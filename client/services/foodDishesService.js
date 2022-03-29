/** @format */

var app = angular.module("foodDishes", ["ngCookies"]);
var ApiUrl = "http://localhost:3000/food/";
// Service for Food Dishes
app.service("foodDishes", function ($http) {
  this.getData = function (cb) {
    $http({
      url: `${ApiUrl}dishes`,
      method: "GET",
    })
      .then(function (response) {
        var foodDishesData = {};
        var categories = response.data.map((item) => {
          var dishes = item.dishes.map(function (dish) {
            return {
              name: dish.name,
              price: dish.price,
              tag: dish.tag,
              tax: dish.tax,
              category: item.category,
              qty: 1,
              id: dish.id,
            };
          });
          foodDishesData[item.category] = dishes;
          return item.category;
        });

        cb({ categories: categories, foodDishes: foodDishesData });
      })
      .catch(function (error) {
        console.log(error);
      });
  };
});
// app.service("foodDishes", function ($http, $cookies) {
//   var cookieValue = $cookies.get("token");

//   this.getData = new Promise(function (resolve, reject) {
//     var data = $http({
//       url: `${ApiUrl}dishes`,
//       method: "GET",
//     });

//     console.log(data);
//     if (data) {
//       resolve(data);
//     } else {
//       reject("Didn't get Data");
//     }
// .then((response) => {
//   var foodDishes = response.data.map((item) => {
//     return {
//       id: item._id,
//       name: item.name,
//       price: item.price,
//       qty: 1,
//     };
//   });
//   resolve(foodDishes);
// })
// .catch((error) => {
//   console.log(error);
// });
//   });
// });
