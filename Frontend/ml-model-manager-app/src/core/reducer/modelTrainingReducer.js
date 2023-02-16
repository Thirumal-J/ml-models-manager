import { handleActions } from "redux-actions";
import { UPDATE_ALGORITHMS, UPDATE_TARGET_ATTRIBUTES, UPDATE_EXPERIMENT_LIST } from "../actions";

const initialState = {
    algorithms: [],
    targetAttributes: [],
    experimentList: [],
}

const modelTrainingReducer = handleActions(
    {
        [UPDATE_ALGORITHMS]: (state, { payload }) => ({
            ...state,
            algorithms: payload
        }),
        [UPDATE_TARGET_ATTRIBUTES]: (state, { payload }) => ({
            ...state,
            targetAttributes: payload.column_names
        }),
        [UPDATE_EXPERIMENT_LIST]: (state, { payload }) => ({
            ...state,
            experimentList: payload
        })
    }, initialState
)

export default modelTrainingReducer;