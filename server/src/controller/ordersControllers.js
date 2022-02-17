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
  try {
    foodOrders
      .find({ userId: req.user._id, orderStatus: { $ne: "Completed" } })
      .then((orders) => {
        res.json(orders);
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
const updateOrder = async (req, res) => {
  try {
    const updatedOrder = await foodOrders.updateOne(
      { _id: req.params.orderId },
      { orderStatus: req.body.orderStatus }
    );
    res.json(updatedOrder);
  } catch (error) {
    res.json({ message: error });
  }
};

module.exports = { getOrders, saveOrder, getAllOrders, updateOrder };
