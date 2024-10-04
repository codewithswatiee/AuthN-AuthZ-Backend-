const bcrypt = require("bcrypt");
const User = require("../model/User");
const jwt  = require("jsonwebtoken");
require("dotenv").config();
// signup route handler
exports.signup = async (req, res) => {
    try{
        // get data
        const {name, email, password, role} =  req.body;
        // check if user already exist
        const existingUser = await User.findOne({email});
        if(existingUser){
            return res.status(400).json({
                success: false,
                message: "User already Exists",
            })
        }
        // secure password
        let hashedPassword;
        try{
            hashedPassword = await bcrypt.hash(password, 10);
        } catch(err){
            return res.status(500).json({
                success: false,
                message: "Error in hashing password",
            })
        }


        // create entry
        const user = await User.create({
            name, email, password: hashedPassword, role
        })
        
        res.status(200).json({
            success: true,
            message: "User Created successfully",
        })
    } catch(err){
        console.error(err);
        res.status(500).json({
            success: false,
            message: "User can't be registered! Please try again later"
        })
    }
}

exports.login = async (req, res) => {
    try{
        const {email, password} = req.body;
        if(!email || !password){
            return res.status(400).json({
                success: false,
                message: "Data incomplete",
            })
        }

        let user = await User.findOne({email});
        if(!user){
            return res.status(400).json({
                success: false,
                message: "Invalid Email or Password",
            })
        }
        const payload = {
            email: user.email,
            id: user._id,
            role: user.role
        };
        if(await bcrypt.compare(password, user.password)){
            let token = jwt.sign(payload, 
                    process.env.JWT_SECRET,
                    {
                        expiresIn:"2h",
                    });
            user = user.toObject();
            user.token = token;
            user.password = undefined;
            const options = {
                expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
                httpOnly: true
            }
            res.cookie("token", token, options).status(200).json({
                success: true,
                token,
                user,
                message: "Logged IN!",
            })
        }
        else{
            // password didnot match
            res.status(403).json({
                success: false,
                message: "Incorrect Password"
            })
        }
    } catch (err){
        console.error(err);
        res.status(500).json({
            success: false,
            message: "User can't be Logged in! Please try again later"
        })
    }
}