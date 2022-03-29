/** @format */

const foodOrders = require("../models/FoodOrders");
const foodDishes = require("../models/FoodDishes");
const getAllMetrics = async (req, res) => {
  // var currentMonth = new Date().getMonth();

  var allMetrics = await foodOrders.aggregate([
    {
      $match: { orderStatus: "Completed", userId: req.user._id },
    },
    {
      $facet: {
        topSelling: [
          { $unwind: "$dishList" },
          {
            $match: {
              "dishList.tag": { $nin: ["alcohol", "nonAlcohol"] },
            },
          },
          {
            $group: {
              _id: "$dishList.name",
              qty: { $sum: "$dishList.qty" },
            },
          },
          { $sort: { qty: -1, _id: 1 } },
          { $limit: 1 },
          {
            $project: {
              _id: 0,
              metricsType: "Top Selling - Food Dish",
              value: "$_id",
              qty: 1,
            },
          },
        ],
        leastSelling: [
          { $unwind: "$dishList" },
          {
            $match: {
              "dishList.tag": { $nin: ["alcohol", "nonAlcohol"] },
            },
          },
          {
            $group: {
              _id: "$dishList.name",
              qty: { $sum: "$dishList.qty" },
            },
          },
          { $sort: { qty: 1, _id: 1 } },
          { $limit: 1 },
          {
            $project: {
              _id: 0,
              metricsType: "Least Selling - Food Dish",
              value: "$_id",
              qty: 1,
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
              details: "(Highest number of visits)",
              value: "$_id",
              count: 1,
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
          { $sort: { orderSum: -1, count: -1 } },
          {
            $match: { count: { $gt: 1 } },
          },
          { $limit: 1 },
          {
            $project: {
              metricsType: "Top Customer",
              details: "(Highest total order amount and number of visits)",
              value: "$_id",
              _id: 0,
              orderSum: 1,
            },
          },
        ],
        happyDayOfThisMonth: [
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
            $group: {
              _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
              revenue: { $sum: "$orderAmount" },
            },
          },
          {
            $sort: {
              revenue: -1,
            },
          },
          {
            $limit: 1,
          },
          {
            $project: {
              metricsType: "Happy day of Current Month",
              details: "(Highest Sale Day of Month)",
              value: "$_id",
              _id: 0,
              revenue: 1,
            },
          },
        ],
        badDayOfThisMonth: [
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
            $group: {
              _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
              revenue: { $sum: "$orderAmount" },
            },
          },
          {
            $sort: {
              revenue: 1,
            },
          },
          {
            $limit: 1,
          },
          {
            $project: {
              metricsType: "Bad day of Current Month",
              details: "(Lowest Sale Day of Month)",
              value: "$_id",
              _id: 0,
              revenue: 1,
            },
          },
        ],
        customersVisitedOnlyOnce: [
          {
            $group: {
              _id: {
                customerName: "$customerName",
              },
              count: { $sum: 1 },
              customerDetails: {
                $push: {
                  customerName: "$customerName",
                  customerContact: "$customerContact",
                },
              },
            },
          },
          { $match: { count: 1 } },
          {
            $project: {
              metricsType: "customersVisitedOnlyOnce",
              customerDetails: 1,
              _id: 0,
            },
          },
        ],
      },
    },
  ]);
  var salesMetrics = await foodOrders.aggregate([
    {
      $match: { orderStatus: "Completed", userId: req.user._id },
    },
    {
      $facet: {
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
        totalSale: [
          {
            $group: { _id: null, total: { $sum: "$orderAmount" } },
          },
          {
            $project: {
              _id: 0,
              metricsType: "Total Sale",
              details: "(Overall sale from beginning)",
              value: "$total",
            },
          },
        ],
      },
    },
  ]);
  var tagsAndDishes = await foodDishes.aggregate([
    {
      $group: {
        _id: "$tag",
        dishes: { $push: "$name" },
      },
    },
  ]);
  var test = await foodDishes.aggregate([
    {
      $group: {
        _id: "$tag",
        dishes: { $push: "$name" },
      },
    },
  ]);
  var taxes = await foodOrders.aggregate([
    {
      $match: { orderStatus: "Completed", userId: req.user._id },
    },
    { $unwind: "$dishList" },
    {
      $facet: {
        taxEarnedOnDishes: [
          { $unwind: "$dishList.tax" },
          {
            $group: {
              _id: {
                dish: "$dishList.name",
                taxType: "$dishList.tax.name",
              },
              taxValue: { $sum: "$dishList.tax.taxAmount" },
            },
          },
          { $sort: { "_id.taxType": 1 } },
          {
            $group: {
              _id: "$_id.dish",
              taxes: {
                $push: { taxName: "$_id.taxType", taxValue: "$taxValue" },
              },
            },
          },
          {
            $project: {
              _id: 0,
              dishName: "$_id",
              taxes: "$taxes",
            },
          },
        ],
        taxesEarnedThisMonth: [
          { $unwind: "$tax.taxes" },
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
            $group: {
              _id: "$tax.taxes.name",
              totalTaxValue: { $sum: "$tax.taxes.taxValue" },
              count: { $count: {} },
            },
          },
          {
            $project: {
              _id: 0,
              taxType: "$_id",
              totalTaxValue: 1,
              count: 1,
            },
          },
        ],
      },
    },
  ]);

  // var test = await foodOrders.aggregate([
  //   {
  //     $match: { orderStatus: "Completed", userId: req.user._id },
  //   },
  //   { $unwind: "$dishList" },

  //   {
  //     $facet: {
  //       taxeEarnedOnDishes: [{ $unwind: "$dishList.tax" }],

  // nontaxableItems: [
  //   // { $unwind: "$tax.taxes" },
  //   // { $unwind: "$dishList.tax" },
  //   {
  //     $match: {
  //       $expr: {
  //         $eq: [
  //           { $dateToString: { format: "%m", date: "$date" } },
  //           { $dateToString: { format: "%m", date: new Date() } },
  //         ],
  //       },
  //     },
  //   },

  // {
  // $filter: {
  //   input: "$dishList.tax",
  //   as: "item",
  //   cond: {
  //     $and: [
  //       { $and: [{$eq:["$$item.name","gst"]},{ $eq: ["$$item.applicable", false] },] },
  //       { $and: [{$eq:["$$item.name","serviceCharge"]},{ $eq: ["$$item.applicable", false] },] },
  //       { $and: [{$eq:["$$item.name",""]},{ $eq: ["$$item.applicable", false] },] }
  //     ]
  //   }

  //   }]
  // },
  // },
  //   { $unwind: "$dishes" },
  // {
  //   $group: {
  //     _id: "null",
  //     dishes: { $addToSet: "$dishList.name" },
  //   },
  // },
  // {
  //   $group: {
  //     _id: null,
  //     dishes: { $push: "$dishList" },
  //   },
  // },
  // {
  //   $group: {
  //     _id: "$tax.taxes.name",
  //     totalTaxValue: { $sum: "$tax.taxes.taxValue" },
  //   },
  // },
  // {
  //   $project: {
  //     _id: 0,
  //     taxType: "$_id",
  //     totalTaxValue: 1,
  //   },
  // },
  // ],
  //     },
  //   },
  // ]);
  // res.json(test);
  res.json({ allMetrics, salesMetrics, taxes, tagsAndDishes });
};

module.exports = getAllMetrics;
