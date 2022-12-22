import json
import os
import sys
from pathlib import Path

from flask import Flask, jsonify, request

print(
    f"\n<=============================== REGRESSION API STARTED ===============================>"
)
print(f"\n<--- Current Directory ---> {os.getcwd()}")

parentDir = os.path.abspath(
    os.path.join(os.getcwd(), os.pardir)
)  #  Gives Pipelines folder
sourceDir = os.path.abspath(os.path.join(parentDir, os.pardir))  # Gives Src folder
sys.path.append(parentDir)
sys.path.append(sourceDir)

print(f"\n\n {sys.path} \n\n")

import pickle
import shutil
from datetime import datetime

import config as appConf
import mlflow
import pandas as pd
import preprocessing as preprocessing
import utils

# from sklearn.model_selection import train_test_split
from sklearn.metrics import (
    mean_absolute_error,
    mean_squared_error,
    r2_score
)
from sklearn.linear_model import LinearRegression
from sklearn.svm import SVR
from sklearn.tree import DecisionTreeRegressor
from sklearn.ensemble import RandomForestRegressor

app = Flask(__name__)
app.config["FILE_UPLOADS"] = sourceDir + appConf.DATASET_FOLDER_LOCATION
target_dataset_path = ""


@app.after_request
def after_request(response):
    response.headers.add("Access-Control-Allow-Origin", "*")
    response.headers.add("Access-Control-Allow-Headers", "Content-Type,Authorization")
    response.headers.add("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE")
    return response


# Collects datasets as CSV and stores for further use
@app.route("/" + appConf.CLASSIFICATION + appConf.URI_CSV_UPLOAD, methods=["POST"])
def csv_upload():
    data = []
    if request.method == "POST":
        if request.files:
            target_dataset_path = save_file(request)
            df = pd.read_csv(target_dataset_path)
            list_of_column_names = list(df.columns)
            list_of_column_names.pop(0)  # Eliminating unnecessary 1st column
            # displaying the list of column names
            output_data = {
                "msg": "File upload Success",
                "status": "200",
                "column_names": list_of_column_names,
            }
            return output_data
        else:
            return jsonify("{msg:'No file found'}")
    else:
        return jsonify("{msg:'Invalid HTTP request, Kindly send POST request'}")


# Trains the model, creates a new mlflow experiment, creates new run within that experiment
@app.route("/" + appConf.CLASSIFICATION + appConf.URI_TRAIN_MODEL, methods=["POST"])
def train_model():
    input = json.loads(request.data)

    # Create MLflow Experiment, create a run and log all the results
    # Create Experiment
    global target_dataset_path
    tags = {"dataset_path": target_dataset_path}
    mlflow.end_run()
    experiment_id = mlflow.create_experiment(input["experiment_name"], tags=tags)
    input["version"] = "0"
    input["experiment_id"] = experiment_id
    # input["target_dataset_path"] = target_dataset_path
    user_id = os.environ.get("USER", os.environ.get("USERNAME"))
    run_tags = []

    return create_mlflow_run(input, run_tags)


# Retrains the model, updates existing mlflow experiment, creates a new run within that experiment
@app.route("/" + appConf.CLASSIFICATION + appConf.URI_RETRAIN_MODEL, methods=["POST"])
def re_train_model():
    input = json.loads(request.data)
    global target_dataset_path
    mlflow.end_run()
    latest_run = mlflow.search_runs(experiment_ids=[input["experiment_id"]])
    run_tags = []

    return create_mlflow_run(input, run_tags)


# function to save the uploaded dataset file
def save_file(request):
    uploaded_file = request.files["file"]
    print(f"<--- Uploaded file name ---> {uploaded_file.filename}")
    print(f"<--- Current directory ---> {os.getcwd()}")
    print(f"<--- Data Directory ---> {app.config['FILE_UPLOADS']}")
    filepath = os.path.join(app.config["FILE_UPLOADS"], uploaded_file.filename)
    uploaded_file.save(filepath)
    global target_dataset_path
    target_dataset_path = filepath
    return target_dataset_path


