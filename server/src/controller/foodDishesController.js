/** @format */

const FoodDishes = require("../models/FoodDishes");
var redis = require("redis");
var client = redis.createClient();
client.connect();
const getFoodDishes = async (req, res) => {
  // const dishes = await FoodDishes.find();

  FoodDishes.find().then(function (dishes) {
    client
      .setEx("foodDishesData", 3600, JSON.stringify(dishes))
      .then((result) => console.log("saved"))
      .then(function () {
        res.json(dishes);
      });
  });
};

const putFoodDishes = async (req, res) => {
  const { name, price } = req.body;
  const dish = new FoodDishes({
    name: name,
    price: price,
  });
  const savedDish = await dish.save();
  res.json({ message: "dishes saved", savedDish });
};

module.exports = { getFoodDishes, putFoodDishes };
