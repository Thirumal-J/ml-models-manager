import React, { useEffect } from 'react';
import * as Yup from 'yup';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { connect } from 'react-redux';
import { Button, Stack, Grid, Card, Typography } from '@mui/material';
import { yupResolver } from '@hookform/resolvers/yup';

import { FormProvider, RHFDropdown, RHFTextField } from '../../components/hook-form';
import { OptionsCreator } from '../../utils';
import ExperimentResult from './experimentResult';
import { UPDATE_ALGORITHMS, UPDATE_EXPERIMENT_LIST } from '../../core/actions';
import api from '../../services/api';
import { URLPathConstants } from '../../utils/constants';

const ExistingExperimentForm = ({ color = 'primary', sx, algorithms, updateAlgorithms, experimentList, updateExperimentList }) => {

    const [showResult, setShowResult] = useState(false);
    const [existingExperiments, setExistingExperiments] = useState([]);
    const [targetAlgorithms, setTargetAlgorithms] = useState([]);
    const [experimentResult, setExperimentResult] = useState({});
    const [submitError, setSubmitError] = useState(null);

    const schema = Yup.object().shape({
        experimentName: Yup.string().required('you must choose an experiment name'),
        algorithmName: Yup.string().required('you must choose an algorithm'),
    });

    const [expData, setExpData] = useState(
        {
            experimentId: "",
            experimentName: "",
            experimentType: "",
            algorithmName: "",
            targetVariable: "",
            datasetPath: ""
        }
    );

    const methods = useForm({
        resolver: yupResolver(schema),
        mode: "onChange",
        defaultValues: expData
    });

    const onSubmit = async () => {
        try {
            const responseData = await retrainModel();
            if (responseData === "error" || responseData.status === "error") {
                setSubmitError("Error occurred during model retraining, check the input data");
            }
            else {
                setSubmitError(null);
                setShowResult(true);
                setExperimentResult(responseData);
            }
        } catch (error) {
            console.log(`error--${JSON.stringify(error)}`);
            setSubmitError("Error occurred during model retraining, check the input data");
        }
    };

    console.log(`showResult--${showResult}`);
    async function retrainModel() {
        const response = await api(URLPathConstants.RETRAIN_MODEL_CLASSIFICATION, {
            method: 'post',
            data: {
                "algorithm_name": expData.algorithmName,
                "target_variable": expData.targetVariable,
                "experiment_name": expData.experimentName,
                "experiment_id": expData.experimentId,
                "experiment_type": expData.experimentType,
                "dataset_path": expData.datasetPath
            },
        });
        return response; // return the response data
    }


    async function fetchExperimentList() {
        const response = await api(URLPathConstants.FETCH_EXPERIMENT_LIST, { method: "get" });
        updateExperimentList(response);
    }

    async function fetchAlgorithms() {
        const response = await api(URLPathConstants.FETCH_ALGORITHMS, { method: "get" });
        updateAlgorithms(response);
    }

    useEffect(() => {
        let expNames = experimentList.map((experiment) => { return experiment._name });
        setExistingExperiments(OptionsCreator(expNames));
    }, [experimentList]);

    useEffect(() => {
        fetchExperimentList();
        fetchAlgorithms();
    }, []);

    useEffect(() => {
        if (expData.experimentType) {
            setTargetAlgorithms(OptionsCreator(algorithms[expData.experimentType]));
        }
    }, [expData.experimentType]);

    console.log(`Expdata --${JSON.stringify(expData)}`);
    const handleInput = (event) => {
        const { name, value } = event.target
        setExpData(prevState => ({
            ...prevState,
            [name]: value
        }));
        if (name === "experimentName") {
            const indexOfExperiment = experimentList.map((experiment) => { return experiment._name }).indexOf(value);
            setExpData(prevState => ({
                ...prevState,
                experimentType: experimentList[indexOfExperiment]._tags.experiment_type,
                datasetPath: experimentList[indexOfExperiment]._tags.dataset_path,
                experimentId: experimentList[indexOfExperiment]._experiment_id,
                targetVariable: experimentList[indexOfExperiment]._tags.target_variable,
            }));
        }
    };

    return (
        <Card
            sx={{
                // bgcolor: "lightgray",
                py: 5,
                boxShadow: 0,
                paddingLeft: 3,
                color: (theme) => theme.palette.grey,
                ...sx,
            }}
        >
            {!showResult ?
                <Grid container spacing={3}>
                    <Grid item xs={12} md={6} lg={8}>
                        <FormProvider methods={methods} onSubmit={methods.handleSubmit(onSubmit)}>
                            <Stack direction="column" spacing={3}>
                                <RHFDropdown name="experimentName" label="Experiment name" options={existingExperiments || []} onBlur={handleInput} />
                                <RHFTextField name="experimentType" label="Experiment type" disabled value={expData.experimentType} />
                                <RHFDropdown name="algorithmName" label="Select the algorithm" options={targetAlgorithms || []} onBlur={handleInput} />
                                <Button variant="contained" color="primary" type="submit">
                                    Re-Train Model
                                </Button>
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
                <Grid container spacing={3}>
                    <Grid item xs={12} md={6} lg={8}>
                        <ExperimentResult experimentResult={experimentResult} />
                    </Grid>
                </Grid>
                : null}
        </Card>
    );
};


const mapStateToProps = (state) => ({
    algorithms: state.appReducer.algorithms,
    experimentList: state.appReducer.experimentList,
})

const mapDispatchToProps = (dispatch) => {
    return {
        updateExperimentList: (payload) => {
            dispatch({
                type: UPDATE_EXPERIMENT_LIST,
                payload
            })
        },
        updateAlgorithms: (payload) => {
            dispatch({
                type: UPDATE_ALGORITHMS,
                payload
            })
        },
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ExistingExperimentForm);