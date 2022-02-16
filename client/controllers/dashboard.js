/** @format */

var app = angular.module("dashboard", ["ngCookies"]);

app.controller("dashboardCtrl", function ($scope, $http, $cookies) {
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
  //Get orders
  // var ordersFactory1 = new ordersFactory();
  // ordersFactory1.getData.then((result) => console.log(result));
  $scope.orders = [];
  $http({
    url: "http://localhost:3000/food/order",
    method: "GET",

    headers: {
      Authorization: cookieValue,
    },
  })
    .then((response) => {
      $scope.orders = response.data.map((order) => {
        return {
          orderId: order._id,
          date: order.date,
          dishList: order.dishList,
          orderAmount: order.orderAmount,
          orderStatus: order.orderStatus,
          customerName: order.customerName,
          customerContact: order.customerContact,
        };
      });
    })
    .catch((error) => console.log(error));
  // change status

  $scope.statusOptions = ["Preparing", "Prepared", "Completed"];
  $scope.statusChange = function (orderStatusValue, orderId) {
    $http({
      url: `http://localhost:3000/food/order/${orderId}`,
      method: "PATCH",
      data: {
        orderStatus: orderStatusValue,
      },
      headers: {
        Authorization: cookieValue,
      },
    })
      .then((response) => console.log(response))
      .catch((error) => console.log(error));
  };

  //Food Dishes and Modal
  $scope.foodDishes = [];
  $http({
    url: "http://localhost:3000/food/dishes",
    method: "GET",
  })
    .then((response) => {
      $scope.foodDishes = response.data.map((item) => {
        return {
          id: item._id,
          name: item.name,
          price: item.price,
          qty: 1,
        };
      });
    })
    .catch((error) => {
      console.log(error);
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
      $http({
        url: "http://localhost:3000/food/order",
        method: "POST",

        headers: {
          Authorization: cookieValue,
        },
        data: {
          orderAmount: $scope.getTotal(),
          dishList: $scope.cart,
          customerName: customerName.toLowerCase(),
          customerContact: customerContact,
        },
      })
        .then((response) => {
          console.log("created", response.data.savedOrder);
          $scope.orders.push(response.data.savedOrder);
        })
        .catch((error) => console.log(error));
      $scope.toggleModal();
      $("#orderModal").on("hidden.bs.modal", function () {
        $("#orderModal form")[0].reset();
      });
      $scope.cart = [];
      $scope.getTotal();
    }
  };
});



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

// app.factory("ordersFactory", function ($http, $cookies) {
//   var cookieValue = $cookies.get("token");
//   var object1 = function () {
//     var orderData = [];
//     this.getData = new Promise((resolve, reject) =>
//     {
//       try
//       {
//         resolve(ob)
//       } catch (err)
//       {

//       }
//     })
//   };
//   return object1;
// });
