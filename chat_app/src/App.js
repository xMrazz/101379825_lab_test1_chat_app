import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Signup from './components/Signup';
import Login from './components/Login';
import ChatApp from './components/ChatApp';

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/login" element={<Login/>} />
        <Route path="/signup" element={<Signup/>} />
        <Route path="/chat" element={<ChatApp/>} />
      </Switch>
    </Router>
  );
}

export default App;