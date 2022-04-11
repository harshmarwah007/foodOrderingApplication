/** @format */

const FoodDishes = require("../models/FoodDishes");
const FoodOrders = require("../models/FoodOrders");
var ObjectId = require("mongoose").Types.ObjectId;
var redis = require("redis");
var client = redis.createClient();
client.connect();

const getFoodDishes = async (req, res) => {
  FoodDishes.aggregate([
    {
      $group: {
        _id: { category: "$category.name", subCategory: "$subCategory.name" },

        dishes: {
          $push: {
            id: "$_id",
            name: "$name",
            price: "$price",
            alias: "$alias",
            tag: "$tag",
            tax: "$tax",
            recommendation: "$recommendation",
            category: "$category",
            subCategory: "$subCategory",
          },
        },
      },
    },
    {
      $group: {
        _id: "$_id.category",
        subCategory: {
          $push: { name: "$_id.subCategory", dishes: "$dishes" },
        },
      },
    },
    {
      $project: {
        _id: 0,
        category: "$_id",
        subCategory: "$subCategory",
      },
    },
  ])
    // FoodDishes.aggregate([
    //   {
    //     $project: {
    //       id: 1,
    //       name: 1,
    //     },
    //   },
    // ])
    .then(function (dishes) {
      client
        .setEx("foodDishesData", 3600, JSON.stringify(dishes))
        .then((result) => console.log("saved"))
        .then(function () {
          res.json({ dishes });
        });
    });
};

// async function justRun() {
//   await FoodDishes.updateMany({}, { $unset: { recommendation: "" } });
// }
// justRun();

const putFoodDishes = async (req, res) => {
  const {
    name,
    price,
    category,
    tag,
    alias,
    tax,
    subCategory,
    recommendation,
  } = req.body;
  const dish = new FoodDishes({
    name: name,
    price: price,
    category: category,
    tag: tag,
    alias: alias,
    tax: tax,
    subCategory: subCategory,
    recommendation: recommendation,
  });
  const savedDish = await dish.save();
  res.json({ message: "dishes saved", savedDish });
};

module.exports = { getFoodDishes, putFoodDishes };
