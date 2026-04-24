export interface LoggerContext {
  [key: string]: string | number | boolean | null | undefined;
}

export interface Logger {
  child(context: LoggerContext): Logger;
  debug(message: string, context?: LoggerContext): void;
  info(message: string, context?: LoggerContext): void;
  warn(message: string, context?: LoggerContext): void;
  error(message: string, context?: LoggerContext): void;
}

function writeLog(
  level: "debug" | "info" | "warn" | "error",
  message: string,
  context: LoggerContext
): void {
  const payload = {
    timestamp: new Date().toISOString(),
    level,
    message,
    ...context
  };

  const line = JSON.stringify(payload);

  if (level === "error") {
    console.error(line);
    return;
  }

  if (level === "warn") {
    console.warn(line);
    return;
  }

  console.log(line);
}

export function createLogger(baseContext: LoggerContext = {}): Logger {
  return {
    child(context) {
      return createLogger({
        ...baseContext,
        ...context
      });
    },
    debug(message, context = {}) {
      writeLog("debug", message, { ...baseContext, ...context });
    },
    info(message, context = {}) {
      writeLog("info", message, { ...baseContext, ...context });
    },
    warn(message, context = {}) {
      writeLog("warn", message, { ...baseContext, ...context });
    },
    error(message, context = {}) {
      writeLog("error", message, { ...baseContext, ...context });
    }
  };
}
