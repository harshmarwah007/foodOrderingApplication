/** @format */

const foodOrders = require("../models/FoodOrders");

// For Root User

const getAllOrders = async (req, res) => {
  try {
    const orders = await foodOrders.find();
    res.json({
      orders,
      user: {
        id: req.user._id,
        email: req.user.email,
      },
    });
  } catch (error) {
    res.json({ message: error });
  }
};

//For single User

const getOrders = async (req, res) => {
  var size = 6;
  var pageNo = req.params.pageNo;
  var skip = size * (pageNo - 1);

  try {
    foodOrders
      .find({ userId: req.user._id, orderStatus: { $ne: "Completed" } })
      .sort({ date: -1 })
      .skip(skip)
      .limit(size)
      .then((orders) => {
        foodOrders
          .count({ userId: req.user._id, orderStatus: { $ne: "Completed" } })
          .then((count) => {
            res.json({ orders, count });
          });
      });
  } catch (error) {
    res.json({ message: error });
  }
};

// for saving one order
const saveOrder = async (req, res) => {
  const order = new foodOrders({
    userId: req.user._id,
    orderStatus: req.body.orderStatus,
    orderAmount: req.body.orderAmount,
    dishList: req.body.dishList,
    customerContact: req.body.customerContact,
    customerName: req.body.customerName,
  });

  try {
    const savedOrder = await order.save();
    res.json({
      savedOrder,
      user: {
        id: req.user._id,
        email: req.user.email,
      },
    });
  } catch (error) {
    res.json({ message: error });
  }
};

// Update Order
const updateOrderStatus = async (req, res) => {
  try {
    const updatedOrder = await foodOrders.updateOne(
      { _id: req.params.orderId },
      { orderStatus: req.body.orderStatus }
    );
    socketData(req.params.orderId, req.body.orderStatus);
    res.json(updatedOrder);
  } catch (error) {
    res.json({ message: error });
  }
};

const updateOrder = async (req, res) => {
  try {
    const updatedOrder = await foodOrders.updateOne(
      { _id: req.params.orderId },
      req.body.updatedOrder
    );
    res.json(updatedOrder);
  } catch (error) {
    res.json({ message: error });
  }
};
module.exports = {
  getOrders,
  saveOrder,
  getAllOrders,
  updateOrderStatus,
  updateOrder,
};
