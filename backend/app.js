const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const Post = require('./models/post');
const mongoose =require('mongoose');

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
      "GET, POST, PATCH, DELETE, OPTIONS"
    );
    next();
  });
  
 // mongodb password:  UlEpf2qfNz2uJnkk

app.post('/api/posts' , (req, res, next) => {   
    const post = new Post({
        title: req.body.title,
        content:req.body.content
    });
    post.save().then(result => {
        console.log(post);
        res.status(201).json({message:'post added successfully' , postId : result._id});
    });
  
}) ; 

app.get('/api/posts', (req,res) => {
    // const posts = [
    //     {id: '12345' , title:'first post', content: ' frst post comming from server'},
    //     {id: '12346' , title:'second post', content: ' second post comming from server'},
    //     {id: '12347' , title:'third post', content: ' third post comming from server'},
    //     {id: '12348' , title:'forth post', content: ' forth post comming from server'}
    // ];

    Post.find().then( documents => {
        res.status(200).json({
            message: 'posts were sent successfully',
            posts:documents
        });
    })
   
});


app.delete('/api/posts/:id', (req, res, next) =>{
   Post.deleteOne({_id: req.params.id}).then(result => {
       console.log(result);
       res.status(200).json({message:'successfully deleted'});
    })


});



module.exports = app ;


//60896308