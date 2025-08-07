/* INTERFACE FOR THE APPLICATION USING POPULAR PACKAGE `INQUIRER` */

import inquirer from 'inquirer';
import { Library, Book, Member } from './classes.js';

export class LibraryCLI {
    private library: Library;

    constructor() {
        this.library = new Library();
        // Add some dummy data to start with
        this.library.addBook(new Book('The Hobbit', 'J.R.R. Tolkien', '9780345339683'));
        this.library.addBook(new Book('1984', 'George Orwell', '9780451524935'));
        this.library.addBook(new Book('To Kill a Mockingbird', 'Harper Lee', '9780061120084'));
        this.library.addBook(new Book('The Great Gatsby', 'F. Scott Fitzgerald', '9780743273565'));
        this.library.addBook(new Book('Pride and Prejudice', 'Jane Austen', '9780141439518'));
        this.library.addBook(new Book('Moby Dick', 'Herman Melville', '9781503280786'));
        this.library.addBook(new Book('War and Peace', 'Leo Tolstoy', '9780199232765'));
        this.library.addBook(new Book('The Catcher in the Rye', 'J.D. Salinger', '9780316769488'));
        this.library.addMember(new Member('Alice', 'M001'));
        this.library.addMember(new Member('Bob', 'M002'));
        this.library.addMember(new Member('Charlie', 'M003'));
        this.library.addMember(new Member('Diana', 'M004'));
        this.library.addMember(new Member('Eve', 'M005'));
        this.library.addMember(new Member('Frank', 'M006'));
    }

    async mainMenu() {
        const { action } = await inquirer.prompt([
            {
                type: 'list',
                name: 'action',
                message: 'Library Menu',
                choices: [
                    'List Available Books',
                    'Borrow a Book',
                    'Return a Book',
                    'List Members',
                    'Exit'
                ],
            },
        ]);

        switch (action) {
            case 'List Available Books':
                this.library.listAvailableBooks();
                break;
            case 'Borrow a Book':
                await this.borrowBook();
                break;
            case 'Return a Book':
                await this.returnBook();
                break;
            case 'List Members':
                this.library.listMembers();
                break;
            case 'Exit':
                console.log('Goodbye! 👋');
                return; // Exit the loop
        }

        this.mainMenu(); // Show the menu again
    }

    private async borrowBook() {
        const { memberId, isbn } = await inquirer.prompt([
            { type: 'input', name: 'memberId', message: 'Enter your member ID:' },
            { type: 'input', name: 'isbn', message: 'Enter the ISBN of the book to borrow:' },
        ]);

        const member = this.library.findMemberById(memberId);
        const book = this.library.findBookByIsbn(isbn);

        if (member && book) {
            member.borrowBook(book);
            console.log(`"${book.title}" borrowed by ${member.name}.`);
        } else {
            console.log('Error: Member or Book not found.');
        }
    }

    private async returnBook() {
        const { memberId, isbn } = await inquirer.prompt([
            { type: 'input', name: 'memberId', message: 'Enter your member ID:' },
            { type: 'input', name: 'isbn', message: 'Enter the ISBN of the book to return:' },
        ]);

        const member = this.library.findMemberById(memberId);
        const book = this.library.findBookByIsbn(isbn);

        if (member && book) {
            member.returnBook(book);
            console.log(`"${book.title}" returned by ${member.name}.`);
        } else {
            console.log('Error: Member or Book not found.');
        }
    }
}