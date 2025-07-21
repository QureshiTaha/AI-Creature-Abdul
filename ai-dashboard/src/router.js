import { ThemeProvider as MuiThemeProvider } from '@emotion/react';
import App from './App';
import NotFoundPage from './pages/notFound';
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import { CssBaseline, createTheme } from '@mui/material';
import { ThemeProvider, useThemeContext } from './utils/ThemeContext';
import { useMemo } from 'react';

function AppThemeWrapper() {
  const { isDark } = useThemeContext();
  
  const theme = useMemo(() => createTheme({
  palette: {
    mode: isDark ? 'dark' : 'light',
    primary: {
      main: isDark ? '#90caf9' : '#1976d2',
    },
    secondary: {
      main: isDark ? '#f48fb1' : '#d81b60',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
        },
      },
    },
  },
}), [isDark]);

  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          <Route exact path="/" element={<App />} />
          <Route exact path="/chat/:id" element={<App />} />
          <Route exact path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </MuiThemeProvider>
  );
}

function Router() {
  return (
    <div className="App">
      <ThemeProvider>
        <AppThemeWrapper />
      </ThemeProvider>
    </div>
  );
}

export default Router;