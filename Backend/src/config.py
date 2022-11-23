# Common Configurations
HOSTNAME = "0.0.0.0"

# Upload Service Configurations
# DATASET_FOLDER_LOCATION = "/home/operation/ML_Software_Development/Backend/src/data"
DATASET_FOLDER_LOCATION = "/mlapp/data"

# MLflow Runs Folder Location
# MLFLOW_RUNS_LOCATION = "/home/operation/ML_Software_Development/Backend/mlruns"
MLFLOW_RUNS_LOCATION = "/mlapp/mlruns"

# MLflow Model Pickle File folder location
# TEMP_PICKLE_FILE_LOCATION = "/home/operation/ML_Software_Development/Backend/Utils/test/model.pkl"
TEMP_PICKLE_FILE_LOCATION = "/mlapp/temp/model.pkl"

# ML_FLOW_TRACKING_URI = "/home/operation/ML_Software_Development/Backend/mlruns"
ML_FLOW_TRACKING_URI = "/mlapp/mlruns"

# Place to store all experiment models to deploy
# ML_MODEL_REGISTRY_LOCATION = "/home/operation/ML_Software_Development/Backend/ModelRegistry"
ML_MODEL_REGISTRY_LOCATION = "/mlapp/modelregistry"


#---------------------------------------------------------------------------------------------------------------------------------#
#---------------------------------------------------------------------------------------------------------------------------------#
# Routes

URI_HELLO = "/hello"
URI_ALGORITHMS = "/algorithms"
URI_EXPERIMENT_LIST = "/experiment-list"
URI_CSV_UPLOAD = "/csv-upload"
URI_EXPERIMENT = "/experiment"
URI_DELETE_EXPERIMENT = "/delete-experiment"
URI_EXPERIMENT_RUNS = "/experiment/runs"
URI_TRAIN_MODEL = "/train-model"
URI_RETRAIN_MODEL = "/re-train-model"
URI_REGISTER_MODEL = "/register-model"
URI_RUN = "/run"
URI_DEPLOYED_MODELS = "/deployed-models"


#---------------------------------------------------------------------------------------------------------------------------------#
#---------------------------------------------------------------------------------------------------------------------------------#
# Pipeline Configurations

# Core MLflow
PORT_MLFLOW = 5000
URI_MLFLOW = "/mlflow"

# Classification
PORT_CLASSIFICATION = 5001
CLASSIFICATION = "classification"
CLASSIFICATION_ALGORITHMS = [
        "K-Nearest Neighbours Classification",
        "Decision Tree Classification",
        "Naive Bayes Classification",
        "Random Forest Classification"
    ]

# Regression
PORT_REGRESSION = 5002
REGRESSION = "regression"
REGRESSION_ALGORITHMS = [
        "Simple Linear Regression",
        "Multiple Linear Regression",
        "Decision Tree Regression",
        "Random Forest Regression"
    ]

# Scania
PORT_SCANIA = 5003
URI_SCANIA = "scania"


#---------------------------------------------------------------------------------------------------------------------------------#
#---------------------------------------------------------------------------------------------------------------------------------#


# CORE CONSTANTS
ALGORITHMS = {
    CLASSIFICATION : CLASSIFICATION_ALGORITHMS,
    REGRESSION : REGRESSION_ALGORITHMS
}
