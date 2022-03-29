/** @format */

var app = angular.module("metricsData", ["ngCookies"]);
var ApiUrl = "http://localhost:3000/food/";

app.service("metricsData", function ($http) {
  this.getMetricsData = function (cb) {
    try {
      $http({
        url: `${ApiUrl}metrics`,
        method: "GET",
        // headers: {
        //   Authorization: cookieValue,
        // },
      })
        .then(function (metrics) {
          cb(metrics);
        })
        .catch(function (error) {
          console.log("error there", error);
        });
    } catch (error) {
      console.log(error);
    }
  };
});
