import { observable, computed, action } from 'mobx';
import web3 from '../shims/web3';

import { contractAddress } from '../data/constants.json';
import abi from '../data/abi.json';

import { wrapCall, wrapSubscription } from './utils';

class ContractStore {
  @observable contract = null;

  @computed get isOnline() { return !!this.contract; }

  constructor() {
    this.connect();
  }

  @action async connect() {
    this.contract = await web3.eth.contract(abi).at(contractAddress);
  }

  @action async executeCommand(command, ...args) {
    if (!this.contract) {
      return Promise.reject(new Error('No Contract!'));
    }
    return wrapCall(this.contract, command, ...args);
  }

  @action subscribeToEvent(command, successHandler, errorHandler) {
    if (!this.contract) {
      throw new Error('No Contract!');
    }
    return wrapSubscription(this.contract, command, successHandler, errorHandler);
  }
}

export default new ContractStore();
