const mongoose = require("mongoose");

const BookSchema = mongoose.Schema({
        ISBN: String,
        title: String,
        pubDate: String,
        language: String,
        numPage: Number,
        author: [Number],
        publications: [Number],
        category: [String]
}
);

const BookModel = mongoose.model("books", BookSchema);

module.exports = BookModel;









// const mongoose = require("mongoose");

// const BookSchema = mongoose.Schema({
//     ISBN: String,
//     title: String,
//     pubDate: String,
//     language: String,
//     numPage: Number,
//     author: [Number],
//     publications: [Number],
//     category: [String]
// }
// );

// const BookModel = mongoose.model("books", BookSchema);
// module.exports = BookModel;

// ======================


// const mongoose = require("mongoose");
// var Schema = mongoose.Schema;
// var BookSchema = new Schema({
//     ISBN: {
//         type:String,
//         required: true
//     },
//     title: {
//         type:String,
//         required: true
//     },
//     language:{
//         type:String,
//         required: true
//     }
// });
// module.exports = mongoose.model("books", BookSchema);


// ================


