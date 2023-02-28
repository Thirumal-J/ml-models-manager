// import { faker } from '@faker-js/faker';
import React, { useState } from 'react';


// @mui
import { useTheme } from '@mui/material/styles';
import { Grid, Container, Typography, Box, Button, Stack } from '@mui/material';
// components
import Page from '../../components/Page';
import NewExperimentForm from './newExperimentForm';
import ExistingExperimentForm from './existingExperimentForm';

function ModelTraining() {
  const theme = useTheme();

  const [newExperimentSelected, setNewExperimentSelected] = useState(false);
  const [existingExperimentSelected, setExistingExperimentSelected] = useState(false);

  const handleNewSelection = event => {
    setNewExperimentSelected(true);
    setExistingExperimentSelected(false);
  };

  const handleExisitingSelection = event => {
    setExistingExperimentSelected(true);
    setNewExperimentSelected(false);
  };


  return (
    <Page variant="h4" color="primary" title="Model Training">
      <Container maxWidth="xl">
        <Typography variant="h4" sx={{ mb: 5 }}>
          Model Training
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6} lg={8}>
            <Stack direction="row" spacing={12}>
              <Button variant="contained" size="large" color={!newExperimentSelected ? "primary" : "selection"} onClick={handleNewSelection}>
                New Experiment
              </Button>
              <Button variant="contained" size="large" color={!existingExperimentSelected ? "primary" : "selection"} onClick={handleExisitingSelection}>
                Existing Experiment
              </Button>
            </Stack>
          </Grid>

          {newExperimentSelected ?
            <Grid item xs={12} md={6} lg={8}>
              <NewExperimentForm />
            </Grid>
            : null}
          {existingExperimentSelected ?
            <Grid item xs={12} md={6} lg={8}>
              <ExistingExperimentForm />
            </Grid>
            : null}
        </Grid>
      </Container>
    </Page>
  );
}


export default ModelTraining;