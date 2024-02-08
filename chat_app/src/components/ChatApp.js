import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import queryString from 'query-string';

const ENDPOINT = 'http://localhost:3001';
let socket;

function ChatApp({ location }) {
  const [username, setUsername] = useState('');
  const [room, setRoom] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const { username, room } = queryString.parse(location.search);
    socket = io(ENDPOINT);

    setUsername(username);
    setRoom(room);

    socket.emit('join', { username, room }, (error) => {
      if (error) {
        alert(error);
      }
    });

    return () => {
      socket.emit('disconnect');
      socket.off();
    };
  }, [ENDPOINT, location.search]);

  useEffect(() => {
    socket.on('message', (message) => {
      setMessages((messages) => [...messages, message]);
    });

    return () => {
      socket.off('message');
    };
  }, []);

  const sendMessage = (event) => {
    event.preventDefault();
    if (message) {
      socket.emit('sendMessage', message, () => setMessage(''));
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h2>Chat Room: {room}</h2>
      </div>
      <div className="messages">
        {messages.map((message, i) => (
          <div key={i}>
            <p>{message.user}: {message.text}</p>
          </div>
        ))}
      </div>
      <div className="message-input">
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter') sendMessage(e);
          }}
          placeholder="Type your message here..."
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}

export default ChatApp;