const mongoose = require("mongoose");

const flightSchema = new mongoose.Schema({
    
    flightName:{
        type:String,
    },
    from:{
        type:String,
    },
    to:{
        type:String,
    }, 
     date:{
        type:String,
    },
      price:{
        type:Number,
    },
    seats:{
        type:Number,
        default:60
    },
    booked:{
        type:Boolean,
        default:false
    }
    

})


const Flight = new mongoose.model("flight",flightSchema)

module.exports = Flight