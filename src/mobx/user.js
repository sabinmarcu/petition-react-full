import { observable, computed } from 'mobx';

import AccountStore from './account';
import ContractStore from './contract';

class UserProfileStore {
  @observable name = '';

  @observable lastname = '';

  @observable account = AccountStore;

  @observable contract = ContractStore;

  @computed get fullname() {
    return `${this.name} ${this.lastname}`;
  }
}

export default new UserProfileStore();
