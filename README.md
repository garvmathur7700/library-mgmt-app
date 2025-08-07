# Library Management System

A simple, full-stack Library Management System built with TypeScript, Express.js, and a modern HTML frontend. This project allows you to manage books and members, borrow and return books, and search for books and members via a RESTful API and a user-friendly web interface.

## Features

- Add, list, and search books (by ISBN or name, partial/full match)
- Add, list, and search members (by ID or name, partial/full match)
- Borrow and return books (with availability checks)
- Prevent duplicate book ISBNs and member IDs
- View all available books and registered members
- Modern, responsive frontend (HTML + Tailwind CSS)
- Status messages and modal dialogs for user feedback

## Prerequisites

- Node.js (v18 or newer recommended)
- npm (comes with Node.js)

## Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/garvmathur7700/library-mgmt-app.git
   cd library-mgmt-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

## Running the Application

1. **Start the backend server**
   ```bash
   npm start
   ```
   The server will run at `http://localhost:3000`.

2. **Open the frontend**
   - Open `src/index.html` in your web browser.
   - Make sure the backend server is running for the frontend to work.

## Project Structure

```
Library_Mgmt_Application/
├── package.json
├── tsconfig.json
├── src/
│   ├── classes.ts      # TypeScript classes for Book, Member, Library
│   ├── index.ts        # Express.js backend server
│   └── index.html      # Frontend web interface
```

## API Endpoints

### Books
- `GET /books` — List all available books
- `GET /books/:isbn` — Get book details by ISBN
- `GET /books/name/:name` — Search books by name (partial/full match)
- `POST /books` — Add a new book (requires title, author, ISBN)

### Members
- `GET /members` — List all members
- `GET /members/:id` — Get member details by ID
- `POST /members/add` — Add a new member (requires name, memberId)

### Transactions
- `POST /borrow` — Borrow a book (requires memberId, ISBN)
- `POST /return` — Return a book (requires memberId, ISBN)

## Usage

- Use the web interface (`index.html`) for all operations: add/search books and members, borrow/return books.
- All actions provide status messages and update the displayed data automatically.

## Development

- TypeScript is used for backend logic. All code is in the `src/` folder.
- To run in development mode (with auto-reload), you can use:
  ```bash
  npm run dev
  ```
  (Requires `nodemon` or similar tool.)

## Customization

- You can add more books/members by editing the initial data in `index.ts`.
- Extend the classes in `classes.ts` for more features (e.g., due dates, fines).

## License

MIT License

---

**Enjoy managing your library!**
