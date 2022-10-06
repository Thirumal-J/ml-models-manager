import { useState } from 'react';
import { NavLink as RouterLink, matchPath, useLocation } from 'react-router-dom';
import { Box, List, ListItemText } from '@mui/material';

const navConfig = [
  {
    title: 'Dashboard',
    path: '/app/dashboard',
    // icon: getIcon('eva:pie-chart-2-fill'),
  },
  {
    title: 'Model Training',
    path: '/app/model-training',
    // icon: getIcon('eva:people-fill'),
  },
  {
    title: 'Experiment List',
    path: '/app/experiment-list',
    // icon: getIcon('eva:shopping-bag-fill'),
  },
  {
    title: 'Deployed Models',
    path: '/app/deployed-models',
    // icon: getIcon('eva:file-text-fill'),
  }
];

function NavItem({ item, active }) {
    const { title, path } = item;
    const isActiveRoot = active(path);

    const [open, setOpen] = useState(isActiveRoot);

    const handleOpen = () => {
        setOpen((prev) => !prev);
    };

return(
    <>
         <ListItemText disableTypography primary={title} />
    </>

)
}

export default function NavBar() {
  const { pathname } = useLocation();

  const match = (path) => (path ? !!matchPath({ path, end: false }, pathname) : false);

  return (
    <Box>
      <List>
        {navConfig.map((item) => (
          <NavItem key={item.title} item={item} active={match} />
        ))}
      </List>
    </Box>
  );
}