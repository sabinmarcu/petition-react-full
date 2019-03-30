import React from 'react';
import { observer, useObservable } from 'mobx-react-lite';

import {
  Card,
  CardHeader,
  CardContent,
  TextField,
} from '@material-ui/core';

import UserProfileStore from '../mobx/user';
import style from './forms.module.css';
import useFocus from '../hooks/focus';


const UserProfile = () => {
  const { name, lastname, fullname } = useObservable(UserProfileStore);
  const { focusState, onFocus, onBlur } = useFocus();
  return (
    <Card raised={focusState} className={style.card}>
      <CardHeader
        title="User Profile"
        subheader={fullname.length > 1 ? fullname : 'Please enter your name'}
      />
      <CardContent className={style.form}>
        <TextField
          className={style.textField}
          type="text"
          label="First Name"
          value={name || ''}
          inputProps={{
            onFocus,
            onBlur,
          }}
          onChange={
            ({ target: { value } }) => { UserProfileStore.name = value; }
          }
        />
        <TextField
          className={style.textField}
          type="text"
          label="Last Name"
          value={lastname || ''}
          inputProps={{
            onFocus,
            onBlur,
          }}
          onChange={
            ({ target: { value } }) => { UserProfileStore.lastname = value; }
          }
        />
      </CardContent>
    </Card>
  );
};

export default observer(UserProfile);
