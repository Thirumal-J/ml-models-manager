import React from 'react';
import * as Yup from 'yup';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import { useForm } from 'react-hook-form';
import { Typography, Box, Button, Stack, Grid, Card } from '@mui/material';
import { yupResolver } from '@hookform/resolvers/yup';
import PropTypes from 'prop-types';

import { FormProvider, RHFTextField, RHFDropdown } from '../../components/hook-form';
import ViewExperimentDetails from './viewExperimentDetails';

const SelectExperiment = ({ color = 'primary', sx }) => {
    const navigate = useNavigate();

    const [showResult, setShowResult] = useState(false);
    const [selectedExperiment, setSelectedExperiment] = useState('');

    const experimentsList = [
        { value: 'scania-experiment', label: 'scania-experiment' },
        { value: 'air-pressure-experiment', label: 'air-pressure-experiment' },
    ];

    const schema = Yup.object().shape({
        // selectedExperiment: Yup.string().required('Experiment name should be provided'),
    });

    const defaultValues = {
        chosenExperiment: '',
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
        setSelectedExperiment('scania')
    };

    return (
        // <Card
        //     sx={{
        //         py: 5,
        //         boxShadow: 0,
        //         paddingLeft: 3,
        //         color: (theme) => theme.palette[color].darker,
        //         // bgcolor: (theme) => theme.palette[color].lighter,
        //         ...sx,
        //     }}
        // >
        <>
            {!showResult ?
                <Grid container spacing={3}>
                    <Grid item xs={12} md={6} lg={8}>
                        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
                            <Stack direction="column" spacing={3}>
                                <RHFDropdown name="chosenExperiment" label="Select the experiment" options={experimentsList} />
                                <Button variant="contained" color="primary" onClick={handleSubmit(onSubmit)}>
                                    Confirm
                                </Button>
                            </Stack>
                        </FormProvider>
                    </Grid>
                </Grid>
                : null}
            {showResult ?
                <Grid container spacing={3}>
                    <Grid item xs={12} md={6} lg={8}>
                        <ViewExperimentDetails selectedExperiment={selectedExperiment}/>
                    </Grid>
                </Grid>
                : null}
                </>
        // </Card>
    );
};

SelectExperiment.propTypes = {
    color: PropTypes.string,
    sx: PropTypes.object,
};

export default SelectExperiment;