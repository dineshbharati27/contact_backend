const asyncHandler = require("express-async-handler")
const User = require("../models/userModel")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

//@desc register the user
//route post /api/user/register
//@access public
const registerUser = asyncHandler(async (req, res) => {
    const {username, email, password} = req.body;
    if(!username || !email || !password){
        res.status(400);
        throw new Error("all fields are mandatory")
    }
    const userAvilable = await User.findOne({email});
    if(userAvilable){
        res.status(400);
        throw new Error("user already exist")
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("hashed password = ", hashedPassword)
    const user = await User.create({
        username, 
        email,
        password: hashedPassword,
    });
    if (user) {
        res.status(201).json({_id: user.id, email: user.email})
    } else {
        res.status(400);
        throw new Error("user data is not valid")
    }
})

//@desc login the user
//route post /api/user/login
//@access public
const loginUser = asyncHandler(async (req, res) => {
    const {email, password} = req.body;
    if (!email || !password) {
        res.status(400);
        throw new Error("email and password are required.");
    }

    const user = await User.findOne({email});
    //compare password with hashedPassword
    if (user && (await bcrypt.compare(password, user.password))) {
        const accessToken = jwt.sign({
            user:{
                username: user.username,
                email: user.email,
                id: user.id,
            },
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "15m"}
    )
        res.status(200).json({ accessToken })
    } else {
        res.status(401);
        throw new Error("Invalid email or password")
    }
})

//@desc current user
//route get /api/user/current
//@access private
const currentUser = asyncHandler(async (req, res) => {
    res.json(req.user);
})

module.exports = {registerUser, loginUser, currentUser}