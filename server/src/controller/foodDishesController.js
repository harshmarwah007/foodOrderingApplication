/** @format */

const FoodDishes = require("../models/FoodDishes");
var redis = require("redis");
var client = redis.createClient();
client.connect();
const getFoodDishes = async (req, res) => {
  // const dishes = await FoodDishes.find();

  // FoodDishes.find()
  //   .populate("category")
  FoodDishes.aggregate([
    {
      $lookup: {
        from: "foodcategories",
        localField: "category",
        foreignField: "_id",
        as: "category",
      },
    },
    {
      $group: {
        _id: "$category.name",
        dishes: {
          $push: {
            id: "$_id",
            name: "$name",
            price: "$price",
            alias: "$alias",
            tag: "$tag",
            tax: "$tax",
          },
        },
      },
    },
    {
      $project: {
        _id: 0,
        category: { $arrayElemAt: ["$_id", 0] },

        dishes: "$dishes",
      },
    },
  ]).then(function (dishes) {
    client
      .setEx("foodDishesData", 3600, JSON.stringify(dishes))
      .then((result) => console.log("saved"))
      .then(function () {
        res.json(dishes);
      });
  });
};

const putFoodDishes = async (req, res) => {
  const { name, price, category, tag, alias, tax } = req.body;
  const dish = new FoodDishes({
    name: name,
    price: price,
    category: category,
    tag: tag,
    alias: alias,
    tax: tax,
  });
  const savedDish = await dish.save();
  res.json({ message: "dishes saved", savedDish });
};

module.exports = { getFoodDishes, putFoodDishes };
