import { applyMiddleware, createStore } from "redux";
import thunk from "redux-thunk";
import logger from "redux-logger"; // previous state, action taken, updated state
import reducers from '../reducer';

let store;
const env = process.env.NODE_ENV;
const middleware = env === "development" ? [thunk,logger] : [thunk]; 
export default store = createStore(reducers, applyMiddleware(...middleware));
