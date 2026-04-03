const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");

const app = express();
const server = http.createServer(app);

// 优化Socket.io配置，启用长轮询和CORS
const io = new Server(server, {
  cors: {
    origin: "*", // 允许所有来源，生产环境中应该设置为具体的域名
    methods: ["GET", "POST"],
    credentials: true
  },
  transports: ["polling", "websocket"], // 优先使用轮询，确保在Vercel上也能工作
  allowEIO3: true
});

// 静态文件服务（index.html / style.css / chat.js）
app.use(express.static(path.join(__dirname)));

// 根路径路由
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// 确保所有静态文件都能被正确访问
app.get("/style.css", (req, res) => {
  res.sendFile(path.join(__dirname, "style.css"));
});

app.get("/chat.js", (req, res) => {
  res.sendFile(path.join(__dirname, "chat.js"));
});

// 在线用户映射：userId → socketId
const onlineUsers = new Map();

// 定期广播在线用户列表
function broadcastOnlineUsers() {
  const onlineList = Array.from(onlineUsers.keys());
  console.log("Broadcasting online list to all clients:", onlineList);
  io.emit("onlineList", onlineList);
}

// 每3秒广播一次在线用户列表
setInterval(broadcastOnlineUsers, 3000);

io.on("connection", (socket) => {
  console.log("New client connected:", socket.id);
  console.log("Transport used:", socket.conn.transport.name);
  let userId = null;

  // 用户加入
  socket.on("userJoin", (id) => {
    console.log("User joined:", id);
    userId = id;
    onlineUsers.set(id, socket.id);
    // 立即广播在线用户列表
    broadcastOnlineUsers();
  });

  // 私聊消息转发
  socket.on("sendPrivateMsg", (data) => {
    const targetSocketId = onlineUsers.get(data.to);
    if (targetSocketId) {
      io.to(targetSocketId).emit("newPrivateMsg", data);
    }
  });

  // 双向销毁转发
  socket.on("clearBothChat", (data) => {
    const targetSocketId = onlineUsers.get(data.to);
    if (targetSocketId) {
      io.to(targetSocketId).emit("clearBothChat", data);
    }
  });

  // 已读回执转发
  socket.on("markAsRead", (data) => {
    const targetSocketId = onlineUsers.get(data.from);
    if (targetSocketId) {
      io.to(targetSocketId).emit("messagesRead", data);
    }
  });

  // 客户端请求在线用户列表
  socket.on("requestOnlineList", () => {
    const onlineList = Array.from(onlineUsers.keys());
    console.log("Sending online list to client:", onlineList);
    socket.emit("onlineList", onlineList);
  });

  // 用户断开
  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
    if (userId) {
      onlineUsers.delete(userId);
      // 立即广播在线用户列表
      broadcastOnlineUsers();
    }
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ 霁语·轻聊 服务已启动: http://localhost:${PORT}`);
});