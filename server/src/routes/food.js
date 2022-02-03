const express = require("express")
const router = express.Router();
const {getFoodDishes,putFoodDishes} = require("../controller/foodDishesController")
const passport = require("passport")
//Passport config
require("../config/passport")
const getAllMetrics = require("../controller/metricsController");
const {getOrders,saveOrder,getAllOrders,updateOrder} = require("../controller/ordersControllers")
// Food Orders Routes
router.get("/orders",passport.authenticate('jwt', { session: false }),getAllOrders)
router.post("/order",passport.authenticate('jwt', { session: false }),saveOrder)
router.get("/order",passport.authenticate('jwt', { session: false }),getOrders)
router.patch("/order/:orderId",passport.authenticate("jwt",{session:false}),updateOrder)


//Food Dishes Routers
router.get("/dishes",getFoodDishes)
router.post("/dishes",putFoodDishes)

//Metrics route 
router.get("/metrics",getAllMetrics)

module.exports = router

