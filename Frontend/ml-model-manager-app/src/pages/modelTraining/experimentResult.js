import React from 'react';
import * as Yup from 'yup';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import { useForm } from 'react-hook-form';
import { Typography, Box, Button, Stack, Grid, Table, TableBody, TableContainer, TableRow, TableCell, TableHead, Paper } from '@mui/material';
import { yupResolver } from '@hookform/resolvers/yup';

import { FormProvider, RHFTextField, RHFDropdown } from '../../components/hook-form';
import experimentResultJSON from '../../services/json/experimentResult.json';

const ExperimentResult = () => {
    const navigate = useNavigate();

    return (
        <Grid container spacing={3}>
            <Grid item xs={12} md={6} lg={8}>
                <Typography variant="h4" sx={{ mb: 5 }}>
                    Experiment Results
                </Typography>
            </Grid>
            <Grid item xs={12} md={6} lg={8}>
                <TableContainer component={Paper}>
                    <Table aria-label="simple table">
                        <TableBody>
                            {Object.entries(experimentResultJSON).map(([key, value], i) => (
                                <TableRow
                                    key={i}
                                    // sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <TableCell component="th" scope="row">{key}</TableCell>
                                    <TableCell align="right">{value}</TableCell>
                                </TableRow>
                            ))} 
                        </TableBody>
                    </Table>
                </TableContainer>
            </Grid>
        </Grid>
    );
};

export default ExperimentResult;