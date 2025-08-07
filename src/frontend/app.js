document.addEventListener('DOMContentLoaded', () => {
    const API_BASE_URL = 'http://localhost:3000';

    // Get all DOM elements
    const booksList = document.getElementById('booksList');
    const membersList = document.getElementById('membersList');
    const borrowForm = document.getElementById('borrowForm');
    const returnForm = document.getElementById('returnForm');
    const addBookForm = document.getElementById('addBookForm');
    const addMemberForm = document.getElementById('addMemberForm');
    const searchBookForm = document.getElementById('searchBookForm');
    const findMemberForm = document.getElementById('findMemberForm');
    
    // Main modal for search results
    const modal = document.getElementById('modal');
    const modalTitle = document.getElementById('modalTitle');
    const modalContent = document.getElementById('modalContent');
    const modalClose = document.getElementById('modalClose');

    // Status modal for alerts
    const statusModal = document.getElementById('statusModal');
    const statusModalTitle = document.getElementById('statusModalTitle');
    const statusModalMessage = document.getElementById('statusModalMessage');
    const statusModalClose = document.getElementById('statusModalClose');

    // --- Modal Functions ---
    function showResultModal(title, contentHTML) {
        modalTitle.textContent = title;
        modalContent.innerHTML = contentHTML;
        modal.classList.remove('hidden');
    }

    function hideResultModal() {
        modal.classList.add('hidden');
    }

    function showStatusModal(message, isError = false) {
        statusModalTitle.textContent = isError ? 'Error' : 'Success';
        statusModalTitle.className = `text-2xl leading-6 font-bold ${isError ? 'text-red-600' : 'text-green-600'}`;
        statusModalMessage.textContent = message;
        statusModal.classList.remove('hidden');
    }
    
    function hideStatusModal() {
        statusModal.classList.add('hidden');
    }

    // --- Data Fetching and Rendering Functions ---
    async function fetchAvailableBooks() {
        try {
            const response = await fetch(`${API_BASE_URL}/books`);
            if (!response.ok) throw new Error('Failed to fetch books.');
            const books = await response.json();

            booksList.innerHTML = '';
            if (books.length === 0) {
                booksList.innerHTML = '<p class="text-gray-500 col-span-full">No books are currently available.</p>';
                return;
            }
            
            books.forEach(book => {
                const card = document.createElement('div');
                card.className = 'card bg-white p-4 rounded-lg shadow-sm border';
                card.innerHTML = `
                    <h3 class="font-bold text-lg">${book.title}</h3>
                    <p class="text-gray-600">${book.author}</p>
                    <p class="text-sm text-gray-500 mt-2">ISBN: ${book.isbn}</p>
                `;
                booksList.appendChild(card);
            });
        } catch (error) {
            showStatusModal(error.message, true);
        }
    }

    async function fetchMembers() {
        try {
            const response = await fetch(`${API_BASE_URL}/members`);
            if (!response.ok) throw new Error('Failed to fetch members.');
            const members = await response.json();

            membersList.innerHTML = '';
            members.forEach(member => {
                const card = document.createElement('div');
                card.className = 'card bg-white p-4 rounded-lg shadow-sm border';
                card.innerHTML = `
                    <h3 class="font-bold text-lg">${member.name}</h3>
                    <p class="text-sm text-gray-500">ID: ${member.memberId}</p>
                    <p class="text-sm text-gray-600 mt-2">Borrowed: ${member.borrowedBooks.length} book(s)</p>
                `;
                membersList.appendChild(card);
            });
        } catch (error) {
            showStatusModal(error.message, true);
        }
    }
    
    function refreshData() {
        fetchAvailableBooks();
        fetchMembers();
    }

    // --- Form Submission Handlers ---
    async function handleTransactionSubmit(event, endpoint) {
        event.preventDefault();
        const form = event.target;
        const memberId = form.elements.memberId.value;
        const isbn = form.elements.isbn.value;

        try {
            const response = await fetch(`${API_BASE_URL}${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ memberId, isbn }),
            });
            const result = await response.json();
            if (!response.ok) throw new Error(result.message);
            
            showStatusModal(result.message);
            form.reset();
            refreshData();
        } catch (error) {
            showStatusModal(error.message, true);
        }
    }

    async function handleAddBook(event) {
        event.preventDefault();
        const form = event.target;
        const title = form.elements.title.value;
        const author = form.elements.author.value;
        const isbn = form.elements.isbn.value;
        
        try {
            const response = await fetch(`${API_BASE_URL}/books`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title, author, isbn }),
            });
            const result = await response.json();
            if (!response.ok) throw new Error(result.message);

            showStatusModal(result.message);
            form.reset();
            refreshData();
        } catch (error) {
            showStatusModal(error.message, true);
        }
    }
    
    async function handleAddMember(event) {
        event.preventDefault();
        const form = event.target;
        const name = form.elements.name.value;
        const memberId = form.elements.memberId.value;
        
        try {
            const response = await fetch(`${API_BASE_URL}/members/add`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, memberId }),
            });
            const result = await response.json();
            if (!response.ok) throw new Error(result.message);

            showStatusModal(result.message);
            form.reset();
            refreshData();
        } catch (error) {
            showStatusModal(error.message, true);
        }
    }

    async function handleSearchBook(event) {
        event.preventDefault();
        const bookName = event.target.elements.bookName.value;
        try {
            const response = await fetch(`${API_BASE_URL}/books/name/${bookName}`);
            const result = await response.json();
            if (!response.ok) throw new Error(result.message);

            let contentHTML = '<p class="text-gray-600">No books found matching your search.</p>';
            if (result.length > 0) {
                contentHTML = result.map(book => `
                    <div class="p-3 border rounded-md">
                        <h4 class="font-bold">${book.title}</h4>
                        <p class="text-sm">${book.author}</p>
                        <p class="text-xs text-gray-500 mt-1">ISBN: ${book.isbn}</p>
                        <p class="text-sm font-semibold ${book.isAvailable ? 'text-green-600' : 'text-red-600'}">${book.isAvailable ? 'Available' : 'Not Available'}</p>
                    </div>
                `).join('');
            }
            showResultModal(`Search Results for "${bookName}"`, contentHTML);
            event.target.reset();
        } catch (error) {
            showStatusModal(error.message, true);
        }
    }

    async function handleFindMember(event) {
        event.preventDefault();
        const memberId = event.target.elements.memberId.value;
        try {
            const response = await fetch(`${API_BASE_URL}/members/${memberId}`);
            const member = await response.json();
            if (!response.ok) throw new Error(member.message);

            let borrowedBooksHTML = '<p class="text-gray-500">No books currently borrowed.</p>';
            if (member.borrowedBooks.length > 0) {
                borrowedBooksHTML = member.borrowedBooks.map(book => `
                    <li class="ml-4 list-disc">${book.title} (ISBN: ${book.isbn})</li>
                `).join('');
            }

            const contentHTML = `
                <p><span class="font-semibold">Name:</span> ${member.name}</p>
                <p><span class="font-semibold">ID:</span> ${member.memberId}</p>
                <h4 class="font-bold mt-4">Borrowed Books:</h4>
                <ul>${borrowedBooksHTML}</ul>
            `;
            showResultModal(`Details for Member: ${member.name}`, contentHTML);
            event.target.reset();
        } catch (error) {
            showStatusModal(error.message, true);
        }
    }

    // --- Event Listeners ---
    borrowForm.addEventListener('submit', (e) => handleTransactionSubmit(e, '/borrow'));
    returnForm.addEventListener('submit', (e) => handleTransactionSubmit(e, '/return'));
    addBookForm.addEventListener('submit', handleAddBook);
    addMemberForm.addEventListener('submit', handleAddMember);
    searchBookForm.addEventListener('submit', handleSearchBook);
    findMemberForm.addEventListener('submit', handleFindMember);
    
    // Modal close events
    modalClose.addEventListener('click', hideResultModal);
    statusModalClose.addEventListener('click', hideStatusModal);
    
    window.addEventListener('click', (event) => {
        if (event.target == modal) hideResultModal();
        if (event.target == statusModal) hideStatusModal();
    });

    // Initial data fetch
    refreshData();
});