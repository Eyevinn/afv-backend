import { Logger } from '@pieropatron/tinylogger';

let logger_: Logger;

export function Log(): Logger {
  if (logger_) {
    return logger_;
  }

  logger_ = new Logger('OSaaS Microservice');
  logger_.level = 'info';
  if (process.env.LOG_DEBUG) {
    logger_.level = 'debug';
  }

  return logger_;
}

