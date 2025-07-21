import React from 'react';
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Drawer,
  ListItemText,
  ListItem,
  List,
  Divider,
  IconButton,
  Tooltip,
  useTheme,
  styled
} from '@mui/material';
import { ThemeToggle } from '../utils/ThemeToggle';
import CloseIcon from '@mui/icons-material/Close';
import ChatIcon from '@mui/icons-material/Chat';
import SettingsIcon from '@mui/icons-material/Settings';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import TuneIcon from '@mui/icons-material/Tune';

const StyledDrawer = styled(Drawer)(({ theme }) => ({
  '& .MuiDrawer-paper': {
    width: 280,
    background: theme.palette.background.paper,
    borderRight: theme.palette.mode === 'light' ? '1px solid rgba(0, 0, 0, 0.12)' : '1px solid rgba(255, 255, 255, 0.12)',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
}));

const StyledListItem = styled(ListItem)(({ theme, selected }) => ({
  borderRadius: theme.shape.borderRadius,
  margin: theme.spacing(0.5, 1),
  padding: theme.spacing(1, 2),
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
  ...(selected && {
    backgroundColor: theme.palette.action.selected,
    '& .MuiListItemText-primary': {
      fontWeight: 600,
    },
  }),
}));

const SidebarDrawer = ({
  isMobile,
  DrawerOpen,
  onClose,
  status,
  handleEvolve,
  handleFineTune,
  loading,
  selectedChat,
  setSelectedChat,
  history,
  chatList
}) => {
  const theme = useTheme();

  const handleChatSelect = (chatID) => {
    setSelectedChat(chatID);
    history(`/chat/${chatID}`);
    if (isMobile) onClose();
  };

  const drawerContent = (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', p: 2 }}>
      {/* Header */}
      <Box sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        mb: 2
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <ChatIcon color="primary" sx={{ mr: 1 }} />
          <Typography variant="h6" component="h2" color="text.primary">
            Chat History
          </Typography>
        </Box>
        {isMobile && (
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        )}
      </Box>

      {/* Chat List */}
      <Box sx={{ flexGrow: 1, overflowY: 'auto', overflowX: 'clip', mb: 2 }}>
        <List >
          {chatList.map((chatID) => (
            <StyledListItem
              key={chatID}
              onClick={() => handleChatSelect(chatID)}
              selected={chatID === selectedChat}
            >
              <ListItemText
                primary={`Chat ${chatID}`}
                primaryTypographyProps={{
                  variant: 'body1',
                  color: chatID === selectedChat ? 'primary' : 'text.primary'
                }}
              />
            </StyledListItem>
          ))}
        </List>
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* Settings Section */}
      <Box>
        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          mb: 2,
          p: 1,
          borderRadius: 1,
          bgcolor: theme.palette.background.default
        }}>
          <SettingsIcon color="action" sx={{ mr: 1 }} />
          <Typography variant="subtitle1" color="text.secondary">
            Settings
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ ml: 'auto' }}>
            {status}
          </Typography>
        </Box>

        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          mb: 3,
          p: 1
        }}>
          <Typography variant="body1">Dark Mode</Typography>
          <ThemeToggle />
        </Box>

        <Tooltip title="Enhance your chat experience">
          <Button
            fullWidth
            variant="contained"
            onClick={handleEvolve}
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : <AutoAwesomeIcon />}
            sx={{ mb: 2 }}
          >
            Evolve Chat
          </Button>
        </Tooltip>

        <Tooltip title="Customize your chat model">
          <Button
            fullWidth
            variant="outlined"
            onClick={handleFineTune}
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : <TuneIcon />}
          >
            Fine Tune
          </Button>
        </Tooltip>
      </Box>
    </Box>
  );

  return (
    <StyledDrawer
     variant={isMobile ? 'temporary' : 'persistent'}
      open={isMobile ? DrawerOpen : true}
      onClose={onClose}
      sx={{
        width: 250,
        flexShrink: 0,
        '& .MuiDrawer-paper': { width: 250, boxSizing: 'border-box' },
      }}
    >
      {drawerContent}
    </StyledDrawer>
  );
};

export default SidebarDrawer;