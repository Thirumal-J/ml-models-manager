import React from 'react';
import * as Yup from 'yup';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import { useForm } from 'react-hook-form';
import { Typography, Container, Card, Box, Button, Stack, Grid, Table, TableBody, TableContainer, TableRow, TableCell, TableHead, Paper } from '@mui/material';
import { yupResolver } from '@hookform/resolvers/yup';

import { FormProvider, RHFTextField, RHFDropdown } from '../../components/hook-form';
import experimentResultJSON from '../../services/json/experimentResult.json';

const ExperimentResult = () => {
    const navigate = useNavigate();

    return (
        <Container maxWidth="xl">

            <Typography variant="h4" sx={{ mb: 5 }}>
                Experiment Results
            </Typography>
            <Card
                sx={{
                    bgcolor: 'background.paper',
                    boxShadow: 1,
                    borderRadius: 2,
                    p: 2,
                    minWidth: 300,
                    spacing: 6,
                    paddingLeft: 2,
                    paddingTop: 2,
                    paddingRight: 2,
                    paddingBottom: 2,
                    textTransform: 'inherit'
                }}>
                <TableContainer component={Box}>
                    <Table aria-label="simple table">
                        <TableBody>
                            <h3><TableHead>METRICS</TableHead></h3>
                            {Object.entries(experimentResultJSON.data.metrics).map(([key, value], i) => (
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

            </Card>


            <Card
                sx={{
                    bgcolor: 'background.paper',
                    boxShadow: 1,
                    borderRadius: 2,
                    p: 2,
                    minWidth: 300,
                    spacing: 6,
                    paddingLeft: 2,
                    paddingTop: 2,
                    paddingRight: 2,
                    paddingBottom: 2,
                    textTransform: 'inherit'
                }}>
                <TableContainer component={Box}>
                    <Table aria-label="simple table">
                        <TableBody>
                            <h3><TableHead>METRICS</TableHead></h3>
                            {Object.entries(experimentResultJSON.data.metrics).map(([key, value], i) => (
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
            </Card>

            <Card
                sx={{
                    bgcolor: 'background.paper',
                    boxShadow: 1,
                    borderRadius: 2,
                    p: 2,
                    minWidth: 300,
                    spacing: 6,
                    paddingLeft: 2,
                    paddingTop: 2,
                    paddingRight: 2,
                    paddingBottom: 2,
                    textTransform: 'inherit'
                }}>
                <TableContainer component={Box}>
                    <Table aria-label="simple table">
                        <TableBody>
                            <h3><TableHead>METRICS</TableHead></h3>
                            {Object.entries(experimentResultJSON.data.metrics).map(([key, value], i) => (
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
            </Card>
            {/* </Grid> */}
        </Container >
    );
};

export default ExperimentResult;