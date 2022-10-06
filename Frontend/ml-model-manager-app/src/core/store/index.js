import { applyMiddleware, createStore } from "redux";
import thunk from "redux-thunk";
import logger from "redux-logger"; // previous state, action taken, updated state
// import rootReducer from "../reducers/RootReducer";

let store;
const env = process.env.NODE_ENV;
const middleware = env === "development" ? [thunk,logger] : [thunk]; 
export default store = createStore(applyMiddleware(...middleware));
