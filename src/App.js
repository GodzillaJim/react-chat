import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import ChatScreen from './screens/ChatScreen';
import WelcomeScreen from './screens/WelcomeScreen';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="chat" element={<ChatScreen />} />
        <Route path="/" element={<WelcomeScreen />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
