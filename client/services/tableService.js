/** @format */

app.service("orderTableData", function ($http) {
  this.getTables = function (cb) {
    $http({
      url: "http://localhost:3000/orderTable",
      method: "GET",
    })
      .then(function (result) {
        cb(result);
      })
      .catch(function (error) {
        console.log(error);
      });
  };
  this.setTable = function () {};
});
