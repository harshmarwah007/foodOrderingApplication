/** @format */

var app = angular.module("registerCtrl", []);

app.controller("registerCtrl", function ($scope, authentication) {
  authentication.isAuthenticated();
  console.log("registeration working");
  $scope.register = function () {
    var name = $scope.name;
    var email = $scope.email;
    var phone = $scope.phone;
    var password = $scope.password;

    try {
      authentication.register(name, email, phone, password);
    } catch (error) {
      alert("server not responding please contact admin");
    }
  };
});
