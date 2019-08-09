

const Post = require('../models/post');



exports.createPost = (req, res, next) => {   
    const URL = req.protocol + '://' + req.get('host');
    const post = new Post({
        title: req.body.title,
        content:req.body.content,
        imagePath : URL + '/images/' + req.file.filename,
        creator : req.userData.userId
    });
    post.save().then(result => {
            console.log(post);
            res.status(201).json({message:'post added successfully' , 
            post : {
                id : result._id,
                ...result
               }
        });
    })
    .catch(error => {
        res.status(500).json({
            message:" post Creation failed !!!"
        })
    });
  
}


exports.updatePost = (req, res, next) => {
    let imagePath = req.body.imagePath;
    if(req.file){
        const URL = req.protocol + '://' + req.get('host');
        imagePath = URL + '/images/' + req.file.filename;
    }
    const post= new Post({
        _id:req.body.id,
        title: req.body.title,
        content: req.body.content,
        imagePath:imagePath,
        creator : req.userData.userId
    });

    Post.updateOne({_id : req.params.id , creator: req.userData.userId}, post).then(result => {

        (result.n > 0) ?  res.status(200).json({
            message:'the post is successfully updated',
            post:result
        }): res.status(401).json({
            message:'Not the authorized user',
            post:result
        })
        
    })
    .catch(error => {
        res.status(500).json({
            message:"couldn't update the post."
        })
    })
}


exports.getPosts = (req,res) => {
    const pageSize = +req.query.pagesize;
    const currentPage = +req.query.page;
    const postQuery = Post.find();
    let fetchedPosts;
    if(pageSize && currentPage) {
        postQuery.skip(pageSize *(currentPage - 1))
        .limit(pageSize);

    }
    postQuery.then( documents => {
        fetchedPosts = documents ;
        return Post.count();
        
    }).then (count => {
        res.status(200).json({
            message: 'posts were sent successfully',
            posts: fetchedPosts,
            maxPost : count
        });
    })
    .catch( error => {
        res.status(500).json({
            message:" Fetchong post not found !!!"
        })
    })

}



exports.getPost = (req, res, next) => {
    Post.findById(req.params.id).then (post => {
        (post) ? 
            res.status(200).json(post):
                res.status(404).json({message:'post not found'}); 
    }).catch( error => {
        res.status(500).json({
            message:" Fetchong post not found !!!"
        })
    });
}



exports.deletePost = (req, res, next) =>{
    Post.deleteOne({_id: req.params.id , creator : req.userData.userId}).then(result => {
     (result.n > 0) ?  res.status(200).json({
         message:'the post is successfully updated',
         post:result
     }): res.status(401).json({
         message:'Not the authorized user',
         post:result
     })
        console.log(result);
        res.status(200).json({message:'successfully deleted'});
     }).catch( error => {
         res.status(500).json({
             message:" Deleting post failed!!!"
         })
     })
 
 
 }