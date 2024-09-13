// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Container, AppBar, Toolbar, Typography, Button } from '@mui/material';
import UploadPage from './UploadPage';
import ViewDataPage from './ViewDataPage';

function App() {
  return (
    <Router>
      <AppBar position="static">
        <Toolbar>
        <Typography 
            variant="h6" 
            component={Link} 
            to="/" 
            sx={{ 
              flexGrow: 1, 
              textDecoration: 'none', 
              color: 'inherit',
              '&:hover': {
                cursor: 'pointer',
              },
            }}
          >
            Suggestify Ads
          </Typography>
          <Button color="inherit" component={Link} to="/">
            Upload Ad
          </Button>
          <Button color="inherit" component={Link} to="/view-data">
            View Ad Suggestions
          </Button>
        </Toolbar>
      </AppBar>
      <Container>
        <Routes>
          <Route path="/" element={<UploadPage />} />
          <Route path="/view-data" element={<ViewDataPage />} />
        </Routes>
      </Container>
    </Router>
  );
}

export default App;