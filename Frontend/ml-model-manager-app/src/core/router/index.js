import { Navigate, useRoutes, BrowserRouter, Routes, Route} from 'react-router-dom';
import NavBar from '../../layout/navBar';
import Dashboard from '../../modules/dashboard';
import DeployedModels from '../../modules/deployedModels';
import ExperimentList from '../../modules/experimentList';
import ModelTraining from '../../modules/modelTraining';


export default function Routers() {
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
                    path: 'model-training',
                    element: <ModelTraining />
                },
                {
                    path: 'experiment-list',
                    element: <ExperimentList />
                },
                {
                    path: 'deployed-models',
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
    // <BrowserRouter>
    //     <Routes>
    //         <Route path='/app/dashboard' component={<Dashboard/>}/>
    //         <Route path='/app/model-training' component={<ModelTraining/>}/>
    //         {/* <Route path='/' component={<Dashboard/>}/> */}
    //         {/* <Route path='/' component={<Dashboard/>}/> */}

    //     </Routes>
    // </BrowserRouter>
}