/** @format */
const orderTable = require("../models/OrderTable");
const getOrderTable = function (req, res) {
  orderTable
    .find({ userId: req.user._id })
    .sort({ tableNumber: 1 })
    .then(function (orderTableData) {
      orderTable.count().then(function (count) {
        res.json({ tablesData: orderTableData, count: count });
      });
    });
};
const createOrderTable = function (req, res) {
  const newTable = new orderTable({
    userId: req.body.userId,
    tableNumber: req.body.tableNumber,
    occupied: req.body.occupied,
    orderId: req.body.orderId,
  });
  newTable.save().then(function (response) {
    res.json(response);
  });
};
const updateOrderTable = function (req, res) {
  orderTable.updateOne({ tableNumber: req.body.tableNumber }, {});
};

module.exports = { getOrderTable, createOrderTable, updateOrderTable };
