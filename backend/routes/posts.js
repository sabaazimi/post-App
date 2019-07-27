const express = require('express');
const router = express.Router();
const Post = require('../models/post');


router.post('' , (req, res, next) => {   
    const post = new Post({
        title: req.body.title,
        content:req.body.content
    });
    post.save().then(result => {
        console.log(post);
        res.status(201).json({message:'post added successfully' , postId : result._id});
    });
  
}) ; 


router.put('/:id' , (req, res, next) => {
    const post= new Post({
        _id:req.body.id,
        title: req.body.title,
        content: req.body.content
    });

    Post.updateOne({_id : req.params.id}, post).then(result => {
        res.status(200).json({
            message:'the post is successfully updated'
        });
        
    })
}) ;

router.get('', (req,res) => {
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



router.get('/:id', (req, res, next) => {
    Post.findById(req.params.id).then (post => {
        (post) ? 
            res.status(200).json(post):
                res.status(404).json({message:'post not found'}); 
    });
});

router.delete('/:id', (req, res, next) =>{
   Post.deleteOne({_id: req.params.id}).then(result => {
       console.log(result);
       res.status(200).json({message:'successfully deleted'});
    })


});


module.exports = router ;