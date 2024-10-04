// src/components/VideoUpload.js
import React, { useState } from 'react';
import { Box, Button, Typography, List, ListItem, ListItemText } from '@mui/material';

const VideoUpload = () => {
  const [uploadedVideos, setUploadedVideos] = useState([]);
  const [analysisResults, setAnalysisResults] = useState([]);

  const handleUpload = (e) => {
    const files = Array.from(e.target.files);
    const newVideos = files.map((file) => ({
      name: file.name,
      result: 'Pending analysis...',
    }));

    setUploadedVideos((prev) => [...prev, ...newVideos]);

    // Mock analysis
    setTimeout(() => {
      setAnalysisResults((prev) => [
        ...prev,
        ...newVideos.map((video) => ({
          name: video.name,
          result: Math.random() > 0.5 ? 'Deepfake Detected' : 'Authentic Video',
        })),
      ]);
    }, 2000); // Mocking analysis time
  };

  return (
    <Box mt={2}>
      <Typography variant="h5">Upload Videos for Analysis</Typography>
      <input
        accept="video/*"
        type="file"
        multiple
        onChange={handleUpload}
        style={{ display: 'none' }}
        id="upload-button"
      />
      <label htmlFor="upload-button">
        <Button variant="contained" color="primary" component="span" sx={{ mt: 2 }}>
          Upload Videos
        </Button>
      </label>

      {analysisResults.length > 0 && (
        <List sx={{ mt: 2 }}>
          {analysisResults.map((video, index) => (
            <ListItem key={index}>
              <ListItemText primary={video.name} secondary={video.result} />
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  );
};

export default VideoUpload;
