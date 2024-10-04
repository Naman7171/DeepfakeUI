import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Grid,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import './Profile.css';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  fontWeight: 'bold',
  backgroundColor: theme.palette.grey[200],
}));

const StyledTableRow = styled(TableRow)(({ theme, index }) => ({
  backgroundColor: index % 2 === 0 ? theme.palette.action.hover : 'inherit',
}));

const Profile = () => {
  const [videos, setVideos] = useState([]);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [analysisResult, setAnalysisResult] = useState('');
  const [fileType, setFileType] = useState('');
  const [isFileUploaded, setIsFileUploaded] = useState(false); // State to track if the file is uploaded
  const navigate = useNavigate();

  const handleUpload = () => {
    if (uploadedFile) {
      const newVideo = {
        name: uploadedFile.name,
        uploadDate: new Date().toISOString().split('T')[0],
        status: 'Processed',
        result: analysisResult || 'Analysis in progress...',
      };
      setVideos([...videos, newVideo]);

      // Display the uploaded file and analysis result
      setIsFileUploaded(true);

      // Reset the uploaded file and analysis result after upload
      setUploadedFile(null);
      setAnalysisResult('');
      setFileType('');
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setUploadedFile(file);
      const type = file.type.split('/')[0]; // Get the file type (video/image)
      setFileType(type);
      
      // Simulate analysis result; replace this with your actual logic
      setAnalysisResult('DeepFake detected!'); 

      // Reset upload display state for the new file
      setIsFileUploaded(false);
    }
  };

  const handleDetails = (index) => {
    navigate(`/details/${index}`);
  };

  return (
    <>
      <Header />
      <Box className="profile-container">
        {/* Three sections for deepfake analysis */}
        <Box className="deepfake-options">
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <Box className="deepfake-option" textAlign="center">
                <Typography variant="h6">Analyze Video</Typography>
                <TextField
                  className="upload-input"
                  type="file"
                  inputProps={{ accept: 'video/*' }}
                  onChange={handleFileChange}
                  fullWidth
                />
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={handleUpload}
                  style={{ marginTop: '10px' }}
                >
                  Upload Video
                </Button>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box className="deepfake-option" textAlign="center">
                <Typography variant="h6">Analyze Image</Typography>
                <TextField
                  className="upload-input"
                  type="file"
                  inputProps={{ accept: 'image/*' }}
                  onChange={handleFileChange}
                  fullWidth
                />
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={handleUpload}
                  style={{ marginTop: '10px' }}
                >
                  Upload Image
                </Button>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box className="deepfake-option" textAlign="center">
                <Typography variant="h6">Analyze Video with Audio</Typography>
                <TextField
                  className="upload-input"
                  type="file"
                  inputProps={{ accept: 'video/*' }}
                  onChange={handleFileChange}
                  fullWidth
                />
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={handleUpload}
                  style={{ marginTop: '10px' }}
                >
                  Upload Video with Audio
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Box>

        {/* Display the uploaded file and analysis result */}
        {isFileUploaded && uploadedFile && (
          <Box className="file-player" mt={4} textAlign="center">
            <Typography variant="h6">
              {fileType === 'video' ? 'Playing Uploaded Video:' : 'Displaying Uploaded Image:'}
            </Typography>
            {fileType === 'video' ? (
              <video
                controls
                style={{ width: '100%', maxWidth: '600px', margin: '20px auto' }}
                src={URL.createObjectURL(uploadedFile)}
              />
            ) : (
              <img
                src={URL.createObjectURL(uploadedFile)}
                alt="Uploaded"
                style={{ width: '100%', maxWidth: '600px', margin: '20px auto' }}
              />
            )}
            <Typography variant="body1" mt={2}>
              Analysis Result: {analysisResult || 'Processing...'}
            </Typography>
          </Box>
        )}

        {/* Table for uploaded videos */}
        <Box className="profile-content" mt={4}>
          <TableContainer component={Paper} className="table-container">
            <Table>
              <TableHead>
                <TableRow>
                  <StyledTableCell>File Name</StyledTableCell>
                  <StyledTableCell>Upload Date</StyledTableCell>
                  <StyledTableCell>Status</StyledTableCell>
                  <StyledTableCell>Result</StyledTableCell>
                  <StyledTableCell>Action</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {videos.map((video, index) => (
                  <StyledTableRow key={index} index={index}>
                    <TableCell>{video.name}</TableCell>
                    <TableCell>{video.uploadDate}</TableCell>
                    <TableCell>{video.status}</TableCell>
                    <TableCell>{video.result}</TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        color="secondary"
                        onClick={() => handleDetails(index)}
                      >
                        Details
                      </Button>
                    </TableCell>
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Box>
      <Footer />
    </>
  );
};

export default Profile;
