/** @format */

var app = angular.module("metricsData", ["ngCookies"]);

app.service("metricsData", function ($http, config) {
  this.getMetricsData = function (cb) {
    try {
      $http({
        url: `${config.apiUrl}metrics`,
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
