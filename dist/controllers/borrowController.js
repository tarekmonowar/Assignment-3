import ErrorHandler from "../utils/ErrorHandler.js";
import { Borrow } from "../models/borrow.model.js";
import mongoose from "mongoose";
import { Book } from "../models/book.model.js";
//---------------------------------------------Borrow a book--------------------------------------
export const createBorrow = async (req, res, next) => {
    try {
        if (!req.body) {
            return next(new ErrorHandler("Missing request body", 400));
        }
        const { book: bookId, quantity, dueDate } = req.body;
        if (!bookId || !quantity || !dueDate) {
            return next(new ErrorHandler("Please provide all required fields", 400));
        }
        // 1. Find the book
        const book = (await Book.findById(bookId));
        if (!book) {
            return next(new ErrorHandler("Book not available", 404));
        }
        // 2. Check if enough copies are available
        if (book.copies < quantity) {
            return next(new ErrorHandler("Not enough books available", 400));
        }
        // 3. Deduct quantity & update availability
        book.copies = book.copies - quantity;
        book.updateAvailability();
        await book.save();
        // 4. Create borrow record
        const borrow = await Borrow.create({
            book: book._id,
            quantity,
            dueDate,
        });
        res.status(201).json({
            success: true,
            message: "Book borrowed successfully",
            data: borrow,
        });
    }
    catch (error) {
        if (error instanceof mongoose.Error.ValidationError) {
            next(new ErrorHandler("Validation failed", 400, error));
        }
        else if (error instanceof Error) {
            next(new ErrorHandler(error.message, 400, error));
        }
        else {
            next(new ErrorHandler("Something went wrong", 400));
        }
    }
};
// --------------------------------------Get all borrowed books------------------------------------------
export const getBorrowedBooksSummary = async (req, res, next) => {
    try {
        const summary = await Borrow.aggregate([
            {
                $group: {
                    _id: "$book",
                    totalQuantity: { $sum: "$quantity" },
                },
            },
            {
                $lookup: {
                    from: "books",
                    localField: "_id",
                    foreignField: "_id",
                    as: "bookDetails",
                },
            },
            { $unwind: "$bookDetails" },
            {
                $project: {
                    _id: 0,
                    book: {
                        title: "$bookDetails.title",
                        isbn: "$bookDetails.isbn",
                    },
                    totalQuantity: 1,
                },
            },
        ]);
        res.status(200).json({
            success: true,
            message: "Borrowed books summary retrieved successfully",
            data: summary,
        });
    }
    catch (error) {
        if (error instanceof Error) {
            next(new ErrorHandler(error.message, 400, error));
        }
        else {
            next(new ErrorHandler("Something went wrong", 400));
        }
    }
};
