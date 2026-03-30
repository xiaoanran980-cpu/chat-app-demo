let ws, to = '', t = 10;
const myid = document.getElementById('myid');
const toid = document.getElementById('toid');
const ulist = document.getElementById('ulist');
const msg = document.getElementById('msg');
const text = document.getElementById('text');
const s = document.getElementById('s');
const n = document.getElementById('n');

// 待确认消息：{msgId: {el: 消息元素, to: 接收方ID}}
const pendingMessages = new Map();
// 已读观察者
let readObserver = null;
// 在线用户列表（用于判断对方是否在线）
let onlineUsers = [];

function connect() {
    ws = new WebSocket('ws://' + window.location.host);
    ws.onopen = () => console.log('WebSocket连接成功');
    ws.onmessage = (e) => {
        const data = JSON.parse(e.data);
        switch (data.type) {
            case 'id':
                myid.innerText = data.id;
                break;
            case 'list':
                onlineUsers = data.list; // 更新在线用户
                showList(data.list);
                break;
            case 'msg':
                // 接收方收到消息，发送【送达回执】给服务器
                ws.send(JSON.stringify({
                    type: 'deliver_ack',
                    to: data.from,
                    msgId: data.msgId
                }));
                // 显示对方消息并监听已读
                showMsg(data.from, data.msg, false, data.msgId);
                break;
            case 'deliver_ack':
                // 发送方收到【送达回执】，更新为已送达
                markMessageAsDelivered(data.msgId);
                break;
            case 'read_ack':
                // 发送方收到【已读回执】，更新为已读
                markMessageAsRead(data.msgId);
                break;
        }
    };
    // 连接断开重连
    ws.onclose = () => {
        console.log('连接断开，正在重连...');
        setTimeout(connect, 1500);
    };
    ws.onerror = (err) => console.error('连接错误：', err);
}

// 渲染在线用户列表
function showList(list) {
    ulist.innerHTML = '';
    list.forEach(id => {
        if (id !== myid.innerText) {
            const div = document.createElement('div');
            div.className = 'user-item';
            div.innerText = id;
            div.onclick = () => {
                to = id;
                toid.value = id;
            };
            ulist.appendChild(div);
        }
    });
}

// 选择聊天对象
function selectUser() {
    if (!toid.value) return alert('请输入对方ID！');
    if (!onlineUsers.includes(toid.value)) {
        alert('对方当前不在线！');
        return;
    }
    to = toid.value;
}

// 生成唯一消息ID
function generateMsgId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
}

// 显示消息
function showMsg(from, content, isMyMsg = false, msgId = null) {
    const div = document.createElement('div');
    div.className = isMyMsg ? 'my-msg' : 'to-msg';
    const currentMsgId = msgId || generateMsgId();
    div.dataset.msgId = currentMsgId;

    // 格式化时间 HH:MM:SS
    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;

    // 消息状态：自己发的显示状态，对方的隐藏
    const statusText = isMyMsg ? '未送达' : '';
    const statusClass = isMyMsg ? 'undelivered' : 'hidden';

    // 消息DOM结构
    div.innerHTML = `
        <div class="msg-content">${content}</div>
        <div class="msg-info">
            <span class="msg-time">${timeStr}</span>
            <span class="msg-status ${statusClass}">${statusText}</span>
        </div>
    `;

    msg.appendChild(div);
    msg.scrollTop = msg.scrollHeight; // 自动滚动到底部

    // 消息自动销毁
    if (t > 0) {
        setTimeout(() => div.remove(), t * 1000);
    }

    if (isMyMsg) {
        // 自己发送的消息：存入待确认列表
        pendingMessages.set(currentMsgId, {
            el: div,
            to: to
        });
    } else {
        // 对方发送的消息：监听是否进入可视区，触发已读回执
        observeMessageRead(div, from);
    }
}

// 监听消息是否进入可视区（触发已读回执）
function observeMessageRead(msgEl, fromId) {
    if (!readObserver) {
        readObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const msgId = entry.target.dataset.msgId;
                    // 发送【已读回执】给服务器
                    ws.send(JSON.stringify({
                        type: 'read_ack',
                        to: fromId,
                        msgId: msgId
                    }));
                    readObserver.unobserve(entry.target); // 停止监听，避免重复发送
                }
            });
        }, { threshold: 0.1 }); // 10%可见即判定为已读
    }
    readObserver.observe(msgEl);
}

// 更新消息为【已送达】
function markMessageAsDelivered(msgId) {
    const msgObj = pendingMessages.get(msgId);
    if (msgObj) {
        const statusEl = msgObj.el.querySelector('.msg-status');
        if (statusEl) {
            statusEl.classList.replace('undelivered', 'delivered');
            statusEl.textContent = '已送达';
        }
    }
}

// 更新消息为【已读】
function markMessageAsRead(msgId) {
    const msgObj = pendingMessages.get(msgId);
    if (msgObj) {
        const statusEl = msgObj.el.querySelector('.msg-status');
        if (statusEl) {
            statusEl.classList.replace('delivered', 'read');
            statusEl.textContent = '已读';
        }
        pendingMessages.delete(msgId); // 移除已确认的消息
    }
}

// 发送消息
function sendMessage() {
    if (!text.value.trim()) return alert('消息内容不能为空！');
    if (!to) return alert('请先选择聊天对象！');
    if (!onlineUsers.includes(to)) {
        if (!confirm('对方当前不在线，是否继续发送？（对方上线后可收到）')) {
            return;
        }
    }

    const msgId = generateMsgId();
    // 发送消息给服务器
    ws.send(JSON.stringify({
        type: 'msg',
        to: to,
        msg: text.value.trim(),
        msgId: msgId
    }));
    // 本地显示消息
    showMsg(myid.innerText, text.value.trim(), true, msgId);
    text.value = ''; // 清空输入框
}

// 消息销毁时间调节（滑块+数字输入联动）
s.oninput = () => {
    t = s.value;
    n.value = t;
};
n.oninput = () => {
    t = Number(n.value) || 0;
    t = Math.max(0, Math.min(60, t)); // 限制0-60秒
    s.value = t;
    n.value = t;
};

// 回车发送消息
text.onkeydown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
    }
};

// 初始化连接
connect();