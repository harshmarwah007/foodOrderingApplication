/** @format */

var app = angular.module("authentication", ["ngCookies"]);

// Register User
app.service("authentication", function ($cookies, $http, config, $location) {
  this.logOut = function () {
    $cookies.remove("token");
    location.reload();
  };
  this.isAuthenticated = function () {
    if ($cookies.get("token")) {
      $location.path("/home");
    }
  };

  this.login = function (username, password) {
    $http({
      url: `${config.baseUrl}/user/login`,
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
      url: `${config.baseUrl}/user/register`,
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
