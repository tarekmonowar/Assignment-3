# Book Borrowing API

This is Programming Hero Lavel-2 Assignment-3 . It's a RESTful API built with
**Express.js** and **MongoDB** for managing books and borrowing records.  
This project supports creating, updating, deleting, and fetching books, as well
as borrowing books with availability management and borrowing summaries.

---

## Live Backend Link

http://localhost:3000

---

## Features

- Manage books with CRUD operations (Create, Read, Update, Delete)
- Borrow books with quantity and due date
- Automatically update book availability(True/False) based on remaining copies
- Get a summary of borrowed books with total quantities
- Centralized error handling and validation
- CORS enabled for cross-origin requests

---

## Tech Stack

- Node.js & Express.js
- MongoDB with Mongoose ODM
- ES Modules (import/export)
- Middleware: CORS, JSON parsing, error handling

---

## API Endpoints

### Books

| Method | Endpoint         | Description       |
| ------ | ---------------- | ----------------- |
| POST   | `/api/books`     | Create a new book |
| GET    | `/api/books`     | Get all books     |
| GET    | `/api/books/:id` | Get book by ID    |
| PUT    | `/api/books/:id` | Update book by ID |
| DELETE | `/api/books/:id` | Delete book by ID |

### Borrow

| Method | Endpoint      | Description                   |
| ------ | ------------- | ----------------------------- |
| POST   | `/api/borrow` | Borrow a book (create record) |
| GET    | `/api/borrow` | Get summary of borrowed books |

---

## Setup & Running

1. Clone the repository:

   ```bash
   git clone <repo-url>
   cd <repo-folder>
   ```
