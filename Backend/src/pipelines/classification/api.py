from unittest import result
from flask import Flask, jsonify, request
import json
from pathlib import Path
import os, sys
sys.path.append("/home/thiru/ML_Software_Development/Backend")
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

import preprocessing as preprocessing

app = Flask(__name__)
app.config['FILE_UPLOADS'] = appConf.DATASET_FOLDER_LOCATION
target_dataset_path = ""


@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE')
    return response

#Collects datasets as CSV and stores for further use
@app.route("/" + appConf.CLASSIFICATION + appConf.URI_CSV_UPLOAD, methods=["POST"])
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


#Trains the model, creates a new mlflow experiment, creates new run within that experiment
@app.route("/" + appConf.CLASSIFICATION + appConf.URI_TRAIN_MODEL, methods=["POST"])
def train_model():
	input = json.loads(request.data)
		
	#Create MLflow Experiment, create a run and log all the results
	#Create Experiment
	global target_dataset_path
	tags = {"dataset_path":target_dataset_path}
	mlflow.end_run()
	experiment_id = mlflow.create_experiment(input['experiment_name'],tags=tags)
	input["version"] = '0'
	input["experiment_id"] = experiment_id
	# input["target_dataset_path"] = target_dataset_path
	user_id = os.environ.get('USER', os.environ.get('USERNAME'))
	run_tags = []
	
	return create_mlflow_run(input, run_tags)

#Retrains the model, updates existing mlflow experiment, creates a new run within that experiment
@app.route("/" + appConf.CLASSIFICATION + appConf.URI_RETRAIN_MODEL, methods=["POST"])
def re_train_model():
	input = json.loads(request.data)
	#input - existing experiment name and id, chosen algorithm name, target variable, flag whether new dataset is uploaded or not
	global target_dataset_path
	mlflow.end_run()
	latest_run = mlflow.search_runs(experiment_ids=[input['experiment_id']])
	# input["version"] = str(int(latest_run.data.tags['version'])+1)
	# run_tags = [{"run_version": input["version"]}]
	run_tags = []
	
	return create_mlflow_run(input, run_tags)


# function to save the uploaded dataset file
def save_file(request):
	uploaded_file = request.files['filename'] # This line uses the same variable and worked fine
	print(f"--Uploaded file name---> {uploaded_file.filename}")
	print(f"--Current directory---> {os.getcwd()}")
	print(f"--Is directory exists or not --> {os.path.exists(app.config['FILE_UPLOADS'])}")
	if not os.path.exists(app.config['FILE_UPLOADS']):
		os.mkdir(app.config['FILE_UPLOADS'])
	filepath = os.path.join(app.config['FILE_UPLOADS'], uploaded_file.filename)
	uploaded_file.save(filepath)
	global target_dataset_path
	target_dataset_path = filepath
	return target_dataset_path


def get_confusion_matrix_values(y_true, predicted_result):
    cm = confusion_matrix(y_true, predicted_result)
    return(cm[0][0], cm[0][1], cm[1][0], cm[1][1])


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
	print(f"--Current directory---> {os.getcwd()}")
	print(f"--Is directory exists or not --> {os.path.exists(appConf.TEMP_PICKLE_FILE_LOCATION)}")
	# if not os.path.exists(appConf.TEMP_PICKLE_FILE_LOCATION):
	# 	os.makedirs(appConf.TEMP_PICKLE_FILE_LOCATION)
	temp_pickle_file = appConf.TEMP_PICKLE_FILE_LOCATION+"/model.pkl"
	pickle.dump(classifier, open(temp_pickle_file, 'wb'))
	pickled_model = pickle.load(open(temp_pickle_file, 'rb'))
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
	print(f"---Tracking Uri ---> {mlflow.get_tracking_uri()}")
	app.run(host=appConf.HOSTNAME,port=appConf.PORT_CLASSIFICATION,debug=True)
