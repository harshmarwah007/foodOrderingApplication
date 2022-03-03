/** @format */

var foodOrders = require("../models/FoodOrders");

var getHistory = function (req, res) {
  var size = 6;
  var pageNo = req.params.pageNo;
  var skip = size * (pageNo - 1);
  foodOrders
    .find({ userId: req.user._id, orderStatus: "Completed" })
    .sort({ date: -1 })
    .skip(skip)
    .limit(size)
    .then(function (orders) {
      foodOrders
        .count({ userId: req.user._id, orderStatus: "Completed" })
        .then((count) => {
          res.json({ orders, count });
        });
    });
};

module.exports = getHistory;
