const express = require('express');
const router = express.Router();
const multer = require('multer');
const Post = require('../models/post');


const MIME_TYPE_MAP = {
    'image/png' : 'png' ,
    'image/jpeg' :'jpg',
    'image/jpg' : 'jpg'
}

const storage = multer.diskStorage({
    destination : (req, file, callback) => {
        const isValid = MIME_TYPE_MAP[file.mimetype];
        let error = new Error('invalid mime type');
        if(isValid) error = null;
        callback(error, 'backend/images')
    },
    filename: (req, file, callback) => {
        const name = file.originalname.toLocaleLowerCase().split(' ').join('-');
        const ext = MIME_TYPE_MAP[file.mimetype];
        callback(null, name + '-' + Date.now() + '.' + ext);

    }
});

router.post('', multer({storage : storage}).single('image') , (req, res, next) => {   
    const URL = req.protocol + '://' + req.get('host');
    const post = new Post({
        title: req.body.title,
        content:req.body.content,
        imagePath : URL + '/images/' + req.file.filename
    });
    post.save().then(result => {
            console.log(post);
            res.status(201).json({message:'post added successfully' , 
            post : {
                id : post._id,
                title : post.title,
                content : post.content,
                imagePath : post.imagePath
            }
        });
    });
  
}) ; 


router.put('/:id', multer({storage : storage}).single('image') , (req, res, next) => {
    let imagePath = req.body.imagePath;
    if(req.file){
        const URL = req.protocol + '://' + req.get('host');
        imagePath = URL + '/images/' + req.file.filename;
    }
    const post= new Post({
        _id:req.body.id,
        title: req.body.title,
        content: req.body.content,
        imagePath:imagePath
    });

    Post.updateOne({_id : req.params.id}, post).then(result => {
        res.status(200).json({
            message:'the post is successfully updated',
            post:result
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