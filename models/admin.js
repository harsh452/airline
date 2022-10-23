const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
    
    email:{
        type:String,
        unique:true,
        required:[true,'Email is required']
    },
    password:{
        type:String,
        required:[true,'Password is required'] ,
        minlength:[6,'Password should be of atleast 6 cahracters']
    }

})


const Admin = new mongoose.model("admin",adminSchema)

module.exports = Admin