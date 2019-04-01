import React from 'react';
import { observer, useObservable } from 'mobx-react-lite';

import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Button,
  Typography,
  Table,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@material-ui/core';

import useSnackbar from '../hooks/transactionSnackbar';
import PetitionStore from '../mobx/petition';

import style from './Petition.module.css';

const Petition = () => {
  const {
    hasSigned,
    signPetition,
    signaturesCount,
    retractedCount,
    signatures,
    retractSign,
  } = useObservable(PetitionStore);
  const {
    Snackbar, openSnackbar, onSuccess, onError,
  } = useSnackbar();
  const signPetitionAction = async () => {
    openSnackbar();
    let p;
    if (!hasSigned) {
      p = signPetition();
    } else {
      p = retractSign();
    }
    p.then(onSuccess).catch(onError);
  };
  return (
    <>
      <Card>
        <CardHeader
          title="Petition"
          subheader={
            `Signatures: ${signaturesCount} / Retracted: ${retractedCount}`
          }
        />
        <CardContent>
          {signatures.length > 0
            ? (
              <>
                <Typography variant="h6">
                  {
                  hasSigned
                    ? 'You have signed this petition'
                    : 'You have not signed this petition'
                }
                </Typography>
                <Typography variant="h6">Signatures:</Typography>
                <section className={style.tableWrapper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell>Last Name</TableCell>
                        <TableCell>Address</TableCell>
                        <TableCell>Retracted</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {signatures.map(({
                        id,
                        address,
                        name,
                        lastname,
                        retractedSignature,
                      }) => (
                        <TableRow key={id}>
                          <TableCell>{name}</TableCell>
                          <TableCell>{lastname}</TableCell>
                          <TableCell>
                            {retractedSignature ? 'Retracted' : 'Signed'}
                          </TableCell>
                          <TableCell>{address}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </section>
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
