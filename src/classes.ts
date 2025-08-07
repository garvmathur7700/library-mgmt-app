/* CLASSES FOR THE LIBRARY APPLICATION */

// Book class

export class Book {
    public isAvailable: boolean = true;

    constructor(
        public title: string,
        public author: string,
        public isbn: string
    ) {}

    borrow(): boolean {
        if (this.isAvailable) {
            this.isAvailable = false;
            return true; // Success
        }
        return false; // Failure
    }

    returnBook(): boolean {
        this.isAvailable = true;
        return true;
    }
}

// Member Class

export class Member {
    public borrowedBooks: Book[] = [];

    constructor(
        public name: string,
        public memberId: string
    ) {}

    borrowBook(book: Book): boolean {
        if (book.isAvailable) {
            book.borrow();
            this.borrowedBooks.push(book);
            return true;
        } 
        return false;
    }

    returnBook(book: Book): boolean {
        const bookIndex = this.borrowedBooks.findIndex(b => b.isbn === book.isbn);
        if (bookIndex !== -1) {
            book.returnBook();
            this.borrowedBooks.splice(bookIndex, 1);
            return true;
        }
        return false;
    }
}

// Library class

export class Library {
    private books: Book[] = [];
    private members: Member[] = [];

    addBook(book: Book): void {
        this.books.push(book);
        console.log(`Added book: "${book.title}" by ${book.author}.`);
    }

    addMember(member: Member): void {
        this.members.push(member);
        console.log(`Added member: ${member.name} (ID: ${member.memberId}).`);
    }

    findBookByIsbn(isbn: string): Book | undefined {
        return this.books.find(book => book.isbn === isbn);
    }

    findBookByName(name: string): Book[] {
        const lowerName = name.toLowerCase();
        return this.books.filter(book => book.title.toLowerCase().includes(lowerName));
    }

    findMemberById(memberId: string): Member | undefined {
        return this.members.find(member => member.memberId === memberId);
    }

    findMemberByName(name: string): Member[] {
        const lowerName = name.toLowerCase();
        return this.members.filter(member => member.name.toLowerCase().includes(lowerName));
    }

    listAvailableBooks(): Book[] {
        return this.books.filter(book => book.isAvailable);
    }

    listMembers(): Member[] {
        return this.members;
    }
}