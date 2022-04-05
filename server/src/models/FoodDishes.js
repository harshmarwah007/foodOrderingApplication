/** @format */

const mongoose = require("mongoose");

const foodDishesSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  category: {
    id: { type: mongoose.Schema.Types.ObjectId },
    name: { type: String },
  },
  subCategory: {
    id: { type: mongoose.Schema.Types.ObjectId },
    name: { type: String },
  },
  tag: {
    type: String,
    required: true,
  },
  alias: {
    type: String,
  },
  tax: [
    {
      name: { type: String },
      applicable: { type: Boolean },
      value: { type: Number },
    },
  ],
});

module.exports = mongoose.model("foodDishes", foodDishesSchema);
