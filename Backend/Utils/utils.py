from flask import Flask, jsonify, request
import json
from pathlib import Path
import os, sys
sys.path.append(os.getcwd())
import config as appConf
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, confusion_matrix, classification_report, f1_score, precision_score, recall_score, mean_squared_error, r2_score, mean_absolute_error
from sklearn.linear_model import LogisticRegression
from sklearn.neighbors import KNeighborsClassifier
from sklearn.ensemble import RandomForestClassifier
import requests
from datetime import datetime
import pickle

import scania_preprocessing as scania

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
	try:
		#Retrieve existing MLflow Experiment List
		get_experiments_url = "api/2.0/mlflow/experiments/list"
		get_experiments_api = url_creator(get_experiments_url)
		experiments_list = requests.get(get_experiments_api)
		return experiments_list.json()
	except requests.exceptions.RequestException as e:
		raise SystemExit(e)

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
	try:
		#Retrieve existing MLflow Experiment
		get_experiment_url = "api/2.0/mlflow/experiments/list"
		get_experiment_api = url_creator(get_experiment_url)

		experiment = requests.get(get_experiment_api)
		return experiment.json()
	except requests.exceptions.RequestException as e:
		raise SystemExit(e)

#
@app.route('/v1/search/mlflow-runs', methods=["POST"])
def search_mlflow_runs():
	try:
		#Retrieve existing MLflow Experiment
		input = json.loads(request.data)
		search_run_url = "api/2.0/mlflow/runs/search"
		search_run_api = url_creator(search_run_url)
		payload = {'experiment_ids':input["experiment_ids"]}

		runs = requests.get(search_run_api,json=payload)
		return runs.json()
	except requests.exceptions.RequestException as e:
		raise SystemExit(e)

#Trains the model, creates a new mlflow experiment, creates new run within that experiment
@app.route('/v1/train-model', methods=["POST"])
def train_model():
	try:
		input = json.loads(request.data)
		global target_dataset_path
		X_train_balanced, X_test, y_train_balanced, y_test = scania.scania_loading_and_preprocessing(target_dataset_path,input["target_variable"])
		model_results = get_model_results(input['algorithm_name'], X_train_balanced, X_test, y_train_balanced, y_test)
		
		#Create MLflow Experiment, create a run and log all the results
		#Create Experiment
		create_experiment_url = "api/2.0/mlflow/experiments/create"
		create_experiment_api = url_creator(create_experiment_url)
		create_experiment_payload = {"name":input['experiment_name'],"artifact_location":target_dataset_path}
		print("target_dataset_path-->",target_dataset_path)
		experiment_response = requests.post(create_experiment_api,json=create_experiment_payload)
		
		#Create run within a experiment
		if (experiment_response.status_code == 200):
			create_run_url = "api/2.0/mlflow/runs/create"
			create_run_api = url_creator(create_run_url)
			experiment_id = experiment_response.json()["experiment_id"]
			user_id = os.environ.get('USER', os.environ.get('USERNAME'))
			start_time = int(round((datetime.now()).timestamp()))
			tags = [{"key":"acccuarcy", "value":model_results['acccuarcy']},{"key":"TN", "value":model_results['TN']},{"key":"FP", "value":model_results['FP']},
					{"key":"FN", "value":model_results['FN']},{"key":"TP", "value":model_results['TP']},{"key":"f1_score", "value":model_results['f1_score']},
					{"key":"precision_score", "value":model_results['precision_score']},{"key":"recall_score", "value":model_results['recall_score']},
					{"key":"mean_squared_error", "value":model_results['mean_squared_error']},{"key":"r2_score", "value":model_results['r2_score']},
					{"key":"mean_absolute_error", "value":model_results['mean_absolute_error']},
					{"key":"algorithm_name", "value":input['algorithm_name']},{"key":"target_variable", "value":input['target_variable']}]
			create_run_payload = {"experiment_id":experiment_id,"user_id":user_id,"start_time":start_time,"tags":tags}

			run_response = requests.post(create_run_api,json=create_run_payload)
			return run_response.json()
	except requests.exceptions.RequestException as e:
		raise SystemExit(e)


#Retrains the model, updates existing mlflow experiment, creates a new run within that experiment
@app.route('/v1/re-train-model', methods=["POST"])
def re_train_model():
	try:
		input = json.loads(request.data)
		#input - existing experiment name and id, chosen algorithm name, target variable, flag whether new dataset is uploaded or not
		global target_dataset_path
		X_train_balanced, X_test, y_train_balanced, y_test = scania.scania_loading_and_preprocessing(target_dataset_path,input["target_variable"])
		model_results = get_model_results(input['algorithm_name'], X_train_balanced, X_test, y_train_balanced, y_test)
		create_run_url = "api/2.0/mlflow/runs/create"
		create_run_api = url_creator(create_run_url)
		experiment_id = input["experiment_id"]
		user_id = os.environ.get('USER', os.environ.get('USERNAME'))
		start_time = int(round((datetime.now()).timestamp()))
		tags = [{"key":"acccuarcy", "value":model_results['acccuarcy']},{"key":"TN", "value":model_results['TN']},{"key":"FP", "value":model_results['FP']},
				{"key":"FN", "value":model_results['FN']},{"key":"TP", "value":model_results['TP']},{"key":"f1_score", "value":model_results['f1_score']},
				{"key":"precision_score", "value":model_results['precision_score']},{"key":"recall_score", "value":model_results['recall_score']},
				{"key":"mean_squared_error", "value":model_results['mean_squared_error']},{"key":"r2_score", "value":model_results['r2_score']},
				{"key":"mean_absolute_error", "value":model_results['mean_absolute_error']},
				{"key":"algorithm_name", "value":input['algorithm_name']},{"key":"target_variable", "value":input['target_variable']}]
		create_run_payload = {"experiment_id":experiment_id,"user_id":user_id,"start_time":start_time,"tags":tags}

		run_response = requests.post(create_run_api,json=create_run_payload)
		return run_response.json()
	except requests.exceptions.RequestException as e:
		raise SystemExit(e)

#function to save the uploaded dataset file
def save_file(request):
	uploaded_file = request.files['filename'] # This line uses the same variable and worked fine
	filepath = os.path.join(app.config['FILE_UPLOADS'], uploaded_file.filename)
	uploaded_file.save(filepath)
	global target_dataset_path
	target_dataset_path = filepath
	return filepath

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
	# pickle.dump(classifier, open('/Models/model.pkl', 'wb'))
	# pickled_model = pickle.load(open('model.pkl', 'rb'))
	predicted_result = classifier.predict(X_test)
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

if __name__ == '__main__':
	app.run(host=appConf.HOSTNAME,port=appConf.PORT_FOR_MLAPP,debug=True)
