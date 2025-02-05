import {
  HTTP_STATUS_BAD_REQUEST,
  HTTP_STATUS_FORBIDDEN,
  HTTP_STATUS_INTERNAL_SERVER_ERROR,
  HTTP_STATUS_UNAUTHORIZED,
  HTTP_STATUS_UNPROCESSABLE_ENTITY,
} from '@/lib/constants';

export class HttpError extends Error {
  public statusCode: number;

  constructor(message: string, statusCode: number = HTTP_STATUS_BAD_REQUEST) {
    super(message);
    this.statusCode = statusCode;
  }
}

export class UnauthorizedError extends HttpError {
  constructor(message?: string) {
    super(message && message.trim() !== '' ? message : 'Access denied.');
    this.name = 'Unauthorized';
    this.statusCode = HTTP_STATUS_UNAUTHORIZED;
  }
}

export class ForbiddenError extends HttpError {
  constructor(message?: string) {
    super(message && message.trim() !== '' ? message : 'Access forbidden.');
    this.name = 'Forbidden';
    this.statusCode = HTTP_STATUS_FORBIDDEN;
  }
}

export class NotFoundError extends HttpError {
  constructor(message?: string) {
    super(message && message.trim() !== '' ? message : 'Not found.');
    this.name = 'Not Found';
    this.statusCode = HTTP_STATUS_FORBIDDEN;
  }
}

export class UnprocessableEntityError extends HttpError {
  public fields: { field: string; message: string }[];

  constructor(message?: string, fields?: { field: string; message: string }[]) {
    super(message && message.trim() !== '' ? message : 'Unprocessable entity.');
    this.name = 'Unprocessable Entity';
    this.statusCode = HTTP_STATUS_UNPROCESSABLE_ENTITY;
    this.fields = fields ?? [];
  }
}

export class ServerError extends HttpError {
  constructor() {
    super('Something went wrong.');
    this.name = 'Server Error';
    this.statusCode = HTTP_STATUS_INTERNAL_SERVER_ERROR;
  }
}
