const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');

const booksArray = [];
let index = 1;
while(books[index] != null){
    booksArray.push(books[index]);
    index++;
}


public_users.post("/register", (req,res) => {
  //Write your code here
  if(req.body.password!=null && req.body.username!=null){
    const username = req.body.username;
    const password = req.body.password;

    if(!isValid(username)){
      users.push({"username":username,"password":password});
      return res.status(200).json({message:"User successfully registered."})
    }else{
      return res.status(404).json({message:"User already exist!"});
    }}else{
        return res.status(404).json({message:"Username or password not entered!"})
    }
    });

// Get the book list available in the shop
public_users.get('/',function (req, res) {
 const getPromise = new Promise ((resolve,reject) => {
   try{
       resolve(books);
   }catch(err){
        reject(err);
   } 
 })
 getPromise.then((book) => {
    res.send(JSON.stringify({books},null,4))
 }).catch((err) =>{
     console.log(err);
 })
});


// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
    const {isbn} = req.params;
    const response =  await  books[isbn];
    res.send(response);
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const authorPromise = new Promise ((resolve,reject) =>{
      try{
            const author = req.params.author;
            const filtered_book = booksArray.filter((b) => b.author === author);
            resolve(filtered_book);
      }catch(err){
          reject(err);
      }
    
  })  
  authorPromise.then((filtered_book) =>{
    res.send(filtered_book);
  }).catch((err) =>{
      console.log(err);
  })
});



// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
  const title = req.params.title;
  const filtered_book = await booksArray.filter((b) => b.title === title);
  res.send(filtered_book);
  
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  const username = req.session.authorization.username;
  books[isbn].reviews[username]= req.query.review;
  res.send("Review added!")

});

module.exports.general = public_users;
