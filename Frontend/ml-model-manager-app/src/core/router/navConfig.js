// component
import Iconify from '../../components/Iconify';

import ListIcon from '@mui/icons-material/List';
// ----------------------------------------------------------------------

const getIcon = (name) => <Iconify icon={name} width={22} height={22} />;

const navConfig = [
  {
    title: 'dashboard',
    path: '/mlapp/dashboard',
    icon: getIcon('carbon:dashboard-reference'),
  },
  {
    title: 'model-training',
    path: '/mlapp/model-training',
    icon: getIcon('eos-icons:machine-learning'),
  },
  {
    title: 'experiments-list',
    path: '/mlapp/experiments-list',
    icon: getIcon('bi:list-stars'),
  },
  {
    title: 'deployed-models',
    path: '/mlapp/deployed-models',
    icon: getIcon('file-icons:3d-model'),
  },
];

export default navConfig;
