/** @format */

var app = angular.module("foodDishes", ["ngCookies"]);
var ApiUrl = "http://localhost:3000/food/";
// Service for Food Dishes
app.service("foodDishes", function ($http, $cookies) {
  var cookieValue = $cookies.get("token");
  this.getData = function (cb) {
    $http({
      //   url: "http://localhost:3000/food/dishes",
      url: `${ApiUrl}dishes`,
      method: "GET",
    })
      .then((response) => {
        var foodDishes = response.data.map((item) => {
          return {
            id: item._id,
            name: item.name,
            price: item.price,
            qty: 1,
          };
        });
        cb(foodDishes);
      })
      .catch((error) => {
        console.log(error);
      });
  };
});
