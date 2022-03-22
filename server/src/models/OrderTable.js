/** @format */

const mongoose = require("mongoose");

const orderTableSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
  },
  tableNumber: {
    type: Number,
    required: true,
  },
  occupied: {
    type: Boolean,
    default: false,
  },
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "foodOrders",
    default: null,
  },
});

module.exports = mongoose.model("orderTable", orderTableSchema);
