import { faComments, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useContext, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { StoreContext } from '..';
import styles from '../styles/Contacts.module.scss';
import Avatar from './ui/Avatar';

const Contact: React.FC = () => {
  const store = useContext(StoreContext);
  const { selectedContact, createNewChat, removeContact } = store.dataStore;
  const { setHeaderContent, setSideBarCurrentTab } = store.UIStore;
  const history = useHistory();

  useEffect(() => {
    setHeaderContent({
      title: selectedContact.fullname,
    });
  }, [selectedContact.fullname, setHeaderContent]);

  return (
    <div className={styles.contact}>
      <div className={styles.avatar}>
        <Avatar size="xlarge" imageUrl={selectedContact.photoUrl} name={selectedContact.fullname} />
      </div>
      <div className={styles.contactInfo}>
        <div className={styles.contactName}>
          <h2>{selectedContact.fullname}</h2>
        </div>
        <p>Phone: {selectedContact.phone}</p>
        <p>Address: {selectedContact.address}</p>
        <div className={styles.btns}>
          <button
            onClick={async () => {
              await createNewChat(selectedContact.userId);
              setSideBarCurrentTab('chats');
              history.push('/');
            }}
            type="submit"
            className="btn compact"
          >
            <FontAwesomeIcon icon={faComments} />
            Start Chat
          </button>
          <button
            onClick={() => {
              removeContact(selectedContact.uid);
            }}
            type="submit"
            className="btnRed"
          >
            <FontAwesomeIcon icon={faTimes} />
            Remove
          </button>
        </div>
      </div>
    </div>
  );
};
export default Contact;
