import React, { useState, useEffect } from 'react';
import { observer, useObservable } from 'mobx-react-lite';
import { Snackbar } from '@material-ui/core';

import PetitionStore from '../mobx/petition';

const NotificationsComponent = () => {
  const [isOpen, setOpen] = useState(false);
  const [text, setText] = useState('');
  const { contract: { isOnline: contractIsOnline } } = useObservable(PetitionStore);

  useEffect(() => {
    if (contractIsOnline) {
      PetitionStore.subscribeToPetitionNameChange(() => {
        setText('Petition name changed!');
        setOpen(true);
      });
      PetitionStore.subscribeToPetitionSign(({ args: { _name, _lastname } }) => {
        setText(`Petition Signed (${_name}, ${_lastname})!`);
        setOpen(true);
      });
    }
  }, [contractIsOnline]);

  return (
    <Snackbar
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left',
      }}
      open={isOpen}
      autoHideDuration={3000}
      onClose={() => setOpen(false)}
      message={<span>{text}</span>}
    />
  );
};

export default observer(NotificationsComponent);
