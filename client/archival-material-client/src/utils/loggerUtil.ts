import log from 'loglevel';


if (process.env.NODE_ENV === 'production') {
  log.setLevel(log.levels.WARN);
} else {
  log.setLevel(log.levels.TRACE);
}

function getLogMessageWithHeader(header: string, ...args: any[]): string {
    const formattedArgs = args.map((arg) =>
    typeof arg === 'object'
      ? JSON.stringify(arg, null, 2) // Use JSON.stringify for object inspection
      : arg
  );

  return `[${header}] ${new Date().toISOString()} - ${formattedArgs.join(' ')}`;
}

const logger = {
  trace: (...args: any[]) => {
    log.trace(getLogMessageWithHeader('TRACE', ...args));
  },
  debug: (...args: any[]) => {
    log.debug(getLogMessageWithHeader('DEBUG', ...args));
  },
  info: (...args: any[]) => {
    log.info(getLogMessageWithHeader('INFO', ...args));
  },
  warn: (...args: any[]) => {
    log.warn(getLogMessageWithHeader('WARN', ...args));
  },
  error: (...args: any[]) => {
    log.error(getLogMessageWithHeader('ERROR', ...args));
  },
  fatal: (...args: any[]) => {
    log.error(getLogMessageWithHeader('FATAL', ...args));
  },
};

export default logger;
