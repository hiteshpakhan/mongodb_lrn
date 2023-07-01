require("dotenv").config();

const express = require('express');
const mongoose = require('mongoose');  
//-now this will initialize the mongoose into our file

var bodyParser = require("body-parser"); 

// database
const database = require("./database");

// initialling express 
const booky = express();

// initializing bodyparser
booky.use(bodyParser.urlencoded({extended: true}));
booky.use(bodyParser.json());


//connecting database
mongoose.connect(process.env.MONGO_URL,
{
    useNewUrlParser: true,
    useUnifiedTopology: true,
    // useFindAndModify: false,
    // useCreateIndex: true
}
).then(() => console.log("connection established successfully"));




/*
to get all the book
*/
booky.get("/", (req, res) => {
    return res.json({books: database.books});
});

/*
to get specific book
*/
booky.get("/is/:isbn", (req, res) => {
    const getSpecificBook = database.books.filter(
        (b) => b.ISBN == req.params.isbn
    );

    if(getSpecificBook.length === 0){
        return res.json({error: `No book found of isbn no ${req.params.isbn}`})
    }

    return res.json({book: getSpecificBook});
});

/*
to get list of books based on category
*/
booky.get("/c/:category", (req, res) => {
    const getSpecificBook = database.books.filter(
        (book) => book.category.includes(req.params.category)
    )

    if(getSpecificBook.length === 0){
        return res.json({error: `No book found of the category : ${req.params.category}`})
    }

    return res.json({book: getSpecificBook});
});

/*
to get the specific book based on language
*/
booky.get("/ln/:lang", (req, res)=>{
    const getSpecificBook = database.books.filter(
        (book) => book.language == req.params.lang
    );

    if(getSpecificBook.length === 0){
        return res.json({error: `there is no book that has the language ${req.params.lang}`})
    }

    return res.json({book: getSpecificBook});
});


/*
to get all the authors
*/
booky.get("/author", (req, res)=>{
    return res.json({authors: database.author});
});

/*
to get specific author
*/
booky.get("/id/:idnum", (req, res)=>{
    const getSpecificAuthor = database.author.filter(
        (author) => author.id == req.params.idnum
    )

    if(getSpecificAuthor.length === 0){
        return res.json({author: `there is no author that has the id : ${req.params.idnum}`})
    }

    return res.json({author: getSpecificAuthor});
});

/*
to get the author based on the book
*/
booky.get("/author/book/:isbn", (req,res)=>{
    const getSpecificAuthor = database.author.filter(
        (author) => author.books.includes(req.params.isbn)
    )

    if(getSpecificAuthor === 0){
        return res.json({author: `there is no author found with isbn number ${req.params.isbn}`})
    }

    return res.json({author: getSpecificAuthor});
});

/*
to get all the publications
*/
booky.get("/publications", (req,res)=>{
    return res.json({publications: database.publication});
});


// # post method:-
// add new book
booky.post("/book/new", (req, res) => {
    const newBook = req.body;
    database.books.push(newBook);
    return res.json({updatedBooks: database.books});
});


// add new author
booky.post("/author/new", (req, res) => {
    const newAuthor = req.body;
    database.author.push(newAuthor);
    return res.json({newAuthor: database.author});
});


// # put method
booky.put("/publication/update/book/:isbn", (req, res)=>{
    
    // update the publication 
    database.publication.forEach((pub)=> {
        if(pub.id == req.body.pubId){
            return pub.books.push(req.params.isbn);
        }
    });

    // update the books
    database.books.forEach((book)=>{
        if(book.ISBN == req.params.isbn){
            book.publications = req.body.pubId;
            return;
        }
    }); 

    return res.json({
        updateBooks: database.books,
        updatePublication: database.publication,
        message: "successfully update publication"
    });
});


/* Delete */ 
// to delete a book
booky.delete("/book/delete/:isbn", (req, res)=>{
    const updatedBookDatabase = database.books.filter(
        (book) => book.ISBN !== req.params.isbn
    )

    database.books = updatedBookDatabase;
    
    return res.json({books: database.books});
});


// to delete the author from book and related book from author
booky.delete("/book/delete/author/:isbn/:authorId", (req,res)=>{

    //update the book database
    database.books.forEach((book) => {
        if(book.ISBN === req.params.isbn){
            const newAuthorList = book.author.filter((eachAuthor) => eachAuthor !== parseInt(req.params.authorId));
            book.author = newAuthorList;
            return;
        }
    });

    //update the author database
    database.author.forEach((eachAuthor) => {
        if(eachAuthor.id === parseInt(req.params.authorId)){
            const newBookList = eachAuthor.books.filter(
                (book) => book !== req.params.isbn
            );
            eachAuthor.books = newBookList;
            return;
        }
    });
    
});


booky.listen(3000,() => {
    console.log("Server is up and running");
});

// this is 