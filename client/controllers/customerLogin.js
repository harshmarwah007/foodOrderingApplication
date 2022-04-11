/** @format */

var app = angular.module("customerLogin", ["socketio"]);

app.controller("customerLoginCtrl", function ($scope, socket) {
  $scope.warnMessage = true;
  var username;
  do {
    username = prompt("Enter Your Name and Contact Number without space");
  } while (!username);
  let messageArea = document.querySelector(".message__area");

  socket.emit("newUser", username);

  function appendCreatedOrder(data) {
    console.log(data, data);
    let mainDiv = document.createElement("div");
    mainDiv.classList.add("outgoing", "message");
    date = moment(data.date).fromNow();

    var markup2 = data.data.dishList
      .map(function (item) {
        return `<li>${item.name} ${item.price} * ${item.qty}</li>`;
      })
      .join("");
    let markUp = `
      <h4>${data.orderId}</h4>
      <p><b><span id="customerName">Hey! ${data.data.customerName}</span></b><br>
      OrderType : ${data.data.orderType}<br>
      Your New order:`;
    let markup3 = `<br>
    <b>Amount : ₹${data.data.orderAmount}</b> <br>
    Order Satus : <b><u>Preparing</u></b>
    </p>
    <h5>${date}</h5>`;
    mainDiv.innerHTML = markUp + markup2 + markup3;
    messageArea.appendChild(mainDiv);
    $scope.warnMessage = false;
  }

  function appendNotification(data) {
    console.log(data, data);
    let mainDiv = document.createElement("div");
    mainDiv.classList.add("outgoing", "message");
    date = moment(data.date).fromNow();
    let markUp = `
      <h4>${data.orderId}</h4>
      <p><b><span id="customerName">${data.data.customerName}</span></b><br>
      Your order is ${data.orderStatus}<br><br>
      </p>
      <h5>${date}</h5>`;
    mainDiv.innerHTML = markUp;
    messageArea.appendChild(mainDiv);
    $scope.warnMessage = false;
    messageArea.scrollTop = messageArea.scrollHeight;
  }

  // recieve messsage
  socket.on("notification", function (data) {
    appendNotification(data);
  });

  socket.on("createOrderNotification", function (data) {
    appendCreatedOrder({
      data: data,
      date: data.date,
      orderId: data._id,
      orderStatus: data.orderStatus,
      dishList: data.dishList,
    });
  });
});

app.directive("ngEnter", function () {
  return function (scope, element, attrs) {
    element.bind("keydown keypress", function (event) {
      if (event.which === 13) {
        scope.$apply(function () {
          scope.$eval(attrs.ngEnter);
        });

        event.preventDefault();
      }
    });
  };
});
