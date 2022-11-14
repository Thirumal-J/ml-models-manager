import React from 'react';
import * as Yup from 'yup';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import { useForm } from 'react-hook-form';
import Grid from '@mui/material/Grid';
import DynamicTable from '../../components/DynamicTable1';
import RunsInExperiment from '../../services/json/runsInExperiment.json';

const ViewExperimentDetails = (props) => {
    const navigate = useNavigate();

    return (
        <Grid container spacing={3}>
            {/* <Grid item xs={12} md={6} lg={8}> */}
                <DynamicTable title={props.selectedExperiment} data={RunsInExperiment} />
            {/* </Grid> */}
        </Grid>
    );
};

export default ViewExperimentDetails;