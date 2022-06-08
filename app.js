const express = require("express");
const path = require("path");
const http = require("http");
const app = express();
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

app.use(express.static(path.join(__dirname, "public")));

app.get("/", (_, res) => {
  res.sendFile(__dirname + "/index.html");
});

const users = [];

io.on("connection", (socket) => {
  // console.log(socket.handshake.query.userName);
  users.push({ userName: socket.handshake.query.userName, id: socket.id });
  console.log(users);

  io.emit("users", users);

  io.emit("chat message", "new user connected");

  socket.on("writing", (id) => {
    io.emit(
      "writing",
      users.map((user) => {
        return user.id === id ? user.userName : null;
      })[0] + " is writing..."
    );
  });

  socket.on("chat message", (msg) => {
    console.log("message: " + msg);
    io.emit("chat message", msg);
  });

  socket.on("disconnect", () => {
    users.splice(users.indexOf(socket.id), 1);
  });
});

server.listen(3000, () => {
  console.log("listening on *:3000");
});
