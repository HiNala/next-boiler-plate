// Base application error class
export class AppError extends Error {
  constructor(
    public message: string,
    public statusCode: number = 500,
    public code?: string
  ) {
    super(message)
    this.name = this.constructor.name
    Error.captureStackTrace(this, this.constructor)
  }
}

// Database related errors
export class DatabaseError extends AppError {
  constructor(message: string, code?: string) {
    super(message, 500, code)
  }
}

// Validation errors
export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, 400)
  }
}

// Authentication errors
export class AuthenticationError extends AppError {
  constructor(message: string = 'Not authenticated') {
    super(message, 401)
  }
}

// Authorization errors
export class AuthorizationError extends AppError {
  constructor(message: string = 'Not authorized') {
    super(message, 403)
  }
}

// Not found errors
export class NotFoundError extends AppError {
  constructor(message: string) {
    super(message, 404)
  }
}

// API response helper
export function errorResponse(error: unknown) {
  console.error('Error:', error)

  if (error instanceof AppError) {
    return Response.json(
      { error: error.message, code: error.code },
      { status: error.statusCode }
    )
  }

  // Handle Zod validation errors
  if (error && typeof error === 'object' && 'issues' in error) {
    return Response.json(
      { error: 'Validation Error', details: error.issues },
      { status: 400 }
    )
  }

  // Default error response
  return Response.json(
    { error: 'Internal Server Error' },
    { status: 500 }
  )
}

// Type guard for checking if an error is an AppError
export function isAppError(error: unknown): error is AppError {
  return error instanceof AppError
}

// Helper for handling async route handlers
export function createRouteHandler<T>(
  handler: () => Promise<T>
): Promise<Response> {
  return handler()
    .then(data => Response.json(data))
    .catch(errorResponse)
} 