/** @format */

app.controller(
  "dashboardCtrl",
  function (
    $scope,
    ordersData,
    authentication,
    ordersFactory,
    $uibModal,
    foodDishes,
    $http,
    $cookies,
    _
  ) {
    //! here object is made
    var orderBill = new ordersFactory();

    // Bulk Edit Code Here
    var updateOrders = function (ordersData) {
      $scope.orders = ordersData;
    };
    $scope.bulkEditOrdersIds;
    $scope.bulkEditOrders = {};
    $scope.bulkEditOrdersButton = false;
    $scope.bulkEditOrdersIds = [];
    $scope.setBulkEditOrders = function () {
      $scope.bulkEditOrdersIds = Object.entries($scope.bulkEditOrders).reduce(
        function (ids, order) {
          if (order[1] == true) {
            ids.push(order[0]);
          }
          return ids;
        },
        []
      );
    };

    $scope.bulkEditOrdersButtonText = "ENABLE BULK EDIT";
    $scope.setBulkEditOrdersButton = function () {
      if ($scope.bulkEditOrdersButton) {
        $scope.bulkEditOrdersButtonText = "ENABLE BULK EDIT";
        $scope.bulkEditOrdersButton = false;
        $scope.bulkEditOrders = {};
      } else {
        $scope.bulkEditOrdersButtonText = "DISABLE BULK EDIT";
        $scope.bulkEditOrdersButton = true;
      }
    };
    $scope.bulkOrderStatusChange = function (selectedStatus) {
      ordersData.bulkOrderStatusChange(
        angular.copy($scope.bulkEditOrdersIds),
        selectedStatus
      );
      //Update Variables
      if (selectedStatus == "None") {
        return alert("please select some status ... if you want to update");
      }
      if (selectedStatus == "Completed") {
        $scope.bulkEditOrdersIds.map(function (orderId) {
          var index = $scope.orders.findIndex(
            (order) => order.orderId == orderId
          );
          $scope.orders.splice(index, 1);
        });
      } else {
        $scope.orders.map(function (order) {
          if ($scope.bulkEditOrdersIds.includes(order.orderId)) {
            order.orderStatus = selectedStatus;
          }
          return order;
        });
      }

      //Update data
      $scope.bulkEditOrdersIds.length = 0;
      Object.keys($scope.bulkEditOrders).forEach(function (order) {
        $scope.bulkEditOrders[order] = false;
      });
      $scope.setBulkEditOrdersButton();
    };
    $scope.bulkEditStatusOptions = [
      "None",
      "Preparing",
      "Prepared",
      "Completed",
    ];

    // var cookieValue = $cookies.get("token");
    // $http.defaults.headers.common.Authorization = cookieValue;
    $scope.showOrdersTabs = false;
    $scope.showPagination = false;
    $scope.currentPage = 1;
    $scope.ordersCount;
    $scope.maxSize = 3;
    $scope.itemsPerPage = 8;
    $scope.pageChange = function (currentPage) {
      $scope.currentPage = currentPage;
      $scope.getAllOrders();
    };

    $scope.logOut = authentication.logOut;
    //Food Dishes
    $scope.getAllFooddishes = function () {
      foodDishes.getData(function (foodDishesData) {
        $scope.foodDishesData = foodDishesData;
      });
    };
    //!
    $scope.getAllDineInOrders = function () {
      ordersData.getDineInOrders(function (dineInOrders) {
        $scope.dineInOrders = dineInOrders;

        if ($scope.dineInOrders.length) {
          $scope.showOrdersTabs = true;
        }
      });
    };

    $scope.getAllOrders = function () {
      $scope.orders;
      ordersData.getOrders($scope.currentPage, function (ordersData, count) {
        updateOrders(ordersData);
        $scope.orders.map(function (item) {
          $scope.bulkEditOrders[item.orderId] = false;
        });
        $scope.ordersCount = count;
        if ($scope.ordersCount) {
          $scope.showPagination = true;
          $scope.showOrdersTabs = true;
        }
      });
    };

    $scope.statusOptions = orderBill.statusOptions;
    $scope.statusChange = function (orderStatusValue, orderId, order) {
      orderBill.statusChange(orderStatusValue, orderId, order);
      if (orderStatusValue == "Completed") {
        if (order.orderType == "dineIn") {
          var index = $scope.dineInOrders.findIndex(
            (order) => order.orderId == orderId
          );
          $scope.dineInOrders.splice(index, 1);
        } else {
          var index = $scope.orders.findIndex(
            (order) => order.orderId == orderId
          );
          $scope.orders.splice(index, 1);
        }
      }
    };
    $scope.openInfoModal = function (order) {
      $uibModal
        .open({
          templateUrl: "components/Modals/infoModal.html",
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
    $scope.openOrderModal = function (typeOfModal, order) {
      $uibModal
        .open({
          templateUrl: "components/Modals/orderModal.html",
          controller: "orderModalCtrl",
          size: "lg",
          resolve: {
            foodDishesData: function () {
              return $scope.foodDishesData;
            },
            typeOfModal: function () {
              return typeOfModal;
            },
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
          function (newOrder) {
            if (typeOfModal != "edit") {
              if (newOrder.orderType == "takeAway") {
                $scope.orders.push(newOrder);
              } else {
                $scope.dineInOrders.push(newOrder);
              }
            } else {
              if (newOrder.updatedOrder.orderType == "dineIn") {
                if (!newOrder.diffOrderType) {
                  $scope.dineInOrders.push(newOrder.updatedOrder);
                  var index = $scope.orders.findIndex(
                    (order) => order.orderId == newOrder.updatedOrder.orderId
                  );
                  $scope.orders.splice(index, 1);
                } else {
                }
              } else {
                $scope.orders.push(newOrder.updatedOrder);
                var index = $scope.dineInOrders.findIndex(
                  (order) => order.orderId == newOrder.updatedOrder.orderId
                );
                $scope.dineInOrders.splice(index, 1);
              }
            }
          },
          function (res) {}
        );
    };
    //! last point

    $scope.getAllData = function () {
      $scope.getAllDineInOrders();
      $scope.getAllOrders();
    };
  }
);

app.factory("_", function ($window) {
  var _ = $window._;
  delete $window._;
  return _;
});
