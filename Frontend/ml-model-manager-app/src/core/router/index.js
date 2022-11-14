import { Navigate, useRoutes } from 'react-router-dom';

// layouts
import DashboardLayout from '../../layout/dashboardLayout';
// ----------------------------------------------------------------------

//Pages of Application
import Dashboard from '../../pages/dashboard';
import ModelTraining from '../../pages/modelTraining';
import ExperimentsList from '../../pages/experimentsList';
import DeployedModels from '../../pages/deployedModels';

export default function Router() {
  return useRoutes([
    {
      path: '/mlapp',
      element: <DashboardLayout />,
      children: [
        { path: 'dashboard', element: <Dashboard /> },
        { path: 'model-training', element: <ModelTraining /> },
        { path: 'experiments-list', element: <ExperimentsList /> },
        { path: 'deployed-models', element: <DeployedModels /> },
      ],
    },
    {
      path: '/',
      element: <Navigate to='/app/dashboard' />
    },
    {
      path: '*',
      element: <Navigate to="/mlapp/dashboard" replace />,
    },
  ]);
}
