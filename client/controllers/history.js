/** @format */

var app = angular.module("history", ["ngCookies", "ordersHistoryService"]);
var ApiUrl = "http://localhost:3000/food/";
app.controller(
  "historyCtrl",
  function ($scope, ordersHistoryService, $uibModal) {
    $scope.history;
    $scope.currentPage = 1;
    $scope.ordersCount;
    $scope.maxSize = 3;
    $scope.itemsPerPage = 6;
    $scope.showPagination = false;
    $scope.pageChange = function (currentPage) {
      $scope.currentPage = currentPage;
      console.log($scope.currentPage);
      $scope.getHistorydata();
    };
    $scope.getHistorydata = function () {
      ordersHistoryService.getData(
        $scope.itemsPerPage,
        $scope.currentPage,
        function (result, count) {
          $scope.history = result;
          $scope.ordersCount = count;
          if ($scope.ordersCount) {
            $scope.showPagination = true;
          }
        }
      );
    };
    $scope.openInfoModal = function (order) {
      console.log("working");

      $uibModal
        .open({
          templateUrl: "/components/Modals/infoModal.html",
          controller: "infoModalCtrl",
          size: "md",
          resolve: {
            order: function () {
              if (order) {
                return order;
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
  }
);