def get_model_results(
    algorithmName, X_train_balanced, X_test, y_train_balanced, y_test
):

    regressor = ""
    if algorithmName == appConf.SIMPLE_LINEAR_REGRESSION:
        regressor = LinearRegression()
    elif algorithmName == appConf.SUPPORT_VECTOR_REGRESSION:
        regressor =SVR(kernel='rbf', gamma='auto')
    elif algorithmName == appConf.DECISION_TREE_REGRESSION:
        regressor = DecisionTreeRegressor(random_state = 0)
    elif algorithmName == appConf.RANDOM_FOREST_REGRESSION:
        regressor = RandomForestRegressor(n_estimators = 300, random_state = 0)
    regressor.fit(X_train_balanced, y_train_balanced)

    # Predict the result
    print(f"--Current directory---> {os.getcwd()}")
    # sourceDir = utils.getParentDirectory(utils.getParentDirectory())
    print(
        f"--Is directory exists or not --> {os.path.exists(sourceDir + appConf.TEMP_PICKLE_FILE_LOCATION)}"
    )
    temp_pickle_file = sourceDir + appConf.TEMP_PICKLE_FILE_LOCATION + "/model.pkl"
    pickle.dump(regressor, open(temp_pickle_file, "wb"))
    pickled_model = pickle.load(open(temp_pickle_file, "rb"))
    predicted_result = pickled_model.predict(X_test)
    print("predicted_result-->", predicted_result)
    
    r2_score_value = r2_score(y_test, predicted_result)
    mean_absolute_error_value = mean_absolute_error(y_test, predicted_result)
    mean_squared_error_value = mean_squared_error(y_test, predicted_result)
    
    result = {
        "mean_squared_error": str(mean_squared_error_value),
        "r2_score": str(r2_score_value),
        "mean_absolute_error": str(mean_absolute_error_value),
    }
    return result


def log_metrics(list_to_update):
    for k, v in list_to_update.items():
        mlflow.log_metric(k, v)


def create_mlflow_run(input, run_tags):
    mlflow.start_run(
        experiment_id=input["experiment_id"],
        run_name=input["version_name"],
        description=input["description"],
        tags=run_tags,
    )

    run = mlflow.active_run()
    print("run_id: {}; status: {}".format(run.info.run_id, run.info.status))

    (
        X_train_balanced,
        X_test,
        y_train_balanced,
        y_test,
    ) = preprocessing.turbofan_loading_and_preprocessing(
        target_dataset_path, input["target_variable"]
    )
    model_results = get_model_results(
        input["algorithm_name"], X_train_balanced, X_test, y_train_balanced, y_test
    )

    mlflow.log_param("algorithm_name", input["algorithm_name"])
    mlflow.log_param("target_variable", input["target_variable"])
    log_metrics(model_results)

    # pickle_file_name = input['experiment_name'] + '_' + run.info.run_id + '.pkl'
    mlflow.log_artifact(sourceDir + appConf.TEMP_PICKLE_FILE_LOCATION + "/model.pkl")
    mlflow.end_run()
    run = mlflow.get_run(run.info.run_id)
    return run.to_dictionary()


def setMLflowTrackingURI():
    mlruns_abs_path = utils.getMLRunsAbsPath(parentDir)
    tracking_uri = f"file://{mlruns_abs_path}"
    mlflow.set_tracking_uri(tracking_uri)
    print(f"\n<---MLFLOW Tracking URI ---> {mlflow.get_tracking_uri()}")


if __name__ == "__main__":
    setMLflowTrackingURI()
    print(f"---Tracking Uri ---> {mlflow.get_tracking_uri()}")
    app.run(host=appConf.HOSTNAME, port=appConf.PORT_CLASSIFICATION, debug=True)
