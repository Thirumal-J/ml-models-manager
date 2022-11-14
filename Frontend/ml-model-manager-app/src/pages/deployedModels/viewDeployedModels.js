import React from 'react';
import * as Yup from 'yup';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import { useForm } from 'react-hook-form';
import { Typography, Box, Button, Stack, Grid, Table, TableBody, TableContainer, TableRow, TableCell, TableHead, Paper } from '@mui/material';
import { yupResolver } from '@hookform/resolvers/yup';

import { FormProvider, RHFTextField, RHFDropdown } from '../../components/hook-form';
import AppTable from '../../components/DynamicTable1';
import DeployedModels from '../../services/json/deployedModels.json';
import DynamicTable from '../../components/DynamicTable1';

const ViewDeployedModels = () => {
    const navigate = useNavigate();

    return (
        <Grid container 
        >
                <DynamicTable title="DeployedModels" data={DeployedModels} />
        </Grid>
    );
};

export default ViewDeployedModels;