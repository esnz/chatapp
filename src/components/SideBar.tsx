import { observer } from 'mobx-react-lite';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useSwipeable } from 'react-swipeable';
import { CSSTransition } from 'react-transition-group';
import { FirebaseContext, StoreContext } from '..';
import { ReactComponent as ChatIcon } from '../assets/chat.svg';
import { ReactComponent as ChatsIcon } from '../assets/chats_icon.svg';
import { ReactComponent as ContactsIcon } from '../assets/contacts_icon.svg';
import { ReactComponent as ProfileIcon } from '../assets/profile_icon.svg';
import { ReactComponent as MenuIcon } from '../assets/three_dot_menu.svg';
import styles from '../styles/SideBar.module.scss';
import { useClickOutside, useMountEffect, useWindowResizeEvent } from '../utils/hooks';
import { joinClasses } from './../utils/helpers';
import Avatar from './ui/Avatar';
import { Menu, MenuItem } from './ui/Menu';

const SideBar = () => {
  const fb = React.useContext(FirebaseContext);
  const store = useContext(StoreContext);
  const history = useHistory();

  const { contactsLoading, sideBarOpen, sideBarCurrentTab, setSideBarOpen, setSideBarCurrentTab } = store.UIStore;
  const { activeChat, selectedContact, chats, contacts, setActiveChat, loadChats, loadContacts, setSelectedContact, logout } = store.dataStore;

  const sideBarRef = useRef(null);
  const tabMenus = [useRef<any>(null), useRef<any>(null)];
  const [menuShow, setMenuShow] = useState<boolean>(false);
  const [activeMenuItem, setActiveMenuItem] = useState(tabMenus[0].current);
  const [contactSearch, setContactSearch] = useState('');

  const swipeHandler = useSwipeable({
    onSwipedLeft: () => {
      setSideBarOpen(false);
    },
  });

  useWindowResizeEvent(() => {
    if (window.innerWidth >= 800) {
      setSideBarOpen(false);
    }
  });

  useClickOutside(sideBarRef, () => {
    if (sideBarOpen) {
      setSideBarOpen(false);
    }
  });

  useMountEffect(() => {
    setActiveMenuItem(tabMenus[0].current);
    loadChats();
    loadContacts();
  });

  useEffect(() => {
    tabMenus.forEach((menu) => {
      const menuItem = menu?.current;
      if (menuItem) {
        menuItem.onclick = (e: Event) => {
          e.preventDefault();
          setActiveMenuItem(menuItem);
        };
      }
    });
  }, [tabMenus]);

  useEffect(() => {
    setActiveMenuItem(tabMenus[sideBarCurrentTab === 'chats' ? 0 : 1].current);
    tabMenus.forEach((m) => m.current.classList.remove(styles.active));
    activeMenuItem?.classList.add(styles.active);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeMenuItem, sideBarCurrentTab]);

  const AppMenu = () => (
    <Menu clickOutsideCallback={() => setMenuShow(false)}>
      <MenuItem
        text="Account"
        icon={ProfileIcon}
        clickHandler={() => {
          history.push('account');
          setSideBarOpen(false);
          setMenuShow(false);
        }}
      />

      <MenuItem
        text="Logout"
        icon={ChatIcon}
        clickHandler={async () => {
          logout();
          await fb.auth.signOut();
          history.push('/login');
          setMenuShow(false);
          setSideBarOpen(false);
        }}
      />
    </Menu>
  );

  return (
    <div ref={sideBarRef} className={joinClasses(styles.sideBar, sideBarOpen ? styles.open : null)}>
      <div {...swipeHandler} style={{ flex: 1 }}>
        <div className={styles.header}>
          <ChatIcon />
          <Link to="/">
            <h1>ChatApp</h1>
          </Link>
          <div
            onClick={(e) => {
              e.preventDefault();
              setMenuShow(true);
            }}
            className={styles.menuBtn}
            style={{ marginLeft: 'auto' }}
          >
            <MenuIcon /> {menuShow ? <AppMenu /> : null}
          </div>
        </div>
        <div className={styles.menu}>
          <div className={styles.items}>
            <a
              ref={tabMenus[0]}
              onClick={() => {
                setSideBarCurrentTab('chats');
              }}
              className={[styles.item, styles.active].join(' ')}
              href="/"
            >
              <ChatsIcon />
              Chats
            </a>
            <a
              ref={tabMenus[1]}
              onClick={() => {
                setSideBarCurrentTab('contacts');
              }}
              className={styles.item}
              href="/"
            >
              <ContactsIcon />
              Contacts
            </a>
            <div
              className={styles.itemBorder}
              style={activeMenuItem && { left: `${activeMenuItem.offsetLeft}px`, width: `${activeMenuItem.clientWidth}px` }}
            />
          </div>
        </div>

        <CSSTransition in={sideBarCurrentTab === 'chats'} unmountOnExit timeout={300} classNames={'tabChats'}>
          <div className={styles.content} style={{ height: '100%' }}>
            <div className={styles.chats}>
              {chats.map((chat, i) => {
                return (
                  <div
                    onClick={() => {
                      if (chat.uid !== activeChat.uid) {
                        setActiveChat(chat.uid);
                      }
                      history.push('/');
                      setSideBarOpen(false);
                    }}
                    key={i}
                    style={{ borderTop: i === 0 ? 'none' : undefined }}
                    className={joinClasses(styles.chat, activeChat?.uid === chat.uid && styles.active)}
                  >
                    <div className={styles.avatar}>
                      <Avatar name={chat.chatterName} size="normal" imageUrl={chat.chatterPhotoUrl} />
                    </div>
                    <div className={styles.texts}>
                      <h6>{chat.chatterName}</h6>
                      <p>{chat.lastMessage}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </CSSTransition>

        <CSSTransition in={sideBarCurrentTab === 'contacts'} unmountOnExit timeout={500} classNames={'tabContacts'}>
          <div className={styles.content} style={{ height: 'calc(100% - 8.3rem)' }}>
            {!contactsLoading && (
              <div className={styles.search}>
                <input onChange={(e) => setContactSearch(e.target.value)} type="text" placeholder="Search contacts" />
              </div>
            )}
            <div className={styles.chats}>
              {contacts
                .filter((x) => x.fullname.toLowerCase().includes(contactSearch))
                .map((contact) => {
                  return (
                    <div
                      onClick={() => {
                        setSelectedContact(contact);
                        setSideBarOpen(false);
                        history.push('/contact');
                      }}
                      key={contact.userId}
                      className={joinClasses(styles.chat, selectedContact.userId === contact.userId && styles.active)}
                    >
                      <div className={styles.avatar}>
                        <Avatar name={contact.fullname} size="normal" imageUrl={contact.photoUrl} />
                      </div>
                      <div className={styles.texts}>
                        <h6>{contact.fullname}</h6>
                      </div>
                    </div>
                  );
                })}
            </div>
            <button
              className={styles.newBtn}
              onClick={() => {
                setSideBarOpen(false);

                history.push('/add-contact');
              }}
            >
              Add New Contact
            </button>
          </div>
        </CSSTransition>
      </div>
    </div>
  );
};

export default observer(SideBar);
