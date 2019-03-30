import {
  observable,
  action,
  reaction,
  computed,
} from 'mobx';

import AccountStore from './account';
import ContractStore from './contract';
import UserProfileStore from './user';
import PersistStore from './persist';

const signerDecoder = ([
  address,
  id,
  name,
  lastname,
  retractedSignature,
]) => ({
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
    return !!this.identificationId;
  }

  @observable signatures = [];

  @computed get filteredSignatures() {
    return this.signatures.slice(0, 1);
  }

  constructor() {
    reaction(() => this.contract.isOnline, async () => {
      if (this.contract.isOnline) {
        this.refreshPetition();
        this.owner = await this.getOwner();
        this.subscribeToPetitionNameChange(({ args: { _addressedTo } }) => {
          this.name = _addressedTo;
        });
        const signatureCount = (await this.getSignatureCount()).toNumber();
        this.signatures = (await Promise.all(
          (new Array(signatureCount))
            .fill(0)
            .map(async (_, index) => this.getSigner(
              await this.getSignatureIndexByIdentificationId(index),
            )),
        )).map(signerDecoder);
        this.tryAndGetIdentificationId();
      }
    });
    reaction(() => this.identificationId, () => {
      if (this.identificationId != null) {
        PersistStore.setItem(
          'identificationId',
          this.identificationId,
        );
      }
    });
    reaction(() => ({
      account: this.account.primaryAccount,
      contract: this.contract.address,
    }), this.tryAndGetIdentificationId);
  }

  @action tryAndGetIdentificationId = async () => {
    this.identificationId = PersistStore.getItem('identificationId');
    console.log('Got identificationId', this.identificationId);
    console.log(this.signatures);
    if (this.signatures.length > 0) {
      console.log('Crawling through signatures');
      const signer = this.signatures.find(
        ({ address }) => address === this.account.primaryAccount,
      );
      if (signer) {
        this.identificationId = signer.id;
        this.userProfile.name = signer.name;
        this.userProfile.lastname = signer.lastname;
      }
    }
  }

  @action refreshPetition = async () => {
    this.name = await this.getPetitionName();
  }

  @action getOwner = async () => this.contract.executeCommand('getOwner');

  @action getPetitionName = async () => this.contract.executeCommand('getAddressedTo')

  @action setPetitionName = async name => this.contract.executeCommand('setAddressedTo', name)

  @action getSignatureCount = async () => this.contract.executeCommand('getSignaturesNumber')

  @action getSigner = async signer => this.contract.executeCommand('getSigner', signer)

  @action getSignatureIndexByIdentificationId = async id => this.contract.executeCommand('getSignatureIndexByIdentificationId', id)

  @action addSignerAndSign = async (id, name, lastname) => this.contract.executeCommand('addSignerAndSign', id, name, lastname)

  @action signPetition = async () => {
    if (this.identificationId) {
      throw new Error('You have already signed this petition!');
    }
    this.identificationId = await this.getSignatureCount();
    return this.addSignerAndSign(
      this.identificationId,
      this.userProfile.name,
      this.userProfile.lastname,
    );
  }

  @action subscribeToPetitionNameChange = (
    successHandler,
    errorHandler,
  ) => this.contract.subscribeToEvent(
    'SetAddressedTo',
    successHandler,
    errorHandler,
  );
}

const Store = new PetitionStore();
if (process.env.NODE_ENV === 'development') {
  window.$s = Store;
}
export default Store;
