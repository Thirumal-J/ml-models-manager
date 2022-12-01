import json
import os
import sys

print(
    f"\n<=============================== CORE API STARTED ===============================>"
)
print(f"\n<--- Current Directory ---> {os.getcwd()}")

sys.path.append(os.path.abspath(os.path.join(os.getcwd(), os.pardir)))

import shutil

import config as appConf
import mlflow
import utils
from flask import Flask, jsonify, request

app = Flask(__name__)
app.config["FILE_UPLOADS"] = appConf.DATASET_FOLDER_LOCATION
target_dataset_path = ""


@app.after_request
def after_request(response):

    response.headers.add("Access-Control-Allow-Origin", "*")
    response.headers.add("Access-Control-Allow-Headers", "Content-Type,Authorization")
    response.headers.add("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE")
    return response


# Retrieve Algorithms List
@app.route(appConf.URI_MLFLOW + appConf.URI_ALGORITHMS, methods=["GET"])
def get_algorithms():

    algorithms = appConf.ALGORITHMS
    return jsonify(algorithms)


# Fetches all the existing experiments list
@app.route(appConf.URI_MLFLOW + appConf.URI_EXPERIMENT_LIST, methods=["GET"])
def get_experiment_list():

    # Retrieve existing MLflow Experiment List
    all_experiments = [
        experiment.__dict__
        for experiment in mlflow.search_experiments(order_by=["name"])
    ]
    return jsonify(all_experiments)


# Fetches the experiment details using the id provided by the user
@app.route(appConf.URI_MLFLOW + appConf.URI_EXPERIMENT, methods=["GET"])
def get_experiment_by_id():

    # Retrieve existing MLflow Experiment
    experiment_id = request.args.get("experiment_id")
    try:
        experiment = mlflow.get_experiment(experiment_id)
        return experiment.__dict__
    except:
        return jsonify({"status": "FAILED", "msg": "no such experiment exists"})


# Delete an experiment
@app.route(appConf.URI_MLFLOW + appConf.URI_DELETE_EXPERIMENT, methods=["POST"])
def delete_experiment():

    input = json.loads(request.data)
    mlruns_abs_path = utils.getMLRunsAbsPath()
    delete_experiment_directory = mlruns_abs_path + "/" + input["experiment_id"]
    trash_experiment_directory = mlruns_abs_path + "/.trash"
    print(f"<--- delete_experiment_directory --> {delete_experiment_directory}")
    if os.path.exists(trash_experiment_directory):
        run = mlflow.active_run()
        mlflow.end_run()
        shutil.rmtree(trash_experiment_directory)
    if os.path.exists(delete_experiment_directory):
        run = mlflow.active_run()
        mlflow.end_run()
        shutil.rmtree(delete_experiment_directory)
        return jsonify({"status": "SUCCESS", "msg": "experiment deleted"})
    else:
        return jsonify(
            {"status": "FAILED", "msg": "no such folder exists, experiment not found"}
        )


# All runs in an experiment
@app.route(appConf.URI_MLFLOW + appConf.URI_EXPERIMENT_RUNS, methods=["GET"])
def search_mlflow_runs():

    experiment_id = request.args.get("experiment-id")
    runs = mlflow.search_runs([experiment_id])
    return runs.to_dict()


# Register Model
@app.route(appConf.URI_MLFLOW + appConf.URI_REGISTER_MODEL, methods=["POST"])
def register_model():

    input = json.loads(request.data)
    # Input - Expect a experiment name, run name to deploy the model
    mlruns_abs_path = utils.getMLRunsAbsPath()
    experiment_run_location = (
        f"{mlruns_abs_path}/{input['experiment_id']}/{input['run_id']}"
    )

    if os.path.exists(experiment_run_location):
        print(f"\n <--- Experiment Model Location ---> {experiment_run_location}")
        src_model_file_location = f"{experiment_run_location}/artifacts/model.pkl"

        if os.path.exists(src_model_file_location):
            register_model_parent_folder = (
                f"{utils.getModelRegistryAbsPath()}/{input['experiment_id']}"
            )
            register_model_child_folder = (
                f"{register_model_parent_folder}/{input['run_id']}"
            )

            if os.path.exists(register_model_parent_folder):
                for f in os.listdir(register_model_parent_folder):
                    shutil.rmtree(os.path.join(register_model_parent_folder, f))
                    print(f"-----------	deleted successfully")
            os.makedirs(register_model_child_folder)
            destination_model_file = f"{register_model_child_folder}/model.pkl"
            shutil.copyfile(src_model_file_location, destination_model_file)
            return jsonify("msg:model registered successfully")

        else:
            return jsonify("msg: no model found in this experiment run")

    else:
        return jsonify("msg:no such experiment run exists")


# Retrieve run by run id
@app.route(appConf.URI_MLFLOW + appConf.URI_RUN, methods=["GET"])
def get_run_by_id():

    try:
        run_id = request.args.get("run_id")
        run = mlflow.get_run(run_id)
        return run.to_dictionary()
    except:
        return jsonify({"msg": "no such experiment run exists"})


# Retrieve all the deployed models
@app.route(appConf.URI_MLFLOW + appConf.URI_DEPLOYED_MODELS, methods=["GET"])
def get_deployed_models():

    model_registry_abs_path = utils.getModelRegistryAbsPath()
    exp_dir_list = os.listdir(model_registry_abs_path)
    deployed_models = []

    for exp in exp_dir_list:
        deployed_exp_path = os.path.join(model_registry_abs_path, exp)
        run_dir_list = os.listdir(deployed_exp_path)
        run_details = (mlflow.get_run(run_dir_list[0])).to_dictionary()
        exp_details = (mlflow.get_experiment(exp)).__dict__
        print(f"experiment_dteails----> {exp_details}")
        run_name = run_details["data"]["tags"]["mlflow.runName"]
        model = {
            "exp_id": exp,
            "exp_name": exp_details["_name"],
            "run_name": run_name,
            "run_id": run_dir_list[0],
        }
        deployed_models.append(model)
    return jsonify(deployed_models)


def setMLflowTrackingURI():

    mlruns_abs_path = utils.getMLRunsAbsPath()
    tracking_uri = f"file://{mlruns_abs_path}"
    mlflow.set_tracking_uri(tracking_uri)
    print(f"\n<---MLFLOW Tracking URI ---> {mlflow.get_tracking_uri()}")


if __name__ == "__main__":
    setMLflowTrackingURI()
    app.run(host=appConf.HOSTNAME, port=appConf.PORT_MLFLOW, debug=True)
