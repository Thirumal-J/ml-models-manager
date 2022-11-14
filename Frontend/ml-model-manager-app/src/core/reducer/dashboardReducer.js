import { handleActions } from "redux-actions";
import { UPDATE_COUNT } from "../actions";

const initialState = {
    experiments_count:0,
    deployed_models_count:0,
    total_runs_count: 0
}

const dashboardReducer = handleActions(
    {
        [UPDATE_COUNT]: (state, { payload }) => ({
            ...state,
            ...payload

        })
    },initialState
)

export default dashboardReducer;