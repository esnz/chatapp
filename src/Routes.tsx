import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import MainPage from './pages/MainPage';
import Account from './components/Account';
import Chat from './components/Chat';
import { FirebaseContext } from '.';
import Spinner from './components/ui/Spinner';
import AddContact from './components/AddContact';
import Contact from './components/Contact';

export default () => {
  const firebase = React.useContext(FirebaseContext);
  const [isAuth, setIsAuth] = React.useState<boolean | null>(null);

  const unsubscribe = firebase.auth.onAuthStateChanged((user) => {
    if (user) {
      setIsAuth(true);
    } else {
      setIsAuth(false);
    }
    unsubscribe();
  });

  const authRoutes = (
    <Switch>
      <Route path="/login" component={Login} />
      <Route path="/signup" component={Signup} />
      <Redirect to="/login" />
    </Switch>
  );

  const mainRoutes = (
    <Switch>
      <MainPage>
        <Route path="/" exact component={Chat} />
        <Route path="/contact" component={Contact} />
        <Route path="/add-contact" component={AddContact} />
        <Route path="/account" component={Account} />
        <Redirect to="/" />
      </MainPage>
    </Switch>
  );

  if (isAuth === null) {
    return <Spinner />;
  }
  if (isAuth === false) {
    return authRoutes;
  }
  return mainRoutes;
};
