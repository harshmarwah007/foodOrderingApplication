const  mongoose  = require("mongoose");

const usersSchema = mongoose.Schema({
    name: {
        type:String,
        required:true,
    },
    email:{
        type: String,
        required:true,
    },
    password:{
        type:String,
        required:true,
        min:4,
        max:255
    },
    phone:{
        type:Number,
        min:1000000000,
        max:9999999999
    },
    date:{
        type:Date,
        defailt:Date.now
    }
})

module.exports = mongoose.model("users",usersSchema);