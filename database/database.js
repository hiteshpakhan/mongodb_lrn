// we had created this file at the start but now we dont need it
const books = [
  {
    ISBN: "12345Book",
    title: "Tesla!!!",
    pubDate: "2021-08-05",
    language: "english",
    numPage: 250,
    author: [1,2],
    publications: [1],
    category: ["tech","space","education"]
  },
  {
    ISBN: "12345Book2",
    title: "zombi!!!",
    pubDate: "2023-08-05",
    language: "hindi",
    numPage: 500,
    author: [3,2],
    publications: [2],
    category: ["tech2","space2","education2"]
  }
]

const author = [
  {
    id: 1,
    name: "Aradhana",
    books: ["12345Book", "secretBook"]
  },
  {
    id: 2,
    name: "Elon Musk",
    books: ["12345Book2"]
  },
  {
    id: 3,
    name: "narandra modi",
    books: ["12222Book"]
  }
]

const publication = [
  {
    id: 1,
    name: "writex",
    books: ["12345Book"]
  },
  {
    id: 2,
    name: "writex2",
    books: []
  }
]

module.exports = {books , author , publication};
