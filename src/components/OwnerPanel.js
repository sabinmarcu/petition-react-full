import React, { useState } from 'react';
import { observer, useObservable } from 'mobx-react-lite';

import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  TextField,
  Button,
} from '@material-ui/core';

import PetitionStore from '../mobx/petition';
import style from './forms.module.css';
import useFocus from '../hooks/focus';
import useSnackbar from '../hooks/transactionSnackbar';

const OwnerPanel = () => {
  const { name, setPetitionName } = useObservable(PetitionStore);
  const { focusState, onFocus, onBlur } = useFocus();
  const {
    Snackbar,
    openSnackbar,
    onSuccess,
    onError,
  } = useSnackbar();
  const [tempPetitionName, setTempPetitionName] = useState(name || '');
  const isValid = tempPetitionName.length > 0 && tempPetitionName !== name;
  const savePetition = (value) => {
    openSnackbar();
    setPetitionName(value)
      .then(onSuccess)
      .catch(onError);
  };
  return (
    <>
      <Card raised={focusState} className={style.card}>
        <CardHeader
          title="Owner Panel"
          subheader={name && name.length > 0
            ? 'Change Petition Name'
            : 'Set Petition Name'
          }
        />
        <CardContent className={style.form}>
          <TextField
            className={style.textField}
            type="text"
            label="First Name"
            value={tempPetitionName || ''}
            inputProps={{
              onFocus,
              onBlur,
            }}
            onChange={
              ({ target: { value } }) => setTempPetitionName(value)
            }
          />
        </CardContent>
        <CardActions>
          <Button
            size="small"
            color="primary"
            disabled={!isValid}
            onClick={() => isValid && savePetition(tempPetitionName)}
          >
            Save
          </Button>
        </CardActions>
      </Card>
      <Snackbar />
    </>
  );
};

export default observer(OwnerPanel);
