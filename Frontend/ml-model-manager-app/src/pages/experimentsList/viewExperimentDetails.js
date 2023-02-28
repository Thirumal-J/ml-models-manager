import React from 'react';
import { useNavigate } from 'react-router-dom';
import Grid from '@mui/material/Grid';
import ClassificationTable from './ClassificationTable';
import RegressionTable from './RegressionTable';

const ViewExperimentDetails = ({ experimentRuns, experimentType }) => {
    console.log(experimentRuns);

    const isClassification = experimentType === 'classification';
    const isRegression = experimentType === 'regression';

    return (
        <div>
            {isClassification && (
                <ClassificationTable title="Experiment Runs" experimentRuns={experimentRuns} />
            )}
            {isRegression && (
                <RegressionTable title="Experiment Runs" experimentRuns={experimentRuns} />
            )}
        </div>
    );
};

export default ViewExperimentDetails;