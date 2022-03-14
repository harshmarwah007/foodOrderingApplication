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

/** @format */

// var app = angular.module("main", [
//   "ngRoute",
//   "ngCookies",
//   "ui.router",
//   "dashboard",
//   "registerCtrl",
//   "logIn",
//   "history",
//   "metrics",
//   "customerLogin",
// ]);

// app.config(function ($stateProvider, $urlRouterProvider) {
//   $stateProvider
//     .state("customerLogin", {
//       url: "/customerLogin",
//       templateUrl: "./components/customerLogin.html",
//       controller: "customerLoginCtrl",
//     })
//     .state("login", {
//       resolve: {
//         function($location, $cookies) {
//           if ($cookies.get("token")) {
//             $location.path("/home");
//           }
//         },
//       },
//       url: "/login",
//       templateUrl: "./components/login.html",
//       controller: "loginCtrl",
//     })
//     .state("register", {
//       resolve: {
//         function($location, $cookies) {
//           if ($cookies.get("token")) {
//             $location.path("/home");
//           }
//         },
//       },
//       url: "/register",
//       templateUrl: "./components/register.html",
//       controller: "registerCtrl",
//     })
//     .state("home", {
//       abstract: true,
//       resolve: {
//         auth: authenticate,
//       },
//       url: "/",
//       templateUrl: "./components/home.html",
//       controller: "dashboardCtrl",
//     })
//     .state("home.dashboard", {
//       resolve: {
//         auth: authenticate,
//       },
//       url: "",
//       templateUrl: "./components/dashboard.html",
//     })
//     .state("home.metrics", {
//       resolve: {
//         auth: authenticate,
//       },
//       url: "metrics",
//       controller: "metricsCtrl",
//       templateUrl: "./components/metrics.html",
//     })
//     .state("home.history", {
//       resolve: {
//         auth: authenticate,
//       },

//       url: "history",
//       controller: "historyCtrl",
//       templateUrl: "./components/history.html",
//     });
//   $urlRouterProvider.otherwise("/");

//   // function authenticate($q, $state, $timeout, $cookies) {
//   //   if ($cookies.get("token")) {
//   //     return $q.when();
//   //   } else {
//   //     $timeout(function () {
//   //       // This code runs after the authentication promise has been rejected.
//   //       // Go to the log-in page
//   //       $state.go("/login");
//   //     });
//   //     // Reject the authentication promise to prevent the state from loading
//   //     return $q.reject();
//   //   }
//   // }
// });
