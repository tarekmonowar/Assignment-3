import mongoose from "mongoose";
import { Document } from "mongoose";

export interface BOOK extends Document {
  _id: string;
  title: string;
  author: string;
  genre:
    | "FICTION"
    | "NON_FICTION"
    | "SCIENCE"
    | "HISTORY"
    | "BIOGRAPHY"
    | "FANTASY";
  isbn: string;
  description: string;
  copies: number;
  available: boolean;
  updateAvailability(): void;
  createdAt: Date;
  updatedAt: Date;
}

const BookSchema = new mongoose.Schema<BOOK>(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      minlength: [3, "Title must be at least 3 characters"],
    },

    author: {
      type: String,
      required: [true, "Author is required"],
      trim: true,
      minlength: [3, "Author name must be at least 3 characters"],
    },
    genre: {
      type: String,
      enum: {
        values: [
          "FICTION",
          "NON_FICTION",
          "SCIENCE",
          "HISTORY",
          "BIOGRAPHY",
          "FANTASY",
        ],
        message: "Genre must be one of the predefined values",
      },
      required: [true, "Genre is required"],
    },

    isbn: {
      type: String,
      required: [true, "ISBN is required"],
      unique: true,
      trim: true,
    },

    description: {
      type: String,
    },

    copies: {
      type: Number,
      required: [true, "Copies is required"],
      min: [0, "Copies must be a positive number"],
    },
    available: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

BookSchema.methods.updateAvailability = function () {
  this.available = this.copies > 0;
};

export const Book = mongoose.model<BOOK>("Book", BookSchema);
