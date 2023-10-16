require("dotenv").config();

const express = require('express');
const mongoose = require('mongoose');  
//-now this will initialize the mongoose into our file

var bodyParser = require("body-parser"); 

// database
// const database = require("./database/database");

// Models
const BookModel = require("./database/book");
const AuthorModel = require("./database/author");
const publicationModel = require("./database/publication");

// initialling express 
const booky = express();

// initializing bodyparser
booky.use(bodyParser.urlencoded({extended: true}));
booky.use(bodyParser.json());
// booky.use(express.json());


//connecting database
mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log("connection established successfully"));




/*
to get all the book
*/
booky.get("/", async (req, res) => {
    const getAllBooks = await BookModel.find();
    return res.json(getAllBooks);
});

/*
to get specific book
*/
booky.get("/is/:isbn", async (req, res) => {
    const getSpecificBook = await BookModel.findOne({ISBN: req.params.isbn});

    if(!getSpecificBook){
        return res.json({error: `No book found of isbn no ${req.params.isbn}`})
    }

    return res.json(getSpecificBook);
});

/*
to get list of books based on category
*/
booky.get("/c/:category", async (req, res) => {
    const getSpecificBook = await BookModel.findOne({category: req.params.category})

    if(!getSpecificBook){
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
booky.get("/authors",async (req, res)=>{
    const getAllAuthors = await AuthorModel.find();
    return res.json(getAllAuthors);
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
booky.get("/publications",async (req,res)=>{
    const getAllPublications = await publicationModel.find();
    return res.json(getAllPublications);
});


// # post method:- but you will realize that this method is wrong and it will give you error 
// booky.post("/book/new", async (req, res) => {
//     const { newBook }  = req.body;
//     const addNewBook = BookModel.create(newBook);
//     return res.json({
//         books: addNewBook,
//         message: "Book has been added!"
//     });
// });







// add new book this is a currect method  
// booky.post("/book/new", async (req, res) => {
//     const newBook  = req.body;
//     const addNewBook = BookModel.create(newBook);
//     return res.json({
//         books: addNewBook,
//         message: "Book has been added!"
//     });
// });


// this is the new method that i learn on the youtube video and this method is error free and currect
booky.post("/book/new", async (req, res) => {
    const newBook = new BookModel(req.body);
    // console.log(newBook);
    try {
        await newBook.save();
        res.status(201).send({
            "status": true,
            "message": "boook added successfully .."
        });
    } catch (error) {
        res.status(400).send(error);
    }
});




// add new author
booky.post("/author/new", async (req, res) => {
    const newAuthor = req.body;
    console.log(newAuthor);
    const addNewAuthor = AuthorModel.create(newAuthor);
    console.log(addNewAuthor);
    return res.json({
        authors: addNewAuthor,
        message: "authoe successfully added"
    });
});



// to update the data from the mongodb database
booky.put("/book/update/:isbn", async (req, res) => {
    const updateBook = await BookModel.findOneAndUpdate(
        {
            ISBN: req.params.isbn
        },
        {
            title:req.body.bookTitle
        },
        {
            new: true
        }
    );

    return res.json({
        books: updateBook
    })
})

// updating the new author array in books database in the mongodb also updating books array in the author database

booky.put("/book/author/update/:isbn", async (req, res)=>{
    //update book database

    const updatedBook = await BookModel.findOneAndUpdate(
        {
            ISBN: req.params.isbn
        },
        {
            $addToSet: {
                author: req.body.newAuthor
            }
        },
        {
            new: true
        }
    );

    // update the author database
    const updatedAuthor = await AuthorModel.findOneAndUpdate(
        {
            id: req.body.newAuthor
        },
        {
            $addToSet:{
                books: req.params.isbn
            }
        },
        {
            new: true
        }
    );
})




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

// here we will delete the book from the mongodb

booky.delete("/book/delete/mmmmm/:isbn",async (req, res)=>{
    const updatedBookDatabase = await BookModel.findOneAndDelete(
        {
            ISBN: req.params.isbn
        }
    );

    return res.json({
        books: updatedBookDatabase
    });
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

// this is somthing that you swhoud read
