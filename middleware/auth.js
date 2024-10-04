// auth, isStudent, isAdmin

const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.auth = (req, res, next) => {
    try{
        // extract JWT token
        const token = req.body.token;
        if(!token){
            return res(401).json({
                success: false,
                message: "No token provided"
            })
        }
        // verify JWT token
        try{
            const decode = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decode;
        } catch(err){
            return res(401).json({
                success: false,
                message: "token Invalid"
            })
        }
    } catch(err){
        return res(500).json({
            success: false,
            message: "Authentication falied"
        })
    }
}