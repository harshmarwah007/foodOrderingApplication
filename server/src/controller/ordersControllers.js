/** @format */

const foodOrders = require("../models/FoodOrders");
const orderTable = require("../models/OrderTable");
var ObjectId = require("mongoose").Types.ObjectId;
// functions for controllers
const cleanTable = async function (id, cleanThisTable) {
  const tableCleaned = await orderTable.updateOne(
    { userId: id, tableNumber: cleanThisTable },
    { orderId: null, occupied: false }
  );
  return tableCleaned;
};
const updateTable = async function (id, updateThisTable, orderId) {
  const updatedTable = await orderTable.updateOne(
    {
      userId: id,
      tableNumber: updateThisTable,
    },
    { orderId: orderId, occupied: true }
  );
};
const swapTable = async function (id, previousTableNumber, newTableNumber) {
  const previousTable = await orderTable.find({
    userId: id,
    tableNumber: previousTableNumber,
  });
  const newTable = await orderTable.find({
    userId: id,
    tableNumber: newTableNumber,
  });
  const updatedPreviousOrder = await foodOrders.updateOne(
    { userId: id, _id: newTable[0].orderId },
    { orderTableNumber: previousTableNumber }
  );

  const updatePreviousTable = await orderTable.updateOne(
    { userId: id, tableNumber: previousTableNumber },
    { orderId: newTable[0].orderId }
  );
  const updateNewTable = await orderTable.updateOne(
    {
      userId: id,
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
  const order = new foodOrders({
    tax: { totalTax: req.body.totalTax, taxes: req.body.taxes },
    totalAmount: req.body.totalAmount,
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
      { userId: req.user._id, tableNumber: req.body.orderTableNumber },
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
      await cleanTable(req.user._id, req.body.order.orderTableNumber);
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

  res.json(null);
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
      //! id update
      await cleanTable(req.user._id, previousTableNumber);
      res.json(updatedOrder);
    } else {
      const emptyTables = await orderTable.find({
        userId: req.user._id,
        occupied: false,
      });
      const emptyTablesArray = emptyTables.map(function (item) {
        return item.tableNumber;
      });
      if (emptyTablesArray.includes(String(newTableNumber))) {
        const updatedOrder = await updateOrder();

        await updateTable(req.user._id, newTableNumber, req.params.orderId);
        await cleanTable(req.user._id, previousTableNumber);

        res.json(updatedOrder);
      } else {
        const updatedOrder = await updateOrder();

        var result = await swapTable(
          req.user._id,
          previousTableNumber,
          newTableNumber
        );

        res.json(updatedOrder);
      }
    }
  } catch (error) {
    res.json({ message: error });
  }
};

var updateBulkOrder = function (req, res) {
  var { bulkEditOrdersIds, selectedStatus } = req.body;
  try {
    var bulk = foodOrders.collection.initializeUnorderedBulkOp();
    var newBulkEditOrdersIds = bulkEditOrdersIds.map((item) => {
      return ObjectId(item);
    });

    bulk
      .find({ userId: req.user._id, _id: { $in: newBulkEditOrdersIds } })
      .update({ $set: { orderStatus: selectedStatus } });

    bulk.execute(function (err, result) {
      return res.json({ code: 200, result: result });
    });
  } catch (e) {
    console.log(e, "error in bulk file");
    return res.json({ code: 400, result: e });
  }

  console.log(req.body);
  // var { bulkEditOrdersIds, selectedStatus } = req.body;
};

module.exports = {
  updateBulkOrder,
  getOrders,
  saveOrder,
  getAllOrders,
  updateOrderStatus,
  updateOrder,
  getDineInOrders,
};
