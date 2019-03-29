import { observable, reaction, computed } from 'mobx';
import { persistKeys } from '../data/constants.json';

class UserProfileStore {
  @observable name = '';

  @observable lastname = '';

  @computed get fullname() {
    return `${this.name} ${this.lastname}`;
  }

  constructor() {
    ['name', 'lastname'].forEach((prop) => {
      this[prop] = localStorage.getItem(persistKeys[prop]);
      this.makePersistHandler(prop);
    });
  }

  makePersistHandler = prop => reaction(
    () => this[prop],
    () => localStorage.setItem(persistKeys[prop], this[prop]),
  )
}

export default new UserProfileStore();
