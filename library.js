// # Variables
// ## Element targets
const main = document.querySelector('main');
const newBookBtn = document.querySelector('.new-book.btn');

const newBookModal = document.querySelector('.new-book.modal');
const form = newBookModal.querySelector('form');
const title = form.querySelector('[name=title]');
const author = form.querySelector('[name=author]');
const pages = form.querySelector('[name=pages]');
const isRead = form.querySelector('[name=isRead]');
const newBookCancelBtn = form.querySelector('.cancel.btn');

const removeBookModal = document.querySelector('.remove-book.modal');
const removeBookCancelBtn = removeBookModal.querySelector('.cancel.btn');
const removeBookConfirmBtn = removeBookModal.querySelector('.confirm.btn');

const summary = document.querySelector('.summary');
const readNumber = summary.querySelector('.read-number').lastElementChild;
const notReadNumber = summary.querySelector('.not-read-number').lastElementChild;
const totalNumber = summary.querySelector('.total-number').lastElementChild;

// ## Local storage 
const library = JSON.parse(localStorage.getItem('library')) || [];

// ## Book object constructor
function Book(title, author, pages, isRead = false, colorTheme) {
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.isRead = isRead;
    this.colorTheme = colorTheme;
}


// # Functions
// ## Display items
function displayItem(book, index) {
    main.innerHTML += `
    <div class="card">
        <div class="image-placeholder ${book.colorTheme}"></div>
        <div class="meta" data-index="${index}">
            <p class="author">${book.author}</p>
            <p class="pages">${book.pages}</p>
            <h3 class="title">${book.title}</h3>
            <button class="status btn" data-is-read=${book.isRead}>${book.isRead ? 'Already read' : "Haven't read"}</button>
        </div>
        <button class="remove"><i class="fa-solid fa-xmark"></i></button>
    </div>
    `;
}

function updateSummary(read, total) {
    readNumber.textContent = read;
    notReadNumber.textContent = total - read;
    totalNumber.textContent = total;
}

// ## Update localStorage with 'library'
function updateLocalStorage() {
    localStorage.setItem('library', JSON.stringify(library));

}

// ## load localStorage and display to 'main'
function loadLocalStorage() {
    main.innerHTML = '';

    let read = 0;

    library.forEach((book, index) => {
        displayItem(book, index);

        if (book.isRead) read++;
    })

    updateSummary(read, library.length);
}

// ## Pick a random color-themed image
function randomImageColor() {
    const color = ['black', 'cyan', 'dark-blue', 'green', 'orange', 'red', 'violet', 'white', 'yellow'];

    return color[Math.floor(Math.random() * 10)];
}


// # Events
// ## Open 'New Book' modal
newBookBtn.addEventListener('click', () => {
    newBookModal.showModal();
})

// ## Close 'New Book' modal
newBookCancelBtn.addEventListener('click', () => {
    newBookModal.close();
})
newBookModal.addEventListener('click', e => {
    if (e.target === newBookModal) {
        newBookModal.close();
    }
})

// ## Create new book
newBookModal.querySelector('form').addEventListener('submit', e => {
    e.preventDefault();

    const book = new Book(
        title.value.trim(),
        author.value.trim(),
        pages.value,
        isRead.checked,
        randomImageColor()
    )


    library.push(book);
    displayItem(book, library.length - 1);
    updateSummary(isRead.checked ? parseInt(readNumber.textContent) + 1 : readNumber.textContent, library.length)
    updateLocalStorage();

    form.reset();
    newBookModal.close();
})

// ## Open 'Remove book' modal
main.addEventListener('click', e => {
    if (!e.target.classList.contains('remove')) return;

    const index = e.target.previousElementSibling.dataset.index;

    removeBookModal.firstElementChild.dataset.bookIndex = index;
    removeBookModal.showModal();
})

// ## Close 'Remove book' modal
removeBookCancelBtn.addEventListener('click', () => {
    removeBookModal.close();
})
removeBookModal.addEventListener('click', e => {
    if (e.target === removeBookModal) removeBookModal.close();
})

// ## Remove book
removeBookConfirmBtn.addEventListener('click', () => {
    const index = removeBookConfirmBtn.parentElement.dataset.bookIndex;

    library.splice(index, 1);

    updateLocalStorage()
    loadLocalStorage();

    removeBookModal.close();
})

// ## Toggle read
main.addEventListener('click', e => {
    const target = e.target;
    if (!target.classList.contains('status')) return;

    // Update visual
    if (target.dataset.isRead === 'true') {
        target.dataset.isRead = false;
        target.textContent = "Haven't read";
        updateSummary(parseInt(readNumber.textContent) - 1, library.length);
    } else {
        target.dataset.isRead = true;
        target.textContent = "Already read";
        updateSummary(parseInt(readNumber.textContent) + 1, library.length);
    }

    // Update localStorage
    library[target.parentNode.dataset.index].isRead = !library[target.parentNode.dataset.index].isRead;
    updateLocalStorage();
})

// ## Load LocalStorage upon open webpage
loadLocalStorage()
