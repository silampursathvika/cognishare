import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import "./Chat.css";

const Chat = ({ roomId }) => {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const socketInstance = io("http://localhost:3001");
    setSocket(socketInstance);

    // Join the room
    socketInstance.emit("join-room", roomId);

    // Listen for incoming messages
    socketInstance.on("chat-message", (msg) => {
        console.log("Message received:", msg); // Debugging
        setMessages((prevMessages) => [...prevMessages, msg]);
      });
      

    return () => {
      socketInstance.disconnect();
    };
  }, [roomId]);

  const sendMessage = () => {
    if (message.trim() && socket) {
      const chatMessage = { roomId, message, sender: "You" }; // Include sender
      socket.emit("chat-message", chatMessage); // Send to server
      setMessage(""); // Clear the input field
    }
  };
  

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  return (
    <div className="chat-container">
      <h3 className="chat-header">Room Chat</h3>
      <div className="chat-box">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`chat-message ${
              msg.sender === "You" ? "chat-message-self" : "chat-message-other"
            }`}
          >
            <strong>{msg.sender}: </strong>
            {msg.message}
          </div>
        ))}
      </div>
      <div className="chat-input-container">
        <input
          type="text"
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          className="chat-input"
        />
        <button onClick={sendMessage} className="chat-send-button">
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
