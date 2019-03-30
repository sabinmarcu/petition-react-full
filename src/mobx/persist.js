import { observable, computed, action } from 'mobx';

import { persistKeys } from '../data/constants.json';

import AccountStore from './account';
import ContractStore from './contract';

class PersistStore {
  @observable account = AccountStore;

  @observable contract = ContractStore;

  @computed get contractPrefix() {
    if (this.contract.address) {
      return this.contract.address;
    }
    return 'unknown';
  }

  @computed get accountPrefix() {
    if (this.account.primaryAccount) {
      return this.account.primaryAccount;
    }
    return 'unknown';
  }

  @action makeKey = key => `${this.contractPrefix}:${this.accountPrefix}:${persistKeys[key]}`

  @action setItem = (key, value) => localStorage.setItem(this.makeKey(key), value);

  @action getItem = key => localStorage.getItem(this.makeKey(key))
}

export default new PersistStore();
