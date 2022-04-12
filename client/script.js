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
]);

app.constant("config", {
  apiUrl: "http://localhost:3000/food/",
  baseUrl: "http://localhost:3000",
});

app.config(function ($stateProvider, $urlRouterProvider, $httpProvider) {
  $stateProvider
    .state("login", {
      // resolve: {
      //   check: function ($location, $cookies) {
      //     if ($cookies.get("token")) {
      //       $location.path("/home");
      //     }
      //   },
      // },
      url: "/login",
      templateUrl: "./components/login.html",
      controller: "loginCtrl",
    })
    .state("register", {
      url: "/register",
      templateUrl: "./components/register.html",
      controller: "registerCtrl",
    })
    .state("customerLogin", {
      url: "/customerLogin",
      templateUrl: "./components/customerLogin.html",
      controller: "customerLoginCtrl",
    })

    .state("home", {
      abstract: true,
      url: "/",
      templateUrl: "./components/home.html",
      controller: "dashboardCtrl",
    })
    .state("home.dashboard", {
      url: "",
      templateUrl: "./components/dashboard.html",
    })
    .state("home.metrics", {
      url: "metrics",
      templateUrl: "./components/metrics.html",
      controller: "metricsCtrl",
    })
    .state("home.history", {
      url: "history",
      templateUrl: "./components/history.html",
      controller: "historyCtrl",
    });
  $urlRouterProvider.otherwise("/");
  $httpProvider.interceptors.push("authInterceptor");
});
