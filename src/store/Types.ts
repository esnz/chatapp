export interface IUser {
  uid: string;
  email: string;
  photoUrl: string;
  firstname: string;
  lastname: string;
  phone: string;
  address: string;
  fullname: string;
}
export interface IContact {
  uid: string;
  userId: string;
  fullname: string;
  photoUrl: string;
  phone: string;
  address: string;
}

export interface IChat {
  uid: string;
  chatterId: string;
  chatterName: string;
  chatterPhotoUrl: string;
  lastMessage: string;
}

export interface IChatMessage {
  uid: string;
  chatId: string;
  date: Date;
  time: string;
  message: string;
  sentBy: string;
  isIncomming: boolean;
}
