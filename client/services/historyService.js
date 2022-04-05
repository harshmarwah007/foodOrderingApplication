/** @format */

var app = angular.module("ordersHistoryService", ["ngCookies"]);

app.service("ordersHistoryService", function ($http, config) {
  this.getData = function (itemsPerPage, pageNo, cb) {
    $http({
      url: `${config.apiUrl}history/${pageNo}`,
      method: "GET",
      data: {
        itemsPerPage: itemsPerPage,
      },
      // headers: {
      //   Authorization: cookieValue,
      // },
    })
      .then(function (response) {
        var count = response.data.count;
        var history = response.data.orders.map((order) => {
          return {
            orderId: order._id,
            date: order.date,
            tax: order.tax,
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
