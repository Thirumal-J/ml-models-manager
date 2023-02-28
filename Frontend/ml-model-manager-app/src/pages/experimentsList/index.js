// @mui
import { useTheme } from '@mui/material/styles';
import { Grid, Container, Typography, Box } from '@mui/material';
import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';

// components
import Page from '../../components/Page';
import SelectExperiment from './selectExperiment';


const ExperimentList = () => {
  const theme = useTheme();

  return (
    <Page title="Experiments List">
      <Container maxWidth="xl">
        <Typography variant="h4" sx={{ mb: 5 }}>
          Experiments List
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6} lg={12}>
            <SelectExperiment />
          </Grid>
        </Grid>
      </Container>
    </Page>
  )
};

export default ExperimentList;