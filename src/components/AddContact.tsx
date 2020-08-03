import { faCheck, faPlus, faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { observer } from 'mobx-react-lite';
import React, { useContext, useEffect, useState } from 'react';
import { FirebaseContext, StoreContext } from '..';
import { ReactComponent as ContactIcon } from '../assets/contact.svg';
import styles from '../styles/AddContact.module.scss';
import { useMountEffect } from '../utils/hooks';
import Avatar from './ui/Avatar';
import Spinner from './ui/Spinner';

const AddContact: React.FC = () => {
  const fb = useContext(FirebaseContext);
  const store = useContext(StoreContext);
  const { setHeaderContent } = store.UIStore;
  const { contacts, addContact } = store.dataStore;

  const [searchTerm, setSearchTerm] = useState<string | null>(null);
  const [result, setResult] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorText, setErrorText] = useState('');

  useMountEffect(() => {
    setHeaderContent({
      title: 'Add Contact',
      icon: <ContactIcon />,
    });
  });

  useEffect(() => {
    if (!searchTerm || searchTerm.length < 3) {
      setResult([]);
      setErrorText('');
      return;
    }
    setLoading(true);
    const currentUser = fb.auth.currentUser?.uid;

    fb.users()
      .orderByChild('fullname')
      .startAt(searchTerm.toLowerCase())
      .endAt(searchTerm.toLowerCase() + '\uf8ff')
      .once('value', (data) => {
        const res: any[] = [];
        data.forEach((child) => {
          if (currentUser !== child.key) {
            res.push({
              uid: child.key,
              ...child.val(),
            });
          }
        });

        setResult(res);
        setLoading(false);

        if (!res.length) {
          setErrorText('No result found');
        }
      });
  }, [fb, searchTerm]);

  return (
    <div className={styles.addContact}>
      <h2>Find contacts</h2>
      <form>
        <div className="form-group">
          <div className="input-wrapper">
            <FontAwesomeIcon icon={faSearch} />
            <input
              onChange={(e) => setSearchTerm(e.target.value)}
              type="text"
              className="form-control"
              style={{ width: '100%' }}
              placeholder="enter a username"
            />
          </div>
        </div>
      </form>
      <div className={styles.result}>
        {loading && <Spinner showBackDrop={false} />}
        <p className={styles.notFound}>{errorText}</p>
        {result.map((contact, i) => {
          return (
            <div key={i} className={styles.item}>
              <Avatar style={{ marginRight: '8px' }} size="normal" name={contact.firstname} imageUrl={contact.photoUrl} />

              <h6>{`${contact.firstname} ${contact.lastname}`}</h6>
              {contacts.find((c) => c.userId === contact.uid) ? (
                <button type="button" className="btnBlue" style={{ pointerEvents: 'none' }}>
                  <FontAwesomeIcon icon={faCheck} /> Added
                </button>
              ) : (
                <button
                  className="btnBlue"
                  onClick={() => {
                    addContact(contact.uid);
                  }}
                >
                  <FontAwesomeIcon icon={faPlus} /> Add to contacts
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default observer(AddContact);
