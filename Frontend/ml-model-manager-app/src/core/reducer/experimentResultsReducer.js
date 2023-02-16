import { handleActions } from "redux-actions";
import { UPDATE_METRICS, UPDATE_PARAMS, UPDATE_TAGS, UPDATE_INFO } from "../actions";

const initialState = {
    metrics: {},
    params: {},
    tags: {},
    info: {}
}

const experimentResultsReducer = handleActions(
    {
        [UPDATE_METRICS]: (state, { payload }) => ({
            ...state,
            metrics: payload.data.metrics
        }),
        [UPDATE_PARAMS]: (state, { payload }) => ({
            ...state,
            params: payload.data.params
        }),
        [UPDATE_TAGS]: (state, { payload }) => ({
            ...state,
            tags: payload.data.info
        }),
        [UPDATE_INFO]: (state, { payload }) => ({
            ...state,
            info: payload.info
        })
    }, initialState
)

export default experimentResultsReducer;