const express = require('express');
const app = express();
const bodyParser = require('body-parser');

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
      "GET, POST, PATCH, DELETE, OPTIONS"
    );
    next();
  });
  


app.post('/api/posts' , (req, res, next) => {   
    const post = req.body ;
    console.log(post);
    res.status(201).json({message:'post added successfully'});
}) ; 

app.get('/api/posts', (req,res) => {
    const posts = [
        {id: '12345' , title:'first post', content: ' frst post comming from server'},
        {id: '12346' , title:'second post', content: ' second post comming from server'},
        {id: '12347' , title:'third post', content: ' third post comming from server'},
        {id: '12348' , title:'forth post', content: ' forth post comming from server'}
    ];
    res.status(200).json({
        message: 'posts were sent successfully',
        posts:posts
    });
});



module.exports = app ;
