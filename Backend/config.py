#Common Configurations
HOSTNAME = "0.0.0.0"

#Ports
PORT_FOR_MLAPP = 4000 
PORT_FOR_MLFLOW = "5000"

#Upload Service Configurations
DATASET_FOLDER_LOCATION = "/home/operation/ML_Software_Development/Backend/Datasets"

#MLflow URLs
GET_EXPERIMENTS_LIST = "api/2.0/mlflow/experiments/list"
GET_EXPERIMENT_BY_ID = "api/2.0/mlflow/experiments/get"
SEARCH_RUNS_BY_EXP_ID = "api/2.0/mlflow/runs/search"
CREATE_EXPERIMENT = "api/2.0/mlflow/experiments/create"
CREATE_RUN = "api/2.0/mlflow/runs/create"

