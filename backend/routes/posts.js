const express = require('express');
const router = express.Router();
const checkAuth = require("../middleware/check-auth");
const postController = require("../controllers/posts");
const extractFile = require("../middleware/file");



router.post('', checkAuth, extractFile , postController.createPost) ; 

/*
* Update a post 
*
*/
router.put('/:id', checkAuth, extractFile ,  postController.updatePost) ;

router.get('', postController.getPosts);



router.get('/:id', postController.getPost);

router.delete('/:id', checkAuth, postController.deletePost);


module.exports = router ;