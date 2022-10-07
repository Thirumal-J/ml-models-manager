import { useState } from 'react';
import {Navigate, NavLink as RouterLink, matchPath, Link } from 'react-router-dom';
import { Box, List, ListItemText, ListItemButton } from '@mui/material';

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

function NavItem({ item }) {
    const { title, path } = item;
    

return(
    <>
       <ListItemButton
      component={RouterLink}
      to={path}
    >
      <ListItemText disableTypography primary={title} />
    </ListItemButton>
    </>

)
}

export default function NavBar() {
//   const { pathname } = useLocation();

//   const match = (path) => (path ? !!matchPath({ path, end: false }, pathname) : false);
  return (
    <Box>
      <List>
        {navConfig.map((item) => (
          <NavItem key={item.title} item={item} />
        ))}
      </List>
    </Box>
  );
}