export const OptionsCreator = (array) => {
    const tempArr = [];
    array.map((obj) =>
        tempArr.push({ "value": obj, "label": obj })
    );
    return tempArr;
};

export const ExperimentNames = (experimentsList) => {
    const tempArr = [];
    experimentsList.map((experiment) =>
        tempArr.push({ "value": experiment._experiment_id, "label": experiment._name })
    );
    return tempArr;

}

export const URLPathConstants = {
    FETCH_ALGORITHMS: "mlflow/algorithms",
    UPLOAD_CSV_CLASSIFICATION: "classification/csv-upload",
    TRAIN_MODEL_CLASSIFICATION: "classification/train-model",
    FETCH_EXPERIMENT_RUNS: "mlflow/experiment/runs",
    FETCH_EXPERIMENT_LIST: "mlflow/experiment-list",
    FETCH_DEPLOYED_MODELS: "mlflow/deployed-models",
    FETCH_REGISTERED_MODELS: "mlflow/register-model",
    FETCH_RUN_BY_ID: "mlflow/run",
    FETCH_EXPERIMENT_BY_ID: "mlflow/experiment",
    CLASSIFICATION: "classification",
    MLFLOW: "mlflow",
}