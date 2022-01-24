const FoodDishes = require("../models/FoodDishes");


const getFoodDishes = async(req,res)=>{

const dishes = await FoodDishes.find();
res.json({dishes})
}

const putFoodDishes = async(req,res)=>{
    const {name,price} = req.body;
    const dish = new FoodDishes({
        name:name,
        price:price,
    })
    const savedDish = await dish.save();
 res.json({message:"dishes saved",savedDish})
}

module.exports = {getFoodDishes,putFoodDishes}

