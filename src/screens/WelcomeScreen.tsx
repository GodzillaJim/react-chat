import {
  AppBar,
  Button,
  Card,
  Grid,
  TextField,
  Toolbar,
  Typography,
} from '@material-ui/core';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const styles = {
  header: {},
  grid: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
  card: { padding: 40 },
  textField: { width: 300 },
  gridItem: { paddingTop: 12, paddingBottom: 12 },
  button: { width: 300 },
};
const WelcomeScreen = () => {
  const [email, setEmail] = useState<string>('');
  const [room, setRoom] = useState<string>();
  const navigate = useNavigate();
  const login = () => {
    if (email !== '' && room !== '') {
      navigate('/chat', { state: { room, email } });
    }
  };

  return (
    <>
      <AppBar style={styles.header} elevation={10}>
        <Toolbar>
          <Typography variant="h6">
            Chat App with Twilio Programmable Chat and React
          </Typography>
        </Toolbar>
      </AppBar>
      <Grid
        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
        container
        direction="column"
        justify="center"
        alignItems="center">
        <Card style={styles.card} elevation={10}>
          <Grid item style={styles.gridItem}>
            <TextField
              name="email"
              required
              style={styles.textField}
              label="Email address"
              placeholder="Enter email address"
              variant="outlined"
              type="email"
              value={email}
              onChange={(e: any): void => setEmail(e.target.value)}
            />
          </Grid>
          <Grid item style={styles.gridItem}>
            <TextField
              name="room"
              required
              style={styles.textField}
              label="Room"
              placeholder="Enter room name"
              variant="outlined"
              value={room}
              onChange={(e: any) => setRoom(e.target.value)}
            />
          </Grid>
          <Grid item style={styles.gridItem}>
            <Button
              color="primary"
              variant="contained"
              style={styles.button}
              onClick={() => login()}>
              Login
            </Button>
          </Grid>
        </Card>
      </Grid>
    </>
  );
};

export default WelcomeScreen;
