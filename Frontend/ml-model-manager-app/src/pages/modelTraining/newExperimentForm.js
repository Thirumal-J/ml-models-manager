import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Card, Grid, Stack, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { connect } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';

import { FormProvider, RHFDropdown, RHFTextField } from '../../components/hook-form';
import { UPDATE_ALGORITHMS, UPDATE_TARGET_ATTRIBUTES, UPDATE_EXPERIMENT_LIST } from '../../core/actions';
import api from '../../services/api';
import { OptionsCreator } from '../../utils';
import { URLPathConstants } from '../../utils/constants';
import ExperimentResult from './experimentResult';

const NewExperimentForm = ({ color = 'primary', sx, algorithms, updateAlgorithms, targetAttributes, updateTargetAttributes, updateExperimentList }) => {
    const navigate = useNavigate();

    const [existingExperimentNames, setExistingExperimentNames] = useState([]);
    const [experimentName, setExperimentName] = useState(null);
    const [experimentTypes, setExperimentTypes] = useState([]); //Fetching the experiment types from the JSON and setting the initial state
    const [selectedExperimentType, setSelectedExperimentType] = useState("");
    const [uploadedFileName, setUploadedFileName] = useState();
    const [uploadedFile, setUploadedFile] = useState();
    const [isFileUploaded, setIsFileUploaded] = useState(false);
    const [showResult, setShowResult] = useState(false);
    const [targetAlgorithms, setTargetAlgorithms] = useState([]); //Initial state is null, based on experiment type selection, it will be updated
    const [selectedAlgorithm, setSelectedAlgorithm] = useState();
    const [targetVariables, setTargetVariables] = useState([]);
    const [selectedTargetVariable, setSelectedTargetVariable] = useState("");

    const schema = Yup.object().shape({
        preferredExpName: Yup.string().required('Experiment name should be provided').test('nameValidation', "The name already exists!", val => existingExperimentNames.indexOf(val) === -1),
        chosenExperimentType: Yup.string().required('Experiment type should be selected'),
        chosenAlgorithm: Yup.string().required('An algorithm should be selected'),
        uploadDataset: Yup.mixed().required('File is required'),
        targetVariable: Yup.string().required('A target variable should be selected'),

    });

    const defaultValues = {
        preferredExpName: '',
        chosenExperimentType: '',
        chosenAlgorithm: '',
        uploadDataset: '',
        targetVariable: '',
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
        console.log(`default values--> ${JSON.stringify(defaultValues)}`);
        await trainModel();
        // props = await api("trainModel", selectedExperimentType ,"experimentResult.json","Error while uploading datasets",defaultValues);
        // const response = trainModel(preferredExpName,targetVariable,);
        setShowResult(true);
    };

    async function trainModel() {
        console.log(`train model ---> request payload -- experimentName: ${experimentName} target_variable: ${selectedTargetVariable}, algorithm_name: ${selectedAlgorithm}, selectedExperimentType: ${selectedExperimentType} `);
        const response = await api(URLPathConstants.TRAIN_MODEL_CLASSIFICATION, {
            method: 'post',
            body: {
                "experiment_name": experimentName,
                "target_variable": selectedTargetVariable,
                "algorithm_name": selectedAlgorithm,
                "experiment_type": selectedExperimentType
            },
        });
    }

    async function uploadCSV(file) {
        let formData = new FormData();
        formData.append('file', file);
        const response = await api(URLPathConstants.UPLOAD_CSV_CLASSIFICATION, {
            method: "post",
            headers: { "Content-Type": "multipart/form-data" },
            data: formData
        });
        updateTargetAttributes(response);
        if (response) {
            setIsFileUploaded(true);
            // setTargetVariables(OptionsCreator(response["column_names"]));
        }
        // setTargetVariables(targetAttributes);
    }

    async function fetchExperimentList() {
        const response = await api(URLPathConstants.FETCH_EXPERIMENT_LIST, { method: "get" });
        updateExperimentList(response);
        setExistingExperimentNames(response.map(res => res._name))
    }

    async function fetchAlgorithms() {
        const response = await api(URLPathConstants.FETCH_ALGORITHMS, { method: "get" });
        updateAlgorithms(response);
    }

    useEffect(() => {
        setTargetVariables(OptionsCreator(targetAttributes));
    }, [targetAttributes]);

    useEffect(() => {
        setExperimentTypes(OptionsCreator(Object.keys(algorithms)));
    }, [algorithms]);

    useEffect(() => {
        fetchExperimentList();
        fetchAlgorithms();
    }, [])

    const handleFileUpload = (event) => {
        setUploadedFile(event.target.files[0]);
        uploadCSV(event.target.files[0]);
        setUploadedFileName(event.target.files[0].name);
    };

    const handleExpTypeSelection = (event) => {
        setSelectedExperimentType(event.target.innerText);
        setTargetAlgorithms(OptionsCreator(algorithms[event.target.innerText]));
    };

    const handleExpNameSelection = (event) => {
        setExperimentName(event.target.innerText);
    };

    const handleAlgorithmSelection = (event) => {
        setSelectedAlgorithm(event.target.innerText);
    };

    const handleTargetVariableSelection = (event) => {
        setSelectedTargetVariable(event.target.innerText);
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
                                <RHFTextField name="preferredExpName" label="Preferred experiment name" onClick={handleExpNameSelection} />
                                <RHFDropdown name="chosenExperimentType" label="Choose experiment type" options={experimentTypes || []} onClick={handleExpTypeSelection} />
                                <RHFDropdown name="chosenAlgorithm" label="Select the algorithm" options={targetAlgorithms || []} onClick={handleAlgorithmSelection} />
                                <Button name="uploadDataset" variant="outlined" component="label">
                                    Upload dataset as CSV
                                    <input hidden type={"file"} accept={".csv"} onChange={handleFileUpload} />
                                </Button>
                                {isFileUploaded ?
                                    <Typography variant="body1" sx={{ mb: 5 }}> File: {uploadedFileName} uploaded successfully</Typography>
                                    : null}
                                <RHFDropdown name="targetVariable" label="Select a target variable" options={targetVariables || []} onClick={handleTargetVariableSelection} />
                                <Button variant="contained" color="primary" onClick={handleSubmit(onSubmit)}>
                                    Train Model
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

NewExperimentForm.propTypes = {
    color: PropTypes.string,
    sx: PropTypes.object,
};

const mapStateToProps = (state) => ({
    algorithms: state.modelTrainingReducer.algorithms,
    targetAttributes: state.modelTrainingReducer.targetAttributes,
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
        updateTargetAttributes: (payload) => {
            dispatch({
                type: UPDATE_TARGET_ATTRIBUTES,
                payload
            })
        },

    }
}

export default connect(mapStateToProps, mapDispatchToProps)(NewExperimentForm);