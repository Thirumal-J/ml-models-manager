import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import { useForm } from 'react-hook-form';
import { Typography, Box, Button, Stack, Grid, Card, Paper } from '@mui/material';
import { yupResolver } from '@hookform/resolvers/yup';
import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';

import { FormProvider, RHFTextField, RHFDropdown } from '../../components/hook-form';
import ViewExperimentDetails from './viewExperimentDetails';
import { UPDATE_EXPERIMENT_LIST } from '../../core/actions';
import api from '../../services/api';
import { URLPathConstants } from '../../utils/constants';
import { OptionsCreator } from '../../utils';


const SelectExperiment = ({ color = 'primary', sx, experimentList, updateExperimentList }) => {
    const navigate = useNavigate();

    const [existingExperimentNames, setExistingExperimentNames] = useState([]);
    const [experimentRuns, setExperimentRuns] = useState([]);
    const [submitError, setSubmitError] = useState(null);
    const [showResult, setShowResult] = useState(false);

    const schema = Yup.object().shape({
        experimentName: Yup.string().required('Experiment name should be selected')
    });

    const [expData, setExpData] = useState({
        experimentId: "",
        experimentName: "",
        experimentType: ""
    });

    const methods = useForm({
        resolver: yupResolver(schema),
        mode: "onChange",
        defaultValues: expData
    });

    useEffect(() => {
        if (expData.experimentName) {
            const indexOfExperiment = experimentList.map(experiment => experiment._name).indexOf(expData.experimentName);
            setExpData(prevState => ({
                ...prevState,
                experimentId: experimentList[indexOfExperiment]._experiment_id,
                experimentType: experimentList[indexOfExperiment]._tags.experiment_type
            }));
        }
    }, [expData.experimentName]);

    const onSubmit = async () => {
        try {
            const responseData = await fetchRunsInExperiment();
            if (responseData === "error" || responseData.status === "error") {
                setSubmitError("Error fetching runs of the experiment try again");
            }
            else {
                setSubmitError(null);
                setExperimentRuns(responseData);
                setShowResult(true);
            }
        } catch (error) {
            console.log(`error--${JSON.stringify(error)}`);
            setSubmitError("Error fetching runs of the experiment try again");
        }
    };

    console.log(`Fetched data fom API-- ${JSON.stringify(experimentRuns)}`)

    async function fetchRunsInExperiment() {
        const response = await api(URLPathConstants.FETCH_EXPERIMENT_RUNS,
            {
                method: "POST",
                data: {
                    "experiment_id": expData.experimentId,
                    "experiment_type": expData.experimentType
                }
            });
        return response;
    }

    useEffect(() => {
        async function fetchExperimentList() {
            const response = await api(URLPathConstants.FETCH_EXPERIMENT_LIST, { method: "GET" });
            updateExperimentList(response);
            setExistingExperimentNames(OptionsCreator(response.map(res => res._name)));
        };
        console.log(`Experiment list during page load---${experimentList}`);

        fetchExperimentList();
    }, [updateExperimentList]);

    const handleInput = (event) => {
        const { name, value } = event.target;
        setExpData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    return (
        <>
            {!showResult ?
                <Grid container spacing={3}>
                    <Grid item xs={12} md={6} lg={8}>
                        <FormProvider methods={methods} onSubmit={methods.handleSubmit(onSubmit)}>
                            <Stack direction="column" spacing={3}>
                                <RHFDropdown name="experimentName" label="Select the experiment" options={existingExperimentNames || []} onBlur={handleInput} />
                                <Button variant="contained" color="primary" type="submit">
                                    Confirm
                                </Button>
                                {/* {experimentRuns} */}
                            </Stack>
                        </FormProvider>
                    </Grid>
                </Grid>
                : null}
            {submitError && (
                <Grid container spacing={5}>
                    <Grid item xs={12} md={6} lg={8}>
                        <Typography color="error" variant="h5">
                            {submitError}
                        </Typography>
                    </Grid>
                </Grid>
            )
            }
            {showResult ?
                <Grid container spacing={12}>
                    <Grid item xs={12} md={6} lg={8}>
                        <ViewExperimentDetails experimentRuns={experimentRuns} experimentType={expData.experimentType} />
                    </Grid>
                </Grid>
                : null}
        </>
    );
};

SelectExperiment.propTypes = {
    color: PropTypes.string,
    sx: PropTypes.object,
};

const mapStateToProps = (state) => ({
    experimentList: state.appReducer.experimentList
});

const mapDispatchToProps = (dispatch) => {
    return {
        updateExperimentList: (payload) => {
            dispatch({
                type: UPDATE_EXPERIMENT_LIST,
                payload
            })
        },
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SelectExperiment);