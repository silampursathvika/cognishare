import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './HomePage.css'; // Import the updated CSS file

const HomePage = () => {
  const [name, setName] = useState('');
  const [roomId, setRoomId] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name && roomId) {
      navigate(`/editor/${roomId}`);
    } else {
      alert("Please enter both room ID and name!");
    }
  };

  return (
    <div className="home-page">
      <h2>Collaborative Coding Room</h2>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Your Name</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="Enter your name"
          />
        </div>

        <div className="form-group">
          <label htmlFor="roomId">Room ID</label>
          <input
            type="text"
            id="roomId"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            required
            placeholder="Enter Room ID"
          />
        </div>

        <button type="submit">Join or Create Room</button>
      </form>

      <footer>
        <p>
          Built with 💻 by <a href="#">Innovators</a>
        </p>
      </footer>
    </div>
  );
};

export default HomePage;
