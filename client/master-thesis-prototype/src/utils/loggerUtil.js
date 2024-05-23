import log from 'loglevel';
import util from 'util'; // Import the util module

const logLevels = {
  trace: 'trace',
  debug: 'debug',
  info: 'info',
  warn: 'warn',
  error: 'error',
};


if (process.env.REACT_APP_ENV === 'production') {
  log.setLevel(logLevels.warn);
} else {
  log.setLevel(logLevels.trace);
}


/**
 * Generates a log message with a header and optional arguments.
 *
 * @param {string} header - The header for the log message.
 * @param {...*} args - Optional arguments to include in the log message.
 * @return {string} The formatted log message.
 */
function getLogMessageWithHeader(header, ...args) {
  const formattedArgs = args.map(
    (arg) => (typeof arg === 'object' ?
      util.inspect(arg, { colors: true, depth: null }) :
      arg));

  return `[${header}] ${new Date().toISOString()} - ${formattedArgs.join(' ')}`;
}


// Create a custom logger object
const logger = {
  /* setLevel: (level) => {
    log.setLevel(level);
  },*/
  trace: (...args) => {
    log.trace(getLogMessageWithHeader('TRACE', ...args));
  },
  debug: (...args) => {
    log.debug(getLogMessageWithHeader('DEBUG', ...args));
  },
  info: (...args) => {
    log.info(getLogMessageWithHeader('INFO', ...args));
  },
  warn: (...args) => {
    log.warn(getLogMessageWithHeader('WARN', ...args));
  },
  error: (...args) => {
    log.error(getLogMessageWithHeader('ERROR', ...args));
  },
  fatal: (...args) => {
    log.error(getLogMessageWithHeader('FATAL', ...args));
  },
};

export default logger;
