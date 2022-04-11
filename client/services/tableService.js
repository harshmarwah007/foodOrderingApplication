/** @format */

app.service("orderTableData", function ($http, config) {
  this.getTables = function (cb) {
    $http({
      url: `${config.baseUrl}/orderTable`,
      method: "GET",
    })
      .then(function (result) {
        cb(result);
      })
      .catch(function (error) {
        console.log(error);
      });
  };
});
