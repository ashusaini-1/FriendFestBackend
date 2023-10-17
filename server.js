const app = require("./app");
const dotenv = require("dotenv");
const connectDatabase = require("./config/db");
const socketio = require("socket.io");
const server = require("http").Server(app);

dotenv.config({ path: "config/config.env" });

connectDatabase();

const PORT = process.env.PORT || 5500;

const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});
//for connection to recieve or send messages
io.on("connection", (client) => {
  client.on("send_message", (data) => {
    io.sockets.emit("receive_message", data);
  });
});

server.listen(PORT, () => {
  console.log(`server is connected on this PORT ${PORT}`);
});
