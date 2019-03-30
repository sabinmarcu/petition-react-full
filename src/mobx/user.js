import { observable, reaction, computed } from 'mobx';

import PersistStore from './persist';
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

  constructor() {
    this.init();
    reaction(() => ({
      account: this.account.primaryAccount,
      contract: this.contract.address,
    }), this.init);
  }

  init = () => {
    ['name', 'lastname'].forEach((prop) => {
      this[prop] = PersistStore.getItem(prop) || '';
      this.makePersistHandler(prop);
    });
  }

  makePersistHandler = prop => reaction(
    () => this[prop],
    () => this[prop] && PersistStore.setItem(prop, this[prop]),
  )
}

export default new UserProfileStore();
