import React, { useContext } from 'react';
import SideBar from '../components/SideBar';
import Header from '../components/Header';
import { useSwipeable } from 'react-swipeable';
import { StoreContext } from '..';
import { useMountEffect } from './../utils/hooks';

const MainPage: React.FC = (props) => {
  const store = useContext(StoreContext);
  const { setSideBarOpen } = store.UIStore;
  const { loadCurrentUser } = store.dataStore;

  useMountEffect(() => {
    loadCurrentUser();
  });

  const swipeHandler = useSwipeable({
    onSwipedRight: (eventData) => {
      if (eventData.initial[0] < 150) {
        setSideBarOpen(true);
      }
    },
  });

  return (
    <div className="PageWithoutBg">
      <SideBar />
      <div {...swipeHandler} className="wrapper">
        <Header />
        {props.children}
      </div>
    </div>
  );
};

export default MainPage;
