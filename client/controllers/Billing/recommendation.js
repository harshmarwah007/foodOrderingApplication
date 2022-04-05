/** @format */
app.service("recommendation", function ($http, _) {
  var ApiUrl = "http://localhost:3000/food/";
  this.recommend = function (cart, cb) {
    // var stringifedCart = JSON.stringify(cart);
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
