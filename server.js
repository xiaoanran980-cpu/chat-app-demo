const http = require('http');
const fs = require('fs');
const path = require('path');
const WebSocket = require('ws');

// 创建HTTP服务器
const server = http.createServer((req, res) => {
    let filePath = '.' + req.url;
    if (filePath === './') filePath = './index.html'; // 默认访问index.html

    // 配置文件MIME类型
    const extname = path.extname(filePath);
    let contentType = 'text/html';
    switch (extname) {
        case '.js': contentType = 'text/javascript'; break;
        case '.css': contentType = 'text/css'; break;
        case '.json': contentType = 'application/json'; break;
    }

    // 读取并返回文件
    fs.readFile(filePath, (error, content) => {
        if (error) {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('404 - 文件未找到', 'utf-8');
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
});

// 创建WebSocket服务
const wss = new WebSocket.Server({ server });
// 存储客户端：key=ws实例，value=用户ID
const clients = new Map();

// 监听WebSocket连接
wss.on('connection', (ws) => {
    // 生成唯一用户ID
    const userId = `ID_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    clients.set(ws, userId);
    console.log(`用户${userId}已连接，当前在线：${clients.size}人`);

    // 给新连接用户发送自己的ID
    ws.send(JSON.stringify({ type: 'id', id: userId }));
    // 广播最新在线用户列表
    broadcastOnlineList();

    // 监听客户端消息
    ws.on('message', (data) => {
        try {
            const packet = JSON.parse(data);
            const fromId = clients.get(ws); // 消息发送方ID

            switch (packet.type) {
                case 'msg':
                    // 转发【普通消息】给指定接收方
                    forwardMessage(packet.type, {
                        from: fromId,
                        msg: packet.msg,
                        msgId: packet.msgId
                    }, packet.to);
                    break;
                case 'deliver_ack':
                    // 转发【送达回执】给消息原发送方
                    forwardMessage(packet.type, { msgId: packet.msgId }, packet.to);
                    break;
                case 'read_ack':
                    // 转发【已读回执】给消息原发送方
                    forwardMessage(packet.type, { msgId: packet.msgId }, packet.to);
                    break;
            }
        } catch (err) {
            console.error('消息解析失败：', err);
        }
    });

    // 监听连接关闭
    ws.on('close', () => {
        const userId = clients.get(ws);
        clients.delete(ws);
        console.log(`用户${userId}已断开，当前在线：${clients.size}人`);
        broadcastOnlineList(); // 广播更新后的在线列表
    });

    // 监听连接错误
    ws.on('error', (err) => {
        console.error('客户端连接错误：', err);
    });
});

// 转发消息给指定用户
function forwardMessage(type, data, toId) {
    for (const [ws, userId] of clients) {
        if (userId === toId && ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({ type, ...data }));
            break;
        }
    }
}

// 广播在线用户列表给所有客户端
function broadcastOnlineList() {
    const userList = Array.from(clients.values());
    const listData = JSON.stringify({ type: 'list', list: userList });
    wss.clients.forEach((ws) => {
        if (ws.readyState === WebSocket.OPEN) {
            ws.send(listData);
        }
    });
}

// 启动服务器
const PORT = 3000;
server.listen(PORT, () => {
    console.log(`✅ 服务启动成功！访问地址：http://localhost:${PORT}`);
    console.log(`✅ WebSocket服务已启动，监听端口：${PORT}`);
});