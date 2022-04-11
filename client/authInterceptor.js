/** @format */

app.factory("authInterceptor", function ($q, $cookies, $location) {
  return {
    request: function (config) {
      if ($cookies.get("token")) {
        config.headers.Authorization = $cookies.get("token");
      }
      return config;
    },
    responseError: function (response) {
      if (response.status === 401 || response.status === 403) {
        $location.path("/login");
        $cookies.remove("token");
        return $q.reject(response);
      } else {
        return $q.reject(response);
      }
    },
  };
});
