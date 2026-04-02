const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  // 配置socket.io，确保即使页面在后台也能保持连接
  pingInterval: 10000,
  pingTimeout: 5000,
  reconnection: true,
  reconnectionAttempts: Infinity,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000
});

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
  let userId = null;

  // 用户加入
  socket.on("userJoin", (id) => {
    userId = id;
    onlineUsers.set(id, socket.id);
    // 广播给所有客户端，包括新加入的用户
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

  // 客户端请求在线用户列表
  socket.on("requestOnlineList", () => {
    socket.emit("onlineList", Array.from(onlineUsers.keys()));
  });

  // 用户断开
  socket.on("disconnect", () => {
    if (userId) {
      onlineUsers.delete(userId);
      // 广播给所有客户端
      io.emit("onlineList", Array.from(onlineUsers.keys()));
    }
  });
  
  // 定时广播在线用户列表，确保所有客户端都能收到最新的列表
  const interval = setInterval(() => {
    if (onlineUsers.size > 0) {
      io.emit("onlineList", Array.from(onlineUsers.keys()));
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