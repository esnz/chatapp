import { observable, action } from 'mobx';

class UIStore {
  @observable headerContent: { title: string; icon?: JSX.Element } | null = null;
  @action
  setHeaderContent = (content: { title: string; icon?: JSX.Element }) => (this.headerContent = content);

  @observable sideBarOpen: boolean = false;
  @action
  setSideBarOpen = (state: boolean) => {
    this.sideBarOpen = state;
  };

  @observable sideBarCurrentTab: string = 'chats';
  @action
  setSideBarCurrentTab = (tab: string) => {
    this.sideBarCurrentTab = tab;
  };

  @observable chatsLoading: boolean = false;
  @action setChatsLoading = (value: boolean) => {
    this.chatsLoading = value;
  };

  @observable contactsLoading: boolean = true;
  @action setContactsLoading = (value: boolean) => {
    this.contactsLoading = value;
  };
}
export const uiStore = new UIStore();
