import * as Sentry from "npm:@sentry/deno";

Sentry.init({
  dsn: Deno.env.get("SENTRY_DSN") || "https://9186ef26b30e3dd572dd8c243c000eba@o4511690011639808.ingest.de.sentry.io/4511690020028496",
  tracesSampleRate: 1.0,
});

const SENSITIVE_KEYS = ['email', 'password', 'token', 'session', 'jwt', 'secret', 'phone', 'authorization', 'api_key', 'card', 'ssn'];

// Recursive deep sanitization for logs and Sentry context
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const deepSanitize = (obj: any, seen = new WeakSet(), depth = 0): any => {
  if (obj === null || typeof obj !== 'object' || depth > 4) {
    return obj;
  }

  if (seen.has(obj)) {
    return '[Circular]';
  }
  seen.add(obj);

  if (Array.isArray(obj)) {
    return obj.map(item => deepSanitize(item, seen, depth + 1));
  }

  const sanitized: Record<string, any> = {};
  for (const [key, value] of Object.entries(obj)) {
    if (SENSITIVE_KEYS.some(sk => key.toLowerCase().includes(sk))) {
      sanitized[key] = '[REDACTED]';
    } else {
      sanitized[key] = deepSanitize(value, seen, depth + 1);
    }
  }
  return sanitized;
};



type LogMetadata = Record<string, any>;

class DenoLogger {
  private baseContext: LogMetadata;

  constructor(context: LogMetadata = {}) {
    this.baseContext = context;
  }

  // Helper to compile metadata fields and output structured JSON
  private log(levelStr: string, levelNum: number, message: string, metadata: LogMetadata = {}) {
    console.log(JSON.stringify({
      time: new Date().getTime(), // pino uses epoch time by default
      level: levelNum,
      msg: message,
      ...deepSanitize(this.baseContext),
      ...deepSanitize(metadata)
    }));
  }

  info(msg: string, metadata?: LogMetadata) { this.log("info", 30, msg, metadata); }
  
  warn(msg: string, metadata?: LogMetadata) { this.log("warn", 40, msg, metadata); }
  
  error(msg: string, error?: Error | unknown, metadata?: LogMetadata) { 
    const sanitizedContext = { ...deepSanitize(this.baseContext), ...deepSanitize(metadata) };
    console.error(JSON.stringify({
      time: new Date().getTime(),
      level: 50, // pino error level
      msg, 
      err: error instanceof Error ? error.message : (error ? String(error) : undefined),
      stack: error instanceof Error ? error.stack : undefined,
      ...sanitizedContext 
    }));
    if (error) {
      Sentry.captureException(error, { extra: sanitizedContext });
    }
  }

  // Retain the ability to spawn traced child loggers for queues
  child(context: LogMetadata) {
    return new DenoLogger({ ...this.baseContext, ...context });
  }

  async flush(timeoutMs: number = 2000) {
    await Sentry.flush(timeoutMs);
  }
}

export const logger = new DenoLogger();
