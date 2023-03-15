import json
import os
import sys
import pickle

print(
    f"\n<=============================== CORE API STARTED ===============================>"
)
print(f"\n<--- Current Directory ---> {os.getcwd()}")

sys.path.append(os.path.abspath(os.path.join(os.getcwd(), os.pardir)))

# currentdir = os.path.dirname(os.path.realpath(__file__))
# parentdir = os.path.dirname(currentdir)
# sys.path.append(parentdir)
import shutil
import subprocess

import config as appConf
import mlflow
import utils
from flask import Flask, jsonify, request, current_app
from flask_cors import CORS, cross_origin

app = Flask(__name__)
app_ctx = app.app_context()
app_ctx.push()
CORS(app, support_credentials=True)
app.config["FILE_UPLOADS"] = appConf.DATASET_FOLDER_LOCATION
target_dataset_path = ""


@app.after_request
def add_headers(response):
    response.headers.add("Content-Type", "application/json")
    response.headers.add("Access-Control-Allow-Origin", "*")
    response.headers.add(
        "Access-Control-Allow-Methods", "PUT, GET, POST, DELETE, OPTIONS"
    )
    response.headers.add("Access-Control-Allow-Headers", "Content-Type,Authorization")
    response.headers.add(
        "Access-Control-Expose-Headers",
        "Content-Type,Content-Length,Authorization,X-Pagination",
    )
    response.headers.add("preflightContinue", "false")
    return response


# Retrieve Algorithms List
@app.route(appConf.URI_MLFLOW + appConf.URI_ALGORITHMS, methods=["GET"])
def get_algorithms():

    algorithms = appConf.ALGORITHMS
    return jsonify(algorithms)


# Fetches all the existing experiments list
@app.route(appConf.URI_MLFLOW + appConf.URI_EXPERIMENT_LIST, methods=["GET"])
def get_experiment_list():
    try:
        # Retrieve existing MLflow Experiment List
        all_experiments = [
            experiment.__dict__
            for experiment in mlflow.search_experiments(order_by=["name"])
        ]
        return jsonify(all_experiments)
    except Exception as e:
        print(f"Error occurred--> {e}")
        return jsonify({"msg": "unable to fetch all experiments, please try again"})


# Fetches the experiment details using the id provided by the user
@app.route(appConf.URI_MLFLOW + appConf.URI_EXPERIMENT, methods=["POST"])
def get_experiment_by_id():
    # Retrieve existing MLflow Experiment
    try:
        input = json.loads(request.data)
        experiment_id = input["experiment_id"]
        experiment = mlflow.get_experiment(experiment_id)
        return experiment.__dict__
    except Exception as e:
        print(f"Error occurred--> {e}")
        return jsonify({"msg": "no such experiment exists"})


# Delete an experiment
@app.route(appConf.URI_MLFLOW + appConf.URI_DELETE_EXPERIMENT, methods=["POST"])
def delete_experiment():
    input = json.loads(request.data)
    return remove_experiment(input)


def remove_experiment(input):
    try:
        # if input is None:
        #     input["experiment_id"] = "0"
        # else:
        #     pass
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
                {
                    "status": "FAILED",
                    "msg": "no such folder exists, experiment not found",
                }
            )
    except Exception as e:
        print(f"Error occurred--> {e}")
        return jsonify({"msg": "no such experiment exists"})


# All runs in an experiment
@app.route(appConf.URI_MLFLOW + appConf.URI_EXPERIMENT_RUNS, methods=["POST"])
def runs_in_experiment():
    try:
        input = json.loads(request.data)
        experiment_id = input["experiment_id"]
        experiment_type = input.get("experiment_type")
        runs = mlflow.search_runs([experiment_id]).to_dict()
        if experiment_type and experiment_type == "classification":
            runs = transform_classification_data(runs)
        elif experiment_type and experiment_type == "regression":
            runs = transform_classification_data(runs)
    except Exception as e:
        print(f"Error occurred--> {e}")
        return jsonify(
            {"status": "error", "msg": "unable to fetch all runs of the experiment"}
        )

    return runs


# Register Model
@app.route(appConf.URI_MLFLOW + appConf.URI_DEPLOY_MODEL, methods=["POST"])
def register_model():

    try:
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
    except Exception as e:
        print(f"Error occurred--> {e}")
        return jsonify({"status": "FAILED", "msg": "Sorry, unable to register model"})


# Retrieve run by run id
@app.route(appConf.URI_MLFLOW + appConf.URI_RUN, methods=["POST"])
def get_run_by_id():

    try:
        input = json.loads(request.data)
        run_id = input["run_id"]
        run = mlflow.get_run(run_id)
        return run.to_dictionary()
    except Exception as e:
        print(f"Error occurred--> {e}")
        return jsonify({"msg": "no such experiment run exists"})


