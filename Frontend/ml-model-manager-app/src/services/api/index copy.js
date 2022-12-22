import axios from 'axios';
import { fetchAlgorithms, uploadCSVClassification, uploadCSVRegression , classificationTrainModel} from './apiPayloads';

export default async function Api(apiName, uri = "mlflow", jsonFile = null, errorMessage = "ERROR", data) {
  let payload = {};

  if (apiName === "fetchAlgorithms") {
    payload = fetchAlgorithms;
  }
  else if (apiName === "uploadCSV" && uri === "classification") {
    payload = uploadCSVClassification
    let formData = new FormData();
    console.log(`data---> ${data}`);
            payload.headers = { "Content-Type": "multipart/form-data" };
    formData.append('file', data);
    formData.forEach((value, key) => {
      console.log("key %s: value %s", key, value);
      })
    payload.data = formData
    console.log(payload)
  }
  else if (apiName === "uploadCSV" && uri === "regression") {
    payload = uploadCSVRegression
  }
  else if (apiName === "trainModel" && uri === "classification" ) {
    console.log(`inise train model classification-- data -- ${data}`)
    payload = classificationTrainModel
    payload.data = data
  }

  return await axios(payload)
    .then(function (response) {
      return response;
    })
    .catch(function (error) {
      console.log(errorMessage, error);
    });
}


