/** @format */

var app = angular.module("customerLogin", []);

app.controller("customerLoginCtrl", function ($scope, socket) {
  let messageArea = document.querySelector(".message__area");
  console.log("customer login working");
  $scope.value = "Harsh Marwah";
  console.log($scope.string);
  $scope.onEnter = function (string) {
    console.log("enter working");
    message = $scope.string;
    console.log($scope.string);
    sendMessage(message);
  };

  // textArea.addEventListener("keyup", function (e) {
  //   if (e.key === "Enter") {
  //     sendMessage(e.target.value);
  //   }
  // });

  function sendMessage(message) {
    let msg = {
      userName: "harsh",
      message: message.trim(),
    };
    appendMessage(msg, "outgoing");
    // send to server
    socket.emit("message", msg);
  }

  function appendMessage(msg, type) {
    let mainDiv = document.createElement("div");
    let className = type;
    mainDiv.classList.add(className, "message");
    let markUp = `
      <h4>${msg.userName}</h4>
      <p>${msg.message}</p> `;
    mainDiv.innerHTML = markUp;
    messageArea.appendChild(mainDiv);
  }

  // recieve messsage
  socket.on("message", function (msg) {
    appendMessage(msg, "incoming");
  });
});
app.factory("socket", function ($rootScope) {
  var socket = io.connect();
  return {
    on: function (eventName, callback) {
      socket.on(eventName, function () {
        var args = arguments;
        $rootScope.$apply(function () {
          callback.apply(socket, args);
        });
      });
    },
    emit: function (eventName, data, callback) {
      socket.emit(eventName, data, function () {
        var args = arguments;
        $rootScope.$apply(function () {
          if (callback) {
            callback.apply(socket, args);
          }
        });
      });
    },
  };
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
