import {
  observable, action, reaction,
} from 'mobx';
import AccountStore from './account';
import ContractStore from './contract';
import UserProfileStore from './user';

class PetitionStore {
  @observable account = AccountStore;

  @observable contract = ContractStore;

  @observable name = null;

  @observable owner = null;

  @observable userProfile = UserProfileStore;

  constructor() {
    reaction(() => this.contract.isOnline, async () => {
      if (this.contract.isOnline) {
        this.refreshPetition();
        this.owner = await this.getOwner();
        this.subscribeToPetitionNameChange(({ args: { _addressedTo } }) => {
          this.name = _addressedTo;
        });
      }
    });
  }

  @action refreshPetition = async () => {
    this.name = await this.getPetitionName();
  }

  @action getOwner = async () => this.contract.executeCommand('getOwner');

  @action getPetitionName = async () => this.contract.executeCommand('getAddressedTo')

  @action setPetitionName = async name => this.contract.executeCommand('setAddressedTo', name)

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
