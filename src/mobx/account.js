import { observable, computed, action } from 'mobx';
import ethereum from '../shims/ethereum';

import { arraysEqual } from './utils';

class ConnectionStore {
  @observable accounts = [];

  @computed get primaryAccount() { return this.accounts[0]; }

  @computed get isOnline() { return this.accounts.length > 0; }

  constructor() {
    this.refreshAccounts();
    setInterval(this.refreshAccounts, 500);
  }

  @action refreshAccounts = async () => {
    const accounts = await this.getAccounts();
    if (this.accounts) {
      if (!arraysEqual(accounts, this.accounts)) {
        this.accounts = accounts;
      }
    } else {
      this.accounts = accounts;
    }
  }

  @action getAccounts = async () => (await ethereum.enable()).sort()
}

export default new ConnectionStore();
