/** @format */

var app = angular.module("ordersFactory", [
  "socketio",
  "ordersData",
  "ordersFactory",
]);
app.factory("ordersFactory", function (ordersData, socket, _) {
  // these are general functions
  var findItemById = function (items, id) {
    return _.find(items, function (item) {
      return item.id === id;
    });
  };

  return function () {
    var outer = this;
    this.newOrder;
    this.cart = [];

    this.statusOptions = ["Preparing", "Prepared", "Completed"];
    this.getCost = function (item) {
      return item.qty * item.price;
    };

    this.addItem = function (itemToAdd) {
      var found = findItemById(outer.cart, itemToAdd.id);
      if (found) {
        found.qty += itemToAdd.qty;
      } else {
        outer.cart.push(angular.copy(itemToAdd));
      }
    };
    this.getTotal = function () {
      var total = _.reduce(
        outer.cart,
        function (sum, item) {
          return sum + outer.getCost(item);
        },
        0
      );
      //! comment it out if required
      //   $scope.total = total;
      return total;
    };

    this.clearCart = function () {
      outer.cart.length = 0;
    };

    this.removeItem = function (item) {
      var index = outer.cart.indexOf(item);
      outer.cart.splice(index, 1);
    };

    this.statusChange = function (orderStatusValue, orderId, order) {
      var currentTime = new Date();
      socket.emit("generateNotification", {
        orderId: orderId,
        receiverName: order.customerName + order.customerContact,
        orderStatus: orderStatusValue,
        date: currentTime,
        data: order,
      });

      ordersData.changeStatus(orderStatusValue, orderId, order, function () {});
    };

    this.createOrder = function (
      customerName,
      customerContact,
      orderType,
      tableNumber,
      cb
    ) {
      var orderTableNumber;
      if (!outer.cart.length) {
        return alert("Add Items to Cart");
      }
      if (!customerContact) {
        return alert("Enter Customer Details");
      }
      if (!customerName) {
        return alert("Enter Customer Details");
      }

      if (orderType == "dineIn" && !tableNumber) {
        return alert("Please select Table");
      }
      if (orderType == "dineIn") {
        orderTableNumber = tableNumber;
      } else {
        orderTableNumber = null;
      }

      var retVal = confirm("Do you want to Confirm Order ?");
      if (retVal == true) {
        var orderAmount = outer.getTotal();
        var dishList = _.sortBy(outer.cart, [
          function (item) {
            item.name;
          },
        ]);
        ordersData.createOrder(
          orderAmount,
          dishList,
          customerContact,
          customerName.toLowerCase(),
          orderType,
          orderTableNumber,
          function (response) {
            console.log("created", response.data.savedOrder);
            var order = response.data.savedOrder;
            socket.emit("OrderNotification", order);
            cb(response.data.savedOrder);
          }
        );
      }
    };
    this.updateOrder = function (
      customerName,
      customerContact,
      order,
      orderType,
      tableNumber,
      previousTableNumber
    ) {
      console.log("contact", customerContact);
      console.log("name", customerName);
      if (!outer.cart.length) {
        alert("Add Items to Cart");
        return false;
      }
      if (!customerName) {
        alert("Enter Customer Name");
        return false;
      }
      if (!customerContact) {
        alert("Enter Customer Details");
        return false;
      }
      var phoneno = /^\d{10}$/;

      var phonenoValidate = function () {
        if (String(customerContact).match(phoneno)) {
          return true;
        } else {
          return false;
        }
      };

      if (!phonenoValidate()) {
        alert("Enter Valid Contact Number");
        return false;
      }

      var retVal = confirm("Do you want to Update Order ?");
      if (retVal == true) {
        var orderAmount = outer.getTotal();
        var dishList = outer.cart;
        var updatedOrder = order;
        updatedOrder.customerName = customerName;
        updatedOrder.customerContact = customerContact;
        updatedOrder.dishList = dishList;
        updatedOrder.orderAmount = orderAmount;
        updatedOrder.orderType = orderType;
        if (orderType == "dineIn") {
          updatedOrder.orderTableNumber = tableNumber;
        } else {
          updatedOrder.orderTableNumber = null;
        }
        // console.log("orderrrrr", previousTableNumber);
        ordersData.updateOrder(
          updatedOrder,
          order,
          previousTableNumber,
          function (response) {
            console.log(response);
          }
        );
      }
      return true;
    };
    //!
  };
});
