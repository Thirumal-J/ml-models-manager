import React, { useEffect } from 'react';
import * as Yup from 'yup';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import { useForm } from 'react-hook-form';
import { Typography, Box, Button, Stack, Grid, Card } from '@mui/material';
import { yupResolver } from '@hookform/resolvers/yup';
import PropTypes from 'prop-types';

import { FormProvider, RHFTextField, RHFDropdown } from '../../components/hook-form';
import { OptionsCreator } from '../../utils';
import ExperimentResult from './experimentResult';
import AlgorithmsJSON from '../../services/json/algorithms.json';
import AttributesJSON from '../../services/json/attributes.json';

const NewExperimentForm = ({ color = 'primary', sx }) => {
    const navigate = useNavigate();

    const [experimentTypes, setExperimentTypes] = useState(OptionsCreator(Object.keys(AlgorithmsJSON))); //Fetching the experiment types from the JSON and setting the initial state
    const [uploadedFileName, setUploadedFileName] = useState();
    const [isFileUploaded, setIsFileUploaded] = useState(false);
    const [showResult, setShowResult] = useState(false);
    const [algorithms, setAlgorithms] = useState([]); //Initial state is null, based on experiment type selection, it will be updated
    const [targetVariables, setTargetVariables] = useState([]); 

    const schema = Yup.object().shape({
        preferredExpName: Yup.string().required('Experiment name should be provided'),
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
        setShowResult(true);
    };

    useEffect(() => {
        if(uploadedFileName) {
            setIsFileUploaded(true);
            setTargetVariables(OptionsCreator(AttributesJSON["attributes"]));
        }
    },[uploadedFileName]);

    const handleFileUpload = (event) => {
        setUploadedFileName(event.target.files[0].name);
    };
    
    const handleExpTypeSelection = (event) => {
        setAlgorithms(OptionsCreator(AlgorithmsJSON[(event.target.innerText).toLowerCase()]))
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
                                <RHFTextField name="preferredExpName" label="Preferred experiment name" />
                                <RHFDropdown name="chosenExperimentType" label="Choose experiment type" options={experimentTypes} onClick={handleExpTypeSelection} />
                                <RHFDropdown name="chosenAlgorithm" label="Select the algorithm" options={algorithms} />
                                <Button name="uploadDataset" variant="outlined" component="label">
                                    Upload dataset as CSV
                                    <input hidden type={"file"} accept={".csv"} onChange={handleFileUpload} />
                                </Button>
                                {isFileUploaded ?
                                    <Typography variant="body1" sx={{ mb: 5 }}> File: {uploadedFileName} uploaded successfully</Typography>
                                    : null}
                                <RHFDropdown name="targetVariable" label="Select a target variable" options={targetVariables} />
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

export default NewExperimentForm;