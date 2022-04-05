/** @format */

var app = angular.module("main", [
  "ngRoute",
  "ngCookies",
  "ui.router",
  "registerCtrl",
  "logIn",
  "history",
  "metrics",
  "customerLogin",
  "foodDishes",
  "ui.bootstrap",
  "authentication",
  "ordersData",
  "ordersFactory",
]);

app.constant("config", {
  apiUrl: "http://localhost:3000/food/",
  baseUrl: "/",
  enableDebug: true,
});

app.config(function ($stateProvider, $urlRouterProvider) {
  $stateProvider
    .state("login", {
      resolve: {
        check: function ($location, $cookies) {
          if ($cookies.get("token")) {
            $location.path("/home");
          }
        },
      },
      url: "/login",
      templateUrl: "./components/login.html",
      controller: "loginCtrl",
    })
    .state("customerLogin", {
      url: "/customerLogin",
      templateUrl: "./components/customerLogin.html",
      controller: "customerLoginCtrl",
    })
    .state("register", {
      resolve: {
        check: function ($location, $cookies) {
          if ($cookies.get("token")) {
            $location.path("/home");
          }
        },
      },
      url: "/register",
      templateUrl: "./components/register.html",
      controller: "registerCtrl",
    })
    .state("home", {
      abstract: true,
      resolve: {
        check: function ($location, $cookies) {
          if (!$cookies.get("token")) {
            $location.path("/login");
          }
        },
      },
      url: "/",
      templateUrl: "./components/home.html",
      controller: "dashboardCtrl",
    })
    .state("home.dashboard", {
      resolve: {
        check: function ($location, $cookies) {
          if (!$cookies.get("token")) {
            $location.path("/login");
          }
        },
      },
      url: "",
      templateUrl: "./components/dashboard.html",
    })
    .state("home.metrics", {
      resolve: {
        check: function ($location, $cookies) {
          if (!$cookies.get("token")) {
            $location.path("/login");
          }
        },
      },
      url: "metrics",
      templateUrl: "./components/metrics.html",
      controller: "metricsCtrl",
    })
    .state("home.history", {
      resolve: {
        check: function ($location, $cookies) {
          if (!$cookies.get("token")) {
            $location.path("/login");
          }
        },
      },
      url: "history",
      templateUrl: "./components/history.html",
      controller: "historyCtrl",
    });
  $urlRouterProvider.otherwise("/");
});
