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
    var cookieValue = $cookies.get("token");
    $http.defaults.headers.common.Authorization = cookieValue;
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
        $scope.orders = ordersData;
        $scope.ordersCount = count;
        if ($scope.ordersCount) {
          $scope.showPagination = true;
          $scope.showOrdersTabs = true;
        }
      });
    };

    //! here object is made

    var orderBill = new ordersFactory();

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
