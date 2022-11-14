// import { faker } from '@faker-js/faker';
import React from 'react';

// @mui
import { useTheme } from '@mui/material/styles';
import { Grid, Container, Typography, Box } from '@mui/material';
// components
import Page from '../../components/Page';
import SelectExperiment from './selectExperiment';
import ViewExperimentDetails from './viewExperimentDetails';
// import Iconify from '../components/Iconify';
// sections
// ----------------------------------------------------------------------


export default function ExperimentList() {
  const theme = useTheme();

  return (
    <Page title="Experiments List">
      <Container maxWidth="xl">
        <Typography variant="h4" sx={{ mb: 5 }}>
          Experiments List
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6} lg={8}>
            <SelectExperiment />
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
}
