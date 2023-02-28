import React from 'react';
import { Typography, Container, Grid, Card, Box, Table, TableBody, TableContainer, TableRow, TableCell, TableHead, Paper } from '@mui/material';
import { FormatTimestamp } from '../../utils';

const ExperimentResult = ({ experimentResult }) => {

    return (
        <Container maxWidth="xl">

            <Typography variant="h4" sx={{ mb: 5 }}>
                Experiment Results
            </Typography>
            <Card
                sx={{
                    bgcolor: 'lightgray',
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
                            {Object.entries(experimentResult.data.metrics).map(([key, value], i) => (
                                <TableRow
                                    key={i}
                                >
                                    <TableCell component="th" scope="row">{key}</TableCell>
                                    <TableCell align="right">{value}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Card>
            <br />
            <br />

            <Card
                sx={{
                    bgcolor: 'lightgray',
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
                            <h3><TableHead>PARAMETERS USED</TableHead></h3>
                            {Object.entries(experimentResult.data.params).map(([key, value], i) => (
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
            <br />
            <br />

            <Card
                sx={{
                    bgcolor: 'lightgray',
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
                            <h3><TableHead>EXPERIMENT DETAILS</TableHead></h3>
                            {/* {Object.entries(experimentResult.data.metrics).map(([key, value], i) => (
                                <TableRow
                                    key={i}
                                // sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <TableCell component="th" scope="row">{key}</TableCell>
                                    <TableCell align="right">{value}</TableCell>
                                </TableRow>
                            ))} */}
                            <TableRow>
                                <TableCell component="th" scope="row">Experiment Id</TableCell>
                                <TableCell align="right">{experimentResult.info.experiment_id}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell component="th" scope="row">Run Id</TableCell>
                                <TableCell align="right">{experimentResult.info.run_id}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell component="th" scope="row">Start Time</TableCell>
                                <TableCell align="right">{FormatTimestamp(experimentResult.info.start_time)}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell component="th" scope="row">End Time</TableCell>
                                <TableCell align="right">{FormatTimestamp(experimentResult.info.end_time)}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell component="th" scope="row">User Id</TableCell>
                                <TableCell align="right">{experimentResult.info.user_id}</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
            </Card>
        </Container >
    );
};

export default ExperimentResult;