import mongoose from "mongoose";
const BorrowSchema = new mongoose.Schema({
    book: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Book",
        required: [true, "Book is required"],
    },
    quantity: {
        type: Number,
        required: [true, "Quantity is required"],
        min: [1, "Quantity must be at least 1"],
    },
    dueDate: {
        type: Date,
        required: [true, "Due date is required"],
    },
}, { timestamps: true });
export const Borrow = mongoose.model("Borrow", BorrowSchema);
