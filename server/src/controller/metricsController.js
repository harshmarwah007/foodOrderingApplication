/** @format */

const foodOrders = require("../models/FoodOrders");

const getAllMetrics = async (req, res) => {
  var currentMonth = new Date().getMonth();
  console.log(currentMonth);

  var allMetrics = await foodOrders.aggregate([
    {
      $match: { orderStatus: "Completed" },
    },
    {
      $facet: {
        topSelling: [
          { $unwind: "$dishList" },
          { $group: { _id: "$dishList.name", qty: { $sum: "$dishList.qty" } } },
          { $sort: { qty: -1 } },
          { $limit: 1 },
          {
            $project: {
              _id: 0,
              metricsType: "Top Selling Food Dish",
              value: "$_id",
            },
          },
        ],
        leastSelling: [
          { $unwind: "$dishList" },
          { $group: { _id: "$dishList.name", qty: { $sum: "$dishList.qty" } } },
          { $sort: { qty: 1 } },
          { $limit: 1 },
          {
            $project: {
              _id: 0,
              metricsType: "Least Selling Food Dish",
              value: "$_id",
            },
          },
        ],
        numberOfCustomers: [
          { $group: { _id: "$customerName", count: { $sum: 1 } } },
          { $count: "numberOfCustomers" },

          {
            $project: {
              metricsType: "Total Number Of Customers",
              value: "$numberOfCustomers",
            },
          },
        ],
        mostVisitingCustomer: [
          { $group: { _id: "$customerName", count: { $sum: 1 } } },
          { $sort: { count: -1 } },
          { $limit: 1 },
          {
            $project: {
              _id: 0,
              metricsType: "Most Visiting Customer",
              value: "$_id",
            },
          },
        ],

        customersVisitedOnlyOnce: [
          { $group: { _id: "$customerName", count: { $sum: 1 } } },
          { $match: { count: 1 } },
          { $group: { _id: null, customers: { $push: "$_id" } } },
          {
            $project: {
              _id: 0,
              metricsType: "customersVisitedOnlyOnce",
              value: "$customers",
            },
          },
        ],
        totalSale: [
          {
            $group: { _id: null, total: { $sum: "$orderAmount" } },
          },
          {
            $project: {
              _id: 0,
              metricsType: "Total Sale",
              value: "$total",
            },
          },
        ],
        saleOfThisMonth: [
          {
            $match: {
              $expr: {
                $eq: [
                  { $dateToString: { format: "%m", date: "$date" } },
                  { $dateToString: { format: "%m", date: new Date() } },
                ],
              },
            },
          },
          {
            $group: { _id: null, total: { $sum: "$orderAmount" } },
          },
          {
            $project: {
              _id: 0,
              metricsType: "Total Sale of This Month",
              value: "$total",
            },
          },
        ],
        topCustomer: [
          {
            $group: {
              _id: "$customerName",
              count: { $sum: 1 },
              orderSum: { $sum: "$orderAmount" },
            },
          },
        ],
      },
    },
  ]);

  res.json(allMetrics);
};

module.exports = getAllMetrics;
