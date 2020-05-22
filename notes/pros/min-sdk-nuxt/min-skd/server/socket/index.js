module.exports = {
  io(io) {
    io.on("connection", socket => {
      socket.on("register", msg => {
        io.emit("register-success", msg);
      });
      socket.on("sendMsg", msg => {
        io.emit("sendMsg-success", msg);
      });


    //   io.emit('connection','链接成功')

      socket.on("disconnect", () => {
        console.log("user disconnected!");
      });
    });
  }
};
