import React from 'react';
import { observer, useObservable } from 'mobx-react-lite';

import {
  AppBar,
  Toolbar,
  Typography,
} from '@material-ui/core';

import AccountStore from '../mobx/account';
import PetitionStore from '../mobx/petition';
import style from './NavBar.module.css';

const NavBar = () => {
  const { isOnline, primaryAccount } = useObservable(AccountStore);
  const { name } = useObservable(PetitionStore);
  const title = name ? `Addressed To: ${name}` : 'DApps with React';
  return (
    <AppBar position="static" className={style.navBar}>
      <Toolbar>
        <Typography
          variant="h6"
          color="inherit"
          className={style.title}
        >
          {title}
        </Typography>
        <Typography color="white" className={style.account}>
          {isOnline ? primaryAccount : 'Not Connected'}
        </Typography>
      </Toolbar>
    </AppBar>
  );
};

export default observer(NavBar);
