/** @format */

const foodOrders = require("../models/FoodOrders");
const orderTable = require("../models/OrderTable");

// functions for controllers
const cleanTable = async function (cleanThisTable) {
  const tableCleaned = await orderTable.updateOne(
    { tableNumber: cleanThisTable },
    { orderId: null, occupied: false }
  );
  return tableCleaned;
};
const updateTable = async function (updateThisTable, orderId) {
  const updatedTable = await orderTable.updateOne(
    {
      tableNumber: updateThisTable,
    },
    { orderId: orderId, occupied: true }
  );
};
const swapTable = async function (previousTableNumber, newTableNumber) {
  const previousTable = await orderTable.find({
    tableNumber: previousTableNumber,
  });
  const newTable = await orderTable.find({ tableNumber: newTableNumber });
  const updatedPreviousOrder = await foodOrders.updateOne(
    { _id: newTable[0].orderId },
    { orderTableNumber: previousTableNumber }
  );

  // console.log("previousTable", previousTable);
  // console.log("newTable", newTable);
  // console.log("newTable.orderId", newTable[0].orderId);

  const updatePreviousTable = await orderTable.updateOne(
    { tableNumber: previousTableNumber },
    { orderId: newTable[0].orderId }
  );
  const updateNewTable = await orderTable.updateOne(
    {
      tableNumber: newTableNumber,
    },
    { orderId: previousTable[0].orderId }
  );

  return {
    previousTable: updatePreviousTable,
    newTable: updateNewTable,
    updatedPreviousOrder: updatedPreviousOrder,
  };
};

// controllers
// for root user
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
  var size = 8;
  var pageNo = req.params.pageNo;
  var skip = size * (pageNo - 1);

  try {
    foodOrders
      .find({
        userId: req.user._id,
        orderStatus: { $ne: "Completed" },
        orderType: { $ne: "dineIn" },
      })
      .sort({ date: -1 })
      .skip(skip)
      .limit(size)
      .then((orders) => {
        foodOrders
          .count({
            userId: req.user._id,
            orderStatus: { $ne: "Completed" },
            orderType: { $ne: "dineIn" },
          })
          .then((count) => {
            res.json({ orders, count });
          });
      });
  } catch (error) {
    res.json({ message: error });
  }
};

const getDineInOrders = function (req, res) {
  try {
    foodOrders
      .find({
        userId: req.user._id,
        orderStatus: { $ne: "Completed" },
        orderType: "dineIn",
      })
      .sort({ date: -1 })
      .then((dineInOrders) => {
        res.json(dineInOrders);
      });
  } catch (error) {
    res.json({ message: error });
  }
};

// for saving one order
const saveOrder = async (req, res) => {
  console.log(req.body);
  const order = new foodOrders({
    userId: req.user._id,
    orderStatus: req.body.orderStatus,
    orderAmount: req.body.orderAmount,
    dishList: req.body.dishList,
    customerContact: req.body.customerContact,
    customerName: req.body.customerName,
    orderTableNumber: req.body.orderTableNumber,
    orderType: req.body.orderType,
  });

  try {
    const savedOrder = await order.save();
    if (req.body.orderTableNumber) {
    }
    const updateTable = await orderTable.updateOne(
      { tableNumber: req.body.orderTableNumber },
      {
        occupied: true,
        orderId: savedOrder._id,
      }
    );
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
    if (
      req.body.orderStatus == "Completed" &&
      req.body.order.orderType == "dineIn"
    ) {
      await cleanTable(req.body.order.orderTableNumber);
    }
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
  var updatedOrder = req.body.updatedOrder;
  var newTableNumber = updatedOrder.orderTableNumber;
  var previousTableNumber = req.body.previousTableNumber;

  const updateOrder = async function () {
    const updatedOrder = await foodOrders.updateOne(
      { _id: req.params.orderId },
      req.body.updatedOrder
    );
    return updateOrder;
  };
  try {
    if (updatedOrder.orderType == "takeAway") {
      const updatedOrder = await updateOrder();
      await cleanTable(previousTableNumber);
      res.json(updatedOrder);
    } else {
      const emptyTables = await orderTable.find({ occupied: false });
      const emptyTablesArray = emptyTables.map(function (item) {
        return item.tableNumber;
      });
      if (emptyTablesArray.includes(String(newTableNumber))) {
        const updatedOrder = await updateOrder();
        await updateTable(newTableNumber, req.params.orderId);
        await cleanTable(previousTableNumber);
        console.log("exist");
        res.json(updatedOrder);
      } else {
        console.log("not in empty tables");
        const updatedOrder = await updateOrder();

        var result = await swapTable(previousTableNumber, newTableNumber);
        console.log(result);
        res.json(updatedOrder);
      }
    }
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
  getDineInOrders,
};
