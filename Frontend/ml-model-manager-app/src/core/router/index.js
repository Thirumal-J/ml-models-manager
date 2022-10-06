import { Navigate, useRoutes} from 'react-router-dom';
import NavBar from '../../layout/navBar';
import Dashboard from '../../modules/dashboard';
import DeployedModels from '../../modules/deployedModels';
import ExperimentList from '../../modules/experimentList';
import ModelTraining from '../../modules/modelTraining';


export default function Router() {
    return useRoutes([
        {
            path: '/app',
            element: <NavBar />,
            children: [
                {
                    path: 'dashboard',
                    element: <Dashboard />
                },
                {
                    path: '/model-training',
                    element: <ModelTraining />
                },
                {
                    path: '/experiment-list',
                    element: <ExperimentList />
                },
                {
                    path: '/deployed-models',
                    element: <DeployedModels />
                }
            ]
        },
        {
            path: '/',
            element: <Navigate to='/app/dashboard' />
        },
        {
            path: '*',
            element: <Navigate to='/app/dashboard'/>
        }
    ])
}