/** @format */

app.controller(
  "orderModalCtrl",
  function (
    ordersFactory,
    $scope,
    $uibModalInstance,
    foodDishes,
    typeOfModal,
    order,
    orderTableData,
    _
  ) {
    $scope.typeOfModal = typeOfModal;
    $scope.justValue = true;
    $scope.buttonColor = "btn btn-primary ml-1";
    $scope.dineInButton = false;
    $scope.takeAwayButton = true;
    $scope.orderType = "takeAway";
    $scope.tableNumber;
    var previousTableNumber;
    //var tempTableNumber;
    $scope.setOrderTable = function (tableNumber) {
      $scope.tableNumber = tableNumber;
      $scope.changeOccured();
    };
    // $scope.currentTable = null;
    $scope.changeOrderTypeButton = function (orderType) {
      if (orderType == "dineIn") {
        $scope.orderType = "dineIn";
        $scope.takeAwayButton = false;
        $scope.dineInButton = true;
      }
    };

    if (typeOfModal == "edit") {
      console.log("valueeeeee", order.orderType, order.orderTableNumber);
      $scope.changeOrderTypeButton(order.orderType);
      $scope.tableNumber = order.orderTableNumber;
      previousTableNumber = order.orderTableNumber;
      //$scope.setOrderTable(order.orderTableNumber);
    }
    //! getting tables data here
    $scope.tableData;
    orderTableData.getTables(function (response) {
      $scope.emptyTable = 0;

      $scope.tableData = response.data;
      response.data.tablesData.forEach(function (item) {
        if (!item.occupied) {
          $scope.emptyTable++;
        }
      });
      console.log($scope.emptyTable);
    });

    $scope.foodDishes = foodDishes;
    $scope.customerContact;
    $scope.customerName;
    $scope.updateOrderAvailble = true;

    var orderBill = new ordersFactory();

    $scope.cart = [];

    $scope.getCost = function (item) {
      return orderBill.getCost(item);
    };

    $scope.addItem = function (itemToAdd) {
      orderBill.addItem(itemToAdd);
      $scope.cart = orderBill.cart;
      $scope.changeOccured();
    };
    $scope.totalAmount = null;
    $scope.getTotal = function () {
      var value = orderBill.getTotal();
      return value;
    };

    $scope.clearCart = function () {
      orderBill.clearCart();
      $scope.cart = orderBill.cart;
      $scope.changeOccured();
    };

    $scope.removeItem = function (item) {
      orderBill.removeItem(item);
      $scope.cart = orderBill.cart;
      $scope.changeOccured();
    };

    // creating order

    $scope.createOrder = function (customerName, customerContact, orderType) {
      orderBill.createOrder(
        customerName,
        customerContact,
        orderType,
        $scope.tableNumber,
        function (newOrder) {
          $uibModalInstance.close(newOrder);
          $scope.cart = [];
          $scope.getTotal();
        }
      );
    };

    // edit Order

    $scope.cancel = function () {
      $uibModalInstance.dismiss("cancel");
    };
    $scope.orderChanged = false;
    $scope.changeVisibilityofUpdateButton = true;
    $scope.changeOccured = function () {
      if (typeOfModal == "edit") {
        $scope.changeVisibilityofUpdateButton = true;
        if (order && $scope.customerContact && $scope.customerName) {
          var dishListResult = _.isEqual(
            order.dishList,
            angular.copy(orderBill.cart)
          );
          var customerNameResult = _.isEqual(
            order.customerName,
            $scope.customerName
          );
          var customerContactResult = _.isEqual(
            parseInt(order.customerContact),
            $scope.customerContact
          );
          var table = _.isEqual(
            parseInt(order.orderTableNumber),
            parseInt($scope.tableNumber)
          );
          var orderType = _.isEqual(order.orderType, $scope.orderType);
          $scope.diffOrderType = orderType; // boolean
          if (
            !customerContactResult ||
            !customerNameResult ||
            !dishListResult ||
            !table ||
            !orderType
          ) {
            $scope.changeVisibilityofUpdateButton = false;
            $scope.updateOrderAvailble = true;
          }
        }
      }
    };

    $scope.updateOrder = function () {
      if ($scope.updateOrderAvailble) {
        var result = orderBill.updateOrder(
          $scope.customerName,
          $scope.customerContact,
          order,
          $scope.orderType,
          $scope.tableNumber,
          previousTableNumber
        );
        if (result) {
          $uibModalInstance.close({
            updatedOrder: result.updatedOrder,
            previousTableNumber: previousTableNumber,
            diffOrderType: $scope.diffOrderType,
          });
        }
      } else {
        alert("No changes are there to update the order");
      }
    };

    //insert data into Modal
    $scope.updateButton = false;
    $scope.orderButton = true;
    if (typeOfModal == "edit") {
      $scope.updateButton = true;
      $scope.orderButton = false;
      order.dishList.map(function (item) {
        $scope.addItem(item);
      });
      $scope.customerContact = parseInt(order.customerContact);
      $scope.customerName = order.customerName;
    }
  }
);

app.service("orderTableData", function ($http, $cookies) {
  var cookieValue = $cookies.get("token");
  this.getTables = function (cb) {
    $http({
      url: "http://localhost:3000/orderTable",
      method: "GET",
      headers: {
        Authorization: cookieValue,
      },
    })
      .then(function (result) {
        cb(result);
      })
      .catch(function (error) {
        console.log(error);
      });
  };
  this.setTable = function () {};
});
