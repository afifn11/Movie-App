import { StrictMode, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import {
  BrowserRouter,
  useLocation,
  useNavigationType,
  createRoutesFromChildren,
  matchRoutes,
} from 'react-router-dom';
import './styles/globals.css';
import App from './App';
import { initSentry } from './lib/sentry';

initSentry({ useEffect, useLocation, useNavigationType, createRoutesFromChildren, matchRoutes });

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);