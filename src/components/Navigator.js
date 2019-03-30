import React, { useState } from 'react';
import { observer, useObservable } from 'mobx-react-lite';
import {
  Card,
  CardContent,
  TextField,
  Button,
  Snackbar,
} from '@material-ui/core';
import web3 from '../shims/web3';


import useFocus from '../hooks/focus';
import ContractStore from '../mobx/contract';

import style from './Navigator.module.css';

const Navigator = () => {
  const { focusState, onFocus, onBlur } = useFocus();
  const { contract } = useObservable(ContractStore);

  const [tempAddress, setTempAddress] = useState(contract ? contract.address : '');
  const [isOpen, setOpen] = useState(false);
  const [duration, setDuration] = useState(null);
  const [text, setText] = useState();

  const isValid = tempAddress.length > 0
    && web3.isAddress(tempAddress)
    && (!contract || tempAddress !== contract.address);
  const changeContract = async () => {
    setOpen(true);
    try {
      await ContractStore.connect(tempAddress);
      setText('Connected');
      setDuration(2000);
    } catch (e) {
      console.error(e);
      setText('Error while connecting');
      setDuration(200);
    }
  };

  return (
    <>
      <Card raised={focusState}>
        <CardContent className={style.wrapper}>
          <TextField
            className={style.input}
            type="text"
            value={tempAddress}
            label="Contract Address"
            onChange={({ target: { value } }) => setTempAddress(value)}
            {...{ onFocus, onBlur }}
          />
          <Button
            className={style.button}
            color="primary"
            variant="raised"
            disabled={!isValid}
            onClick={() => isValid && changeContract(tempAddress)}
          >
Access Contract
          </Button>
        </CardContent>
      </Card>
      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        autoHideDuration={duration}
        open={isOpen}
        onClose={() => setOpen(false)}
        message={<span>{text}</span>}
      />
    </>
  );
};

export default observer(Navigator);
