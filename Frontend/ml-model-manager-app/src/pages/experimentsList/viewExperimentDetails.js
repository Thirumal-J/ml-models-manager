import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Typography } from '@mui/material';
import ClassificationTable from './ClassificationTable';
import RegressionTable from './RegressionTable';

const ViewExperimentDetails = ({ experimentRuns, experimentType }) => {
    console.log(experimentRuns);

    const isClassification = experimentType === 'classification';
    const isRegression = experimentType === 'regression';

    return (
        <div>
            <Typography color="primary" variant="h5">
                Select a run and click on deploy model to deploy the model
            </Typography>
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