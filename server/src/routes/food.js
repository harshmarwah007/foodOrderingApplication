const express = require("express")
const router = express.Router();
const {getFoodDishes,putFoodDishes} = require("../controller/foodDishesController")
const passport = require("passport")
//Passport config
require("../config/passport")

const {getOrders,saveOrder,getAllOrders} = require("../controller/ordersControllers")
// Food Orders Routes
router.get("/orders",passport.authenticate('jwt', { session: false }),getAllOrders)
router.post("/order",passport.authenticate('jwt', { session: false }),saveOrder)
router.get("/order",passport.authenticate('jwt', { session: false }),getOrders)



//Food Dishes Routers
router.get("/dishes",getFoodDishes)
router.post("/dishes",putFoodDishes)
module.exports = router