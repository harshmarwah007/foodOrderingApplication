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
    _
  ) {
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

    $scope.createOrder = function (customerName, customerContact) {
      orderBill.createOrder(
        customerName,
        customerContact,

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
      console.log("first");
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
          if (
            !customerContactResult ||
            !customerNameResult ||
            !dishListResult
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
          order
        );
        if (result) {
          $uibModalInstance.close();
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
