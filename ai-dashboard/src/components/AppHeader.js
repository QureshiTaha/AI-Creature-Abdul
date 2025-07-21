import React from 'react';
import { AppBar, Toolbar, Typography, IconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { ThemeToggle } from '../utils/ThemeToggle';

const AppHeader = ({ isMobile, DrawerOpen, onDrawerToggle }) => {
    return (
        <AppBar position="fixed" sx={{ display: isMobile && !DrawerOpen ? 'flex' : 'none', zIndex: (theme) => theme.zIndex.drawer + 1 }}>
            <Toolbar>
                <IconButton color="inherit" edge="start" onClick={onDrawerToggle} sx={{ mr: 2 }}>
                    <MenuIcon />
                </IconButton>
                <Typography variant="h6" noWrap sx={{ flexGrow: 1 }}>
                    AI Dashboard
                </Typography>
                <ThemeToggle />
            </Toolbar>
        </AppBar>
    );
};

export default AppHeader;
