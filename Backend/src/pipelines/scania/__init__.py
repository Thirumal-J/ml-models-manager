from unittest import result
from flask import Flask, jsonify, request
import json
from pathlib import Path
import os, sys
sys.path.append(os.getcwd())
import config as appConf
import pandas as pd
# from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, confusion_matrix, classification_report, f1_score, precision_score, recall_score, mean_squared_error, r2_score, mean_absolute_error
from sklearn.linear_model import LogisticRegression
from sklearn.neighbors import KNeighborsClassifier
from sklearn.ensemble import RandomForestClassifier
import requests
from datetime import datetime
import pickle
import mlflow
import shutil

import Backend.app.pipelines.classification.preprocessing as preprocessing

app = Flask(__name__)
app.config['FILE_UPLOADS'] = appConf.DATASET_FOLDER_LOCATION
target_dataset_path = ""

#Testing API, Hello World API
@app.route('/v1/hello', methods=['GET'])
def hello_world():
	if(request.method == 'GET'):
		data = {"data": "Hello World"}
		return jsonify(data)

#Retrieve Algorithms List
@app.route('/v1/algorithms', methods=["GET"])
def get_algorithms():
	algorithms = ["Logistic Regression", "Random Forest Classifier", "KNN"]
	return jsonify(algorithms)

#Fetches all the existing experiments list
@app.route('/v1/experiment-list', methods=["GET"])
def get_experiment_list():
	#Retrieve existing MLflow Experiment List
	all_experiments = [exp.__dict__ for exp in mlflow.list_experiments()]
	# print(type(all_experiments))
	return jsonify(all_experiments)

#Collects datasets as CSV and stores for further use
@app.route('/v1/csv-upload', methods=["POST"])
def csv_upload():
	data = []
	if(request.method == 'POST'):
		if request.files:
			target_dataset_path = save_file(request)
			df = pd.read_csv(target_dataset_path)
			list_of_column_names = list(df.columns)
			list_of_column_names.pop(0) # Eliminating unnecessary 1st column
			# displaying the list of column names
			output_data = {"msg": "File upload Success", "status": "200", "column_names": list_of_column_names}
			return output_data
		else:
			return jsonify("{msg:'No file found'}")
	else:
		return jsonify("{msg:'Invalid HTTP request, Kindly send POST request'}")

#Fetches the experiment details using the id provided by the user
@app.route('/v1/experiment-by-id', methods=["GET"])
def get_experiment_by_id():
		#Retrieve existing MLflow Experiment
		experiment_id = request.args.get("experiment_id")
		experiment = mlflow.get_experiment(experiment_id)
		return (experiment.__dict__)

#Delete an experiment
@app.route('/v1/delete-experiment', methods=["POST"])
def delete_experiment():
	input = json.loads(request.data)
	delete_experiment_directory = str(os.path.join(appConf.MLFLOW_RUNS_LOCATION,input["experiment_id"]))
	if(os.path.exists(delete_experiment_directory)):
		run = mlflow.active_run()
		mlflow.end_run()
		shutil.rmtree(delete_experiment_directory)
		return jsonify({'status':'SUCCESS','msg':'experiment deleted'})
	else:
		return jsonify({'status':'FAILED','msg':'no such folder exists, experiment not found'})

#Search runs within experiments
@app.route('/v1/search/mlflow-runs', methods=["POST"])
def search_mlflow_runs():
	input = json.loads(request.data)
	runs = mlflow.search_runs([input["experiment_id"]])
	return runs.to_dict()

#Trains the model, creates a new mlflow experiment, creates new run within that experiment
@app.route('/v1/train-model', methods=["POST"])
def train_model():
	input = json.loads(request.data)
		
	#Create MLflow Experiment, create a run and log all the results
	#Create Experiment
	global target_dataset_path
	tags = {"dataset_path":target_dataset_path}
	experiment_id = mlflow.create_experiment(input['experiment_name'],tags=tags)
	input["version"] = '0'
	input["experiment_id"] = experiment_id
	# input["target_dataset_path"] = target_dataset_path
	user_id = os.environ.get('USER', os.environ.get('USERNAME'))
	run_tags = []
	
	return create_mlflow_run(input, run_tags)

