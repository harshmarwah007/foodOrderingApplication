/** @format */

var foodOrders = require("../models/FoodOrders");

var getHistory = function (req, res) {
  foodOrders
    .find({ userId: req.user._id, orderStatus: "Completed" })
    .then(function (response) {
      res.json(response);
    });
};

module.exports = getHistory;
