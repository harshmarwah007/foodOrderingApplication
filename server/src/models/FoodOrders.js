
const mongoose = require("mongoose");
const foodOrdersSchema = mongoose.Schema({
   
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"users"
    },
    date:{
        type:Date,
        default:Date.now
    },
    orderStatus:{
        type:String,
        default:"Order Being Prepared"
    },
    orderAmount:{
        type:Number,
        require:true
    },
    dishList:{
        type:Array,
        require:true
    }
})
module.exports = mongoose.model("foodOrders",foodOrdersSchema);

