import { NextFunction, Request, Response } from "express";
import ErrorHandler from "../utils/ErrorHandler.js";
import { Book } from "../models/book.model.js";
import mongoose from "mongoose";
import connectDB from "../utils/db.js";

//type definition for base query

export interface BaseQuery {
  genre?: string;
}

// --------------------------------------------Create a new book-----------------------------------
export const createBook = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    await connectDB(); // hi PH Instructor without this it cannot works in vercel see buffering timed out that's why i call here
    const bookData = req.body;
    const newBook = await Book.create(bookData);
    res.status(201).json({
      success: true,
      message: "Book created successfully",
      data: newBook,
    });
  } catch (error: unknown) {
    if (error instanceof mongoose.Error.ValidationError) {
      next(new ErrorHandler("Validation failed", 400, error));
    } else if (error instanceof Error) {
      next(new ErrorHandler(error.message, 400, error));
    } else {
      next(new ErrorHandler("Something went wrong", 400));
    }
  }
};

// -----------------------------------------------Get all books------------------------------
export const getAllBooks = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    await connectDB(); // hi PH Instructor without this it cannot works in vercel see buffering timed out that's why i call here

    const { filter, sortBy, sort = "asc", limit = 10 } = req.query;

    const basequery: BaseQuery = {};

    if (filter) {
      basequery.genre = filter as string;
    }
    const sortField = typeof sortBy === "string" ? sortBy : "createdAt";
    const sortOrder = sort === "asc" ? 1 : -1;

    const books = await Book.find(basequery)
      .limit(Number(limit))
      .sort({ [sortField]: sortOrder });

    res.status(200).json({
      success: true,
      message: "Books retrieved successfully",
      data: books,
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      next(new ErrorHandler(error.message, 400, error));
    } else {
      next(new ErrorHandler("Something went wrong", 400));
    }
  }
};

//----------------------------------------------get book by id---------------------------------

export const getBookById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    await connectDB(); // hi PH Instructor without this it cannot works in vercel see buffering timed out that's why i call here

    const bookId = req.params.bookId;
    const book = await Book.findById(bookId);
    if (!book) {
      return next(new ErrorHandler("Book not found", 404));
    }
    res.status(200).json({
      success: true,
      message: "Books retrieved successfully",
      data: book,
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      next(new ErrorHandler(error.message, 400, error));
    } else {
      next(new ErrorHandler("Something went wrong", 400));
    }
  }
};

//----------------------------------------------update book by id-------------------------------

export const updateBookById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    await connectDB(); // hi PH Instructor without this it cannot works in vercel see buffering timed out that's why i call here
    const bookId = req.params.bookId;
    const bookData = req.body;

    const updatedBook = await Book.findByIdAndUpdate(bookId, bookData, {
      new: true,
      runValidators: true,
    });

    if (!updatedBook) {
      return next(new ErrorHandler("Book not found", 404));
    }

    // Update availability after updating the book if it false
    updatedBook.updateAvailability();
    await updatedBook.save();

    // Return the updated book
    res.status(200).json({
      success: true,
      message: "Book updated successfully",
      data: updatedBook,
    });
  } catch (error: unknown) {
    if (error instanceof mongoose.Error.ValidationError) {
      next(new ErrorHandler("Validation failed", 400, error));
    } else if (error instanceof Error) {
      next(new ErrorHandler(error.message, 400, error));
    } else {
      next(new ErrorHandler("Something went wrong", 400));
    }
  }
};

//-----------------------------------------------------Delete book by id-------------------------------------------
export const deleteBookById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    await connectDB(); // hi PH Instructor without this it cannot works in vercel see buffering timed out that's why i call here

    const bookId = req.params.bookId;
    const deletedBook = await Book.findByIdAndDelete(bookId);

    if (!deletedBook) {
      return next(new ErrorHandler("Book not found", 404));
    }

    res.status(200).json({
      success: true,
      message: "Book deleted successfully",
      data: deletedBook,
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      next(new ErrorHandler(error.message, 400, error));
    } else {
      next(new ErrorHandler("Something went wrong", 400));
    }
  }
};
