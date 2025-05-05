// function Book(title, author, pages, read){
//     if(!new.target){
//         throw Error("must use 'new'");
//     }
//     this.title = title;
//     this.author = author;
//     this.pages = pages;
//     this.read = read;
//     this.bookID = crypto.randomUUID();
// }

// Book.prototype.info = function() {
//     const readStatus = this.read ? "Read" : "Not Read Yet";
//     return(`${this.title} by ${this.author}, ${this.pages} pages, ${readStatus}`)
// }

// Book.prototype.toggleRead = function() {
//     this.read = !this.read;
// }

class Book{
    constructor(title, author, pages, read){
        this.title = title;
        this.author = author;
        this.pages = pages;
        this.read = read;
        this.bookID = crypto.randomUUID();
    }
    info() {
        const readStatus = this.read ? "Read" : "Not Read Yet";
        return(`${this.title} by ${this.author}, ${this.pages} pages, ${readStatus}`)
    }
    toggleRead() {
        this.read = !this.read;
    }
}

const myLibrary = [];

function addBook(title, author, pages, read) {
    const book = new Book(title, author, pages, read);

    myLibrary.push(book);
    return book;
}

function startUp(library) {
    library.forEach((entry) => {
        displayBook(entry);
    })
}

function displayBook(book) {
    const { title, author, pages, read, bookID } = book;

    const mainDiv = document.createElement("div");
    mainDiv.classList.add("book");
    mainDiv.dataset.bookId = bookID;
    container.appendChild(mainDiv);

    const readStatus = read ? "Read" : "Not Read Yet";
    const details = [title, author, pages, readStatus];
    details.forEach((detail, index) => {
        const divChild = document.createElement("div");
        divChild.classList.add("book-detail");
        divChild.textContent = detail;
        if (index === 3) {
            divChild.style.color = read ? "green" : "red";
            divChild.style.fontWeight = "bold";
        }
        mainDiv.appendChild(divChild);
    });

    const toggleReadBtn = document.createElement("button");
    toggleReadBtn.classList.add("toggle-read");
    toggleReadBtn.textContent = read ? "Mark as Unread" : "Mark as Read";
    toggleReadBtn.addEventListener("click", () => {
        book.toggleRead(); 
        const newStatus = book.read ? "Read" : "Not Read Yet";

        const readDiv = mainDiv.querySelectorAll(".book-detail")[3];
        readDiv.textContent = newStatus;
        readDiv.style.color = book.read ? "green" : "red";
        toggleReadBtn.textContent = book.read ? "Mark as Unread" : "Mark as Read";
    });
    mainDiv.appendChild(toggleReadBtn);

    const delBookBtn = document.createElement("button");
    delBookBtn.classList.add("del-book");
    delBookBtn.textContent = "Delete Book";
    delBookBtn.addEventListener("click", () => {
        document.querySelector(`[data-book-id="${bookID}"]`).remove();
        const index = myLibrary.findIndex(book => book.bookID === bookID);
        if (index !== -1) {
            myLibrary.splice(index, 1);
        }
    })
    mainDiv.appendChild(delBookBtn);
}

const container = document.querySelector(".container");
const newBookInput = document.getElementById("new-book");
const showButton = document.querySelector("dialog + button");
// const confirmButton = document.getElementById("confirmBtn");
const form = newBookInput.querySelector("form");

showButton.addEventListener("click", () => {
    newBookInput.showModal();
});

form.addEventListener("submit", (event) => {
    event.preventDefault();

    const formData = new FormData(form);
    const newTitle = formData.get("title");
    const newAuthor = formData.get("author");
    const newPages = formData.get("pages");
    const newRead = formData.has("read");

    newBookInput.close(JSON.stringify({newTitle, newAuthor, newPages, newRead}))
});

newBookInput.addEventListener("close", () => {
    const returnValue = newBookInput.returnValue;

    try {
        const result = JSON.parse(returnValue);
        if (result && result.newTitle && result.newAuthor && result.newPages) {
            const book = addBook(result.newTitle, result.newAuthor, result.newPages, result.newRead);
            displayBook(book);
        }
    } catch (e) {
        // Ignore cancel or invalid returnValue (e.g., user clicked X)
    }

    form.reset();
});


addBook("The Hobbit 1", "J.R.R. Tolkien", 295, true);
startUp(myLibrary);
