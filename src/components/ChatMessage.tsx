import React, { useContext } from 'react';
import Avatar from './ui/Avatar';
import styles from '../styles/Chat.module.scss';
import { StoreContext } from '..';
import { observer } from 'mobx-react-lite';

interface IChatItemProps {
  Uid: string;
  Message: string;
  Time: string;
  IsIncomingMsg: boolean;
  sentBy: string;
}

const ChatMessage = (props: IChatItemProps) => {
  const store = useContext(StoreContext);
  const { activeChat, currentUser } = store.dataStore;

  return (
    <div className={[styles.message, props.IsIncomingMsg ? styles.friend : styles.me].join(' ')}>
      <div className={styles.avatar}>
        {props.sentBy === currentUser?.uid ? (
          <Avatar size="small" imageUrl={currentUser.photoUrl} name={currentUser.firstname} />
        ) : (
          <Avatar size="small" imageUrl={activeChat.chatterPhotoUrl} name={activeChat.chatterName} />
        )}
      </div>
      <div className={styles.text}>
        {props.Message}
        {props.Time && <div className={styles.timestamp}>{props.Time}</div>}
      </div>
    </div>
  );
};

export default observer(ChatMessage);
