import express from "express";
import { createBorrow, getBorrowedBooksSummary, } from "../controllers/borrowController.js";
const router = express.Router();
router.post("/api/borrow", createBorrow);
router.get("/api/borrow", getBorrowedBooksSummary);
export default router;
