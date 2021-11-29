import { ListItem } from '@material-ui/core';
import React from 'react';
import { Message } from 'twilio-chat';

interface IChatItem {
  message: Message;
  email: string;
}
const ChatItem = (props: IChatItem) => {
  const { message, email } = props;
  const isOwnMessage = message.author === email;

  return (
    <ListItem
      style={
        isOwnMessage
          ? {
              flexDirection: 'column',
              alignItems: 'flex-end',
            }
          : {
              flexDirection: 'column',
              alignItems: 'flex-start',
            }
      }>
      <div style={styles.author}>{message.author}</div>
      <div style={styles.container(isOwnMessage)}>
        {message.body}
        <div
          style={{
            fontSize: 8,
            color: 'white',
            textAlign: 'right',
            paddingTop: 4,
          }}>
          {new Date(message.dateCreated.toISOString()).toLocaleString()}
        </div>
      </div>
    </ListItem>
  );
};

const styles = {
  listItem: {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  listItemOwn: {
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
  container: (isOwnMessage: boolean) => ({
    maxWidth: '75%',
    borderRadius: 12,
    padding: 16,
    color: 'white',
    fontSize: 12,
    backgroundColor: isOwnMessage ? '#054740' : '#262d31',
  }),
  author: { fontSize: 10, color: 'gray' },
  timestamp: { fontSize: 8, color: 'white', textAlign: 'right', paddingTop: 4 },
};

export default ChatItem;
