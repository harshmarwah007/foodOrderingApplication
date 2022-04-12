/** @format */

app.factory("authInterceptor", function ($q, $cookies, $location) {
  return {
    request: function (config) {
      if ($cookies.get("token")) {
        config.headers.Authorization = $cookies.get("token");
      } else {
        $location.path("/login");
      }
      return config;
    },
    responseError: function (response) {
      if (response.status == 401 || response.status == 403) {
        $location.path("/login");
        // $cookies.remove("token");
        return $q.reject(response);
      } else {
        return $q.reject(response);
      }
    },
  };
});

app.run(function ($rootScope, $location, $cookies) {
  $rootScope.$on("$locationChangeStart", function () {
    // console.log($location.path());
    var currentPath = $location.path();
    console.log(currentPath);
    if (currentPath != "/login" && currentPath != "/register") {
      if (!$cookies.get("token")) {
        $location.path("/login");
      }
    }
  });
});
