import axios from 'axios';
import { fetchAlgorithms, fetchAlgorithms2 } from './apiPayloads';
 
export default async function Api(apiName, fileName, errorMessage) {
  let payload = {};
  
  if (apiName == "fetchAlgorithms") {
    payload = fetchAlgorithms;
  }
  
  return await axios(payload)
    .then(function (response) {
      console.log("file where response will be saved", fileName)
      console.log(response);
    })
    .catch(function (error) {
      console.log(errorMessage, error);
    });
}


