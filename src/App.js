// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Profile from './components/Profile';
import VideoDetails from './components/VideoDetails';
import Login from './components/Login'; // Include Login if needed
import Registration from './components/Registration'; // Include Registration if needed

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/*" element={<Login />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/details/:id" element={<VideoDetails />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Registration />} />
      </Routes>
    </Router>
  );
}

export default App;
