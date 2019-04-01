import {
  observable,
  action,
  reaction,
  computed,
} from 'mobx';

import AccountStore from './account';
import ContractStore from './contract';
import UserProfileStore from './user';

const signerDecoder = ([
  address,
  id,
  name,
  lastname,
  retractedSignature,
]) => console.log('DECODING', {
  address, id, name, lastname, retractedSignature,
}) || ({
  address,
  name,
  lastname,
  id: id.toNumber(),
  retractedSignature: retractedSignature.toNumber(),
});

class PetitionStore {
  @observable account = AccountStore;

  @observable contract = ContractStore;

  @observable name = null;

  @observable owner = null;

  @observable userProfile = UserProfileStore;

  @observable identificationId = null;

  @computed get hasSigned() {
    return this.identificationId != null;
  }

  @observable signaturesCount: -1;

  @observable retractedCount: -1;

  @observable signatures = [];

  constructor() {
    reaction(() => this.contract.isOnline, async () => {
      if (this.contract.isOnline) {
        this.refreshPetition();
        this.owner = await this.getOwner();
        this.subscribeToPetitionNameChange(({ args: { _addressedTo } }) => {
          this.name = _addressedTo;
        });
        await this.reactToSignatureChange();
        this.subscribeToPetitionSign(this.reactToSignatureChange);
        this.subscribeToSignatureRetracted(this.reactToSignatureChange);
      }
    });
    reaction(() => ({
      account: this.account.primaryAccount,
    }), this.tryAndGetIdentificationId);
  }

  @action reactToSignatureChange = async () => {
    await this.refreshSignatures();
    return this.tryAndGetIdentificationId();
  }

  @action tryAndGetIdentificationId = async () => {
    if (this.signatures.length > 0) {
      const signer = this.signatures.find(
        ({ address }) => address === this.account.primaryAccount,
      );
      if (signer) {
        this.identificationId = signer.id;
        this.userProfile.name = signer.name;
        this.userProfile.lastname = signer.lastname;
      } else {
        this.identificationId = null;
        this.userProfile.name = null;
        this.userProfile.lastname = null;
      }
    }
  }

  @action refreshSignatures = async () => {
    await this.refreshSignaturesCount();
    this.signatures = (await Promise.all(
      (new Array(this.signaturesCount))
        .fill(0)
        .map(async (_, index) => this.getSigner(
          await this.getSignatureIndexByIdentificationId(index),
        )),
    )).map(signerDecoder);
  }

  @action refreshPetition = async () => {
    this.name = await this.getPetitionName();
  }

  @action refreshSignaturesCount = async () => {
    this.signaturesCount = (await this.getSignatureCount()).toNumber();
    this.retractedCount = (await this.getRetractedCount()).toNumber();
  }

  @action getOwner = async () => this.contract.executeCommand('getOwner');

  @action getPetitionName = async () => this.contract.executeCommand('getAddressedTo')

  @action setPetitionName = async name => this.contract.executeCommand('setAddressedTo', name)

  @action getSignatureCount = async () => this.contract.executeCommand('getSignaturesNumber')

  @action getSigner = async signer => this.contract.executeCommand('getSigner', signer)

  @action getSignatureIndexByIdentificationId = async id => this.contract.executeCommand('getSignatureIndexByIdentificationId', id)

  @action addSignerAndSign = async (id, name, lastname) => this.contract.executeCommand('addSignerAndSign', id, name, lastname)

  @action retractSign = async () => this.contract.executeCommand('retractSign')

  @action getRetractedCount = async () => this.contract.executeCommand('getRetractedSignaturesIndex')

  @action signPetition = async () => {
    if (this.identificationId) {
      throw new Error('You have already signed this petition!');
    }
    const signatureCount = await this.getSignatureCount();
    return this.addSignerAndSign(
      signatureCount,
      this.userProfile.name,
      this.userProfile.lastname,
    );
  }

  @action retractSignature = async () => {
    if (!this.identificationId) {
      throw new Error('You must have signed the petition to retract it!');
    }
    return this.retractSign();
  }

  @action subscribeToPetitionSign = (
    successHandler,
    errorHandler,
  ) => this.contract.subscribeToEvent(
    'PetitionSigned',
    successHandler,
    errorHandler,
  )

  @action subscribeToPetitionNameChange = (
    successHandler,
    errorHandler,
  ) => this.contract.subscribeToEvent(
    'SetAddressedTo',
    successHandler,
    errorHandler,
  );

  @action subscribeToSignatureRetracted = (
    successHandler,
    errorHandler,
  ) => this.contract.subscribeToEvent(
    'SignatureRetracted',
    successHandler,
    errorHandler,
  );
}

const Store = new PetitionStore();
if (process.env.NODE_ENV === 'development') {
  window.$s = Store;
}
export default Store;
