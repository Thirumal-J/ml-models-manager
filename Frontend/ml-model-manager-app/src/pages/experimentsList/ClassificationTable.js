import React, { useState } from 'react';
import { makeStyles } from '@mui/styles';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Paper,
  Button,
  Grid,
} from '@mui/material';
import { URLPathConstants } from '../../utils/constants';
import api from '../../services/api';

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});

const ClassificationTable = ({ experimentRuns }) => {
  const classes = useStyles();
  const [selectedRow, setSelectedRow] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);


  async function deployModel(run_id, exp_id) {
    const response = await api(URLPathConstants.DEPLOY_MODEL, {
      method: 'POST',
      data: {
        "experiment_id": exp_id,
        "run_id": run_id
      },
    });
    return response; // return the response data
  }

  const handleRowClick = (modelRun) => {
    setSelectedRow(modelRun);
  };

  const handleDeployModel = async () => {
    try {
      const selectedRunId = selectedRow.run_id
      const selectedExperimentId = experimentRuns.find(({ run_id }) => run_id === selectedRunId)?.experiment_id;
      const responseData = await deployModel(selectedRunId, selectedExperimentId);
      if (responseData === "error" || responseData.status === "error") {
        setErrorMsg("Error occurred while deploying the model, retry later");
        setSuccessMsg(null);
      }
      else {
        setErrorMsg(null);
        setSuccessMsg("Model Deployed Successfully");
      }
    } catch (error) {
      console.log(`error--${JSON.stringify(error)}`);
      setSuccessMsg(null);
      setErrorMsg("Error occurred while deploying the model, retry later");
    }
  };

  return (
    <>
      <TableContainer component={Paper}>
        <Table className={classes.table} aria-label="Runs in Experiment">
          <TableHead>
            <TableRow>
              <TableCell>Run ID</TableCell>
              <TableCell>Algorithm Name</TableCell>
              <TableCell>Target Variable</TableCell>
              <TableCell>Accuracy</TableCell>
              <TableCell>F1 Score</TableCell>
              <TableCell>Recall Score</TableCell>
              <TableCell>True Negative</TableCell>
              <TableCell>True Positive</TableCell>
              <TableCell>False Negative</TableCell>
              <TableCell>False Positive</TableCell>
              <TableCell>Precision Score</TableCell>
              <TableCell>R2 Score</TableCell>
              <TableCell>Start Time</TableCell>
              <TableCell>End Time</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {experimentRuns.map((modelRun) => (
              <TableRow
                key={modelRun.run_id}
                onClick={() => handleRowClick(modelRun)}
                selected={selectedRow && selectedRow.run_id === modelRun.run_id}
              >
                <TableCell component="th" scope="row">
                  {modelRun.run_id}
                </TableCell>
                <TableCell>{modelRun.params['Algorithm Name']}</TableCell>
                <TableCell>{modelRun.params['Target Variable']}</TableCell>
                <TableCell>{modelRun.metrics['Accuracy']}</TableCell>
                <TableCell>{modelRun.metrics['F1 Score']}</TableCell>
                <TableCell>{modelRun.metrics['Recall Score']}</TableCell>
                <TableCell>{modelRun.metrics['True Negative']}</TableCell>
                <TableCell>{modelRun.metrics['True Positive']}</TableCell>
                <TableCell>{modelRun.metrics['False Negative']}</TableCell>
                <TableCell>{modelRun.metrics['False Positive']}</TableCell>
                <TableCell>{modelRun.metrics['Precision Score']}</TableCell>
                <TableCell>{modelRun.metrics['R2 Score']}</TableCell>
                <TableCell>{modelRun.start_time}</TableCell>
                <TableCell>{modelRun.end_time}</TableCell>
                <TableCell>{modelRun.status}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {selectedRow && (
        <Button variant="contained" onClick={handleDeployModel}>
          Deploy Model
        </Button>
      )}
      {errorMsg && (
        <Grid container spacing={5}>
          <Grid item xs={12} md={6} lg={8}>
            <Typography color="error" variant="h5">
              {errorMsg}
            </Typography>
          </Grid>
        </Grid>
      )
      }
      {successMsg && (
        <Grid container spacing={5}>
          <Grid item xs={12} md={6} lg={8}>
            <Typography color="success" variant="h5">
              {successMsg}
            </Typography>
          </Grid>
        </Grid>
      )
      }
    </>
  );
};

export default ClassificationTable;