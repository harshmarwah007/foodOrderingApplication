
const mongoose = require("mongoose");


const foodDishesSchema = mongoose.Schema({
    dishId:{
        type :mongoose.Schema.Types.ObjectId,
        index:true
    },
    name:{
        type:String,
        required:true,
    },
    price:{
        type: Number,
        required:true,
    }
})

module.exports = mongoose.model("foodDishes",foodDishesSchema);