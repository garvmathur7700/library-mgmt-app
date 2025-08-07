/* STARTING POINT OF LIBRARYA MGMT APPLICATION */

// src/index.ts

import express from 'express';
import cors from 'cors';
import { Library, Book, Member } from './classes'; // We still need our classes

// --- Server Setup ---
const app = express();
const PORT = 3000;

// --- Middleware ---
// Enable CORS for all routes
app.use(cors());
// Enable parsing of JSON request bodies
app.use(express.json());

// --- In-Memory "Database" ---
// We'll create a single instance of our Library to act as our data store.
const library = new Library();
// Add some initial data
library.addBook(new Book('The Hobbit', 'J.R.R. Tolkien', '9780345339683'));
library.addBook(new Book('1984', 'George Orwell', '9780451524935'));
library.addBook(new Book('To Kill a Mockingbird', 'Harper Lee', '9780061120084'));
library.addBook(new Book('Pride and Prejudice', 'Jane Austen', '9780141439518'));
library.addBook(new Book('The Great Gatsby', 'F. Scott Fitzgerald', '9780743273565'));
library.addBook(new Book('Moby-Dick', 'Herman Melville', '9781503280786'));
library.addBook(new Book('War and Peace', 'Leo Tolstoy', '9780199232765'));
library.addBook(new Book('The Catcher in the Rye', 'J.D. Salinger', '9780316769488'));

library.addMember(new Member('Alice', 'M001'));
library.addMember(new Member('Bob', 'M002'));
library.addMember(new Member('Charlie', 'M003'));
library.addMember(new Member('Diana', 'M004'));
library.addMember(new Member('Eve', 'M005'));
library.addMember(new Member('Frank', 'M006'));

console.log("📚 Initial library data loaded.");

// --- API Endpoints ---

// GET /books -> Get a list of all available books
app.get('/books', (req, res) => {
    const availableBooks = library.listAvailableBooks(); // Let's adapt this method
    res.json(availableBooks);
});

// GET /books/name/:name -> Get details for book(s) by name (partial or full match)
app.get('/books/name/:name', (req, res) => {
    const books = library.findBookByName(req.params.name);
    if (books.length > 0) {
        res.json(books);
    } else {
        res.status(404).json({ message: 'No books found matching the name.' });
    }
});

// GET /books/:isbn -> Get details for a single book
app.get('/books/:isbn', (req, res) => {
    const book = library.findBookByIsbn(req.params.isbn);
    if (book) {
        res.json(book);
    } else {
        res.status(404).json({ message: 'Book not found' });
    }
});

// GET /members -> Get a list of all members
app.get('/members', (req, res) => {
    const members = library.listMembers();
    res.json(members);
});

// GET /members/:id -> Get details for a single member
app.get('/members/:id', (req, res) => {
    const member = library.findMemberById(req.params.id);
    if (member) {
        res.json(member);
    } else {
        res.status(404).json({ message: 'Member not found' });
    }
});

// POST /members -> Add a new member to the library
app.post('/members/add', (req, res) => {
    const { name, memberId } = req.body;

    if (!name || !memberId) {
        return res.status(400).json({ message: 'Name and Member ID are required.' });
    }

    // Check if a member with the same memberId already exists
    if (library.findMemberById(memberId)) {
        return res.status(409).json({ message: 'A member with this ID already exists.' });
    }

    const newMember = new Member(name, memberId);
    library.addMember(newMember);

    res.status(201).json({ message: 'Member added successfully.', member: newMember });
});

// POST /books -> Add a new book to the library
app.post('/books', (req, res) => {
    const { title, author, isbn } = req.body;

    if (!title || !author || !isbn) {
        return res.status(400).json({ message: 'Title, author, and ISBN are required.' });
    }

    // Check if a book with the same ISBN already exists
    if (library.findBookByIsbn(isbn)) {
        return res.status(409).json({ message: 'A book with this ISBN already exists.' });
    }

    const newBook = new Book(title, author, isbn);
    library.addBook(newBook);

    res.status(201).json({ message: 'Book added successfully.', book: newBook });
});

// POST /borrow -> Borrow a book
app.post('/borrow', (req, res) => {
    const { memberId, isbn } = req.body;

    // Basic validation
    if (!memberId || !isbn) {
        return res.status(400).json({ message: 'Member ID and book ISBN are required.' });
    }

    const member = library.findMemberById(memberId);
    const book = library.findBookByIsbn(isbn);

    if (!member) {
        return res.status(404).json({ message: 'Member not found.' });
    }
    if (!book) {
        return res.status(404).json({ message: 'Book not found.' });
    }

    if (member.borrowBook(book)) {
        res.status(200).json({ message: `"${book.title}" successfully borrowed by ${member.name}.` });
    } else {
        res.status(409).json({ message: `"${book.title}" is currently unavailable.` }); // 409 Conflict
    }
});

// POST /return -> Return a book
app.post('/return', (req, res) => {
    const { memberId, isbn } = req.body;

    if (!memberId || !isbn) {
        return res.status(400).json({ message: 'Member ID and book ISBN are required.' });
    }

    const member = library.findMemberById(memberId);
    const book = library.findBookByIsbn(isbn);

    if (!member || !book) {
        return res.status(404).json({ message: 'Member or Book not found.' });
    }

    // You will need to implement this method in your Member class
    if (member.returnBook(book)) {
        res.status(200).json({ message: `"${book.title}" successfully returned by ${member.name}.` });
    } else {
        res.status(400).json({ message: `This book was not borrowed by ${member.name}.` });
    }
});

// --- Start the Server ---
app.listen(PORT, () => {
    console.log(`✅ Server is running at http://localhost:${PORT}`);
});