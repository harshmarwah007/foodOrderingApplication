/** @format */

app.controller("infoModalCtrl", function ($scope, $uibModalInstance, order) {
  $scope.order = order;
  $scope.date = moment(order.date).format("MMMM Do YYYY, h:mm:ss a");

  // $scope.okay = function () {
  //   $uibModalInstance.close();
  // };
  $scope.cancel = function () {
    $uibModalInstance.dismiss("cancel");
  };
});
