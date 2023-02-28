import React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Grid, Typography } from '@mui/material';

// import DeployedModels from '../../services/json/deployedModels.json';
import DynamicTable from '../../components/DynamicTable1';
import { URLPathConstants } from '../../utils/constants';
import api from '../../services/api';


const ViewDeployedModels = () => {
    const navigate = useNavigate();

    const [deployedModels, setDeployedModels] = useState([]);
    const [submitError, setSubmitError] = useState(null);

    async function fetchDeployedModels() {
        try {
            const responseData = await api(URLPathConstants.FETCH_DEPLOYED_MODELS, { method: "get" });
            if (responseData === "error" || responseData.status === "error") {
                setSubmitError("Error occurred while fetching deployed models");
            }
            else {
                setSubmitError(null);
                setDeployedModels(responseData);
            }
        } catch (error) {
            console.log(`error--${JSON.stringify(error)}`);
            setSubmitError("Error occurred while fetching deployed models");
        }
    }

    useEffect(() => {
        fetchDeployedModels();
    }, []);



    return (
        <Grid container>
            {submitError && (
                <Grid container spacing={5}>
                    <Grid item xs={12} md={6} lg={8}>
                        <Typography color="error" variant="h5">
                            {submitError}
                        </Typography>
                    </Grid>
                </Grid>
            )
            }
            {deployedModels.length > 0 ?
                <DynamicTable title="DeployedModels" data={deployedModels} />
                :
                <Typography variant="h4" color="primary">No deployed models found</Typography>
            }
        </Grid>
    );
};

export default ViewDeployedModels;