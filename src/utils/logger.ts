import pino from 'pino';
import * as Sentry from '@sentry/react';

// Initialize Sentry
Sentry.init({
  dsn: "https://9186ef26b30e3dd572dd8c243c000eba@o4511690011639808.ingest.de.sentry.io/4511690020028496",
  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.replayIntegration(),
  ],
  // Performance Monitoring
  tracesSampleRate: 1.0, 
  // Session Replay
  replaysSessionSampleRate: 0.1, 
  replaysOnErrorSampleRate: 1.0, 
});

// Configure Pino with native redaction for its own outputs
const pinoLogger = pino({
  browser: { asObject: true },
  level: import.meta.env.MODE === 'production' ? 'info' : 'debug',
  redact: {
    paths: [
      '*.email', '*.password', '*.token', '*.session', '*.jwt', '*.secret', 
      '*.phone', '*.authorization', '*.api_key', '*.card', '*.ssn',
      '*.*.email', '*.*.password', '*.*.token', '*.*.session', '*.*.jwt', '*.*.secret', 
      '*.*.phone', '*.*.authorization', '*.*.api_key', '*.*.card', '*.*.ssn'
    ],
    censor: '[REDACTED]'
  }
});

const SENSITIVE_KEYS = ['email', 'password', 'token', 'session', 'jwt', 'secret', 'phone', 'authorization', 'api_key', 'card', 'ssn'];

// Recursive deep sanitization for Sentry context
 
export const deepSanitize = (obj: unknown): unknown => {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(item => deepSanitize(item));
  }

  const sanitized: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(obj)) {
    if (key !== '__proto__' && key !== 'constructor' && key !== 'prototype') {
      if (SENSITIVE_KEYS.some(sk => key.toLowerCase().includes(sk))) {
        Reflect.set(sanitized, key, '[REDACTED]');
      } else {
        Reflect.set(sanitized, key, deepSanitize(value));
      }
    }
  }
  return sanitized;
};

export const logger = {
  info: (msg: string, data?: Record<string, unknown>) => {
    // Pino handles redaction for console
    pinoLogger.info(data, msg);
  },
  
  warn: (msg: string, data?: Record<string, unknown>) => {
    pinoLogger.warn(data, msg);
  },
  
  error: (msg: string, error: unknown, context?: Record<string, unknown>) => {
    pinoLogger.error({ err: error, ...context }, msg);
    
    // Automatically capture structured errors in Sentry with sanitized extra
    const sanitizedContext = deepSanitize(context);
    
    // Attempt to sanitize error object if it's an Axios/Fetch error with response data
    let sanitizedError = error;
    if (error && typeof error === 'object') {
       const errObj = error as Record<string, unknown>;
       const response = errObj.response;
       if (response && typeof response === 'object') {
           const resData = (response as Record<string, unknown>).data;
           if (resData) {
               sanitizedError = new Error(typeof errObj.message === 'string' ? errObj.message : 'Unknown error');
               Object.assign(sanitizedError as object, { response: { data: deepSanitize(resData) } });
           }
       }
    }

    Sentry.captureException(sanitizedError, { 
      extra: sanitizedContext as Record<string, unknown>,
      tags: { custom_message: msg }
    });
  },
  
  action: (actionName: string, metadata?: Record<string, unknown>) => {
    pinoLogger.info({ action: actionName, ...metadata }, `User Action: ${actionName}`);
  }
};
