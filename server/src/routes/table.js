/** @format */

const express = require("express");
const router = express.Router();
const {
  getOrderTable,
  createOrderTable,
  updateOrderTable,
} = require("../controller/orderTableController");
const passport = require("passport");
require("../config/passport");

router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  getOrderTable
);
router.post("/", createOrderTable);
router.patch("/", updateOrderTable);
module.exports = router;
