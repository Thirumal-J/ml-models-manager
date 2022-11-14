// import { faker } from '@faker-js/faker';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

// @mui
import { useTheme } from '@mui/material/styles';
import { Grid, Container, Typography, Box, Button, Stack } from '@mui/material';
// components
import Page from '../../components/Page';
import NewExperimentForm from './newExperimentForm';
import ExistingExperimentForm from './existingExperimentForm';
import Api from '../../services/api';

export default function ModelTraining() {
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

  useEffect(() => {
    // const fetchAlgorithms = async () => {
      // const result = await axios(
      //   'http://127.0.0.1:4000/v1/algorithms', {
      //   method: 'GET',
      //   headers: {}
      // }
      // ).then(response => {
      //   console.log(response);
      // }).catch(error => {
      //   console.error("Error while fetching algorithms", error)
      // });
    // }
    // fetchAlgorithms();
    const result = Api("fetchAlgorithms","algorithms.json","Error while fetching algorithms");
  }, []);

  return (
    <Page title="Model Training">
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