#Retrains the model, updates existing mlflow experiment, creates a new run within that experiment
@app.route('/v1/re-train-model', methods=["POST"])
def re_train_model():
	input = json.loads(request.data)
	#input - existing experiment name and id, chosen algorithm name, target variable, flag whether new dataset is uploaded or not
	global target_dataset_path

	latest_run = mlflow.search_runs(experiment_ids=[input['experiment_id']])
	# input["version"] = str(int(latest_run.data.tags['version'])+1)
	# run_tags = [{"run_version": input["version"]}]
	run_tags = []
	
	return create_mlflow_run(input, run_tags)

#register a selected model
# @app.route('/v1/register-model', methods= ["POST"])
# def register_model():
# 	input = json.loads(request.data)
# 	#Input - Expect a experiment name, tags and description to register the model
# 	model_uri = f"runs/{input['run_id']}/model.pkl"
# 	name = f"{input['experiment_name']}-model"
# 	# tracking_uri=""
# 	tracking_uri="http://0.0.0.0:8889"
# 	mlflow.set_tracking_uri(tracking_uri)
# 	print(f"###############{mlflow.get_tracking_uri()}")
# 	result = mlflow.register_model(model_uri,name)
# 	return jsonify(result)


@app.route('/v1/register-model', methods= ["POST"])
def register_model():
	input = json.loads(request.data)
	#Input - Expect a experiment name, run name to deploy the model
	experiment_run_location = f"{appConf.MLFLOW_RUNS_LOCATION}/{input['experiment_id']}/{input['run_id']}"
	print(f"----****-experiment_run_location- {experiment_run_location}")
	if (os.path.exists(experiment_run_location)):
		src_model_file_location = f"{experiment_run_location}/artifacts/model.pkl"
		if (os.path.exists(src_model_file_location)):
			register_model_parent_folder = f"{appConf.ML_MODEL_REGISTRY_LOCATION}/{input['experiment_id']}"
			register_model_child_folder  = f"{register_model_parent_folder}/{input['run_id']}"
			if (os.path.exists(register_model_parent_folder)):
					for f in os.listdir(register_model_parent_folder):
						shutil.rmtree(os.path.join(register_model_parent_folder, f))
						print(f'-----------	deleted successfully')
			os.makedirs(register_model_child_folder)
			destination_model_file = f"{register_model_child_folder}/model.pkl"
			shutil.copyfile(src_model_file_location,destination_model_file)
			return jsonify("msg:model registered successfully")
		else:
			return jsonify("msg: no model found in this experiment run")
	else:
		return jsonify("msg:no such experiment run exists")
#List registered models

@app.route('/v1/get-run-by-id', methods=['GET'])
def get_run_by_id():
	run_id = request.args.get("run_id")
	run = mlflow.get_run(run_id)
	return run.to_dictionary()

@app.route('/v1/get-deployed-models', methods=['GET'])
def get_deployed_models():
	exp_dir_list = os.listdir(appConf.ML_MODEL_REGISTRY_LOCATION)
	deployed_models =[]
	for exp in exp_dir_list:
		deployed_exp_path = os.path.join(appConf.ML_MODEL_REGISTRY_LOCATION,exp)
		run_dir_list = os.listdir(deployed_exp_path)
		run_details = (mlflow.get_run(run_dir_list[0])).to_dictionary()
		exp_details = (mlflow.get_experiment(exp)).__dict__
		print(f'experiment_dteails----> {exp_details}')
		run_name = run_details['data']['tags']['mlflow.runName'] 
		model = {"exp_id":exp,"exp_name": exp_details['_name'] ,"run_name":run_name,"run_id":run_dir_list[0]}
		deployed_models.append(model)
	return jsonify(deployed_models)

	
