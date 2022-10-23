const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    
    email:{
        type:String,
    },
    password:{
        type:String,
        minlength:[6,'Password should be of atleast 6 cahracters']
    },
    confirmPassword:{
        type:String,
    },
    name:{
        type:String
    }

})


const User = new mongoose.model("User",userSchema)

module.exports = User