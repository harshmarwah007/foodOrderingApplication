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
    type: mongoose.Schema.Types.ObjectId,
    ref: "foodcategories",
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
