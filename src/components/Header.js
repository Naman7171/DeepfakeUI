// src/components/Header.js
import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, IconButton, Menu, MenuItem, Avatar, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import './Header.css'; // Import the CSS file

const Header = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleMenuClose();
    navigate('/login');
  };

  return (
    <AppBar position="fixed" className="header" sx={{ bgcolor: "purple" }}>
      <Toolbar className="toolbar">
        {/* Logo Section */}
        <Box className="logo-section">
          <img
            src="../static/deepfake_logo.png" // Update this path to your actual logo
            alt="Logo"
            className="logo"
          />
          <Typography className="header-title" variant="h6" noWrap component="div">
            Deepfake Detection Platform
          </Typography>
        </Box>

        {/* Profile Icon */}
        <IconButton onClick={handleMenuOpen} color="inherit">
          <Avatar alt="User Profile" />
        </IconButton>
        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
          <MenuItem onClick={handleMenuClose}>User Preferences</MenuItem>
          <MenuItem onClick={handleLogout}>Logout</MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
