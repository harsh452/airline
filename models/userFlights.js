const mongoose = require("mongoose");

const userFlightsSchema = new mongoose.Schema({
    
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
        type:String
    },
    seats:{
        type:Number,
    },
    email:{
        type:String
    }

})


const UserFlights = new mongoose.model("UserFlight",userFlightsSchema)

module.exports = UserFlights