/** @format */

var app = angular.module("history", ["ngCookies"]);

app.controller(
  "historyCtrl",
  function ($scope, $http, $cookies, ordersHistoryService) {
    var cookieValue = $cookies.get("token");
    // $scope.history = [];
    $scope.history;
    ordersHistoryService.getData(function (response) {
      $scope.history = response;
    });
    console.log("History working");
  }
);
app.service("ordersHistoryService", function ($http, $cookies) {
  var cookieValue = $cookies.get("token");
  this.getData = function (cb) {
    $http({
      url: "http://localhost:3000/food/history",
      method: "GET",
      headers: {
        Authorization: cookieValue,
      },
    })
      .then(function (response) {
        var history = response.data.map((order) => {
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
        cb(history);
      })
      .catch(function (error) {
        console.log(error);
      });
  };
});
