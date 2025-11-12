const { initializeDatabase } = require("./db/db.connect");
const express = require("express");
const app = express();
app.use(express.json());

const Book = require("./model/book.model");

initializeDatabase();

// 1. Create an API with route "/books" to create a new book data in the books Database.
//  Make sure to do error handling. Test your API with Postman. Add the following book:

// const newBook = {
//   title: "Lean In",
//   author: "Sheryl Sandberg",
//   publishedYear: 2012,
//   genre: ["Non-Fiction", "Business"],
//   language: "English",
//   country: "United States",
//   rating: 4.1,
//   summary:
//     "A book about empowering women in the workplace and achieving leadership roles.",
//   coverImageUrl: "https://example.com/lean_in.jpg",
// };

async function addNewBook(newBook) {
  try {
    const book = new Book(newBook);
    const savedBook = await book.save();
    return savedBook;
  } catch (error) {
    console.log(error);
  }
}

// 2. --------   TO ADD NEW BOOK    --------------//
app.post("/books", async (req, res) => {
  try {
    const book = await addNewBook(req.body);
    if (book) {
      res.status(200).json({ message: "Book added sucesfully!" });
    } else {
      res.status(500).json({ message: "Failed to add book!" });
    }
  } catch (error) {
    res.status(201).json({ error: "Error ocurred while adding book." });
  }
});

// 3. -----------     TO GET ALL BOOKS    --------------//

async function readAllBooks() {
  try {
    const allBooks = await Book.find();
    return allBooks;
  } catch (error) {
    console.log(error);
  }
}

app.get("/books/all", async (req, res) => {
  try {
    const books = await readAllBooks();
    res.json(books);
  } catch (error) {
    res.status(201).json({ error: "Error ocurred while adding book." });
  }
});

// 4. -------     TO GET BOOK BY TITLE     ----------//

async function readBookByTitle(bookTitle) {
  try {
    const book = await Book.findOne({ title: bookTitle });
    return book;
  } catch (error) {
    console.log(error);
  }
}

app.get("/books/:title", async (req, res) => {
  try {
    const book = await readBookByTitle(req.params.title);
    if (book) {
      res.json(book);
    } else {
      res.status(500).json({ message: "Failed to fetch book!" });
    }
  } catch (error) {
    res.status(201).json({ error: "Error ocurred!" });
  }
});

// 5. -------     TO GET BOOK BY AUTHOR     ----------//

async function readBookByAuthor(bookAuthor) {
  try {
    const book = await Book.findOne({ author: bookAuthor });
    return book;
  } catch (error) {
    console.log(error);
  }
}

app.get("/books/author/:authorName", async (req, res) => {
  try {
    const book = await readBookByAuthor(req.params.authorName);
    if (book) {
      res.json(book);
    }
  } catch (error) {
    res.status(201).json({ error: "Error ocurred!." });
  }
});

//6. Create an API to get all the books which are of "Business" genre.

async function readBookByGenre(bookGenre) {
  try {
    const book = await Book.find({ genre: bookGenre });
    return book;
  } catch (error) {
    console.Consolelog(error);
  }
}

app.get("/books/genre/:bookGenre", async (req, res) => {
  try {
    const book = await readBookByGenre(req.params.bookGenre);
    if (book) {
      res.json(book);
    } else {
      res.status(404).json({ message: "Book Not Found!" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to fetch!" });
  }
});

// 7. Create an API to get all the books which was released in the year 2012.

async function readBookByYear(year) {
  try {
    const book = await Book.find({ publishedYear: year });
    return book;
  } catch (error) {
    console.log(error);
  }
}

app.get("/books/publishedYear/:year", async (req, res) => {
  try {
    const book = await readBookByYear(req.params.year);
    if (book) {
      res.json(book);
    } else {
      res.status(404).json({ message: "Book Not Found!" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch!" });
  }
});

// 8. Create an API to update a book's rating with the help of its id. Update the rating
// of the "Lean In" from 4.1 to 4.5. Send an error message "Book does not exist",
//  in case that book is not found.

async function readBookByIdAndUpdate(bookId, dataToUpdate) {
  try {
    const book = await Book.findByIdAndUpdate(bookId, dataToUpdate, {
      new: true,
    });
    return book;
  } catch (error) {
    console.log(error);
  }
}

app.post("/books/update/:bookId", async (req, res) => {
  try {
    const book = await readBookByIdAndUpdate(req.params.bookId, req.body);
    if (book) {
      res.json(book);
    } else {
      res.status(404).json({ message: "Book does not Exist!" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to Update!" });
  }
});

// 9. Create an API to update a book's rating with the help of its title. Update the
//  details of the book "Shoe Dog". Use the query .findOneAndUpdate() for this.
//  Send an error message "Book does not exist", in case that book is not found.

async function readBookByTitleAndUpdate(bookTitle, dataToUpdate) {
  try {
    const book = await Book.findOneAndUpdate(
      { title: bookTitle },
      dataToUpdate,
      {
        new: true,
      }
    );
    return book;
  } catch (error) {
    console.log(error);
  }
}

app.post("/books/update/bookTitle/:title", async (req, res) => {
  try {
    const book = await readBookByTitleAndUpdate(req.params.title, req.body);
    if (book) {
      res.json(book);
    } else {
      res.status(404).json({ message: "Book does not Exist!" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to Update!" });
  }
});

// 10. Create an API to delete a book with the help of a book id, Send an error message
// "Book not found" in case the book does not exist. Make sure to do error handling.

async function readBookByIdAndDelete(bookId) {
  try {
    const book = await Book.findByIdAndDelete(bookId);
    return book;
  } catch (error) {
    console.log(error);
  }
}

app.delete("/books/delete/:bookId", async (req, res) => {
  try {
    const book = await readBookByIdAndDelete(req.params.bookId);
    if (book) {
      res.json({ message: "Book deleted Sucessfully!", deletedBook: book });
    } else {
      res.status(404).json({ message: "Book does not Exist!" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to Delete!" });
  }
});

PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
