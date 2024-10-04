// src/components/Footer.js
import React from 'react';
import { Box, Typography } from '@mui/material';
import './Footer.css'; // Import the CSS file

const Footer = () => {
  return (
    <Box component="footer" className="footer">
      <Typography variant="body2">© 2024 Deepfake Detection Platform. All rights reserved.</Typography>
    </Box>
  );
};

export default Footer;
