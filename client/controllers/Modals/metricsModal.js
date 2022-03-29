/** @format */
app.controller("metricsModalCtrl", function ($scope, $uibModalInstance, data) {
  $scope.data = data;
  $scope.cancel = function () {
    $uibModalInstance.dismiss("cancel");
  };
});
