import { useState } from 'react';
import {connect} from 'react-redux';
import {UPDATE_COUNT} from '../../core/actions';

const Dashboard = ({ expCount, modelsCount, updateCount }) => {
    const incrementExpCount = () => {
        updateCount({experiments_count:expCount+1}); 
    }
    const incrementModelsCount = () => {
        updateCount({deployed_models_count:modelsCount+1}); 
    }
    return (
        <>
        <div>
            {expCount}
        </div>
        <div>
            {modelsCount}
      </div>
            <button onClick={incrementExpCount}>
                EXP INCREMENT
            </button>
            <button onClick={incrementModelsCount}>
                                MODELS INCREMENT

            </button>
            </>
    )
}

const mapStateToProps = (state) => ({
    expCount: state.dashboardReducer.experiments_count,
    modelsCount: state.dashboardReducer.deployed_models_count
})

const mapDispatchToProps = (dispatch) => {
    return {
        updateCount: (payload) => {
            dispatch({
                type: UPDATE_COUNT,
                payload
            })
        },
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);