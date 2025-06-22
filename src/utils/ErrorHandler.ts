class ErrorHandler extends Error {
  statusCode: number;
  details?: any;
  constructor(message: string, statusCode: number, details?: any) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;

    Error.captureStackTrace(this, this.constructor);
  }
}

export default ErrorHandler;
