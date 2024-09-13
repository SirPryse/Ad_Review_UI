import React, { useState } from 'react';
import { Button, Box, Typography, Input, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import axios from 'axios';

function UploadPage() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileError, setFileError] = useState('');
  const [isUploadDialogOpen, setUploadDialogOpen] = useState(false);
  
  // Allowed MIME types for images and videos
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
      const response = await axios.post('https://b8kvafiaxj.execute-api.us-east-1.amazonaws.com/presigned-url', {
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
      alert('File uploaded successfully!');
      setSelectedFile(null); // Reset file selection after upload
      setUploadDialogOpen(false); // Close the dialog
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

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Upload your Advertisement to be Reviewed
      </Typography>

      <Input type="file" onChange={handleFileChange} />
      {fileError && <Typography color="error">{fileError}</Typography>}

      <Button variant="contained" color="primary" onClick={handleOpenDialog} disabled={!selectedFile}>
        Upload File
      </Button>

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
    </Box>
  );
}

export default UploadPage;
