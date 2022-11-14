// import AppWidgetSummary from '../../components/AppWidgetSummary';

import { Grid, Container, Typography } from '@mui/material';

const Bio = () => {
    return (
        <Container maxWidth="xl">
            <Grid item xs={12} md={6} lg={8}>
                <Typography variant="body1" sx={{ mb: 5 }}>
                    This application is a standardised software system for managing Machine Learning models.
                    This application helps to view and edit the machine learning projects used in the production domain of the Fraunhofer IPT industry.
                    Using this app, we can manage machine learning models' whole life cycle, such as data integration, preprocessing, modelling, and model deployment.
                </Typography>
            </Grid>
        </Container>
    )
}
export default Bio;