#function to save the uploaded dataset file
def save_file(request):
	uploaded_file = request.files['filename'] # This line uses the same variable and worked fine
	filepath = os.path.join(app.config['FILE_UPLOADS'], uploaded_file.filename)
	uploaded_file.save(filepath)
	global target_dataset_path
	target_dataset_path = filepath
	return target_dataset_path

def get_confusion_matrix_values(y_true, predicted_result):
    cm = confusion_matrix(y_true, predicted_result)
    return(cm[0][0], cm[0][1], cm[1][0], cm[1][1])

def url_creator(target_url):
    return "http://"+appConf.HOSTNAME+":"+appConf.PORT_FOR_MLFLOW+"/"+target_url

def get_model_results(algorithmName, X_train_balanced, X_test, y_train_balanced, y_test):
	classifier = ""
	if algorithmName == "Logistic Regression":
		classifier = LogisticRegression(solver='liblinear')
	elif algorithmName == "Random Forest Classifier":
		classifier = RandomForestClassifier(n_estimators=100, random_state=0)
	elif algorithmName == "KNN":
		classifier = KNeighborsClassifier(n_neighbors = 5, metric = 'minkowski', p = 2)
	classifier.fit(X_train_balanced, y_train_balanced)

	#Predict the result
	pickle.dump(classifier, open(appConf.TEMP_PICKLE_FILE_LOCATION, 'wb'))
	pickled_model = pickle.load(open(appConf.TEMP_PICKLE_FILE_LOCATION, 'rb'))
	predicted_result = pickled_model.predict(X_test)
	print("predicted_result-->",predicted_result)
    # classifier_report = classification_report(y_test, predicted_result, output_dict=True)
	mean_squared_error_value = mean_squared_error(y_test, predicted_result)
	r2_score_value = r2_score(y_test, predicted_result)
	mean_absolute_error_value = mean_absolute_error(y_test, predicted_result)
	f1_score_value = f1_score(y_test, predicted_result)
	precision_score_value = precision_score(y_test, predicted_result)
	recall_score_value = recall_score(y_test,predicted_result)
	accuracy_score_value = "{:.2f}".format(accuracy_score(y_test, predicted_result) * 100)
	TN, FP, FN, TP = (get_confusion_matrix_values(y_test, predicted_result))
	result = {"acccuarcy":accuracy_score_value, "TN":str(TN),"FP":str(FP),"FN":str(FN),"TP":str(TP), "f1_score":str(f1_score_value),"precision_score":str(precision_score_value), "recall_score":str(recall_score_value), 
    "mean_squared_error":str(mean_squared_error_value), "r2_score":str(r2_score_value), "mean_absolute_error":str(mean_absolute_error_value)}
	return result

def log_metrics(list_to_update):
	for k,v in list_to_update.items():
		mlflow.log_metric(k,v)

def create_mlflow_run(input, run_tags):
	mlflow.start_run(experiment_id=input["experiment_id"], run_name=input["version_name"],
                              description=input["description"],
                              tags=run_tags)

	run = mlflow.active_run()
	print("run_id: {}; status: {}".format(run.info.run_id, run.info.status))

	X_train_balanced, X_test, y_train_balanced, y_test = preprocessing.scania_loading_and_preprocessing(target_dataset_path,input["target_variable"])
	model_results = get_model_results(input['algorithm_name'], X_train_balanced, X_test, y_train_balanced, y_test)

	mlflow.log_param("algorithm_name",input['algorithm_name'])
	mlflow.log_param("target_variable",input['target_variable'])
	log_metrics(model_results)

	# pickle_file_name = input['experiment_name'] + '_' + run.info.run_id + '.pkl'
	mlflow.log_artifact(appConf.TEMP_PICKLE_FILE_LOCATION)
	mlflow.end_run()
	run = mlflow.get_run(run.info.run_id)
	return run.to_dictionary()

if __name__ == '__main__':
	app.run(host=appConf.HOSTNAME,port=appConf.PORT_FOR_MLAPP,debug=True)
