import React, { useEffect } from 'react';
import * as Yup from 'yup';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import { useForm } from 'react-hook-form';
import { Typography, Box, Button, Stack, Grid, Card } from '@mui/material';
import { yupResolver } from '@hookform/resolvers/yup';

import { FormProvider, RHFDropdown, RHFTextField } from '../../components/hook-form';
import { ExperimentNames, OptionsCreator } from '../../utils';
import ExperimentResult from './experimentResult';
import AllExperimentsJSON from '../../services/json/allExperiments.json';
import AlgorithmsJSON from '../../services/json/algorithms.json';

const ExistingExperimentForm = ({ color = 'primary', sx, props }) => {
    const navigate = useNavigate();

    const [showResult, setShowResult] = useState(false);
    const [experimentType, setExperimentType] = useState("");
    const [experimentName, setExperimentName] = useState("");
    const [existingExperiments, setExistingExperiments] = useState(ExperimentNames(AllExperimentsJSON));
    const [algorithms, setAlgorithms] = useState([]); //Initial state is null, based on experiment type selection, it will be updated

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

    const algorithmOptions = [
        { value: 'random forest', label: 'random forest' },
        { value: 'linear regression', label: 'linear regression' },
        { value: 'knn', label: 'knn' },
    ];

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
        if(experimentType)
        setAlgorithms(OptionsCreator(AlgorithmsJSON[experimentType]));
    }, [experimentType]);

    const handleExpSelection = (event) => {
        const indexOfExperiment = AllExperimentsJSON.map(i => i._experiment_id).indexOf(event.target.dataset.value);
        setExperimentType(AllExperimentsJSON[indexOfExperiment]._tags.experiment_type);
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
                                <RHFDropdown name="experimentName" label="Experiment Name" options={existingExperiments} onClick={handleExpSelection} />
                                <RHFDropdown name="chosenAlgorithm" label="Select the algorithm" options={algorithms} />
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

export default ExistingExperimentForm;