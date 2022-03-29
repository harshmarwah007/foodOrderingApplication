/** @format */

const mongoose = require("mongoose");
const foodOrdersSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
  },
  date: {
    type: Date,
    default: Date.now,
  },
  orderStatus: {
    type: String,
    default: "Preparing",
  },
  orderAmount: {
    type: Number,
    require: true,
  },
  tax: {
    totalTax: { type: Number },
    taxes: { type: Array },
  },
  totalAmount: {
    type: Number,
    require: true,
  },
  dishList: {
    type: Array,
    require: true,
  },
  orderType: {
    type: String,
    require: true,
    default: "take away",
  },
  orderTableNumber: {
    type: String,
    default: null,
  },
  customerName: {
    type: String,
    require: true,
  },
  customerContact: {
    type: String,
    require: true,
  },
});

module.exports = mongoose.model("foodOrders", foodOrdersSchema);
