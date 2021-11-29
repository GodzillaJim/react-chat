import {
  AppBar,
  Backdrop,
  CircularProgress,
  Container,
  CssBaseline,
  Grid,
  IconButton,
  List,
  TextField,
  Toolbar,
  Typography,
} from '@material-ui/core';
import { Send } from '@material-ui/icons';
import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Channel, Message, Client } from 'twilio-chat';
import ChatItem from '../components/ChatItem';

const ChatScreen = () => {
  const [text, setText] = useState<string>('');
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [channel, setChannel] = useState<Channel>();
  const scrollDiv = useRef<null | HTMLDivElement>(null);

  const joinChannel = async (chan: Channel) => {
    try {
      if (channel && channel.status !== 'joined') {
        await chan.join();
      }
      setChannel(chan);
      const m = await channel?.getMessages();
      setMessages(m?.items || []);
      channel?.on('messageAdded', handleMessageAdded);
      scrollToBottom();
    } catch (e: any) {
      console.log(e);
    }
  };
  const handleMessageAdded = (message: Message) => {
    setMessages([...messages, message]);
    scrollToBottom();
  };
  const scrollToBottom = () => {
    if (scrollDiv.current) {
      const { scrollHeight, clientHeight } = scrollDiv.current;
      const maxScrollTop = scrollHeight - clientHeight;

      scrollDiv.current.scrollTop = maxScrollTop > 0 ? maxScrollTop : 0;
    }
  };
  const location = useLocation();
  const navigate = useNavigate();
  const getToken = async (email: string) => {
    try {
      const {
        data: { token },
      } = await axios.get(`http://localhost:5000/token/${email}`);
      return token;
    } catch (e: any) {
      console.log(e);
    }
  };
  useEffect(() => {
    const initializeChat = async () => {
      const { email, room } = location.state;
      if (email === '' || room === '') {
        return navigate('/');
      }
      const token = await getToken(email);
      console.log(token);
      const client = await Client.create(token);
      client.on('tokenAboutToExpire', async () => {
        const token = await getToken(email);
        client.updateToken(token);
      });
      client.on('tokenExpired', async () => {
        const token = await getToken(email);
        client.updateToken(token);
      });
      try {
        const channelT = await client.getChannelByUniqueName(room);
        joinChannel(channelT);
      } catch (e) {
        try {
          const channelT = await client.createChannel({
            uniqueName: room,
            friendlyName: room,
          });
          joinChannel(channelT);
        } catch (e) {
          console.log(e);
        }
      }
    };
    initializeChat();
  });
  const sendMessage = () => {
    if (text) {
      setLoading(true);
      channel?.sendMessage(text);
      setText('');
      setLoading(false);
    }
  };
  return (
    <Container component="main" maxWidth="md">
      <Backdrop open={loading} style={{ zIndex: 99999 }}>
        <CircularProgress style={{ color: 'white' }} />
      </Backdrop>

      <AppBar elevation={10}>
        <Toolbar>
          <Typography variant="h6">
            {`Room: ${location.state.room}, User: ${location.state.email}`}
          </Typography>
        </Toolbar>
      </AppBar>

      <CssBaseline />

      <Grid container direction="column" style={styles.mainGrid}>
        <div ref={scrollDiv} style={{ height: '70vh', overflow: 'auto' }}>
          <List dense={true}>
            {messages &&
              messages.map((message) => (
                <ChatItem
                  key={message.index}
                  message={message}
                  email={location.state.email}
                />
              ))}
          </List>
        </div>

        <Grid item style={styles.gridItemMessage}>
          <Grid
            container
            direction="row"
            justifyContent="center"
            alignItems="center">
            <Grid item style={styles.textFieldContainer}>
              <TextField
                required
                style={styles.textField}
                placeholder="Enter message"
                variant="outlined"
                multiline
                rows={2}
                value={text}
                disabled={!channel}
                onChange={(event) => setText(event.target.value)}
              />
            </Grid>

            <Grid item>
              <IconButton
                style={styles.sendButton}
                onClick={sendMessage}
                disabled={!channel}>
                <Send style={styles.sendIcon} />
              </IconButton>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
};
const styles = {
  textField: { width: '100%', borderWidth: 0, borderColor: 'transparent' },
  textFieldContainer: { flex: 1, marginRight: 12 },
  gridItem: { paddingTop: 12, paddingBottom: 12 },
  gridItemChatList: { overflow: 'auto', height: '70vh' },
  gridItemMessage: { marginTop: 12, marginBottom: 12 },
  sendButton: { backgroundColor: '#3f51b5' },
  sendIcon: { color: 'white' },
  mainGrid: { paddingTop: 100, borderWidth: 1 },
};
export default ChatScreen;
