import express from "express";
import { createBook, deleteBookById, getAllBooks, getBookById, updateBookById, } from "../controllers/bookController.js";
const router = express.Router();
router.post("/api/books", createBook);
router.get("/api/books", getAllBooks);
router.get("/api/books/:bookId", getBookById);
router.put("/api/books/:bookId", updateBookById);
router.delete("/api/books/:bookId", deleteBookById);
export default router;
