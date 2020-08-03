import React from 'react';
import styles from '../styles/Header.module.scss';
import { ReactComponent as HamburgerIcon } from '../assets/hamburger_menu.svg';
import { StoreContext } from '..';
import { observer } from 'mobx-react-lite';

const Header: React.FC = (props) => {
  const store = React.useContext(StoreContext);
  const { setSideBarOpen, headerContent } = store.UIStore;

  return (
    <div className={styles.header}>
      <div className={styles.hamburger}>
        <button
          onClick={() => {
            setSideBarOpen(true);
          }}
        >
          <HamburgerIcon />
        </button>
      </div>
      {headerContent?.icon}
      <h6 style={{ flex: 1 }}>{headerContent?.title}</h6>

      {/* <a style={{ marginRight: '1rem' }} href="/">
          <FontAwesomeIcon icon={faTrash} />
        </a> */}
    </div>
  );
};

export default observer(Header);
