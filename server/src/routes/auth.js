/** @format */

const express = require("express");
const router = express.Router();
const { login, register } = require("../controller/authController");
const categories = require("../models/Categories");


// users
router.post("/register", register);
router.post("/login", login);

// Categories
router.post("/categories", async function (req, res)
{
    
  const category = new categories({
    userId: req.body.userId,
    name: req.body.name,
  });
  const postedCategory = await category.save();
  res.json(postedCategory);
});
router.get("/categories", async function (req, res) {
  const categoriesData = await categories.find();
  res.json(categoriesData);
});

module.exports = router;
