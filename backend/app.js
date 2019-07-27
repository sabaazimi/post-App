const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const Post = require('./models/post');
const mongoose =require('mongoose');
const postRoute = require('./routes/posts');

mongoose.connect('mongodb+srv://saba:UlEpf2qfNz2uJnkk@cluster0-fqdxo.mongodb.net/test?retryWrites=true&w=majority')
    .then(()=>{
        console.log('connection succesfull');
    }).catch(() => {
        console.log('connectionfailed');
    })

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET, POST, PATCH, PUT, DELETE, OPTIONS"
    );
    next();
  });
  
 // mongodb password:  UlEpf2qfNz2uJnkk

app.use('/api/posts/',postRoute);



module.exports = app ;


//60896308