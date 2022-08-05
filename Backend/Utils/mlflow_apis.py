import config as appConf
import requests
import os, sys
from datetime import datetime
import pickle

def url_creator(target_url):
    return "http://"+appConf.HOSTNAME+":"+appConf.PORT_FOR_MLFLOW+"/"+target_url

#Retrieve existing MLflow Experiment List
def get_experiment_list():
	try:
		get_experiments_api = url_creator(appConf.GET_EXPERIMENTS_LIST)
		experiments_list = requests.get(get_experiments_api)
		return experiments_list.json()
	except requests.exceptions.RequestException as e:
		raise SystemExit(e)

#Fetches an experiment using its ID
def get_experiment_by_id(id):
    try:
        get_experiment_api = url_creator(appConf.GET_EXPERIMENT_BY_ID)
        payload = {'id':id}
        experiment = requests.get(get_experiment_api,params=payload)
        return experiment.json()
    except requests.exceptions.RequestException as e:
        raise SystemExit(e)

#Fetch all mlflow runs within a experiment by experiment id
def search_mlflow_runs():
	try:
		search_run_api = url_creator(appConf.SEARCH_RUNS_BY_EXP_ID)

		runs = requests.get(search_run_api)
		return runs.json()
	except requests.exceptions.RequestException as e:
		raise SystemExit(e)

#Create a new experiment
def create_experiment(target_dataset_path):
    try:
        create_experiment_api = url_creator(appConf.CREATE_EXPERIMENT)
        create_experiment_payload = {"name":input['experiment_name'],"artifact_location":target_dataset_path}
        experiment_response = requests.post(create_experiment_api,json=create_experiment_payload)
        return experiment_response
    except requests.exceptions.RequestException as e:
        raise SystemExit(e)

#Create a new run within a experiment
def create_run(input,experiment_id,model_results):
    try:
        create_run_api = url_creator(appConf.CREATE_RUN)
        user_id = os.environ.get('USER', os.environ.get('USERNAME'))
        start_time = int(round((datetime.now()).timestamp()))
        tags = []
        tags = tag_updater(tags, model_results)
        tags = tag_updater(tags,[{"key":"algorithm_name", "value":input['algorithm_name']},{"key":"target_variable", "value":input['target_variable']}])
        create_run_payload = {"experiment_id":experiment_id,"user_id":user_id,"start_time":start_time,"tags":tags}

        run_response = requests.post(create_run_api,json=create_run_payload)
        return run_response.json()
    except requests.exceptions.RequestException as e:
        raise SystemExit(e)

#Make a key and value pair, append and create an array of tags
def tag_updater(tags,tags_to_update):
    for k,v in tags_to_update.items():
        tags.append({"key":k,"value":v})
    return tags