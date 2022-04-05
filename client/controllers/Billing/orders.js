/** @format */

var app = angular.module("ordersFactory", [
  "socketio",
  "ordersData",
  "ordersFactory",
]);
app.factory("ordersFactory", function (ordersData, recommendation, socket, _) {
  var findItemById = function (items, id) {
    return _.find(items, function (item) {
      return item.id === id;
    });
  };

  return function () {
    var outer = this;
    this.allDishes;
    this.newOrder;
    this.cart = [];
    this.taxes = [];
    this.total = 0;
    this.totalTaxValue;
    this.recommendationData;
    this.statusOptions = ["Preparing", "Prepared", "Completed"];
    this.setAllDishesData = function (data) {
      outer.allDishes = data.allDishes;
      outer.recommendationData = data.recommendationData;
    };

    // this.recommendation = function (cb) {
    //   if (outer.cart.length) {
    //     if (outer.cart.length < 4) {
    //       recommendation.recommend(outer.cart, function (data) {
    //         cb(data);
    //       });
    //     } else {
    //       cb([]);
    //     }
    //   } else {
    //     cb([]);
    //   }
    // };

    this.getCost = function (item) {
      return item.qty * item.price;
    };
    this.getTotalTax = function () {
      var totalTaxValue = outer.taxes.reduce(function (
        previousValue,
        currentValue
      ) {
        return previousValue + currentValue.taxValue;
      },
      0);
      return totalTaxValue;
    };
    this.getTax = function () {
      outer.taxes = [];
      outer.cart.map(function (item) {
        item.tax.forEach(function (typeOfTax) {
          if (typeOfTax.applicable) {
            var found = _.findIndex(outer.taxes, { name: typeOfTax.name });

            var taxValue = (item.price * typeOfTax.value) / 100;

            if (found >= 0) {
              var newTaxValue = taxValue + outer.taxes[found]["taxValue"];
              outer.taxes[found]["taxValue"] = newTaxValue;
            } else {
              outer.taxes.push({
                name: typeOfTax.name,
                taxValue: taxValue,
              });
            }
          }
        });
      });

      outer.totalTaxValue = outer.getTotalTax();
    };

    var getNewTax = function (itemToAdd) {
      var newTax = itemToAdd.tax.map(function (tax) {
        if (tax.applicable) {
          var price = itemToAdd.price;
          var value = tax.value;

          var taxValue = (price * value) / 100;

          return {
            name: tax.name,
            value: tax.value,
            taxAmount: taxValue,
            applicable: tax.applicable,
          };
        } else {
          return {
            name: tax.name,
            value: tax.value,
            taxAmount: 0,
            applicable: tax.applicable,
          };
        }
      });
      return newTax;
    };
    var addTaxToItem = function (itemToAdd, found) {
      if (found) {
        var newTax = getNewTax(found);

        found.tax = newTax;
      } else {
        var newTax = getNewTax(itemToAdd);
        itemToAdd.tax = newTax;
        return itemToAdd;
      }
    };

    this.addItem = function (itemToAdd) {
      var found = findItemById(outer.cart, itemToAdd.id);
      if (found) {
        addTaxToItem(itemToAdd, found);
        found.qty += itemToAdd.qty;
      } else {
        var updatedItem = addTaxToItem(itemToAdd, found);
        outer.cart.push(angular.copy(updatedItem));
      }
      outer.getTotal();
    };

    this.getTotal = function () {
      outer.getTax();
      var total = _.reduce(
        outer.cart,
        function (sum, item) {
          return sum + outer.getCost(item);
        },
        0
      );
      outer.total = total;
      return total;
    };

    this.clearCart = function () {
      outer.cart.length = 0;
      outer.getTotal();
    };

    this.removeItem = function (item) {
      var index = outer.cart.indexOf(item);
      outer.cart.splice(index, 1);
      outer.getTotal();
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
        var totalAmount = outer.getTotal();
        var taxes = outer.taxes;
        var totalTaxValue = outer.totalTaxValue;
        var orderAmount = totalAmount + totalTaxValue;
        var dishList = _.sortBy(outer.cart, [
          function (item) {
            item.name;
          },
        ]);
        ordersData.createOrder(
          totalAmount,
          taxes,
          totalTaxValue,
          orderAmount,
          dishList,
          customerContact,
          customerName.toLowerCase(),
          orderType,
          orderTableNumber,
          function (response) {
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
        var totalAmount = outer.getTotal();
        var taxes = outer.taxes;
        var totalTaxValue = outer.totalTaxValue;
        var orderAmount = totalAmount + totalTaxValue;
        var dishList = outer.cart;
        var updatedOrder = order;
        updatedOrder.customerName = customerName;
        updatedOrder.customerContact = customerContact;
        updatedOrder.dishList = dishList;
        updatedOrder.orderAmount = orderAmount;
        updatedOrder.totalAmount = totalAmount;
        updatedOrder.taxes = taxes;
        updatedOrder.totalTaxValue = totalTaxValue;
        updatedOrder.orderType = orderType;
        if (orderType == "dineIn") {
          updatedOrder.orderTableNumber = tableNumber;
        } else {
          updatedOrder.orderTableNumber = null;
        }

        ordersData.updateOrder(
          updatedOrder,
          order,
          previousTableNumber,
          function (response) {
            console.log(response);
          }
        );
      }
      return {
        updatedOrder: updatedOrder,
      };
    };
    //!
  };
});
