/** @format */

var app = angular.module("dashboard", ["data", "ngCookies"]);

app.controller(
  "dashboardCtrl",
  function ($scope, $http, $cookies, foodDishes, ordersData) {
    $scope.toggleModal = function () {
      $("#orderModal").modal("toggle");
    };
    $scope.logOut = function () {
      console.log("LOGGED OUT");
      $cookies.remove("token");
      location.reload();
    };
    var cookieValue = $cookies.get("token");
    console.log("this is", cookieValue);
    //! just for refernce --- how to implement factory
    // var ordersFactory1 = new ordersFactory();
    // ordersFactory1.getData.then((result) => console.log(result));
    // Get Orders
    $scope.orders;
    ordersData.getOrders(function (ordersData) {
      $scope.orders = ordersData;
    });

    // Change Status
    $scope.statusOptions = ["Preparing", "Prepared", "Completed"];
    $scope.statusChange = function (orderStatusValue, orderId) {
      var index = $scope.orders.findIndex((order) => order.orderId == orderId);
      $scope.orders.splice(index, 1);
      console.log($scope.orders);
      ordersData.changeStatus(orderStatusValue, orderId, function (response) {
        console.log(response);
      });
    };

    //Food Dishes
    foodDishes.getData(function (foodDishesData) {
      $scope.foodDishes = foodDishesData;
    });

    $scope.cart = [];

    var findItemById = function (items, id) {
      return _.find(items, function (item) {
        return item.id === id;
      });
    };

    $scope.getCost = function (item) {
      return item.qty * item.price;
    };

    $scope.addItem = function (itemToAdd) {
      var found = findItemById($scope.cart, itemToAdd.id);
      if (found) {
        found.qty += itemToAdd.qty;
      } else {
        $scope.cart.push(angular.copy(itemToAdd));
      }
    };
    $scope.totalAmount = null;
    $scope.getTotal = function () {
      var total = _.reduce(
        $scope.cart,
        function (sum, item) {
          return sum + $scope.getCost(item);
        },
        0
      );

      $scope.total = total;
      return total;
    };

    $scope.clearCart = function () {
      $scope.cart.length = 0;
    };

    $scope.removeItem = function (item) {
      var index = $scope.cart.indexOf(item);
      $scope.cart.splice(index, 1);
    };

    // creating order
    $scope.createOrder = function (customerName, customerContact) {
      if (!$scope.cart.length) {
        return alert("Add Items to Cart");
      }
      if (!customerContact && !customerName) {
        return alert("Enter Customer Details");
      }
      console.log($scope.cart.length);
      var retVal = confirm("Do you want to Confirm Order ?");
      if (retVal == true) {
        var orderAmount = $scope.getTotal();
        var dishList = $scope.cart;
        ordersData.createOrder(
          orderAmount,
          dishList,
          customerContact,
          customerName.toLowerCase(),
          function (response) {
            console.log("created", response.data.savedOrder);
            $scope.orders.push(response.data.savedOrder);
          }
        );
        $scope.toggleModal();
        $("#orderModal").on("hidden.bs.modal", function () {
          $("#orderModal form")[0].reset();
        });
        $scope.cart = [];
        $scope.getTotal();
      }
    };
  }
);

// Services and Factories

// app.factory("ordersFactory", function ($http, $cookies) {
//   var cookieValue = $cookies.get("token");
//   var object1 = function () {
//     this.getData = new Promise(function (resolve, reject) {
//       var response = 1;
//       // try {
//       // var response = $http({
//       //   url: "http://localhost:3000/food/order",
//       //   method: "GET",
//       //   headers: {
//       //     Authorization: cookieValue,
//       //   },
//       // });
//       if (response) {
//         resolve("hello");
//       } else {
//         reject(response);
//       }
//       // } catch (error) {
//       //   reject(error);
//       // }
//     });
//   };
//   return object1;
// });
