// import { faker } from '@faker-js/faker';
import React from 'react';

// @mui
import { useTheme } from '@mui/material/styles';
import { Grid, Container, Typography, Box, Card } from '@mui/material';
// components
import Page from '../../components/Page';
// import Iconify from '../components/Iconify';
// sections
import AppWidgetSummary from '../../components/AppWidgetSummary';
import ModelStats from './modelStats';
import Bio from './bio';
// ----------------------------------------------------------------------

export default function DashboardApp() {
  const theme = useTheme();

  return (
    <Page title="Dashboard">
      <Container maxWidth="xl">
        <Typography variant="h4" sx={{ mb: 5 }}>
          Welcome to Machine Learning Models Lifecycle Management
        </Typography>
        <Card  
        sx={{
          bgcolor: 'background.paper',
          boxShadow: 1,
          borderRadius: 2,
          p: 2,
          minWidth: 300,
          spacing:6,
          paddingLeft:2,
          paddingTop:2,
          paddingRight:2,
          paddingBottom:2,
          textTransform:'inherit'
        }}>
          {/* <Grid item xs={12} md={6} lg={8}> */}
            <ModelStats />
          {/* </Grid> */}
          {/* <Grid item xs={12} md={6} lg={8}> */}
            <Bio />
          {/* </Grid> */}
        </Card>
      </Container>    
    </Page>
  );
}
