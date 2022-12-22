# Common Configurations
HOSTNAME = "0.0.0.0"

# Upload Service Configurations
DATASET_FOLDER_LOCATION = "/data"

# MLflow Runs Folder Location
MLFLOW_RUNS_LOCATION = "/mlruns"

# MLflow Model Pickle File folder location
TEMP_PICKLE_FILE_LOCATION = "/temp"

# Place to store all experiment models to deploy
ML_MODEL_REGISTRY_LOCATION = "/model-registry"


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
DECISION_TREE_CLASSIFICATION = "Decision Tree Classification"
K_NEAREST_NEIGHBOURS_CLASSIFICATION = "K-Nearest Neighbours Classification"
NAIVE_BAYES_CLASSIFICATION = "Naive Bayes Classification"
RANDOM_FOREST_CLASSIFICATION = "Random Forest Classification"
CLASSIFICATION_ALGORITHMS = [DECISION_TREE_CLASSIFICATION,K_NEAREST_NEIGHBOURS_CLASSIFICATION,NAIVE_BAYES_CLASSIFICATION,RANDOM_FOREST_CLASSIFICATION]

# Regression
PORT_REGRESSION = 5002
REGRESSION = "regression"
SIMPLE_LINEAR_REGRESSION = "Simple Linear Regression"
SUPPORT_VECTOR_REGRESSION = "Support Vector Regression"
DECISION_TREE_REGRESSION = "Decision Tree Regression"
RANDOM_FOREST_REGRESSION = "Random Forest Regression"
REGRESSION_ALGORITHMS = [SIMPLE_LINEAR_REGRESSION,SUPPORT_VECTOR_REGRESSION,DECISION_TREE_REGRESSION,RANDOM_FOREST_REGRESSION]

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
