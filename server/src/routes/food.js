/** @format */

const express = require("express");
const router = express.Router();
const {
  getFoodDishes,
  putFoodDishes,
} = require("../controller/foodDishesController");
const getHistory = require("../controller/historyControllers");
const passport = require("passport");
var redisMiddle = require("../controller/redisMiddleware");
//Passport config
require("../config/passport");
const getAllMetrics = require("../controller/metricsController");
const {
  getOrders,
  saveOrder,
  getAllOrders,
  updateOrderStatus,
  updateOrder,
} = require("../controller/ordersControllers");
// Food Orders Routes
router.get(
  "/orders",
  passport.authenticate("jwt", { session: false }),
  getAllOrders
);
router.post(
  "/order",
  passport.authenticate("jwt", { session: false }),
  saveOrder
);
router.get(
  "/order/:pageNo",
  passport.authenticate("jwt", { session: false }),
  getOrders
);
router.patch(
  "/orderStatus/:orderId",
  passport.authenticate("jwt", { session: false }),
  updateOrderStatus
);
router.patch(
  "/order/:orderId",
  passport.authenticate("jwt", { session: false }),
  updateOrder
);
router.get(
  "/history/:pageNo",
  passport.authenticate("jwt", { session: false }),
  getHistory
);

//Food Dishes Routers

var redis = require("redis");
var client = redis.createClient();
client.connect();
router.get("/dishes", redisMiddle("foodDishesData"), getFoodDishes);
router.post("/dishes", putFoodDishes);

//Metrics route
router.get(
  "/metrics",
  passport.authenticate("jwt", { session: false }),
  getAllMetrics
);

module.exports = router;
