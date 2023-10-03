require("dotenv").config()
const jwt = require("jsonwebtoken");
const Users = require("../models/users.schema");

const authMiddleware = async (req,res,next) =>{
    const token = req.cookies.authToken || req.headers.token;
    if(!token){
        return res.status(401).send({message : "Token is not Found",status : false})
    }
    try {
        let decode = jwt.verify(token,process.env.SECRETKEY)
        // console.log("decode =>",decode)
        req.body.userId = decode.id
        req.user = decode
        next()
    } catch (error) {
        return res.status(400).send({message : error.message,status : false})
    }
}

module.exports = authMiddleware