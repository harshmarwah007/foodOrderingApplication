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
  dishList: {
    type: Array,
    require: true,
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
