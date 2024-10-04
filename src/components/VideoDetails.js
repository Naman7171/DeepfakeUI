import React from 'react';
import { Box, Typography, Card, CardContent, CardMedia, Grid } from '@mui/material';
import Header from './Header';
import Footer from './Footer';
import { useParams } from 'react-router-dom';
import './VideoDetails.css';

const VideoDetails = () => {
  const { id } = useParams(); // Get video id from the URL parameters

  // Mock data - Replace with actual data fetching
  const analysisData = {
    id,
    name: `video${id}.mp4`,
    uploadDate: '2024-10-03', // Mock upload date
    result: id % 2 === 0 ? 'No Deepfake' : 'Deepfake Detected',
    analysis: 'Detailed analysis of the video goes here...',
    videoUrl: `/static/deepfake_video.mp4`, // Mock video URL, adjust according to your structure
    reviewerComments: 'This video shows signs of manipulation, but further analysis is needed.',
    recommendations: 'Consider running additional tests for verification.',
  };

  return (
    <Box
      className="details-container"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginTop: '5%',
        padding: '20px',
        minHeight: '100vh', // Ensure it takes at least full viewport height
        justifyContent: 'space-between', // Space between header and footer
      }}
    >
      <Header />
      <Box
        className="details-content"
        sx={{
          width: '100%',
          maxWidth: '1200px',
          mt: 4,
          mb: 4, // Add margin-bottom to create space above the footer
        }}
      >
        <Grid container spacing={2}>
          {/* Left Side - Video Player */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardMedia
                component="video"
                controls
                src={analysisData.videoUrl}
                sx={{
                  height: 300, // Set height for the video player
                  border: '2px solid', // Add border
                  borderColor: 'primary.black', // Set border color (you can choose another color)
                  borderRadius: '8px', // Add rounded corners
                }}
              />
            </Card>
          </Grid>

          {/* Right Side - Details Section */}
          <Grid item xs={12} md={6} container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Card sx={{ minHeight: '200px' }}>
                <CardContent>
                  <Typography variant="h5" gutterBottom>
                    Video Name
                  </Typography>
                  <Typography variant="body1">{analysisData.name}</Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Card sx={{ minHeight: '200px' }}>
                <CardContent>
                  <Typography variant="h5" gutterBottom>
                    Upload Date
                  </Typography>
                  <Typography variant="body1">{analysisData.uploadDate}</Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Card sx={{ minHeight: '200px' }}>
                <CardContent>
                  <Typography variant="h5" gutterBottom>
                    Analysis Result
                  </Typography>
                  <Typography variant="body1" color={analysisData.result === 'Deepfake Detected' ? 'error.main' : 'success.main'}>
                    {analysisData.result}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Card sx={{ minHeight: '200px' }}>
                <CardContent>
                  <Typography variant="h5" gutterBottom>
                    Analysis Details
                  </Typography>
                  <Typography variant="body2">{analysisData.analysis}</Typography>
                </CardContent>
              </Card>
            </Grid>

            {/* New Cards for Additional Analysis */}
            <Grid item xs={12} sm={6}>
              <Card sx={{ minHeight: '200px' }}>
                <CardContent>
                  <Typography variant="h5" gutterBottom>
                    Reviewer Comments
                  </Typography>
                  <Typography variant="body2">{analysisData.reviewerComments}</Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Card sx={{ minHeight: '200px' }}>
                <CardContent>
                  <Typography variant="h5" gutterBottom>
                    Recommendations
                  </Typography>
                  <Typography variant="body2">{analysisData.recommendations}</Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>
      </Box>
      <Footer />
    </Box>
  );
};

export default VideoDetails;
