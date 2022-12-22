import { combineReducers } from "redux";

import dashboardReducer from "./dashboardReducer";
import modelTrainingReducer from "./modelTrainingReducer";

export default combineReducers({
    dashboardReducer,
    modelTrainingReducer,
    // experimentsListReducer,
    // deployedModelsReducer
});