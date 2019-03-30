import React, { useState } from 'react';
import { observer, useObservable } from 'mobx-react-lite';

import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Button,
  List,
  ListItem,
  Typography,
} from '@material-ui/core';

import useSnackbar from '../hooks/transactionSnackbar';
import PetitionStore from '../mobx/petition';

const Petition = () => {
  const {
    hasSigned, signPetition, signatures, filteredSignatures,
  } = useObservable(PetitionStore);
  const {
    Snackbar, openSnackbar, onSuccess, onError,
  } = useSnackbar();
  const signPetitionAction = async () => {
    openSnackbar();
    signPetition().then(onSuccess).catch(onError);
  };
  const [expand, setExpand] = useState(false);
  return (
    <>
      <Card>
        <CardHeader
          title="Petition"
          subheader={
            hasSigned
              ? 'You have signed this petition'
              : 'You have not signed this petition'
          }
        />
        <CardContent>
          {signatures.length > 0
            ? (
              <>
                <Typography variant="h6">Signatures</Typography>
                <List>
                  {(expand ? signatures : filteredSignatures)
                    .map(({ id, name, lastname }) => (
                      <ListItem key={id}>
                        {name}
                        {' '}
                        {lastname}
                      </ListItem>
                    ))}
                </List>
                <Button
                  color="primary"
                  onClick={() => setExpand(!expand)}
                >
                  See
                  {expand ? ' Less' : ' More'}
                </Button>
              </>
            )
            : <Typography variant="h6">There are no signatures yet!</Typography>
          }
        </CardContent>
        <CardActions>
          <Button color="primary" onClick={signPetitionAction}>
            {!hasSigned ? 'Sign Petition' : 'Revoke Petition'}
          </Button>
        </CardActions>
      </Card>
      <Snackbar />
    </>
  );
};

export default observer(Petition);
