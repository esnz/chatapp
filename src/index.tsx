import 'mobx-react-lite/batchingForReactDom';
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.scss';
import { dataStore } from './store/DataStore';
import { uiStore } from './store/UIStore';
import Firebase from './services/firebase';

export const rootStore = {
  UIStore: uiStore,
  dataStore: dataStore,
};
export const FirebaseContext = React.createContext<Firebase>({} as Firebase);
export const StoreContext = React.createContext({} as typeof rootStore);

export const firebase = new Firebase();

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <FirebaseContext.Provider value={firebase}>
        <StoreContext.Provider value={rootStore}>
          <App />
        </StoreContext.Provider>
      </FirebaseContext.Provider>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);
