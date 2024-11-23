import React from 'react';
import { BrowserRouter as Router,Routes,Route } from 'react-router-dom';
import HomePage from './components/homepage/HomePage';
import Editor from './components/editor/Editor';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/editor/:roomId" element={<Editor />} />
      </Routes>
    </Router>
  );
}

export default App;
