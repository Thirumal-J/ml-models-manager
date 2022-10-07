import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Routes, Route} from 'react-router-dom';
import Routers from './core/router';
// import NavBar from './layout/navBar';

import Dashboard from './modules/dashboard';
import ModelTraining from './modules/modelTraining';
import ExperimentList from './modules/experimentList';
import DeployedModels from './modules/deployedModels';
import NavBar from './layout/navBar';

function App() {
  return (
    <div className="App">
      {/* <Router> */}
        <Routers />
        {/* </Router> */}
    </div>
    // <BrowserRouter>
    //   <Routes>
    //     <Route path='/' element={<NavBar/>}/>
    //     <Route path='/model-training' element={<ModelTraining/>}/>
    //     <Route path='/experiment-list' element={<ExperimentList/>}/>
    //     <Route path='/deployed-models' element={<DeployedModels/>}/>
    //     <Route path='*' element={<NavBar/>}/>
    //   </Routes>
    // </BrowserRouter>
  );
}

export default App;
