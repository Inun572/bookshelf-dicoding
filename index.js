let books = [];
var bookId;

function addBook(e) {
  e.preventDefault();
  const id = +new Date();
  const title = document.querySelector('#judul').value;
  const author = document.querySelector('#penulis').value;
  const year = parseInt(document.querySelector('#tahun').value);
  const isComplete = document.querySelector('#check').checked;

  const book = {
    id,
    title,
    author,
    year,
    isComplete,
  };

  books.push(book);
  document.dispatchEvent(new Event('bookChanged'));
}

function postBook() {
  const form = document.getElementById('inputBook');
  form.addEventListener('submit', (e) => {
    addBook(e);
    form.reset();
  });
}

function setBookToLocal() {
  localStorage.setItem('books', JSON.stringify(books));
}

function getBooksFromLocal() {
  books = JSON.parse(localStorage.getItem('books')) || [];
  showlistbooks(books);
}

function showlistbooks(b) {
  let incompleteList = '';
  let completeList = '';

  b.forEach((book) => {
    let item = `
    <div class="item" id=${book.id}>
        <div class="book">
            <strong>${book.title}</strong>
            <p>${book.author}</p>
            <p>Tahun: ${book.year}</p>
        </div>
        ${
          (book.isComplete &&
            `
            <div class="action">
              <button class="incomplete">Belum dibaca</button>
              <button class="hapus">Hapus</button>
            </div>
          `) ||
          `
            <div class="action">
              <button class="complete">Selesai dibaca</button>
              <button class="hapus">Hapus</button>
            </div>
          `
        }        
    </div>`;
    if (book.isComplete) {
      completeList += item;
    } else {
      incompleteList += item;
    }
  });

  document.getElementById('complete').innerHTML = completeList;
  document.getElementById('incomplete').innerHTML = incompleteList;

  const deleteBtn = document.querySelectorAll('.hapus');
  deleteBtn.forEach((node) => {
    const btnId = node.parentElement.parentElement.id;
    const targetIndex = books.findIndex((book) => {
      return book.id === parseInt(btnId);
    });
    node.addEventListener('click', function () {
      showModalDelete(targetIndex);
      document.dispatchEvent(new Event('bookChanged'));
    });
  });

  const statusBtn = document.querySelectorAll(['.complete', '.incomplete']);
  statusBtn.forEach((node) => {
    const btnId = node.parentElement.parentElement.id;
    node.addEventListener('click', function () {
      const targetIndex = books.findIndex((book) => {
        return book.id === parseInt(btnId);
      });
      books[targetIndex].isComplete = !books[targetIndex].isComplete;
      document.dispatchEvent(new Event('bookChanged'));
    });
  });
}
function searchBook() {
  const searchBox = document.querySelector('.search-input');
  searchBox.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') {
      query = searchBox.value;
      query
        ? showlistbooks(
            books.filter((book) => {
              return book.title.toLowerCase().includes(query.toLowerCase());
            })
          )
        : showlistbooks(books);
      searchBox.value = '';
    }
  });
}

function showModalDelete(index) {
  document.querySelector('.modal').classList.add('active');
  document.querySelector('.delete').classList.add('active');
  document.querySelector('.btn-hapus').addEventListener('click', () => {
    books.splice(index, 1);
    closeModal();
    showModalSuccess();
    document.dispatchEvent(new Event('bookChanged'));
  });
}
function showModalSuccess() {
  document.querySelector('.modal').classList.add('active');
  document.querySelector('.success').classList.add('active');
}
function closeModal() {
  document.querySelector('.modal').classList.remove('active');
  document.querySelector('.delete').classList.remove('active');
  document.querySelector('.success').classList.remove('active');
}

window.addEventListener('load', () => {
  getBooksFromLocal();
  postBook();
  searchBook();

  document
    .querySelectorAll('.btn-cancel')
    .forEach((node) => node.addEventListener('click', closeModal));

  document.addEventListener('bookChanged', () => {
    setBookToLocal();
    getBooksFromLocal();
  });
});
