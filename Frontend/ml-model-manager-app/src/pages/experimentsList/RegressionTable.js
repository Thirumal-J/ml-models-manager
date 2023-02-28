import React from 'react';
import { makeStyles } from '@mui/styles';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});
const RegressionTable = ({ experimentRuns }) => {
  const classes = useStyles();
  console.log(`experimentRuns--${JSON.stringify(experimentRuns)}`)


  return (
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
            <TableRow key={modelRun.run_id}>
              <TableCell component="th" scope="row">{modelRun.run_id}</TableCell>
              <TableCell>{modelRun.params["Algorithm Name"]}</TableCell>
              <TableCell>{modelRun.params["Target Variable"]}</TableCell>
              <TableCell>{modelRun.metrics.Acccuarcy}</TableCell>
              <TableCell>{modelRun.metrics["F1 Score"]}</TableCell>
              <TableCell>{modelRun.metrics["Recall Score"]}</TableCell>
              <TableCell>{modelRun.metrics["True Negative"]}</TableCell>
              <TableCell>{modelRun.metrics["True Positive"]}</TableCell>
              <TableCell>{modelRun.metrics["False Negative"]}</TableCell>
              <TableCell>{modelRun.metrics["False Positive"]}</TableCell>
              <TableCell>{modelRun.metrics["Precision Score"]}</TableCell>
              <TableCell>{modelRun.metrics["R2 Score"]}</TableCell>
              <TableCell>{modelRun.start_time}</TableCell>
              <TableCell>{modelRun.end_time}</TableCell>
              <TableCell>{modelRun.status}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default RegressionTable;