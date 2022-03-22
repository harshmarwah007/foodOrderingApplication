/** @format */

var app = angular.module("metrics", ["metricsData"]);

app.controller("metricsCtrl", function ($scope, metricsData) {
  $scope.value = "Hello";
  $scope.metrics = [];
  $scope.salesMetrics = [];
  $scope.customerVisitedOnce;
  $scope.getMetricsData = function () {
    metricsData.getMetricsData(function (metricsData) {
      var allMetricsData = metricsData.data.allMetrics[0];
      var salesMetricsData = metricsData.data.salesMetrics[0];
      console.log("front", metricsData);

      for (var item in allMetricsData) {
        if (allMetricsData[item].length) {
          if (
            allMetricsData[item][0].metricsType != "customersVisitedOnlyOnce"
          ) {
            $scope.metrics.push(allMetricsData[item][0]);
          } else {
            $scope.customerVisitedOnce = allMetricsData[item];
          }
        }
      }
      for (var item in salesMetricsData) {
        if (salesMetricsData[item].length) {
          $scope.salesMetrics.push(salesMetricsData[item][0]);
        }
      }
    });
  };
});
