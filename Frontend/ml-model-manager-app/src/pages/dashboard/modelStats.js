import AppWidgetSummary from '../../components/AppWidgetSummary';

import { Grid, Container, Typography } from '@mui/material';

const ModelStats = () => {
    return (
        <Container maxWidth="xl">
            <Grid container spacing={12}>
                <Grid item xs={12} md={6} lg={3}>
                    <AppWidgetSummary title="Total Experiments" total={10} icon={'eos-icons:rotating-gear'} />
                </Grid>

                <Grid item xs={12} md={6} lg={3}>
                    <AppWidgetSummary title="Total Runs" total={30} color="secondary" icon={'material-symbols:dynamic-feed-sharp'} />
                </Grid>

                <Grid item xs={12} md={6} lg={3}>
                    <AppWidgetSummary title="Total Models Deployed" total={6} color="success" icon={'fxemoji:rocket'} />
                </Grid>
            </Grid>
        </Container>
    )
}
export default ModelStats;