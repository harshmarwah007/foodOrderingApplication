/** @format */

const FoodDishes = require("../models/FoodDishes");
const FoodOrders = require("../models/FoodOrders");
var ObjectId = require("mongoose").Types.ObjectId;
// var cart = [];
var recommendAllDrinks = function (cart, result) {
  var drinkRecommendation = addDrinkAsPerTime(cart, result);

  if (drinkRecommendation) {
    result.push({ _id: drinkRecommendation });
  }
  if (result.length < 3) {
    var mineralWaterRecommendation = addMineralWater(cart, result);
    if (mineralWaterRecommendation) {
      result.push({ _id: mineralWaterRecommendation });
    }
  }
};
var pushItemIntoRecommendation = function (dishID, cart, recommendation) {
  var alreadyIncluded = cart.find(function (item) {
    return item == dishID;
  });
  var alreadyIncludedInrecommendation = recommendation.find(function (item) {
    return item._id == ObjectId(dishID);
  });

  if (!alreadyIncluded && !alreadyIncludedInrecommendation) {
    return dishID;
  }
};
var addMineralWater = function (cart, recommendation) {
  return pushItemIntoRecommendation(
    "624403f7390c2b0f9e786ca2",
    cart,
    recommendation
  );
};
var addDrinkAsPerTime = function (cart, recommendation) {
  //   var currentTimeHour = new Date().getHours();
  var currentTimeHour = new Date().getHours();
  if (currentTimeHour <= 12 && currentTimeHour >= 8) {
    return pushItemIntoRecommendation(
      "62454b90279e492c98bcb192",
      cart,
      recommendation
    );
  } else if (currentTimeHour <= 17) {
    return pushItemIntoRecommendation(
      "624403c6390c2b0f9e786c98",
      cart,
      recommendation
    );
  } else {
    return pushItemIntoRecommendation(
      "62440570390c2b0f9e786cac",
      cart,
      recommendation
    );
  }
};

var getFoodDishes = function (dataArray) {
  return FoodDishes.find({ _id: dataArray });
};

var getRecommendations = function (req, res) {
  var lastDate = new Date();
  lastDate.setMonth(lastDate.getMonth() - 3);
  console.log(lastDate);
  console.log(req.query.cart);
  var cart = JSON.parse(req.query.cart);
  var arrayLength = cart.length;

  FoodOrders.aggregate([
    {
      $match: {
        date: { $gt: lastDate },
        $expr: { $setIsSubset: [cart, "$dishList.id"] },
      },
    },
    { $unwind: "$dishList" },
    { $group: { _id: "$dishList.id", count: { $sum: 1 } } },
    { $sort: { count: -1, _id: 1 } },
    // { $sort: { count: -1, _id: 1 } },
    { $skip: arrayLength },
    { $limit: 3 },
  ]).then(function (result) {
    recommendAllDrinks(cart, result);
    var dishIdsArray = result.map(function (item) {
      return item._id;
    });
    var finalResult = dishIdsArray.filter(function (val) {
      return !cart.includes(val);
    });
    var dishIds = [...new Set(finalResult)].slice(0, 4);
    getFoodDishes(dishIds).then(function (recommendationDishes) {
      res.json(recommendationDishes);
    });
  });
};

module.exports = { getRecommendations };

// FoodOrders.aggregate([
//   { $unwind: "$dishList" },
//   { $group: { _id: "$_id", dishes: { $push: "$dishList.id" } } },
//   {
//     $match: {
//       $expr: { $setIsSubset: [cart, "$dishes"] },
//     },
//   },
//   {
//     $group: { _id: null, dishes: { $push: "$dishes" } },
//   },
//   {
//     $project: {
//       allDishes: {
//         $reduce: {
//           input: "$dishes",
//           initialValue: [],
//           in: { $concatArrays: ["$$value", "$$this"] },
//         },
//       },
//     },
//   },
//   { $unwind: "$allDishes" },
//   { $group: { _id: "$allDishes", count: { $sum: 1 } } },
//   { $sort: { count: -1, _id: 1 } },
//   { $skip: arrayLength },
//   { $limit: 3 },
// ])
