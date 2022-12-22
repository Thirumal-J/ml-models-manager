export const fetchAlgorithms = {
    method: 'get',
    url: 'http://127.0.0.1:5000/mlflow/algorithms',
    headers: {}
};

export const uploadCSVClassification = {
    method:'POST',
    ur: 'http://127.0.0.1:5001/classification/csv-upload'
}

export const uploadCSVRegression = {
    method:'POST',
    url: 'http://127.0.0.1:5001/regression/csv-upload'
}

export const classificationTrainModel = {
    method:"POST",
    url:"http://127.0.0.1:5001/classification/train-model"
}