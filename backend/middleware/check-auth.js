const jwt = require('jsonwebtoken');



module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        jwt.verify(token, "what_the_Fuck_is_the_Secret");
        next();
    } catch (error) {
        res.status(401).json({
            message : "Auth Falied!"
        });
    }



}