import app from 'firebase/app';
import 'firebase/database';
import 'firebase/auth';
import 'firebase/storage';

const config = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_DATABASE_URL,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_APIID,
  measurementId: process.env.REACT_APP_MEASUREMENTID,
};

class Firebase {
  auth: app.auth.Auth;
  db: app.database.Database;
  storage: app.storage.Storage;

  constructor() {
    app.initializeApp(config);
    this.auth = app.auth();
    this.db = app.database();
    this.storage = app.storage();
  }

  users = () => this.db.ref('users');
  contacts = () => this.db.ref('contacts');
  chats = () => this.db.ref('chats');
  userChats = () => this.db.ref('userChats');
  chatMessages = () => this.db.ref('chatMessages');
  facebookProvider = () => new app.auth.FacebookAuthProvider();
}

export default Firebase;
