const express = require('express');
const router = express.Router();
const userController = require("../controllers/user")


// ********************user registration ************************
router.post('/signup', userController.createUser);

// ***************** USER Authentication ************************ 
router.post("/login", userController.userLogin);



module.exports = router