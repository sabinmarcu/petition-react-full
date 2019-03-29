import React from 'react';
import { observer, useObservable } from 'mobx-react-lite';

import {
  AppBar,
  Toolbar,
  Typography,
} from '@material-ui/core';

import AppStore from '../mobx/app';
import AccountMenu from './AccountMenu';

const NavBar = () => {
  const {
    title,
  } = useObservable(AppStore);
  return (
    <AppBar>
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
