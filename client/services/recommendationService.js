/** @format */
app.service("recommendation", function ($http, config, _) {
  var ApiUrl = config.apiUrl;
  this.recommend = function (cart, cb) {
    var cartOfIds = cart.map(function (item) {
      return item.id;
    });
    var stringifedCart = JSON.stringify(cartOfIds);
    return $http({
      url: `${ApiUrl}recommendations/?cart=${stringifedCart}`,
      method: "GET",
    }).then(function (data) {
      var dishes = data.data.map(function (dish) {
        dish["id"] = dish._id;
        dish["qty"] = 1;
        return dish;
      });
      cb(dishes);
    });
  };
});
