const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    username:{
        type: String,
        required: [true, "please add the user name"],
    },
    email:{
        type: String,
        required: [true, "please add the user email"],
        unique: [true, "email address already exist"],
    },
    password:{
        type: String,
        required: [true, "please add the user password"],
    },
    
},{
    Timestamp: true,
})

module.exports = mongoose.model("user", userSchema);