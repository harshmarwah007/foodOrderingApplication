/** @format */

var app = angular.module("ordersData", ["ngCookies"]);

//Service for  Orders Data
app.service("ordersData", function ($http, config) {
  var ApiUrl = config.apiUrl;
  this.createOrder = function (
    totalAmount,
    taxes,
    totalTaxValue,
    orderAmount,
    dishList,
    customerContact,
    customerName,
    orderType,
    orderTableNumber,
    cb
  ) {
    $http({
      url: `${ApiUrl}order`,
      method: "POST",
      // headers: {
      //   Authorization: cookieValue,
      // },
      data: {
        totalAmount: totalAmount,
        taxes: taxes,
        totalTax: totalTaxValue,
        orderAmount: orderAmount,
        dishList: dishList,
        customerName: customerName,
        customerContact: customerContact,
        orderType: orderType,
        orderTableNumber: orderTableNumber,
      },
    })
      .then((response) => {
        cb(response);
      })
      .catch((error) => console.log(error));
  };

  this.getDineInOrders = function (cb) {
    // var cookieValue = $cookies.get("token");
    $http({
      url: `${ApiUrl}dineInOrders`,
      method: "GET",

      // headers: {
      //   Authorization: cookieValue,
      // },
    })
      .then((response) => {
        var dineInOrders = response.data.map((order) => {
          return {
            orderId: order._id,
            date: order.date,
            dishList: order.dishList,
            orderAmount: order.orderAmount,
            orderStatus: order.orderStatus,
            customerName: order.customerName,
            customerContact: order.customerContact,
            orderType: order.orderType,
            orderTableNumber: order.orderTableNumber,
          };
        });
        cb(dineInOrders);
      })
      .catch((error) => console.log(error));
  };

  this.getOrders = function (pageNo, cb) {
    $http({
      url: `${ApiUrl}order/${pageNo}`,
      method: "GET",

      // headers: {
      //   Authorization: cookieValue,
      // },
    })
      .then((response) => {
        var count = response.data.count;
        var orders = response.data.orders.map((order) => {
          return {
            tax: order.tax,
            totalAmount: order.totalAmount,
            orderId: order._id,
            date: order.date,
            dishList: order.dishList,
            orderAmount: order.orderAmount,
            orderStatus: order.orderStatus,
            customerName: order.customerName,
            customerContact: order.customerContact,
            orderType: order.orderType,
            orderTableNumber: order.orderTableNumber,
          };
        });
        cb(orders, count);
      })
      .catch((error) => console.log(error));
  };

  this.changeStatus = function (orderStatusValue, orderId, order, cb) {
    $http({
      url: `http://localhost:3000/food/orderStatus/${orderId}`,
      method: "PATCH",
      data: {
        orderStatus: orderStatusValue,
        order: order,
      },
      // headers: {
      //   Authorization: cookieValue,
      // },
    })
      .then((response) => cb(response))
      .catch((error) => console.log(error));
  };
  this.updateOrder = function (updatedOrder, order, previousTableNumber, cb) {
    var orderId = updatedOrder.orderId;
    var updatedOrder = angular.copy(updatedOrder);
    console.log("updated one", updatedOrder);
    $http({
      url: `http://localhost:3000/food/order/${orderId}`,
      method: "PATCH",
      data: {
        updatedOrder: updatedOrder,
        order: order,
        previousTableNumber: previousTableNumber,
      },
      // headers: {
      //   Authorization: cookieValue,
      // },
    })
      .then(function (response) {
        cb(response);
      })
      .catch(function (error) {
        cb(error);
      });
  };
});
