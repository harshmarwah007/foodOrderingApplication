/** @format */

const FoodDishes = require("../models/FoodDishes");
const FoodOrders = require("../models/FoodOrders");
var ObjectId = require("mongoose").Types.ObjectId;
var redis = require("redis");
var client = redis.createClient();
client.connect();

var recommendationData = {
  "6243fb6f390c2b0f9e786c11": ["6244001b390c2b0f9e786c4d"], //momos
  "6243fc61390c2b0f9e786c20": ["6244001b390c2b0f9e786c4d"],
  "6243fc3b390c2b0f9e786c1b": ["6244001b390c2b0f9e786c4d"],
  "6243fbec390c2b0f9e786c16": ["624400a2390c2b0f9e786c5c"],
  "6243fcde390c2b0f9e786c25": ["6243fd98390c2b0f9e786c34"], //hakka
  "6243fd09390c2b0f9e786c2a": ["6243fdea390c2b0f9e786c3e"], //chick nood
  "6243fd2f390c2b0f9e786c2f": ["6243fdd2390c2b0f9e786c39"], //egg nood
  "6243fe0a390c2b0f9e786c43": ["62440032390c2b0f9e786c52"], //chillipotato
  "624400a2390c2b0f9e786c5c": ["62440570390c2b0f9e786cac"], //non veg momo platter
  "62440085390c2b0f9e786c57": ["62440570390c2b0f9e786cac"], //combo
  "624400b7390c2b0f9e786c61": ["62440570390c2b0f9e786cac"], //combo
  "62440104390c2b0f9e786c6b": ["62440570390c2b0f9e786cac"], //combo
  "62440155390c2b0f9e786c70": ["62454b67279e492c98bcb191"], //Chicken & Egg Burger
  "62440202390c2b0f9e786c75": ["62454b67279e492c98bcb191"], //"Veg & Cheese Burger"
  "62440219390c2b0f9e786c7a": ["62454b67279e492c98bcb191"], //"Chicken Burger"
  "62440298390c2b0f9e786c7f": ["62440320390c2b0f9e786c8e"], //Veg Pizza"
  "624402d4390c2b0f9e786c84": ["62440219390c2b0f9e786c7a"], //"Chicken & Egg Pizza"
  "62440320390c2b0f9e786c8e": ["62440300390c2b0f9e786c89"], //"Indi Tandoor Pizza"
  "62440300390c2b0f9e786c89": ["62440298390c2b0f9e786c7f"], //"Double Cheese Pizza"
  "62440570390c2b0f9e786cac": ["62440585390c2b0f9e786cb1"], //bira beer
  "62440585390c2b0f9e786cb1": ["62440570390c2b0f9e786cac"], //"RS Beer"
  "624403f7390c2b0f9e786ca2": ["62440413390c2b0f9e786ca7"], //mineral water
  "624405a6390c2b0f9e786cb6": ["62440570390c2b0f9e786cac"], //breezer
  "624403c6390c2b0f9e786c98": ["624405a6390c2b0f9e786cb6"], //coke
  "6243fd98390c2b0f9e786c34": ["6243fcde390c2b0f9e786c25"], // veg manchurian
  "6243fdea390c2b0f9e786c3e": ["6243fd09390c2b0f9e786c2a"], //chick manchu
  "6243fdd2390c2b0f9e786c39": ["6243fd2f390c2b0f9e786c2f"], //egg manchu
};
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
          res.json({ dishes, recommendationData });
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
