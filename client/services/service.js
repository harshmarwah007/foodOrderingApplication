/** @format */

var app = angular.module("data", ["ngCookies"]);
var ApiUrl = "http://localhost:3000/food/";

//Service for Metrics Data
app.service("metricsData", function ($cookies, $http) {
  var cookieValue = $cookies.get("token");
  this.getMetricsData = function (cb) {
    try {
      $http({
        url: `${ApiUrl}metrics`,
        method: "GET",
        headers: {
          Authorization: cookieValue,
        },
      }).then(function (metrics) {
        cb(metrics);
      });
    } catch (error) {
      console.log(error);
    }
  };
});

//Service for  Orders Data
app.service("ordersData", function ($http, $cookies) {
  var cookieValue = $cookies.get("token");

  this.createOrder = function (
    orderAmount,
    dishList,
    customerContact,
    customerName,
    cb
  ) {
    $http({
      url: `${ApiUrl}order`,
      method: "POST",
      headers: {
        Authorization: cookieValue,
      },
      data: {
        orderAmount: orderAmount,
        dishList: dishList,
        customerName: customerName,
        customerContact: customerContact,
      },
    })
      .then((response) => {
        cb(response);
      })
      .catch((error) => console.log(error));
  };

  this.getOrders = function (pageNo, cb) {
    $http({
      //   url: "http://localhost:3000/food/order",
      url: `${ApiUrl}order/${pageNo}`,
      method: "GET",

      headers: {
        Authorization: cookieValue,
      },
    })
      .then((response) => {
        var count = response.data.count;

        var orders = response.data.orders.map((order) => {
          return {
            orderId: order._id,
            date: order.date,
            dishList: order.dishList,
            orderAmount: order.orderAmount,
            orderStatus: order.orderStatus,
            customerName: order.customerName,
            customerContact: order.customerContact,
          };
        });
        cb(orders, count);
      })
      .catch((error) => console.log(error));
  };

  this.changeStatus = function (orderStatusValue, orderId, cb) {
    $http({
      url: `http://localhost:3000/food/order/${orderId}`,
      method: "PATCH",
      data: {
        orderStatus: orderStatusValue,
      },
      headers: {
        Authorization: cookieValue,
      },
    })
      .then((response) => cb(response))
      .catch((error) => console.log(error));
  };
});

// Service for Food Dishes
app.service("foodDishes", function ($http, $cookies) {
  var cookieValue = $cookies.get("token");
  this.getData = function (cb) {
    $http({
      //   url: "http://localhost:3000/food/dishes",
      url: `${ApiUrl}dishes`,
      method: "GET",
    })
      .then((response) => {
        var foodDishes = response.data.map((item) => {
          return {
            id: item._id,
            name: item.name,
            price: item.price,
            qty: 1,
          };
        });
        cb(foodDishes);
      })
      .catch((error) => {
        console.log(error);
      });
  };
});
