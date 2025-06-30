// apiResponse.ts
import { Response } from 'express';

export class ApiResponse<T = any> {
  statusCode: number;
  message: string;
  data: T | null;
  success: boolean;

  constructor(statusCode: number, message: string = "Request successful", data: T | null = null) {
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
    this.success = true;
  }

  send(res: Response) {
    return res.status(this.statusCode).json(this);
  }
}

export class ApiErrorResponse {
  statusCode: number;
  message: string;
  errors: string[];
  success: boolean;
  data: null;

  constructor(statusCode: number, message: string = "Something went wrong", errors: string[] = []) {
    this.statusCode = statusCode;
    this.message = message;
    this.errors = errors;
    this.success = false;
    this.data = null;
  }

  send(res: Response) {
    return res.status(this.statusCode).json(this);
  }
}

