import json
import os
import sys

sys.path.append("/home/thiru/ML_Software_Development/Backend")
import shutil

import config as appConf
import mlflow
from flask import Flask, jsonify, request

app = Flask(__name__)
app.config['FILE_UPLOADS'] = appConf.DATASET_FOLDER_LOCATION
target_dataset_path = ""


@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE')
    return response
	
#Retrieve Algorithms List
@app.route(appConf.URI_MLFLOW + appConf.URI_ALGORITHMS, methods=["GET"])
def get_algorithms():
	algorithms = appConf.ALGORITHMS
	return jsonify(algorithms)


#Fetches all the existing experiments list
@app.route(appConf.URI_MLFLOW + appConf.URI_EXPERIMENT_LIST, methods=["GET"])
def get_experiment_list():
	#Retrieve existing MLflow Experiment List
	# all_experiments = [exp.__dict__ for exp in mlflow.list_experiments()]
    all_experiments = [experiment.__dict__ for experiment in mlflow.search_experiments(order_by=["name"])]
    return jsonify(all_experiments)


#Fetches the experiment details using the id provided by the user
@app.route(appConf.URI_MLFLOW + appConf.URI_EXPERIMENT, methods=["GET"])
def get_experiment_by_id():
		#Retrieve existing MLflow Experiment
		experiment_id = request.args.get("experiment_id")
		experiment = mlflow.get_experiment(experiment_id)
		return (experiment.__dict__)


#Delete an experiment
@app.route(appConf.URI_MLFLOW + appConf.URI_DELETE_EXPERIMENT, methods=["POST"])
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


# All runs in an experiment
@app.route(appConf.URI_MLFLOW + appConf.URI_EXPERIMENT_RUNS, methods=["GET"])
def search_mlflow_runs():
    experiment_id = request.args.get("experiment-id")
    runs = mlflow.search_runs([experiment_id])
    return runs.to_dict()


# Register Model
@app.route(appConf.URI_MLFLOW + appConf.URI_REGISTER_MODEL, methods= ["POST"])
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
@app.route(appConf.URI_MLFLOW + appConf.URI_RUN, methods=['GET'])
def get_run_by_id():
	run_id = request.args.get("run_id")
	run = mlflow.get_run(run_id)
	return run.to_dictionary()


@app.route(appConf.URI_MLFLOW + appConf.URI_DEPLOYED_MODELS, methods=['GET'])
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



if __name__ == '__main__':
	app.run(host=appConf.HOSTNAME,port=appConf.PORT_MLFLOW,debug=True)
