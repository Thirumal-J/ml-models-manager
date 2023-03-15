// import React, { useState } from 'react';
// import { makeStyles } from '@mui/styles';
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Typography,
//   Paper,
//   Button,
//   Grid,
// } from '@mui/material';
// import { URLPathConstants } from '../../utils/constants';
// import api from '../../services/api';

// const useStyles = makeStyles({
//   table: {
//     minWidth: 650,
//   },
// });

// const DeployedModelsTable = ({ title, deployedModels }) => {
//   const classes = useStyles();
//   const [selectedRow, setSelectedRow] = useState(null);
//   const [errorMsg, setErrorMsg] = useState(null);
//   const [successMsg, setSuccessMsg] = useState(null);


//   async function getPrediction(run_id, exp_id) {
//     const response = await api(URLPathConstants.DEPLOY_MODEL, {
//       method: 'POST',
//       data: {
//         "experiment_id": exp_id,
//         "run_id": run_id
//       },
//     });
//     return response; // return the response data
//   }

//   const handleRowClick = (modelRun) => {
//     setSelectedRow(modelRun);
//   };

//   const handlePrediction = async () => {
//     try {
//       const selectedRunId = selectedRow.run_id
//       const selectedExperimentId = deployedModels.find(({ run_id }) => run_id === selectedRunId)?.experiment_id;
//       const responseData = await getPrediction(selectedRunId, selectedExperimentId);
//       if (responseData === "error" || responseData.status === "error") {
//         setErrorMsg("Error occurred while retrieving the model prediction, retry later");
//         setSuccessMsg(null);
//       }
//       else {
//         setErrorMsg(null);
//         setSuccessMsg("Prediction done successfully");
//       }
//     } catch (error) {
//       console.log(`error--${JSON.stringify(error)}`);
//       setSuccessMsg(null);
//       setErrorMsg("Error occurred while retrieving the model prediction, retry later");
//     }
//   };

//   return (
//     <>
//       <Typography variant="h4" color="primary">
//         {title}
//       </Typography>
//       <TableContainer component={Paper}>
//         <Table className={classes.table} aria-label="Deployed Models">
//           <TableHead>
//             <TableRow>
//               <TableCell>Experiment Id</TableCell>
//               <TableCell>Experiment Name</TableCell>
//               <TableCell>Run Id</TableCell>
//               <TableCell>Run Name</TableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {deployedModels.map((model) => (
//               <TableRow
//                 key={model.run_id}
//                 onClick={() => handleRowClick(model)}
//                 selected={selectedRow && selectedRow.run_id === model.run_id}
//               >
//                 <TableCell component="th" scope="row">
//                   {model.run_id}
//                 </TableCell>
//                 <TableCell>{model['exp_id']}</TableCell>
//                 <TableCell>{model['exp_name']}</TableCell>
//                 <TableCell>{model['run_id']}</TableCell>
//                 <TableCell>{model['run_name']}</TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </TableContainer>
//       {selectedRow && (
//         <Button variant="contained" onClick={handlePrediction}>
//           Get Prediction
//         </Button>
//       )}
//       {errorMsg && (
//         <Grid container spacing={5}>
//           <Grid item xs={12} md={6} lg={8}>
//             <Typography color="error" variant="h5">
//               {errorMsg}
//             </Typography>
//           </Grid>
//         </Grid>
//       )
//       }
//       {successMsg && (
//         <Grid container spacing={5}>
//           <Grid item xs={12} md={6} lg={8}>
//             <Typography color="success" variant="h5">
//               {successMsg}
//             </Typography>
//           </Grid>
//         </Grid>
//       )
//       }
//     </>
//   );
// };

// export default DeployedModelsTable;


import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField
} from '@mui/material';

const DeployedModelsTable = ({ title, data }) => {
  const [selectedRow, setSelectedRow] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleRowClick = (row) => {
    setSelectedRow(row);
  }

  const handleFormSubmit = (event) => {
    event.preventDefault();
    // code to trigger prediction API
    setDialogOpen(false);
  }

  return (
    <>
      <TableContainer component={Paper}>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Experiment ID</TableCell>
              <TableCell>Experiment Name</TableCell>
              <TableCell>Run ID</TableCell>
              <TableCell>Run Name</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row) => (
              <TableRow key={row.exp_id} onClick={() => handleRowClick(row)}>
                <TableCell component="th" scope="row">{row.exp_id}</TableCell>
                <TableCell>{row.exp_name}</TableCell>
                <TableCell>{row.run_id}</TableCell>
                <TableCell>{row.run_name}</TableCell>
                <TableCell>
                  {selectedRow && selectedRow.exp_id === row.exp_id && (
                    <Button variant="contained" color="primary" onClick={() => setDialogOpen(true)}>Predict</Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>Predict</DialogTitle>
        <form onSubmit={handleFormSubmit}>
          <DialogContent>
            <TextField type="file" name="file" label="Upload a file" fullWidth required />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button type="submit" color="primary">Predict</Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
}

export default DeployedModelsTable;
