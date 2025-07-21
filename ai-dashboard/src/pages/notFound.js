import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Button, Container, useTheme } from '@mui/material';
import { motion } from 'framer-motion';
import BrokenImageIcon from '@mui/icons-material/BrokenImage';
import HomeIcon from '@mui/icons-material/Home';

const NotFound = () => {
  const navigate = useNavigate();
  const theme = useTheme();

  return (
    <Container maxWidth="lg" sx={{ height: '100vh', display: 'flex', alignItems: 'center' }}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: 'center',
          justifyContent: 'center',
          gap: 6,
          width: '100%',
        }}
      >
        {/* Animated Illustration Section */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          style={{ position: 'relative' }}
        >
          <Box
            sx={{
              width: { xs: 200, sm: 300 },
              height: { xs: 200, sm: 300 },
              borderRadius: '50%',
              bgcolor: theme.palette.mode === 'dark' ? theme.palette.grey[800] : theme.palette.grey[100],
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              boxShadow: theme.shadows[10],
            }}
          >
            <BrokenImageIcon
              sx={{
                fontSize: 100,
                color: theme.palette.error.main,
              }}
            />
            <Box
              sx={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                borderRadius: '50%',
                border: `4px dashed ${theme.palette.error.light}`,
                animation: 'spin 20s linear infinite',
                '@keyframes spin': {
                  '0%': { transform: 'rotate(0deg)' },
                  '100%': { transform: 'rotate(360deg)' },
                },
              }}
            />
          </Box>
        </motion.div>

        {/* Content Section */}
        <Box sx={{ maxWidth: 500 }}>
          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: '3rem', sm: '4rem', md: '5rem' },
              fontWeight: 900,
              lineHeight: 1,
              mb: 2,
              background: theme.palette.mode === 'dark'
                ? 'linear-gradient(45deg, #ff5252, #ff4081)'
                : 'linear-gradient(45deg, #ff1744, #f50057)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            404
          </Typography>

          <Typography
            variant="h4"
            component="h2"
            sx={{
              fontWeight: 700,
              mb: 2,
              color: theme.palette.mode === 'dark' ? '#fff' : theme.palette.grey[800],
            }}
          >
            Lost in the Digital Void
          </Typography>

          <Typography
            variant="body1"
            sx={{
              fontSize: '1.1rem',
              mb: 4,
              color: theme.palette.mode === 'dark' ? theme.palette.grey[300] : theme.palette.grey[600],
            }}
          >
            The page you're seeking has either vanished into the digital abyss or never existed. 
            Don't worry though - our cosmic navigation system can beam you back to safety.
          </Typography>

          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/')}
              startIcon={<HomeIcon />}
              sx={{
                px: 4,
                borderRadius: '50px',
                fontWeight: 600,
                textTransform: 'none',
                boxShadow: theme.shadows[4],
                '&:hover': {
                  boxShadow: theme.shadows[8],
                },
              }}
            >
              Back to Home
            </Button>

            <Button
              variant="outlined"
              size="large"
              onClick={() => window.history.back()}
              sx={{
                px: 4,
                borderRadius: '50px',
                fontWeight: 600,
                textTransform: 'none',
              }}
            >
              Go Back
            </Button>
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default NotFound;