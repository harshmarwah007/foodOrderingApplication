/** @format */

var app = angular.module("foodDishes", ["ngCookies"]);

// Service for Food Dishes
app.service("foodDishes", function ($http, config) {
  this.getData = function (cb) {
    $http({
      url: `${config.apiUrl}dishes`,
      method: "GET",
    })
      .then(function (response) {
        var allDishes = [];
        var categories = response.data.dishes.map((item) => {
          item.subCategory.map(function (subCategory) {
            subCategory.dishes.map(function (dish) {
              dish["qty"] = 1;
              allDishes.push(dish);
            });
          });
          return item;
        });

        allDishes = angular.copy(allDishes);
        categories = angular.copy(categories);
        var recommendationData = response.data.recommendationData;
        cb({ categories, allDishes, recommendationData });
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
