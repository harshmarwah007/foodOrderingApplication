/** @format */

const mongoose = require("mongoose");

const catergoriesSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
  },
  name: {
    type: String,
    required: true,
  },
});
module.exports = mongoose.model("foodcategories", catergoriesSchema);
