import React from 'react';
import ReactDOM from 'react-dom/client';
import Home from './index';
import './index.css';
import { ThemeProvider } from './hooks/useTheme';

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
            <Home />
        </ThemeProvider>
    </React.StrictMode>
);
