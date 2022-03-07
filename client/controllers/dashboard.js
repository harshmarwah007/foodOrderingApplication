/** @format */

var app = angular.module("dashboard", [
  // "ngCookies",
  "ui.bootstrap",
  // "socketio",
  "authentication",
  "foodDishes",
  "ordersData",
  "ordersFactory",
]);

app.controller(
  "dashboardCtrl",
  function (
    $scope,
    // $cookies,
    foodDishes,
    ordersData,
    socket,
    authentication,
    ordersFactory
  ) {
    $scope.toggleModal = function () {
      $("#orderModal").modal("toggle");
    };
    $scope.showPagination = false;
    $scope.currentPage = 1;
    $scope.ordersCount;
    $scope.maxSize = 3;
    $scope.itemsPerPage = 6;
    $scope.pageChange = function (currentPage) {
      $scope.currentPage = currentPage;
      $scope.getAllOrders();
    };

    $scope.logOut = authentication.logOut;

    //! just for refernce --- how to implement factory

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
        var index = $scope.orders.findIndex(
          (order) => order.orderId == orderId
        );
        $scope.orders.splice(index, 1);
      }
    };

    //Food Dishes
    foodDishes.getData(function (foodDishesData) {
      $scope.foodDishes = foodDishesData;
    });

    //todo
    $scope.cart = [];

    //todo
    $scope.getCost = function (item) {
      orderBill.getCost(item);
    };

    $scope.addItem = function (itemToAdd) {
      orderBill.addItem(itemToAdd);
      $scope.cart = orderBill.cart;
    };
    $scope.totalAmount = null;
    $scope.getTotal = function () {
      var value = orderBill.getTotal();
      return value;
    };

    $scope.clearCart = function () {
      orderBill.clearCart();
      $scope.cart = orderBill.cart;
    };

    $scope.removeItem = function (item) {
      orderBill.removeItem(item);
      $scope.cart = orderBill.cart;
    };

    // creating order
    // var toggle = $scope.toggleModal();
    $scope.createOrder = function (customerName, customerContact) {
      orderBill.createOrder(
        customerName,
        customerContact,

        function (newOrder) {
          $scope.orders.push(newOrder);
          $scope.toggleModal();
        }
      );
      // $scope.toggleModal();
      $("#orderModal").on("hidden.bs.modal", function () {
        $("#orderModal form")[0].reset();
      });
      $scope.cart = [];
      $scope.getTotal();
    };
    //! last point
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

//! this one is last code

// /** @format */

// var app = angular.module("dashboard", [
//   "ngCookies",
//   "socketio",
//   "ui.bootstrap",
//   "authentication",
//   "foodDishes",
//   "ordersData",
// ]);

// app.controller(
//   "dashboardCtrl",
//   function ($scope, $cookies, foodDishes, ordersData, socket, authentication) {
//     $scope.toggleModal = function () {
//       $("#orderModal").modal("toggle");
//     };
//     $scope.showPagination = false;
//     $scope.currentPage = 1;
//     $scope.ordersCount;
//     $scope.maxSize = 3;
//     $scope.itemsPerPage = 6;
//     $scope.pageChange = function (currentPage) {
//       $scope.currentPage = currentPage;
//       $scope.getAllOrders();
//       console.log(currentPage);
//       console.log($scope.ordersCount);
//     };

//     $scope.logOut = authentication.logOut;

//     //! just for refernce --- how to implement factory

//     $scope.getAllOrders = function () {
//       $scope.orders;
//       ordersData.getOrders($scope.currentPage, function (ordersData, count) {
//         $scope.orders = ordersData;
//         $scope.ordersCount = count;
//         if ($scope.ordersCount) {
//           $scope.showPagination = true;
//         }
//       });
//     };

//     // var ordersFactory1 = new ordersFactory();
//     // ordersFactory1.getData.then((result) => console.log(result));
//     // Get Orders
//     // Change Status
//     $scope.statusOptions = ["Preparing", "Prepared", "Completed"];
//     $scope.statusChange = function (orderStatusValue, orderId, order) {
//       var currentTime = new Date();
//       socket.emit("generateNotification", {
//         orderId: orderId,
//         receiverName: order.customerName + order.customerContact,
//         orderStatus: orderStatusValue,
//         date: currentTime,
//         data: order,
//       });
//       if (orderStatusValue == "Completed") {
//         var index = $scope.orders.findIndex(
//           (order) => order.orderId == orderId
//         );
//         $scope.orders.splice(index, 1);
//       }

//       ordersData.changeStatus(orderStatusValue, orderId, function () {});
//     };

//     //Food Dishes
//     foodDishes.getData(function (foodDishesData) {
//       $scope.foodDishes = foodDishesData;
//     });
//     $scope.cart = [];

//     var findItemById = function (items, id) {
//       return _.find(items, function (item) {
//         return item.id === id;
//       });
//     };

//     $scope.getCost = function (item) {
//       return item.qty * item.price;
//     };

//     $scope.addItem = function (itemToAdd) {
//       var found = findItemById($scope.cart, itemToAdd.id);
//       if (found) {
//         found.qty += itemToAdd.qty;
//       } else {
//         $scope.cart.push(angular.copy(itemToAdd));
//       }
//     };
//     $scope.totalAmount = null;
//     $scope.getTotal = function () {
//       var total = _.reduce(
//         $scope.cart,
//         function (sum, item) {
//           return sum + $scope.getCost(item);
//         },
//         0
//       );

//       $scope.total = total;
//       return total;
//     };

//     $scope.clearCart = function () {
//       $scope.cart.length = 0;
//     };

//     $scope.removeItem = function (item) {
//       var index = $scope.cart.indexOf(item);
//       $scope.cart.splice(index, 1);
//     };

//     // creating order
//     $scope.createOrder = function (customerName, customerContact) {
//       if (!$scope.cart.length) {
//         return alert("Add Items to Cart");
//       }
//       if (!customerContact && !customerName) {
//         return alert("Enter Customer Details");
//       }
//       console.log($scope.cart.length);
//       var retVal = confirm("Do you want to Confirm Order ?");
//       if (retVal == true) {
//         var orderAmount = $scope.getTotal();
//         var dishList = $scope.cart;
//         ordersData.createOrder(
//           orderAmount,
//           dishList,
//           customerContact,
//           customerName.toLowerCase(),
//           function (response) {
//             console.log("created", response.data.savedOrder);
//             var order = response.data.savedOrder;
//             socket.emit("OrderNotification", order);

//             $scope.orders.push(response.data.savedOrder);
//           }
//         );
//         $scope.toggleModal();
//         $("#orderModal").on("hidden.bs.modal", function () {
//           $("#orderModal form")[0].reset();
//         });
//         $scope.cart = [];
//         $scope.getTotal();
//       }
//     };
//   }
// );

// // Services and Factories

// // app.factory("ordersFactory", function ($http, $cookies) {
// //   var cookieValue = $cookies.get("token");
// //   var object1 = function () {
// //     this.getData = new Promise(function (resolve, reject) {
// //       var response = 1;
// //       // try {
// //       // var response = $http({
// //       //   url: "http://localhost:3000/food/order",
// //       //   method: "GET",
// //       //   headers: {
// //       //     Authorization: cookieValue,
// //       //   },
// //       // });
// //       if (response) {
// //         resolve("hello");
// //       } else {
// //         reject(response);
// //       }
// //       // } catch (error) {
// //       //   reject(error);
// //       // }
// //     });
// //   };
// //   return object1;
// // });
