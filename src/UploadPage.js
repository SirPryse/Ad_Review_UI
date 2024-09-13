import React, { useState } from 'react';
import { Button, Box, Typography, Input, Dialog, DialogTitle, DialogContent, DialogActions  } from '@mui/material';
import { Snackbar, Alert } from '@mui/material';
import { styled } from '@mui/material/styles';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import axios from 'axios';


const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

function UploadPage() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileError, setFileError] = useState('');
  const [isUploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const AWS_URL = process.env.REACT_APP_AWS_BASE_URL;

  
  const allowedImageTypes = [
    'image/png',
    'image/jpeg',
    'image/webp',
    'image/heic',
    'image/heif',
  ];

  const allowedVideoTypes = [
    'video/mp4',
    'video/mpeg',
    'video/mov',
    'video/avi',
    'video/x-flv',
    'video/mpg',
    'video/webm',
    'video/wmv',
    'video/3gpp',
  ];

  // Handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFileError(''); // Reset previous error
    if (file) {
      const fileType = file.type;

      // Check if file is an image or video and if it is valid
      if (allowedImageTypes.includes(fileType) || allowedVideoTypes.includes(fileType)) {
        setSelectedFile(file);
      } else {
        setFileError('Invalid file type. Please upload a valid image or video.');
        setSelectedFile(null);
      }
    }
  };

  const fetchPresignedURL = async () => {
    try {
      const response = await axios.post(`${AWS_URL}/presigned-url`, {
        fileName: selectedFile.name,
        fileType: selectedFile.type,
      });
      return response.data.url;
    } catch (error) {
      console.error('Error fetching pre-signed URL:', error);
    }
  };

  const handleFileUpload = async () => {
    if (!selectedFile) {
      setFileError('No file selected.');
      return;
    }

      const uploadURL = await fetchPresignedURL();

      try {
        await axios.put(uploadURL, selectedFile, {
          headers: {
            'Content-Type': selectedFile.type,
          },
        });

      // Success
      setSelectedFile(null); // Reset file selection after upload
      setUploadDialogOpen(false); // Close the dialog
      setSnackbarMessage('File uploaded successfully!');
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Error uploading file:', error);
      setFileError('Failed to upload file.');
      setUploadDialogOpen(false);
    }
  };

  const handleOpenDialog = () => {
    setUploadDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setUploadDialogOpen(false);
    setFileError(null);
    setSelectedFile(null);
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    <Box sx={{ height: '50vh', display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center' }}>
    <Typography variant="h4" gutterBottom>
      Upload your Advertisement to be Reviewed
    </Typography>

    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', maxWidth: 300 }}>
      <Button
        component="label"
        variant="contained"
        startIcon={<CloudUploadIcon />}
        sx={{ mb: 2, width: '100%' }}
      >
        Select File
        <VisuallyHiddenInput
          type="file"
          onChange={handleFileChange}
        />
      </Button>

      {fileError && (
        <Typography color="error" sx={{ mb: 2, textAlign: 'center' }}>
          {fileError}
        </Typography>
      )}

      {selectedFile && (
        <Typography variant="body1" sx={{ mb: 2, textAlign: 'center' }}>
          Selected file: {selectedFile.name}
        </Typography>
      )}

      <Button 
        variant="contained" 
        color="primary" 
        onClick={handleOpenDialog} 
        disabled={!selectedFile}
        sx={{ width: '100%' }}
      >
        Upload File
      </Button>
    </Box>

      <Dialog open={isUploadDialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>Upload File</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to upload "{selectedFile?.name}"?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleFileUpload} color="primary" variant="contained">
            Confirm Upload
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={5}
        onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity="success">
          {snackbarMessage}
        </Alert>
      </Snackbar>

    </Box>
  );
}

export default UploadPage;
