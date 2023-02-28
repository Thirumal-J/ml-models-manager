import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Card, Grid, Stack, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { connect } from 'react-redux';
import * as Yup from 'yup';

import { FormProvider, RHFDropdown, RHFTextField } from '../../components/hook-form';
import { UPDATE_ALGORITHMS, UPDATE_TARGET_ATTRIBUTES, UPDATE_EXPERIMENT_LIST } from '../../core/actions';
import api from '../../services/api';
import { OptionsCreator } from '../../utils';
import { URLPathConstants } from '../../utils/constants';
import ExperimentResult from './experimentResult';

const NewExperimentForm = ({ color = 'primary', sx, algorithms, updateAlgorithms, targetAttributes, updateTargetAttributes, updateExperimentList }) => {
    const [existingExperimentNames, setExistingExperimentNames] = useState([]);
    const [experimentTypes, setExperimentTypes] = useState([]); //Fetching the experiment types from the JSON and setting the initial state
    const [uploadedFileName, setUploadedFileName] = useState();
    const [isFileUploaded, setIsFileUploaded] = useState(false);
    const [showResult, setShowResult] = useState(false);
    const [targetAlgorithms, setTargetAlgorithms] = useState([]); //Initial state is null, based on experiment type selection, it will be updated
    const [targetVariables, setTargetVariables] = useState([]);
    const [experimentResult, setExperimentResult] = useState({});
    const [submitError, setSubmitError] = useState(null);

    const schema = Yup.object().shape({
        experimentName: Yup.string().required('Experiment name should be provided').test('nameValidation', "The name already exists!", val => existingExperimentNames.indexOf(val) === -1),
        experimentType: Yup.string().required('Experiment type should be selected'),
        algorithmName: Yup.string().required('An algorithm should be selected'),
        targetVariable: Yup.string().required('A target variable should be selected'),
        uploadedDataset: Yup.mixed().required('File is required'),
    });

    const [expData, setExpData] = useState(
        {
            experimentName: "",
            experimentType: "",
            algorithmName: "",
            targetVariable: "",
            uploadedDataset: ""
        }
    );

    const methods = useForm({
        resolver: yupResolver(schema),
        mode: "onChange",
        defaultValues: expData
    });

    const onSubmit = async () => {
        // const responseData = await trainModel(); // get the response data
        // setShowResult(true);
        // setExperimentResult(responseData);
        try {
            const responseData = await trainModel();
            if (responseData === "error") {
                setSubmitError("Error occurred during model training, check the input data");
            }
            else {
                setSubmitError(null);
                setShowResult(true);
                setExperimentResult(responseData);
            }
        } catch (error) {
            console.log(`error--${JSON.stringify(error)}`);
            setSubmitError("Error occurred during model training, check the input data");
        }
    };

    console.log(submitError)
    async function trainModel() {
        const response = await api(URLPathConstants.TRAIN_MODEL_CLASSIFICATION, {
            method: 'POST',
            data: {
                "experiment_name": expData.experimentName,
                "target_variable": expData.targetVariable,
                "algorithm_name": expData.algorithmName,
                "experiment_type": expData.experimentType
            },
        });
        return response; // return the response data
    }

    async function uploadCSV(file) {
        let formData = new FormData();
        formData.append('file', file);
        const response = await api(URLPathConstants.UPLOAD_CSV_CLASSIFICATION, {
            method: "POST",
            headers: { "Content-Type": "multipart/form-data" },
            data: formData
        });
        updateTargetAttributes(response);
        if (response) {
            setIsFileUploaded(true);
        }
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
        if (expData.experimentType)
            setTargetAlgorithms(OptionsCreator(algorithms[expData.experimentType]));
    }, [expData.experimentType]);

    useEffect(() => {
        fetchExperimentList();
        fetchAlgorithms();
    }, [])

    const handleFileUpload = (event) => {
        console.log(`--Event--uploadedDataSet-- ${event.target.name} `)
        handleInput(event);
        // setUploadedFile(event.target.files[0]);
        uploadCSV(event.target.files[0]);
        setUploadedFileName(event.target.files[0].name);
    };

    const handleInput = (event) => {
        const { name, value } = event.target

        setExpData(prevState => ({
            ...prevState,
            [name]: value
        }));

    };
    return (
        <Card
            sx={{
                // bgcolor: "lightgray",
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
                        <FormProvider methods={methods} onSubmit={methods.handleSubmit(onSubmit)}>
                            <Stack direction="column" spacing={3}>
                                <Button variant="outlined" component="label">
                                    Upload dataset as CSV
                                    <input hidden name="uploadedDataset" type={"file"} accept={".csv"} onChange={handleFileUpload} />
                                </Button>
                                {isFileUploaded ?
                                    <Typography variant="body1" sx={{ mb: 5 }}> File: {uploadedFileName} uploaded successfully</Typography>
                                    : null}
                                <RHFTextField name="experimentName" label="Preferred experiment name" onBlur={handleInput} />
                                <RHFDropdown name="experimentType" label="Select a experiment type" options={experimentTypes || []} onBlur={handleInput} />
                                <RHFDropdown name="algorithmName" label="Select a algorithm" options={targetAlgorithms || []} onBlur={handleInput} />
                                <RHFDropdown name="targetVariable" label="Select a target variable" options={targetVariables || []} onBlur={handleInput} />
                                <Button variant="contained" color="primary" type="submit">
                                    Train Model
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
            {
                showResult ?
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={6} lg={8}>
                            <ExperimentResult experimentResult={experimentResult} />
                        </Grid>
                    </Grid>
                    : null
            }
        </Card >
    );
};

NewExperimentForm.propTypes = {
    color: PropTypes.string,
    sx: PropTypes.object,
};

const mapStateToProps = (state) => ({
    algorithms: state.appReducer.algorithms,
    targetAttributes: state.appReducer.targetAttributes,
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