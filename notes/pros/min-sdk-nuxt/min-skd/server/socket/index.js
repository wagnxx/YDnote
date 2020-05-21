module.exports = {
  io(io) {
    io.on("connection", socket => {
      socket.on("register", msg => {
        io.emit("register-success", msg);
      });
      socket.on("sendMsg", msg => {
        io.emit("sendMsg-success", msg);
      });


      socket.on("disconnect", () => {
        console.log("user disconnected!");
      });
    });
  }
};
