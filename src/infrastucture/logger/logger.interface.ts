export interface IContextAwareLogger {
  debug(message: string, context?: string): void;
  log(context: string, message: string): void;
  error(context: string, message: string, trace?: string, metadata?: any): void;
  warn(context: string, message: string): void;
  verbose(context: string, message: string): void;
}

export interface ILoggerTimeStamp {
  timestamp?: boolean;
}
