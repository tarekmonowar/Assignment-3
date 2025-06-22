import { NextFunction, Request, Response, RequestHandler } from "express";
import ErrorHandler from "./ErrorHandler.js";
import mongoose from "mongoose";

export const errorMiddleware = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal Server Error";

  console.log(err);
  //handle Mongoose validation error
  if (err instanceof mongoose.Error.ValidationError) {
    res.status(400).json({
      message: "Validation failed",
      success: false,
      error: {
        name: err.name,
        errors: err.errors,
      },
    });
    return;
  }

  // Handle Mongo duplicate key error (code 11000)
  if (err.details && err.details.code === 11000) {
    const field = Object.keys(err.details.keyValue || {})[0];
    const value = err.details.keyValue ? err.details.keyValue[field] : null;
    res.status(400).json({
      message: "Validation failed",
      success: false,
      error: {
        name: "DuplicateKeyError",
        errors: {
          [field]: {
            message: `${field} must be unique. "${value}" is already taken.`,
            name: "ValidatorError",
            properties: {
              message: `${field} must be unique.`,
              type: "unique",
              path: field,
              value,
            },
            kind: "unique",
            path: field,
            value,
          },
        },
      },
    });
    return;
  }

  // Handle other errors
  res.status(err.statusCode).json({
    message: err.message,
    success: false,
    error: {
      name: err.name,
      errors: err.details?.errors || {},
    },
  });
};
