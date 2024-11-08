class AppError extends Error {
    constructor(message, code, status) {
        super(message);
        this.code = code;
        this.status = status;
        this.success = false;
        this.name = 'AppError';
    }
}

class ValidationError extends AppError {
    constructor(errors) {
        super("Validation Failed", 'VALIDATION_ERROR', 422);
        this.details = errors;
        this.name = 'ValidationError';
    }
}

class AuthError extends AppError {
    constructor(message = "Authentication Required") {
        super(message, 'AUTH_ERROR', 401);
        this.name = 'AuthError';
    }
}

export const globalErrorHandler = (err, req, res, next) => {
    // Log error for debugging (consider using a proper logging service)
    console.log("This is the error message: ", err);
    
    console.error('Error:', {
      message: err.message,
      stack: err.stack,
      timestamp: new Date().toISOString(),
      path: req.path,
      method: req.method,
      body: req.body,
      query: req.query,
      params: req.params,
      headers: req.headers
    });
  
    // Default error response
    const errorResponse = {
      success: false,
      error: {
        message: 'An unexpected error occurred',
        code: 'SERVER_ERROR',
        status: 500
      }
    };
  
    // Handle known errors
    if (err instanceof AppError) {
      errorResponse.error = {
        message: err.message,
        code: err.code,
        status: err.status,
        ...(err.details && { details: err.details })
      };
    }
    else if (err instanceof ValidationError) {
        errorResponse.error = {
          message: err.message,
          code: 'VALIDATION_ERROR',
          status: 422,
          details: err.details
        };
       }
    else if (err instanceof AuthError) {
        errorResponse.error = {
          message: err.message,
          code: 'AUTH_ERROR',
          status: 401
        };
      }
    // Handle Mongoose validation errors
    else if (err.name === 'ValidationError') {
      errorResponse.error = {
        message: 'Validation failed',
        code: 'VALIDATION_ERROR',
        status: 422,
        details: Object.values(err.errors).map(error => ({
          field: error.path,
          message: error.message
        }))
      };
    }
    // Handle JWT errors
    else if (err.name === 'JsonWebTokenError') {
      errorResponse.error = {
        message: 'Invalid token',
        code: 'INVALID_TOKEN',
        status: 401
      };
    }
    // Handle database errors
    else if (err.name === 'MongoError' || err.name === 'MongoServerError') {
      errorResponse.error = {
        message: 'Database error',
        code: 'DATABASE_ERROR',
        status: 500
      };
    }
  
    // Send response
    res.status(errorResponse.error.status).json(errorResponse);
  };