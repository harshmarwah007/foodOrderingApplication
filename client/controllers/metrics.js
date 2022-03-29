/** @format */

var app = angular.module("metrics", ["metricsData"]);

app.controller("metricsCtrl", function ($scope, metricsData, $uibModal) {
  $scope.value = "Hello";
  $scope.metrics = [];
  $scope.salesMetrics = [];
  $scope.customerVisitedOnce;
  $scope.getMetricsData = function () {
    metricsData.getMetricsData(function (metricsData) {
      var allMetricsData = metricsData.data.allMetrics[0];
      var salesMetricsData = metricsData.data.salesMetrics[0];
      var taxAsPerItems = metricsData.data.taxes[0].taxEarnedOnDishes;
      var taxesEarnedThisMonth = metricsData.data.taxes[0].taxesEarnedThisMonth;
      var tagsAndDishes = metricsData.data.tagsAndDishes;
      $scope.tagsAndDishes = tagsAndDishes;
      console.log(tagsAndDishes);
      $scope.taxesEarnedThisMonth = taxesEarnedThisMonth;
      var dishesWithNoTaxes = [];
      $scope.taxAsPerItems = taxAsPerItems.map(function (item) {
        var taxObject = {};
        item.taxes.map(function (tax) {
          taxObject[tax.taxName] = tax.taxValue;
        });
        // console.log(taxObject);
        if (
          taxObject.gst == 0 &&
          taxObject.serviceCharge == 0 &&
          taxObject.stateTax == 0
        ) {
          dishesWithNoTaxes.push(item.dishName);
        }
        return { dishName: item.dishName, taxes: taxObject };
      });
      $scope.dishesWithNoTaxes = dishesWithNoTaxes;

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

    $scope.openMetricsModal = function (url, data) {
      $uibModal
        .open({
          templateUrl: `components/metricsModals/${url}.html`,
          // templateUrl: "components/metricsModals/generalMetrics.html",
          controller: "metricsModalCtrl",
          size: "lg",
          resolve: {
            data: function () {
              if (data.length) {
                return data;
              } else {
                return null;
              }
            },
          },
        })
        .result.then(
          function () {},
          function (res) {}
        );
    };
  };
});
