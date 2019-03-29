import React, { useState } from 'react';
import { Snackbar } from '@material-ui/core';

export default (defaultValue = false) => {
  const [isOpen, setState] = useState(defaultValue);
  const [text, setText] = useState('Please confirm transacton...');
  const [autoHideDuration, setHideDuration] = useState(null);
  const openSnackbar = () => setState(true);
  const closeSnackbar = () => setState(false);
  const TransactionSnackbar = () => (
    <Snackbar
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left',
      }}
      open={isOpen}
      autoHideDuration={autoHideDuration}
      onClose={closeSnackbar}
      message={<span>{text}</span>}
    />
  );
  const setExpiration = (duration = 1000) => setHideDuration(duration);
  const onSuccess = () => {
    setText('Transaction approved');
    setExpiration();
  };
  const onError = () => {
    setText('Transaction declined');
    setExpiration();
  };
  return {
    onSuccess,
    onError,
    openSnackbar,
    closeSnackbar,
    Snackbar: TransactionSnackbar,
    TransactionSnackbar,
    setText,
    setExpiration,
  };
};
