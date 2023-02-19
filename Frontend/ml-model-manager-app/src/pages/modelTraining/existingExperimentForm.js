import React, { useEffect } from 'react';
import * as Yup from 'yup';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import { useForm } from 'react-hook-form';
import { connect } from 'react-redux';
import { Typography, Box, Button, Stack, Grid, Card } from '@mui/material';
import { yupResolver } from '@hookform/resolvers/yup';

import { FormProvider, RHFDropdown, RHFTextField } from '../../components/hook-form';
import { ExperimentNames, OptionsCreator } from '../../utils';
import ExperimentResult from './experimentResult';
import { UPDATE_ALGORITHMS, UPDATE_EXPERIMENT_LIST } from '../../core/actions';
import api from '../../services/api';
import { URLPathConstants } from '../../utils/constants';
import AllExperimentsJSON from '../../services/json/allExperiments.json';
import AlgorithmsJSON from '../../services/json/algorithms.json';

const ExistingExperimentForm = ({ color = 'primary', sx, algorithms, updateAlgorithms, experimentList, updateExperimentList }) => {
    const navigate = useNavigate();

    const [showResult, setShowResult] = useState(false);
    // const [retrainModel, setRetrainModel] = useState({});
    const [experimentType, setExperimentType] = useState("");
    const [experimentName, setExperimentName] = useState("");
    // const [existingExperiments, setExistingExperiments] = useState(ExperimentNames(AllExperimentsJSON));
    const [existingExperiments, setExistingExperiments] = useState([]);
    const [targetAlgorithms, setTargetAlgorithms] = useState([]); //Initial state is null, based on experiment type selection, it will be updated
    const [selectedAlgorithm, setSelectedAlgorithm] = useState("");
    const [datasetPath, setDatasetPath] = useState("");
    const [experimentId, setExperimentId] = useState("");
    const [experimentTargetVariable, setExperimentTargetVariable] = useState("");

    console.log(existingExperiments);

    const schema = Yup.object().shape({
        experimentName: Yup.string().required('you must choose an experiment name'),
        chosenAlgorithm: Yup.string().required('you must choose an algorithm'),
    });

    const defaultValues = {
        experimentName: '',
        chosenAlgorithm: '',
        experimentType: '',
    };

    const methods = useForm({
        resolver: yupResolver(schema),
        mode: "onChange",
        defaultValues,
    });

    const {
        handleSubmit,
        formState: { errors },
    } = methods;

    const onSubmit = async () => {
        setShowResult(true);
    };

    async function retrainModel() {
        const response = await api(URLPathConstants.TRAIN_MODEL_CLASSIFICATION, {
            method: 'post',
            body: {
                "experiment_id": experimentId,
                "target_variable": experimentTargetVariable,
                "algorithm_name": selectedAlgorithm,
                "experiment_type": experimentType,
                "dataset_path": datasetPath,
            },
        });
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
        if (experimentType)
            setTargetAlgorithms(OptionsCreator(algorithms[experimentType]));
    }, [experimentType]);

    const handleExpSelection = (event) => {
        console.log(`event---> ${event.target.dataset}`);
        const indexOfExperiment = experimentList.map(experiment => experiment._name).indexOf(event.target.dataset.value);
        setExperimentType(experimentList[indexOfExperiment]._tags.experiment_type);
        setDatasetPath(experimentList[indexOfExperiment]._tags.dataset_path);
        setExperimentId(experimentList[indexOfExperiment]._experiment_id);
        setExperimentTargetVariable(experimentList[indexOfExperiment]._tags.target_variable);
    };

    const handleAlgorithmSelection = (event) => {
        setSelectedAlgorithm(event.target.innerText);
    };

    return (
        <Card
            sx={{
                py: 5,
                boxShadow: 0,
                paddingLeft: 3,
                color: (theme) => theme.palette[color].darker,
                ...sx,
            }}
        >
            {!showResult ?
                <Grid container spacing={3}>
                    <Grid item xs={12} md={6} lg={8}>
                        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
                            <Stack direction="column" spacing={3}>
                                <RHFDropdown name="experimentName" label="Experiment Name" options={existingExperiments} onChange={handleExpSelection} />
                                <RHFDropdown name="chosenAlgorithm" label="Select the algorithm" options={targetAlgorithms || []} onChange={handleAlgorithmSelection} />
                                <RHFTextField name='experimentType' label="Chosen Experiment Type" disabled value={experimentType} />
                                <Button variant="contained" size="large" color="primary" onClick={handleSubmit(onSubmit)}>
                                    Re-Train Model
                                </Button>
                            </Stack>
                        </FormProvider>
                    </Grid>
                </Grid>
                : null}
            {showResult ?
                <Grid container spacing={3}>
                    <Grid item xs={12} md={6} lg={8}>
                        <ExperimentResult />
                    </Grid>
                </Grid>
                : null}
        </Card>
    );
};


const mapStateToProps = (state) => ({
    algorithms: state.modelTrainingReducer.algorithms,
    experimentList: state.modelTrainingReducer.experimentList,
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