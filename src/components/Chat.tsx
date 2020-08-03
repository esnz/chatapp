import { observer } from 'mobx-react-lite';
import React, { useContext, useEffect, useRef } from 'react';
import { StoreContext } from '..';
import { ReactComponent as MessageSendIcon } from '../assets/message_send.svg';
import styles from '../styles/Chat.module.scss';
import { joinClasses } from './../utils/helpers';
import Avatar from './ui/Avatar';
import ChatMessage from './ChatMessage';
import Spinner from './ui/Spinner';

const Chat = () => {
  const store = useContext(StoreContext);
  const { setHeaderContent } = store.UIStore;
  const { loadingMessages, activeChat, chatMessages, sendMessage } = store.dataStore;

  const messageInput = useRef<any>();

  const handleSendClick = () => {
    const msg = messageInput.current.value;

    if (!msg) {
      return;
    }

    sendMessage(messageInput.current.value);
    messageInput.current.value = '';
  };

  useEffect(() => scrollToBottomOfChatPane(), [chatMessages]);

  const scrollToBottomOfChatPane = () => {
    const chatPane = document.querySelector('.chatPane');
    if (chatPane) {
      setTimeout(() => {
        chatPane.scrollTop = 9999;
      }, 200);
    }
  };

  useEffect(() => {
    setHeaderContent({
      title: activeChat.chatterName,
      icon: <Avatar size="normal" imageUrl={activeChat.chatterPhotoUrl} />,
    });
  }, [activeChat, setHeaderContent]);

  if (!activeChat.uid) {
    return (
      <div className={styles.noChat}>
        <h1>To start, please select a chat </h1>
      </div>
    );
  }

  return (
    <div className={styles.chat} style={{ position: 'relative' }}>
      {loadingMessages && <Spinner showBackDrop={false} />}
      <div className={joinClasses('chatPane', styles.chatPane)}>
        {chatMessages.map((msg, i) => {
          return <ChatMessage sentBy={msg.sentBy} Uid={msg.uid} Message={msg.message} Time={msg.time} key={i} IsIncomingMsg={msg.isIncomming} />;
        })}
      </div>
      <div className={styles.chatBar}>
        <div className={styles.messageInput}>
          <input
            onKeyPress={(e) => {
              if (e.which === 13 || e.keyCode === 13 || e.key === 'Enter') {
                handleSendClick();
              }
            }}
            type="text"
            name="messagge"
            placeholder="Enter your message"
            ref={messageInput}
          />
          <button className={styles.sendBtn} onClick={() => handleSendClick()}>
            <MessageSendIcon />
          </button>
        </div>
      </div>
    </div>
  );
};

export default observer(Chat);
