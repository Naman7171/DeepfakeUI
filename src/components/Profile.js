import React, { useState } from "react";
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
  Alert,
  Snackbar,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import AWS from "aws-sdk";
import FullPageLoader from "./FullPageLoader";
import "./Profile.css";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  fontWeight: "bold",
  backgroundColor: theme.palette.grey[200],
}));

const StyledTableRow = styled(TableRow)(({ theme, index }) => ({
  backgroundColor: index % 2 === 0 ? theme.palette.action.hover : "inherit",
}));

// Configure AWS SDK
AWS.config.update({
  accessKeyId: "",
  secretAccessKey: "",
  region: "us-east-1",
});

const s3 = new AWS.S3();

const Profile = () => {
  const [files, setFiles] = useState([
    {
      name: "video1.mp4",
      uploadDate: "2024-10-03",
      status: "Processed",
      result: "DeepFake",
      category: "Video",
    },
    {
      name: "image1.jpg",
      uploadDate: "2024-10-03",
      status: "Processed",
      result: "Original",
      category: "Image",
    },
    {
      name: "audio_video1.mp4",
      uploadDate: "2024-10-03",
      status: "Processed",
      result: "Original",
      category: "Audio with Video",
    },
  ]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleClose = () => {
    setOpen(false);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
  };

  const handleUpload = (file, category) => {
    setIsLoading(true);
    const createMultipartParams = {
      Bucket: "naman-deepfake-weights",
      Key: `${file.name}`,
      ContentType: file.type,
    };

    s3.createMultipartUpload(createMultipartParams, (err, multipart) => {
      if (err) {
        setIsLoading(false);
        console.error("Error creating multipart upload:", err);
        return;
      }

      console.log("Created multipart upload:", multipart);
      const partSize = 1024 * 1024 * 5; // 5MB chunks
      const numParts = Math.ceil(file.size / partSize);
      const uploadPromises = [];

      for (let part = 0; part < numParts; part++) {
        const start = part * partSize;
        const end = Math.min(start + partSize, file.size);
        const partParams = {
          Body: file.slice(start, end),
          Bucket: createMultipartParams.Bucket,
          Key: createMultipartParams.Key,
          PartNumber: part + 1,
          UploadId: multipart.UploadId,
        };

        uploadPromises.push(s3.uploadPart(partParams).promise());
      }

      Promise.all(uploadPromises)
        .then((parts) => {
          const completeParams = {
            Bucket: createMultipartParams.Bucket,
            Key: createMultipartParams.Key,
            MultipartUpload: {
              Parts: parts.map((part, index) => ({
                ETag: part.ETag,
                PartNumber: index + 1,
              })),
            },
            UploadId: multipart.UploadId,
          };

          s3.completeMultipartUpload(completeParams, (err, data) => {
            setIsLoading(false);
            if (err) {
              console.error("Error completing multipart upload:", err);
              return;
            }

            console.log("Multipart upload completed successfully:", data);

            // Retry mechanism for checking output.txt
            const checkOutputFile = (attempts) => {
              const outputParams = {
                Bucket: "naman-deepfake-weights",
                Key: file.name.replace(/\.[^/.]+$/, "") + "_output.txt",
              };

              s3.getObject(outputParams, (err, outputData) => {
                if (err) {
                  if (attempts > 0) {
                    console.log(
                      `Output file not found, retrying... (${3 - attempts + 1})`
                    );
                    setTimeout(() => checkOutputFile(attempts - 1), 2000); // Retry after 2 seconds
                  } else {
                    console.error("Error retrieving output.txt:", err);
                  }
                  return;
                }

                const outputContent = outputData.Body.toString("utf-8").trim();
                if (outputContent === "Deepfake") {
                  setError("Uploaded file is a Deepfake");
                  setOpen(true);
                } else {
                  setSuccess("Uploaded file looks Original");
                  setOpen(true);
                }
                const newFile = {
                  name: file.name,
                  uploadDate: new Date().toISOString().split("T")[0],
                  status: "Processing",
                  result: outputContent,
                  category: category,
                };

                setFiles([...files, newFile]);
              });
            };

            checkOutputFile(3); // Retry 3 times
          });
        })
        .catch((err) => {
          console.error("Error uploading parts:", err);
          const abortParams = {
            Bucket: createMultipartParams.Bucket,
            Key: createMultipartParams.Key,
            UploadId: multipart.UploadId,
          };
          s3.abortMultipartUpload(abortParams, (abortErr) => {
            if (abortErr) {
              console.error("Error aborting multipart upload:", abortErr);
            } else {
              console.log("Multipart upload aborted successfully");
            }
          });
        });
    });
  };

  const handleDetails = (index) => {
    navigate(`/details/${index}`);
  };

  return (
    <>
      <Header />
      <Box
        style={{
          display: "flex",
          height: "100vh", // Full screen height
        }}
      >
        {/* Left Section for Static Image */}
        <Box
          style={{
            flex: "0 0 20%", // 20% width
            backgroundImage: `url('/static/deepfake_background.png')`, // Use the correct path for your static image
            backgroundSize: "cover",
            backgroundPosition: "center",
            marginTop: "5%", // Space from the header
            marginBottom: "5%", // Space from the footer,
            borderRadius: "10px", // Adjust the value for more or less rounding
            overflow: "hidden", // Ensure the corners are rounded by clipping the background
          }}
        />

        {/* Right Section for Upload and Table */}
        <Box
          style={{
            flex: "1", // 80% width
            display: "flex",
            flexDirection: "column",
            padding: "20px",
            overflowY: "auto", // Allows scrolling if content overflows
          }}
        >
          <Box className="profile-content" mt={4}>
            <Box className="upload-section" mt={4} mb={4}>
              {error && (
                <Snackbar
                  open={open}
                  autoHideDuration={3000}
                  onClose={handleClose}
                  anchorOrigin={{ vertical: "top", horizontal: "center" }} // Positioning here
                >
                  <Alert onClose={handleClose} severity="error">
                    {error}
                  </Alert>
                </Snackbar>
              )}
              {success && (
                <Snackbar
                  open={open}
                  autoHideDuration={3000}
                  onClose={handleClose}
                  anchorOrigin={{ vertical: "top", horizontal: "center" }} // Positioning here
                >
                  <Alert onClose={handleClose} severity="success">
                    {success}
                  </Alert>
                </Snackbar>
              )}
              <Typography variant="h6">
                Upload a file for deepfake analysis
              </Typography>
              <Typography variant="subtitle1" color="textSecondary">
                "Discover the truth behind your media with our advanced deepfake
                detection!"
              </Typography>
              <TextField
                className="upload-input"
                type="file"
                inputProps={{ accept: "video/*,image/*,audio/*" }}
                onChange={handleFileChange}
                style={{ marginBottom: "16px" }} // Adjust the value for more or less spacing
              />
              <Box display="flex" justifyContent="space-between">
                {!isLoading && (
                  <Button
                    variant="contained"
                    color="secondary"
                    size="large"
                    onClick={() => {
                      setSelectedCategory("Video");
                      selectedFile && handleUpload(selectedFile, "Video");
                    }}
                    style={{ marginRight: "8px" }}
                  >
                    Upload Video
                  </Button>
                )}
                {!isLoading && (
                  <Button
                    variant="contained"
                    color="secondary"
                    size="large"
                    onClick={() => {
                      setSelectedCategory("Image");
                      selectedFile && handleUpload(selectedFile, "Image");
                    }}
                    style={{ marginRight: "8px" }}
                  >
                    Upload Image
                  </Button>
                )}
                {!isLoading && (
                  <Button
                    variant="contained"
                    color="secondary"
                    size="large"
                    onClick={() => {
                      setSelectedCategory("Audio with Video");
                      selectedFile && handleUpload(selectedFile, "Audio with Video");
                    }}
                  >
                    Upload Audio with Video
                  </Button>
                )}
                {isLoading && <FullPageLoader />}
              </Box>
            </Box>

            <TableContainer component={Paper} className="table-container">
              <Table>
                <TableHead>
                  <TableRow>
                    <StyledTableCell>File Name</StyledTableCell>
                    <StyledTableCell>Upload Date</StyledTableCell>
                    <StyledTableCell>Status</StyledTableCell>
                    <StyledTableCell>Result</StyledTableCell>
                    <StyledTableCell>Category</StyledTableCell>
                    <StyledTableCell>Details</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {files.map((file, index) => (
                    <StyledTableRow key={index} index={index}>
                      <TableCell>{file.name}</TableCell>
                      <TableCell>{file.uploadDate}</TableCell>
                      <TableCell>{file.status}</TableCell>
                      <TableCell>{file.result}</TableCell>
                      <TableCell>{file.category}</TableCell>
                      <TableCell>
                        <Button
                          variant="contained"
                          color="secondary"
                          onClick={() => handleDetails(index)}
                        >
                          View Details
                        </Button>
                      </TableCell>
                    </StyledTableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Box>
      </Box>
      <Footer />
    </>
  );
};

export default Profile;
