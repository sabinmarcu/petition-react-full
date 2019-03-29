import { observable, computed } from 'mobx';

import PetitionStore from './petition';

const defaultText = 'DApps with React';

class AppStore {
  @observable petition = PetitionStore;

  @computed get title() {
    let text = defaultText;
    const { contract: { isOnline }, name } = this.petition;
    if (isOnline) {
      if (name) {
        text = `Petition For: ${name.length > 0 ? name : 'Unknown'}`;
      } else {
        text = 'Loading petition...';
      }
    }
    return text;
  }

  @computed get isOnline() {
    return this.petition.account.isOnline && this.petition.contract.isOnline;
  }

  @computed get isOwner() {
    const { owner, account: { primaryAccount } } = this.petition;
    return owner && primaryAccount && owner === primaryAccount;
  }
}

export default new AppStore();
