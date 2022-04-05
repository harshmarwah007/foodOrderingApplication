/** @format */

app.controller(
  "orderModalCtrl",
  function (
    ordersFactory,
    $scope,
    $uibModalInstance,
    foodDishesData,
    typeOfModal,
    order,
    orderTableData,
    _,
    recommendation
  ) {
    $scope.typeOfModal = typeOfModal;
    $scope.justValue = true;
    $scope.buttonColor = "btn btn-primary ml-1";
    $scope.dineInButton = false;
    $scope.takeAwayButton = true;
    $scope.orderType = "takeAway";
    $scope.tableNumber;
    $scope.taxValue = null;
    $scope.totalTaxValue = null;
    $scope.totalAmount = 0;

    var setBillValues = function (taxValue, totalTaxValue, totalAmount) {
      $scope.taxes = taxValue;
      $scope.totalTaxValue = totalTaxValue;
      $scope.totalAmount = totalAmount;
    };

    var setRecommendationValues = function (orderBill) {
      var cart = orderBill.cart;
      if (cart.length) {
        if (cart.length < 4) {
          recommendation.recommend(cart, function (data) {
            $scope.recommendation = data;
          });
        } else {
          $scope.recommendation = [];
        }
      } else {
        $scope.recommendation = [];
      }
    };
    // var setRecommendationValues = function (orderBill) {
    //   orderBill.recommendation(function (data) {
    //     $scope.recommendation = data;
    //     // console.log("recommendationsData", $scope.recommendation);
    //   });
    // };
    $scope.addRecommendation = function (reccomendedDish) {
      $scope.addItem(reccomendedDish);
    };
    $scope.taxValue = null;
    $scope.totalTaxValue = null;
    var previousTableNumber;

    $scope.setOrderTable = function (tableNumber) {
      $scope.tableNumber = tableNumber;
      $scope.changeOccured();
    };

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

    $scope.foodDishesData = foodDishesData.categories;
    $scope.customerContact;
    $scope.customerName;
    $scope.updateOrderAvailble = true;

    var orderBill = new ordersFactory();
    orderBill.setAllDishesData(foodDishesData);
    $scope.cart = [];

    $scope.getCost = function (item) {
      return orderBill.getCost(item);
    };

    $scope.addItem = function (itemToAdd) {
      orderBill.addItem(itemToAdd);
      $scope.cart = orderBill.cart;
      $scope.changeOccured();
      setBillValues(orderBill.taxes, orderBill.totalTaxValue, orderBill.total);
      setRecommendationValues(orderBill);
    };

    $scope.totalAmount = null;
    $scope.getTotal = function () {
      var value = orderBill.getTotal();
      return value;
    };

    $scope.clearCart = function () {
      // $scope.recommendation.length = 0;
      orderBill.clearCart();
      $scope.cart = orderBill.cart;
      setBillValues(orderBill.taxes, orderBill.totalTaxValue, orderBill.total);
      $scope.changeOccured();
      setRecommendationValues(orderBill);
    };

    $scope.removeItem = function (item) {
      orderBill.removeItem(item);
      $scope.cart = orderBill.cart;
      setBillValues(orderBill.taxes, orderBill.totalTaxValue, orderBill.total);
      $scope.changeOccured();
      setRecommendationValues(orderBill);
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
