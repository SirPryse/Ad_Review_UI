// src/ViewDataPage.js
import React, { useState, useEffect } from 'react';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';

function ViewDataPage() {
  const [data, setData] = useState([]);
  const [lastEvaluatedKey, setLastEvaluatedKey] = useState(null);
  const [loading, setLoading] = useState(false);
  const [pageSize] = useState(10);  // Set the page size
  const [selectedAd, setSelectedAd] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const AWS_URL = process.env.REACT_APP_AWS_BASE_URL;

  useEffect(() => {
    fetchData();
  }, []);

  // Fetch data from DynamoDB with pagination
  const fetchData = async (lastKey = null) => {
    setLoading(true);
    try {
      const response = await axios.post(`${AWS_URL}/get-ads`, {
        pageSize: pageSize,
        lastEvaluatedKey: lastKey,
      });

      const { items, lastEvaluatedKey: newLastEvaluatedKey } = response.data;

      // Append new items to existing data
      setData(prevData => [...prevData, ...items]);

      // Update the last evaluated key
      setLastEvaluatedKey(newLastEvaluatedKey);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  // Handle dialog opening
  const handleOpenDialog = (ad) => {
    setSelectedAd(ad);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedAd(null);
  };

  // Load more data on clicking "Load More"
  const handleLoadMore = () => {
    fetchData(lastEvaluatedKey);
  };

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        View and Improve your Ads
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Ad Type</TableCell>
              <TableCell>Ad Name</TableCell>
              <TableCell>Upload Date</TableCell>
              <TableCell>Suggestions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((ad) => (
              <TableRow key={ad.ad_id}>
                <TableCell>{ad.ad_type}</TableCell>
                <TableCell>{ad.ad_name}</TableCell>
                <TableCell>{ad.ad_id}</TableCell>
                <TableCell>
                  <Button variant="outlined" color="primary" onClick={() => handleOpenDialog(ad)}>
                    Get Suggestions
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Load More Button */}
      {lastEvaluatedKey && (
        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <Button variant="contained" color="primary" onClick={handleLoadMore} disabled={loading}>
            {loading ? 'Loading...' : 'Load More'}
          </Button>
        </Box>
      )}

      {selectedAd && (
        <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
          <DialogTitle>Suggestions for Ad Improvement</DialogTitle>
          <DialogContent>
            <ReactMarkdown>
              {selectedAd.gen_ai_response} 
            </ReactMarkdown>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog} color="primary">
              Close
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </Box>
  );
}

export default ViewDataPage;
