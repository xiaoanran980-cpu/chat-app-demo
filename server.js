const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// 静态文件服务（index.html / style.css / chat.js）
app.use(express.static(__dirname));

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

io.on("connection", (socket) => {
  console.log("New client connected:", socket.id);
  let userId = null;

  // 用户加入
  socket.on("userJoin", (id) => {
    console.log("User joined:", id);
    userId = id;
    onlineUsers.set(id, socket.id);
    // 广播给所有客户端，包括新加入的用户
    const onlineList = Array.from(onlineUsers.keys());
    console.log("Broadcasting online list:", onlineList);
    io.emit("onlineList", onlineList);
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
      // 广播给所有客户端
      const onlineList = Array.from(onlineUsers.keys());
      console.log("Broadcasting online list after disconnect:", onlineList);
      io.emit("onlineList", onlineList);
    }
  });
  
  // 定时广播在线用户列表，确保所有客户端都能收到最新的列表
  const interval = setInterval(() => {
    if (onlineUsers.size > 0) {
      const onlineList = Array.from(onlineUsers.keys());
      console.log("Scheduled broadcast of online list:", onlineList);
      io.emit("onlineList", onlineList);
    }
  }, 5000); // 每5秒广播一次
  
  // 清理定时器
  socket.on("disconnect", () => {
    clearInterval(interval);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`✅ 霁语·轻聊 服务已启动: http://localhost:${PORT}`);
});