# Retrieve all the deployed models
@app.route(appConf.URI_MLFLOW + appConf.URI_DEPLOYED_MODELS, methods=["GET"])
def get_deployed_models():
    try:
        model_registry_abs_path = utils.getModelRegistryAbsPath()
        exp_dir_list = os.listdir(model_registry_abs_path)
        deployed_models = []

        for exp in exp_dir_list:
            deployed_exp_path = os.path.join(model_registry_abs_path, exp)
            run_dir_list = os.listdir(deployed_exp_path)
            run_details = (mlflow.get_run(run_dir_list[0])).to_dictionary()
            exp_details = (mlflow.get_experiment(exp)).__dict__
            print(f"experiment_details----> {exp_details}")
            run_name = run_details["data"]["tags"]["mlflow.runName"]
            model = {
                "exp_id": exp,
                "exp_name": exp_details["_name"],
                "run_name": run_name,
                "run_id": run_dir_list[0],
            }
            deployed_models.append(model)
        return jsonify(deployed_models)
    except Exception as e:
        print(f"Error occurred--> {e}")
        return jsonify(
            {"msg": "Sorry, unable to retrieve all deployed models", "status": "error"}
        )


@app.route(appConf.URI_MLFLOW + appConf.URI_PREDICT, methods=["POST"])
def predict():
    try:
        model_registry_abs_path = utils.getModelRegistryAbsPath()
        # Load model from run_id
        # run_id = request.json["run_id"]
        exp_id = request.json["exp_id"]
        model_file = os.path.join(model_registry_abs_path, exp_id, "model.pkl")
        with open(model_file, "rb") as f:
            model = pickle.load(f)

        # Load data from request
        data = request.json["data"]

        # Make predictions using model
        predictions = model.predict(data)

        # Return results
        return jsonify({"predictions": predictions.tolist()})
    except Exception as e:
        print(f"Error occurred--> {e}")
        return jsonify(
            {"msg": "Sorry, unable to retrieve all deployed models", "status": "error"}
        )


def setMLflowTrackingURI():

    mlruns_abs_path = utils.getMLRunsAbsPath()
    tracking_uri = f"file://{mlruns_abs_path}"
    mlflow.set_tracking_uri(tracking_uri)
    input = {}
    input["experiment_id"] = "0"  # to remove default experiment to avoid confusion
    remove_experiment(input)
    print(f"\n<---MLFLOW Tracking URI ---> {mlflow.get_tracking_uri()}")


def transform_classification_data(data):
    transformed_data = []
    for i in range(len(data["artifact_uri"])):
        d = {}
        d["artifact_uri"] = data["artifact_uri"][i]
        d["end_time"] = data["end_time"][i]
        d["experiment_id"] = data["experiment_id"][i]
        d["metrics"] = {
            "Accuracy": data["metrics.Accuracy"][i],
            "F1 Score": data["metrics.F1 Score"][i],
            "False Negative": data["metrics.False Negative"][i],
            "False Positive": data["metrics.False Positive"][i],
            "Precision Score": data["metrics.Precision Score"][i],
            "R2 Score": data["metrics.R2 Score"][i],
            "Recall Score": data["metrics.Recall Score"][i],
            "True Negative": data["metrics.True Negative"][i],
            "True Positive": data["metrics.True Positive"][i],
        }
        d["params"] = {
            "Algorithm Name": data["params.Algorithm Name"][i],
            "Target Variable": data["params.Target Variable"][i],
        }
        d["run_id"] = data["run_id"][i]
        d["start_time"] = data["start_time"][i]
        d["status"] = data["status"][i]
        transformed_data.append(d)
    return transformed_data


# @app.route(appConf.URI_MLFLOW + "/deploy-model", methods=["POST"])
# def deploy_model():
#     # Get experiment run ID from request data
#     input = json.loads(request.data)
#     run_id = input["run_id"]

#     # Deploy model using mlflow models serve command
#     process = subprocess.Popen(
#         [
#             "mlflow",
#             "models",
#             "serve",
#             "-m",
#             f"runs:/model/{run_id}/model",
#             "-p",
#             "1234",
#         ],
#         stdout=subprocess.PIPE,
#         stderr=subprocess.PIPE,
#     )
#     stdout, stderr = process.communicate()

#     if process.returncode == 0:
#         # Deployment succeeded
#         return jsonify({"status": "success", "message": stdout.decode("utf-8")})
#     else:
#         # Deployment failed
#         return jsonify({"status": "error", "message": stderr.decode("utf-8")})


if __name__ == "__main__":
    setMLflowTrackingURI()
    app.run(host=appConf.HOSTNAME, port=appConf.PORT_MLFLOW, debug=True)
