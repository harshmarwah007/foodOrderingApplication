/** @format */

var app = angular.module("ordersHistoryService", ["ngCookies"]);
var ApiUrl = "http://localhost:3000/food/";
app.service("ordersHistoryService", function ($http, $cookies) {
  var cookieValue = $cookies.get("token");
  this.getData = function (itemsPerPage, pageNo, cb) {
    $http({
      // url: "http://localhost:3000/food/history",
      url: `${ApiUrl}history/${pageNo}`,
      method: "GET",
      data: {
        itemsPerPage: itemsPerPage,
      },
      headers: {
        Authorization: cookieValue,
      },
    })
      .then(function (response) {
        var count = response.data.count;
        var history = response.data.orders.map((order) => {
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

        cb(history, count);
      })
      .catch(function (error) {
        console.log(error);
      });
  };
});
