/** @format */

var app = angular.module("logIn", []);

app.controller("loginCtrl", function ($scope, authentication) {
  authentication.isAuthenticated();
  console.log("I am working");
  $scope.login = function () {
    var username = $scope.username;
    var password = $scope.password;

    try {
      authentication.login(username, password);
    } catch (error) {
      alert("Server not responding");
    }
  };
});


