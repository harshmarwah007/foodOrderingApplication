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
    _
  ) {
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
      foodDishes.getData.then(function (response) {
        $scope.foodDishes = response.data.map((item) => {
          return {
            id: item._id,
            name: item.name,
            price: item.price,
            qty: 1,
          };
        });
      });
    };
    //!
    $scope.getAllDineInOrders = function () {
      ordersData.getDineInOrders(function (dineInOrders) {
        $scope.dineInOrders = dineInOrders;
      });
    };

    $scope.getAllOrders = function () {
      $scope.orders;
      ordersData.getOrders($scope.currentPage, function (ordersData, count) {
        $scope.orders = ordersData;
        $scope.ordersCount = count;
        if ($scope.ordersCount) {
          $scope.showPagination = true;
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
    $scope.openOrderModal = function (typeOfModal, order) {
      console.log("modal type", typeOfModal);
      $uibModal
        .open({
          templateUrl: "/components/Modals/orderModal.html",
          controller: "orderModalCtrl",
          size: "lg",
          resolve: {
            foodDishes: function () {
              return $scope.foodDishes;
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
            }
          },
          function (res) {}
        );
    };
    //! last point
  }
);

app.factory("_", function ($window) {
  var _ = $window._;
  delete $window._;
  return _;
});
