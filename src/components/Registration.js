import React, { useState } from 'react';
import { Button, TextField, Box, Typography, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook
import { register } from '../services/mockAuthService';

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate(); // Initialize useNavigate

  const handleRegister = (e) => {
    e.preventDefault();
    const response = register({ username, password });
    if (response.success) {
      setSuccess(response.message);
      setError('');
      setTimeout(() => {
        navigate('/login'); // Redirect to the login page after successful registration
      }, 1500); // Optional delay to show the success message
    } else {
      setError(response.message);
      setSuccess('');
    }
  };

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      mt={4}
      sx={{ minHeight: '100vh' }} // Ensure it takes full height
    >
      {/* Logo Section */}
      <Box
        component="img"
        src="static/deepfake_bg.png"
        alt="App Logo"
        sx={{
          marginRight: '50px', // Space between logo and form
        }}
      />
      
      {/* Register Form Section */}
      <Box display="flex" flexDirection="column" alignItems="center">
        <Typography variant="h4">Register</Typography>
        {error && <Alert severity="error">{error}</Alert>}
        {success && <Alert severity="success">{success}</Alert>}
        <Box component="form" onSubmit={handleRegister} mt={2}>
          <TextField
            label="Username"
            variant="outlined"
            fullWidth
            margin="normal"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <TextField
            label="Password"
            type="password"
            variant="outlined"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <TextField
            label="Confirm Password"
            type="password"
            variant="outlined"
            fullWidth
            margin="normal"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <Button type="submit" variant="contained" color="secondary" fullWidth>
            Register
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default Register;
