/** @format */

var app = angular.module("metrics", ["ngCookies"]);

app.controller("metricsCtrl", function ($scope, metricsData) {
  $scope.value = "Hello";
  $scope.metrics = [];
  metricsData.getMetricsData(function (metricsData) {
    // console.log(metricsData.data[0]);
    for (var item in metricsData.data[0]) {
      //   console.log(metricsData.data[0][item][0]);
      if (
        metricsData.data[0][item][0].metricsType != "customersVisitedOnlyOnce"
      )
      {
        $scope.metrics.push(metricsData.data[0][item][0]);  
      }
      else
      {
          
       } 
        
    }
    // metricsData.data.map((data) => console.log(data));
  });
});

app.service("metricsData", function ($cookies, $http) {
  var cookieValue = $cookies.get("token");
  this.getMetricsData = function (cb) {
    try {
      $http({
        url: "http://localhost:3000/food/metrics",
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
