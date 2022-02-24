/** @format */

var app = angular.module("history", ["ngCookies"]);

app.controller("historyCtrl", function ($scope, ordersHistoryService) {
  $scope.history;
  $scope.getHistorydata = function () {
    ordersHistoryService.getData(function (result) {
      $scope.history = result;
    });
  };
  console.log("History working");
});

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

// app.controller("historyCtrl", function ($scope, historyFactory) {
//   var historyData = new historyFactory();
//   $scope.history;
//   $scope.getHistorydata = function () {
//     historyData.getHistoryData.then(function (result) {

//       $scope.history = result;
//       console.log($scope.history);
//     });
//   };
//   console.log("History working");
// });

// app.factory("historyFactory", function (ordersHistoryService) {
//   return function () {
//     this.getHistoryData = new Promise(function (resolve, reject) {
//       try {
//         ordersHistoryService.getData(function (response) {
//           if (response) {
//             resolve(response);
//           } else {
//             console.log("29");
//             reject(response);
//           }
//         });
//       } catch (error) {
//         reject(error);
//       }
//     });
//   };
// });
// app.service("ordersHistoryService", function ($http, $cookies) {
//   var cookieValue = $cookies.get("token");
//   this.getData = function (cb) {
//     $http({
//       url: "http://localhost:3000/food/history",
//       method: "GET",
//       headers: {
//         Authorization: cookieValue,
//       },
//     })
//       .then(function (response) {
//         var history = response.data.map((order) => {
//           return {
//             orderId: order._id,
//             date: order.date,
//             dishList: order.dishList,
//             orderAmount: order.orderAmount,
//             orderStatus: order.orderStatus,
//             customerName: order.customerName,
//             customerContact: order.customerContact,
//           };
//         });

//         cb(history);
//       })
//       .catch(function (error) {
//         console.log(error);
//       });
//   };
// });
