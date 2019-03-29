import React, { useRef } from 'react';
import { observer, useObservable } from 'mobx-react-lite';

import {
  IconButton,
  Menu,
  MenuItem,
} from '@material-ui/core';

import { Menu as MenuIcon } from 'mdi-material-ui';
import AccountStore from '../mobx/account';
import useMenu from '../hooks/menu';

const AccountMenu = () => {
  const menuButtonRef = useRef(null);
  const { menuState, openMenu, closeMenu } = useMenu();
  const { isOnline, primaryAccount, accounts } = useObservable(AccountStore);
  console.log(menuButtonRef);
  return (
    <>
      <IconButton
        color="inherit"
        aria-label="Menu"
        ref={menuButtonRef}
        onClick={openMenu}
      >
        <MenuIcon />
      </IconButton>
      <Menu
        id="menu-appbar"
        anchorEl={menuButtonRef.current && menuButtonRef.current.target}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        open={menuState}
        onClose={closeMenu}
      >
        <MenuItem>
          Debug Menu
        </MenuItem>
        {isOnline ? (
          [
            <MenuItem key="primary">
              {primaryAccount}
            </MenuItem>,
            <MenuItem key="separator">
            === Accounts: ===
            </MenuItem>,
            ...accounts.map(account => <MenuItem key={account}>{account}</MenuItem>),
          ]
        ) : (
          <MenuItem>Not logged in</MenuItem>
        )}
      </Menu>
    </>
  );
};

export default observer(AccountMenu);
