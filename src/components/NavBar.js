import React from 'react';
import { observer, useObservable } from 'mobx-react-lite';

import {
  AppBar,
  Toolbar,
  Typography,
} from '@material-ui/core';

import AppStore from '../mobx/app';
import AccountMenu from './AccountMenu';

import style from './NavBar.module.css';

const NavBar = () => {
  const {
    title,
  } = useObservable(AppStore);
  return (
    <AppBar position="static" style={style.navBar}>
      <Toolbar>
        <AccountMenu />
        <Typography
          variant="h6"
          color="inherit"
        >
          {title}
        </Typography>
      </Toolbar>
    </AppBar>
  );
};

export default observer(NavBar);
