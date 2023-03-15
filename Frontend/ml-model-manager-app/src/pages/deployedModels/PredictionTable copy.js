import React, { useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Typography,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    TextField,
} from '@mui/material';
import { URLPathConstants } from '../../utils/constants';
import api from '../../services/api';

const PredictForm = ({ exp_id, run_id, open, handleClose, predictionResult }) => {
    const [file, setFile] = useState(null);

    const handleFileChange = (event) => {
        console.log(`inside handle file chanege---file---${event.target.files[0]}`);
        setFile(event.target.files[0]);
    };

    async function getPrediction() {
        let formData = new FormData();
        formData.append('file', file);
        formData.append("experiment_id", exp_id);
        formData.append("run_id", run_id);
        console.log(`inside getPrediction--file---${file.name}----exp_id---${exp_id}----run_id--${run_id}`);

        const response = await api(URLPathConstants.PREDICTION_CLASSIFICATION, {
            method: "POST",
            headers: { "Content-Type": "multipart/form-data" },
            data: formData
        });
        return response;
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        const response = await getPrediction();
        console.log(response);
        predictionResult = response;
        handleClose();
    };

    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Predict</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Upload a dataset in CSV format to make a prediction.
                </DialogContentText>
                <form onSubmit={handleSubmit}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        type="file"
                        onChange={handleFileChange}
                    />
                    <DialogActions>
                        <Button onClick={handleClose} color="primary">
                            Cancel
                        </Button>
                        <Button type="submit" color="primary">
                            Predict
                        </Button>
                    </DialogActions>
                </form>
            </DialogContent>
        </Dialog>
    );
};

const PredictionTable = ({ data }) => {
    const [selectedRow, setSelectedRow] = useState(null);
    const [open, setOpen] = useState(false);
    const [predictionResult, setPredictionResult] = useState(null);

    console.log(` selected row---${selectedRow}`)

    const handleRowClick = (exp_id, run_id) => {
        console.log(`inside handle row click--exp_id--${exp_id}-- run_id--${run_id}`)
        setSelectedRow({ exp_id, run_id });
        setOpen(true);
    };

    const handlePredictClose = () => {
        setSelectedRow(null);
        setOpen(false);
    };

    const handleDownload = () => {
        window.location.href = predictionResult.csv_url;
    };

    console.log(`predictionResult---${predictionResult}`);

    return (
        <>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Experiment ID</TableCell>
                            <TableCell>Experiment Name</TableCell>
                            <TableCell>Run ID</TableCell>
                            <TableCell>Run Name</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data.map((row) => (
                            <TableRow key={row.exp_id}>
                                <TableCell>{row.exp_id}</TableCell>
                                <TableCell>{row.exp_name}</TableCell>
                                <TableCell>{row.run_id}</TableCell>
                                <TableCell>{row.run_name}</TableCell>
                                <TableCell>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        disabled={!row.run_id}
                                        onClick={() => handleRowClick(row.exp_id, row.run_id)}
                                    >
                                        Predict
                                    </Button>
                                </TableCell>
                                <TableCell>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        disabled={!predictionResult}
                                        onClick={() => handleDownload()}
                                    >
                                        Download
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            {selectedRow && (
                <PredictForm
                    exp_id={selectedRow.exp_id}
                    run_id={selectedRow.run_id}
                    open={open}
                    handleClose={handlePredictClose}
                    handlePrediction
                />
            )}
        </>
    );
};

export default PredictionTable;
