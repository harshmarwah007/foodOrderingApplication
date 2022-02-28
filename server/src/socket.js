/** @format */
var onlineUsers = [];
const addNewUser = (username, socketId) => {
  !onlineUsers.some((user) => user.username === username) &&
    onlineUsers.push({ username, socketId });
};
const removeUser = (socketId) => {
  onlineUsers = onlineUsers.filter((user) => user.socketId !== socketId);
};
const getUser = (username) => {
  return onlineUsers.find((user) => user.username === username);
};

var getSocket = function (io) {
  io.on("connection", (socket) => {
    console.log("Connected...");
    socket.on("newUser", (username) => {
      addNewUser(username, socket.id);
    });
    // { orderId, receiverName, orderStatus, date, data }
    socket.on("OrderNotification", (order) => {
      const receiverName = order.customerName + order.customerContact;
      const receiver = getUser(receiverName);
      io.to(receiver?.socketId).emit("createOrderNotification", order);
    });
    socket.on(
      "generateNotification",
      ({ orderId, receiverName, orderStatus, date, data }) => {
        const receiver = getUser(receiverName);
        io.to(receiver?.socketId).emit("notification", {
          orderId,
          orderStatus,
          data,
          date,
        });
      }
    );

    socket.on("disconnect", () => {
      console.log("disconnected");
      removeUser(socket.id);
    });
  });
};
module.exports = getSocket;
