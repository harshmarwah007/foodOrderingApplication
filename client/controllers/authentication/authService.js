/** @format */

var app = angular.module("authentication", ["ngCookies"]);

// Register User
app.service("authentication", function ($cookies, $http, $location) {
  this.logOut = function () {
    console.log("LOGGED OUT");
    $cookies.remove("token");
    location.reload();
  };
  this.isAuthenticated = function () {
    if ($cookies.get("token")) {
      $location.path("/home");
    }
  };
  this.authenticate = function (address) {};
  this.login = function (username, password) {
    $http({
      url: "http://localhost:3000/user/login",
      method: "POST",
      data: {
        email: username,
        password: password,
      },
    })
      .then((response) => {
        $cookies.put("token", response.data.token);
        console.log(response.data.token);
        if (response.data.message == "loggedIn") {
          $location.path("/home");
        } else {
          alert("invalid Login");
        }
      })
      .catch((error) => {
        {
          console.log("auth error", error);
          alert(error.data.message || error.data || "Some error occured");
        }
      });
  };
  this.register = function (name, email, phone, password) {
    $http({
      url: "http://localhost:3000/user/register",
      method: "POST",
      data: {
        name: name,
        email: email,
        phone: phone,
        password: password,
      },
    })
      .then((response) => {
        if (response.data.message == "registered") {
          alert("You Successfully got registered");
          $location.path("/login");
        }
      })
      .catch((error) => {
        console.log("auth error", error);
        alert(error.data.message || error.data || "Some error occured");
      });
  };
});
