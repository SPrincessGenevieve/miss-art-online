// File: components/Chatbox.js

'use client'; // Needed in Next.js to indicate this is a client-side component

import { useEffect, useState } from 'react';
import io from 'socket.io-client';
import './chatbox.css'

let socket;

const Chatbox = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [socketId, setSocketId] = useState(null);

  useEffect(() => {
    socket = io(); // Automatically connects to the Socket.IO server

    // Store socket ID when connected
    socket.on('connect', () => {
      setSocketId(socket.id);
    });

    // Listen for incoming messages
    socket.on('receive-message', (messageData) => {
      setMessages((prevMessages) => [...prevMessages, messageData]);
    });

    return () => {
      socket.off('connect');
      socket.off('receive-message');
    };
  }, []);

  const sendMessage = () => {
    if (newMessage.trim()) {
      // Emit the new message to the server
      socket.emit('new-message', newMessage);
      setNewMessage(''); // Clear input after sending
    }
  };

  // Notification handling when receiving new messages
  useEffect(() => {
    if (Notification.permission === 'granted') {
      socket.on('receive-message', (messageData) => {
        if (messageData.id !== socketId) {
          new Notification('New message', { body: messageData.message });
        }
      });
    } else if (Notification.permission !== 'denied') {
      Notification.requestPermission().then((permission) => {
        if (permission === 'granted') {
          new Notification('New message');
        }
      });
    }
  }, [socketId]);

  return (
    <div className="chatbox">
      <div className="messages">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`message ${msg.id === socketId ? 'my-message' : 'other-message'}`}
          >
            <strong>{msg.id === socketId ? 'You' : 'User ' + msg.id}:</strong> {msg.message}
          </div>
        ))}
      </div>
      <input
        type="text"
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        placeholder="Type a message..."
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
};

export default Chatbox;
