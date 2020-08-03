import { action, observable } from 'mobx';
import { firebase as fb } from '../index';
import { formatDate } from '../utils/helpers';
import { rootStore } from './../index';
import { getUserData } from './../services/user';
import { IChat, IChatMessage, IContact, IUser } from './Types';

class DataStore {
  @observable currentUser: null | IUser = null;

  @action loadCurrentUser = async () => {
    const currentUser = fb.auth.currentUser;
    if (!currentUser) return;

    const user = (await fb.users().child(currentUser.uid).once('value')).val();

    this.currentUser = {
      uid: currentUser.uid,
      email: currentUser.email as string,
      photoUrl: user.photoUrl as string,
      fullname: user.fullname,
      firstname: user.firstname,
      lastname: user.lastname,
      phone: user.phone,
      address: user.address,
    };
  };

  @action updateProfilePhoto = (photoUrl: string) => {
    if (this.currentUser) {
      this.currentUser.photoUrl = photoUrl;
    }
  };

  @action logout = () => {
    fb.chats().off('value');
    fb.chatMessages().off('value');
    fb.contacts().off('value');
  };

  //************************************************************ */
  @observable contacts: IContact[] = [];
  @observable selectedContact: IContact = {
    uid: '',
    userId: '',
    fullname: '',
    photoUrl: '',
    phone: '',
    address: '',
  };

  @action addContact = async (uid: string) => {
    const currentUserUid = fb.auth.currentUser?.uid;
    if (!currentUserUid) {
      return;
    }
    await fb.users().child(`${currentUserUid}/contacts`).push({
      uid: uid,
    });
  };

  @action removeContact = async (uid: string) => {
    const currentUserUid = this.currentUser?.uid;
    if (!currentUserUid) {
      return;
    }
    await fb.users().child(`${currentUserUid}/contacts`).child(uid).remove();
  };

  @action loadContacts = async () => {
    rootStore.UIStore.setContactsLoading(true);

    const currentUser = fb.auth.currentUser?.uid;
    if (!currentUser) return;

    fb.users()
      .child(currentUser)
      .child('contacts')
      .on('value', (contactUids) => {
        const contacts: IContact[] = [];
        const promises: Promise<any>[] = [];
        const uids: string[] = [];

        contactUids.forEach((item) => {
          uids.push(item.key as string);
          promises.push(fb.users().child(`${item.val().uid}`).once('value'));
        });

        Promise.all(promises).then((res) => {
          res.forEach((user, i) => {
            const contact: IContact = {
              uid: uids[i],
              userId: user.key,
              fullname: user.val().firstname + ' ' + user.val().lastname,
              photoUrl: user.val().photoUrl,
              phone: user.val().phone,
              address: user.val().address,
            };
            contacts.push(contact);
          });
          this.contacts = contacts;
          rootStore.UIStore.setContactsLoading(false);
        });
      });
  };

  @action setSelectedContact = (contact: IContact) => {
    this.selectedContact = contact;
  };

  //************************************************************ */
  @observable chats: IChat[] = [];
  @observable activeChat: IChat = {
    uid: '',
    chatterId: '',
    chatterName: '',
    chatterPhotoUrl: '',
    lastMessage: '',
  };
  @observable chatMessages: IChatMessage[] = [];
  @observable loadingMessages: boolean = false;

  @action loadChats = async () => {
    const userId = fb.auth.currentUser?.uid;
    if (!userId) return;

    fb.userChats()
      .child(userId)
      .on('value', (snapshot) => {
        snapshot.forEach((chatId) => {
          this.chats = [];
          let chatterId = '';
          let lastMessage = '';

          fb.chats()
            .child(chatId.val().chatId)
            .once('value')
            .then((sender) => {
              const members = sender.val().members;
              chatterId = members['0'] === this.currentUser?.uid ? members['1'] : members['0'];
              lastMessage = sender.val().lastMessage;
              return fb.users().child(chatterId).once('value');
            })
            .then((user) => {
              const chat: IChat = {
                uid: chatId.val().chatId,
                chatterId: chatterId,
                chatterName: user.val().firstname,
                chatterPhotoUrl: user.val().photoUrl,
                lastMessage: lastMessage,
              };
              this.chats.push(chat);
            });
        });
      });
  };

  chatRef = '';
  chatMessageRef = '';

  @action setActiveChat = (chatId: string) => {
    if (!chatId) return;
    this.loadingMessages = true;

    if (this.chatRef) {
      fb.chats().child(this.chatRef).off('value');
    }
    if (this.chatMessageRef) {
      fb.chatMessages().child(this.chatMessageRef).off('value');
    }

    fb.chats()
      .child(chatId)
      .once('value')
      .then(async (res) => {
        const data = res.val();
        const userData = await getUserData(this.currentUser?.uid === data.members['0'] ? data.members['1'] : data.members['0']);

        this.activeChat = {
          uid: res.key as string,
          chatterId: data.members['1'],
          lastMessage: data.lastMessage,
          chatterName: userData.firstname,
          chatterPhotoUrl: userData.photoUrl,
        };

        fb.chatMessages()
          .child(chatId)
          .orderByChild('date')
          .on('value', (msgSnapshot) => {
            this.chatMessageRef = chatId;
            this.loadingMessages = true;
            const chatMessages: IChatMessage[] = [];

            msgSnapshot.forEach((m) => {
              const data = m.val();
              chatMessages.push({
                uid: m.key as string,
                chatId: this.activeChat?.uid as string,
                date: new Date(data.date),
                isIncomming: data.sentBy !== this.currentUser?.uid,
                message: data.message,
                sentBy: data.sentBy,
                time: formatDate(new Date(data.date)),
              });
            });
            this.chatMessages = chatMessages;
            this.loadingMessages = false;
          });
      });

    fb.chats()
      .child(chatId)
      .on('value', (res) => {
        this.chatRef = chatId;
        this.setLastMessage(chatId, res.val().lastMessage);
      });
  };

  @action createNewChat = async (userId: string) => {
    const existing = this.chats.find((x) => x.chatterId === userId);
    if (existing) {
      this.setActiveChat(existing.uid);
      return;
    }
    const chatId = await fb.chats().push({
      createdBy: this.currentUser?.uid,
      lastMessage: '',
      members: {
        '0': this.currentUser?.uid,
        '1': userId,
      },
    });
    await fb
      .userChats()
      .child(this.currentUser?.uid as string)
      .push({
        chatId: chatId.key,
      });

    await fb.userChats().child(userId).push({ chatId: chatId.key });

    this.setActiveChat(chatId.key as string);
  };

  @action setLastMessage = (chatId: string, message: string) => {
    const chat = this.chats.find((x) => x.uid === chatId);
    if (chat) {
      chat.lastMessage = message;
    }
  };

  @action sendMessage = (message: string) => {
    fb.chatMessages().child(this.activeChat.uid).push({
      date: new Date().toISOString(),
      message: message,
      sentBy: fb.auth.currentUser?.uid,
    });
    fb.chats().child(this.activeChat.uid).update({
      lastMessage: message,
    });
  };
}
export const dataStore = new DataStore();
