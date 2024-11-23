import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const [name, setName] = useState('');
  const [roomId, setRoomId] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name && roomId) {
      // Redirect to editor page with roomId and name as parameters
      navigate(`/editor/${roomId}/${name}`);
    } else {
      alert("Please enter both room ID and name!");
    }
  };

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', padding: '20px' }}>
      <h2>Join or Create a Collaborative Room</h2>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '10px' }}>
          <label htmlFor="name">Your Name: </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="Enter your name"
          />
        </div>

        <div style={{ marginBottom: '10px' }}>
          <label htmlFor="roomId">Room ID: </label>
          <input
            type="text"
            id="roomId"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            required
            placeholder="Enter Room ID"
          />
        </div>

        <button type="submit" style={{ padding: '10px 20px' }}>Join or Create Room</button>
      </form>
    </div>
  );
};

export default HomePage;
