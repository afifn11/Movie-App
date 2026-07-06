import * as Sentry from '@sentry/react';

export function initSentry({ useEffect, useLocation, useNavigationType, createRoutesFromChildren, matchRoutes }) {

  if (!import.meta.env.PROD) return;

  const dsn = import.meta.env.VITE_SENTRY_DSN;
  if (!dsn) {
    console.warn('[Sentry] VITE_SENTRY_DSN tidak diset — error tracking dinonaktifkan.');
    return;
  }

  Sentry.init({
    dsn,
    environment: import.meta.env.MODE,
    integrations: [
      Sentry.reactRouterV6BrowserTracingIntegration({
        useEffect,
        useLocation,
        useNavigationType,
        createRoutesFromChildren,
        matchRoutes,
      }),
      Sentry.replayIntegration(),
    ],
    tracesSampleRate: 0.2,
    replaysSessionSampleRate: 0.0,
    replaysOnErrorSampleRate: 1.0,
  });
}

export { Sentry };