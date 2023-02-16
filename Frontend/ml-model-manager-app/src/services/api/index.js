import axios from 'axios';
import { URLPathConstants } from '../../utils/constants';

export default async function Api(path, payload) {

  const HOST = window.location.hostname;
  const PORT = (path.includes(URLPathConstants.CLASSIFICATION)) ? 5001 : 5000
  console.log(`PORT---> ${PORT}`);
  // const BACKEND_PORT_GET = 5000;
  // const BACKEND_PORT_POST = 5001;
  const FINAL_PAYLOAD = { ...payload, url: `${window.location.protocol}//${HOST}:${PORT}/${path}` }
  console.log(`Final Payload --> ${FINAL_PAYLOAD}`)
  return axios(FINAL_PAYLOAD)
    .then(function (response) {
      return response.data;
    })
    .catch(function (error) {
      console.log(error);
    });
}


