const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// 静态文件服务（index.html / style.css / chat.js）
app.use(express.static(path.join(__dirname)));

// 根路径路由
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// 在线用户映射：userId → socketId
const onlineUsers = new Map();

io.on("connection", (socket) => {
  let userId = null;

  // 用户加入
  socket.on("userJoin", (id) => {
    userId = id;
    onlineUsers.set(id, socket.id);
    io.emit("onlineList", Array.from(onlineUsers.keys()));
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

  // 用户断开
  socket.on("disconnect", () => {
    if (userId) {
      onlineUsers.delete(userId);
      io.emit("onlineList", Array.from(onlineUsers.keys()));
    }
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`✅ 霁语·轻聊 服务已启动: http://localhost:${PORT}`);
});
