/** @format */

var test = function ($q, $cookies, $location) {
  var cookieValue = $cookies.get("token");
  console.log(config);
  return {
    request: function (config) {
      config.headers = config.headers || {};

      if (cookieValue) {
        config.headers.common["Authorization"] = cookieValue;
      }

      return config;
    },
    requestError: function (rejection) {
      console.log(rejection);
      return $q.reject(rejection);
    },
    responseError: function (response) {
      if (response.status === 401 || response.status === 403) {
        $location.path("/login");
      }
      return $q.reject(response);
    },
  };
};

angular.module("myInterceptor", []).config(function ($httpProvider) {
  $httpProvider.interceptors.push(test);
});
