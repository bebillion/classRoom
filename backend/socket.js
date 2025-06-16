const socketHandler = (io) => {
  io.on("connection", (socket) => {
    console.log("User connected");

    socket.on("join-room", ({ roomId, user }) => {
      socket.join(roomId);
      io.to(roomId).emit("update-participants", { user, action: "joined" });
    });

    socket.on("leave-room", ({ roomId, user }) => {
      socket.leave(roomId);
      io.to(roomId).emit("update-participants", { user, action: "left" });
    });

    socket.on("disconnect", () => {
      console.log("User disconnected");
    });
  });
};

export default socketHandler;
