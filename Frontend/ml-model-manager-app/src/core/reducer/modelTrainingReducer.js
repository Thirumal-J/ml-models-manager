import { handleActions } from "redux-actions";
import { UPDATE_ALGORITHMS,UPDATE_TARGET_ATTRIBUTES } from "../actions";

const initialState = {
  algorithms: [],
  targetAttributes: [],
}

const modelTrainingReducer = handleActions(
    {
        [UPDATE_ALGORITHMS]: (state, { payload }) => ({
            ...state,
            algorithms:payload
        }),
        [UPDATE_TARGET_ATTRIBUTES]: (state, { payload }) => ({
            ...state,
            targetAttributes:payload.column_names
        })
    },initialState
)

export default modelTrainingReducer;