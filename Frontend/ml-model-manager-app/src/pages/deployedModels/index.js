// import { faker } from '@faker-js/faker';
import { React, useState } from 'react';

// @mui
import { useTheme } from '@mui/material/styles';
import { Grid, Container, Typography, Box, Button } from '@mui/material';
// components
import Page from '../../components/Page';
import { FormProvider } from 'react-hook-form';
import { RHFDropdown } from '../../components/hook-form';
import ViewDeployedModels from './viewDeployedModels';
// import Iconify from '../components/Iconify';
// sections
// ----------------------------------------------------------------------

export default function DeployedModels() {
  const theme = useTheme();

  const [selectedExperiment, setSelectedExperiment] = useState('');

  const [showResult, setShowResult] = useState(false);

  const algorithmOptions = [
    { value: 'random forest', label: 'random forest' },
    { value: 'linear regression', label: 'linear regression' },
    { value: 'knn', label: 'knn' },
  ];
  return (
    <Page title="Deployed Models">
      <Container maxWidth="xl">
        <Grid container spacing={3}>
          <Grid item xs={12} md={6} lg={12}>
            <ViewDeployedModels />
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
}
