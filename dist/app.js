import express from "express";
const app = express();
import connectDB from "./utils/db.js";
import cors from "cors";
// Route Imports
import { errorMiddleware } from "./utils/Error.js";
import bookRouter from "./router/bookRouter.js";
import borrowRouter from "./router/borrowRouter.js";
// Connect to MongoDB
connectDB();
// Middleware for parsing JSON and URL-encoded data & CORS
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
// Setting up routes
app.use("/", bookRouter);
app.use("/", borrowRouter);
// Home route
app.get("/", (req, res) => {
    res.send("Hello, PH Instructor you are in right place ❤️ !!! API Working with https://assignment-3-three-lilac.vercel.app");
});
// Catch-all route for undefined routes
app.use((req, res) => {
    res.status(400).send("Bad Request Dear PH Instructor 😂");
});
// Error handling middleware its separate file for all errors and better management
app.use(errorMiddleware);
export default app;
