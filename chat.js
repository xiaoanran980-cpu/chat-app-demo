// 配置socket.io连接，确保能正确连接到服务器
const socket = io({
  reconnection: true,
  reconnectionAttempts: Infinity,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  timeout: 20000,
  transports: ["polling", "websocket"] // 优先使用轮询，确保在各种环境下都能工作
});

const myId = document.getElementById("myId");
const targetId = document.getElementById("targetId");
const onlineUser = document.getElementById("onlineUser");
const selectBtn = document.getElementById("selectBtn");
const msgArea = document.getElementById("msgArea");
const msgInput = document.getElementById("msgInput");
const sendBtn = document.getElementById("sendBtn");
const clearBothBtn = document.getElementById("clearBothBtn");

let currentUserId = null;
let onlineUsersList = [];

// 成语ID池
const IDIOMS = ["一心一意","一丝不苟","一尘不染","一举两得","一鸣惊人","一马当先","一路顺风","一言九鼎","一诺千金","一表人才","二话不说","二龙戏珠","二泉映月","二惠竞爽","二姓之好","二八佳人","二满三平","二童一马","二分明月","二缶钟惑","三心二意","三长两短","三番五次","三顾茅庐","三阳开泰","三生有幸","三思而行","三头六臂","三更半夜","三教九流","四面八方","四平八稳","四通八达","四海为家","四分五裂","四体不勤","四海升平","四脚朝天","四大皆空","四战之地","五光十色","五颜六色","五体投地","五湖四海","五彩缤纷","五风十雨","五谷丰登","五内如焚","五世其昌","五蕴皆空","六神无主","六根清净","六六大顺","六尘不染","六趣轮回","六通四辟","六马仰秣","六尺之孤","六出奇计","六卿分职","七上八下","七零八落","七手八脚","七嘴八舌","七情六欲","七步之才","七窍生烟","七擒七纵","七开八得","七扭八歪","八面玲珑","八面威风","八仙过海","八方呼应","八斗之才","八拜之交","八窗玲珑","八府巡按","八砖学士","八索九丘","九牛一毛","九死一生","九霄云外","九九归一","九流三教","九原可作","九合一匡","九关虎豹","九衢三市","九阍虎豹","十全十美","十万火急","十拿九稳","十恶不赦","十面埋伏","十室九空","十步芳草","十荡十决","十行俱下","十载寒窗","百发百中","百依百顺","百折不挠","百家争鸣","百里挑一","百年好合","百感交集","百废俱兴","百孔千疮","百媚千娇","千方百计","千军万马","千言万语","千山万水","千变万化","千钧一发","千载难逢","千丝万缕","千疮百孔","千锤百炼","万水千山","万众一心","万象更新","万紫千红","万古长青","万里无云","万念俱灰","万马奔腾","万无一失","万籁俱寂","天长地久","天经地义","天罗地网","天昏地暗","天诛地灭","天造地设","天高地厚","天寒地冻","天翻地覆","天公作美","日新月异","日积月累","日理万机","日以继夜","日月如梭","日上三竿","日暮途穷","日薄西山","日夜兼程","日进斗金","山清水秀","山高水长","山穷水尽","山盟海誓","山明水秀","山珍海味","山摇地动","山呼海啸","山重水复","山环水抱","风花雪月","风吹雨打","风平浪静","风调雨顺","风尘仆仆","风华正茂","风雨同舟","风云变幻","风起云涌","风驰电掣","春暖花开","春色满园","春光明媚","春意盎然","春回大地","春和景明","春寒料峭","春花秋月","春兰秋菊","春树暮云","秋色宜人","秋高气爽","秋水伊人","秋毫无犯","秋月春风","秋菊傲骨","秋收冬藏","秋色平分","秋意深浓","秋虫唧唧","冰雪聪明","冰清玉洁","冰天雪地","冰肌玉骨","冰壶秋月","冰魂雪魄","冰消瓦解","冰炭不投","冰寒于水","冰解云散","一帆风顺","两全其美","四季平安","五福临门","七星高照","八方来财","九九同心","百花齐放","万事如意","前程似锦","壮志凌云","光明磊落","乘风破浪","福星高照","气宇轩昂","卓尔不群","鹏程万里","如花似玉","金玉满堂","宁静致远","海阔天空","大公无私","心怀若谷","温文尔雅","厚德载物","自强不息","安居乐业","国泰民安","人寿年丰","繁荣昌盛","欣欣向荣","蒸蒸日上","花好月圆","举案齐眉","永结同心","相亲相爱","莫逆之交","志同道合","患难与共","情同手足","肝胆相照","勤学苦练","废寝忘食","学而不厌","孜孜不倦","博览群书","博学多才","见多识广","才高八斗","学富五车","满腹经纶","见义勇为","助人为乐","拾金不昧","乐善好施","扶危济困","雪中送炭","解囊相助","拔刀相助","仗义疏财","勇往直前","坚持不懈","持之以恒","顽强拼搏","百折不挠","坚韧不拔","坚定不移","矢志不渝","锲而不舍","生龙活虎","朝气蓬勃","神采奕奕","精神焕发","神采飞扬","正大光明","堂堂正正","廉洁奉公","严于律己","两袖清风","克己奉公","公而忘私","刚正不阿","繁花似锦","绿草如茵","鸟语花香","山清水秀","湖光山色","风景如画","美不胜收","赏心悦目","心旷神怡","流连忘返"];

// ==============================================
// 生成随机用户ID
// ==============================================
function generateRandomUserId() {
  const randomIndex = Math.floor(Math.random() * IDIOMS.length);
  return IDIOMS[randomIndex];
}

// ==============================================
// 初始化页面
// ==============================================
function initPage() {
  // 生成并显示用户ID
  currentUserId = generateRandomUserId();
  myId.textContent = currentUserId;
  
  // 立即显示上次选择的聊天对象
  const lastChatTarget = localStorage.getItem("last_chat_target");
  if (lastChatTarget && lastChatTarget !== "未选择") {
    targetId.textContent = lastChatTarget;
    // 尝试加载消息
    loadMessages();
  } else {
    targetId.textContent = "未选择";
  }
  
  // 显示加载状态
  onlineUser.textContent = "加载中...";
  selectBtn.innerHTML = '<option value="未选择">未选择</option>';
  
  // 立即尝试连接
  if (socket.connected) {
    socket.emit("userJoin", currentUserId);
    socket.emit("requestOnlineList");
  }
}

// ==============================================
// 更新在线用户UI
// ==============================================
function updateOnlineUsersUI(users) {
  // 确保用户列表包含当前用户
  if (!users.includes(currentUserId)) {
    users.push(currentUserId);
  }
  
  // 排序用户列表，确保顺序一致
  users.sort();
  
  // 更新在线用户显示
  if (users.length > 1) {
    // 过滤掉当前用户，只显示其他在线用户
    const otherUsers = users.filter(u => u !== currentUserId);
    onlineUser.textContent = otherUsers.join(" | ");
    
    // 更新选择框
    selectBtn.innerHTML = '<option value="未选择">未选择</option>';
    otherUsers.forEach(u => {
      const opt = document.createElement("option");
      opt.value = u;
      opt.textContent = u;
      selectBtn.appendChild(opt);
    });
  } else {
    onlineUser.textContent = "暂无其他在线用户";
    selectBtn.innerHTML = '<option value="未选择">未选择</option>';
  }
  
  // 恢复上次选择的聊天对象
  const lastChatTarget = localStorage.getItem("last_chat_target");
  if (lastChatTarget && lastChatTarget !== "未选择" && users.includes(lastChatTarget)) {
    selectBtn.value = lastChatTarget;
    targetId.textContent = lastChatTarget;
    loadMessages();
  }
}

// ==============================================
// 🔥 新增：滚动到聊天框底部
// ==============================================
function scrollToBottom() {
  requestAnimationFrame(() => {
    msgArea.scrollTop = msgArea.scrollHeight;
  });
}

// ==============================================
// 🔥 新增：发送已读回执的统一方法
// ==============================================
function emitReadReceipt() {
  const partner = targetId.textContent;
  if (partner && partner !== "未选择") {
    socket.emit("markAsRead", { reader: currentUserId, from: partner });
  }
}

// ==============================================
// 在线列表 + 记忆聊天对象
// ==============================================
socket.on("connect", () => {
  console.log("Socket connected");
  console.log("Transport used:", socket.io.engine.transport.name);
  onlineUser.textContent = "加载中...";
  socket.emit("userJoin", currentUserId);
  // 连接后立即请求在线用户列表
  setTimeout(() => {
    socket.emit("requestOnlineList");
  }, 500);
});

socket.on("onlineList", (list) => {
  console.log("Received online list:", list);
  // 更新在线用户列表
  onlineUsersList = list;
  
  // 更新界面
  updateOnlineUsersUI(list);
});

socket.on("connect_error", (error) => {
  console.error("Socket connection error:", error);
  // 显示错误信息
  onlineUser.textContent = "连接失败";
});

socket.on("reconnect", () => {
  console.log("Socket reconnected");
  console.log("Transport used:", socket.io.engine.transport.name);
  onlineUser.textContent = "加载中...";
  socket.emit("userJoin", currentUserId);
  socket.emit("requestOnlineList");
});

socket.on("reconnect_error", (error) => {
  console.error("Socket reconnect error:", error);
  onlineUser.textContent = "连接失败";
});

selectBtn.addEventListener("change", () => {
  const to = selectBtn.value;
  targetId.textContent = to;
  localStorage.setItem("last_chat_target", to);
  loadMessages();
});

// ==============================================
// 提示框
// ==============================================
function showTip(text) {
  document.querySelectorAll(".tip-box").forEach(t => t.remove());
  const tip = document.createElement("div");
  tip.className = "tip-box";
  tip.textContent = text;
  document.body.appendChild(tip);
  setTimeout(() => tip.remove(), 2500);
}

// ==============================================
// 本地存储聊天记录（刷新不消失）
// ==============================================
function getStorageKey() {
  const partner = targetId.textContent;
  if (!partner || partner === "未选择") return "chat_empty";
  return "chat_" + [currentUserId, partner].sort().join("_");
}

function saveMessages() {
  const key = getStorageKey();
  const messages = [];
  
  // 收集所有消息及其状态
  msgArea.querySelectorAll(".message").forEach(msgEl => {
    const message = {
      id: msgEl.dataset.id || generateMessageId(),
      content: msgEl.textContent.replace(/未读|已读/, '').trim(),
      isMe: msgEl.classList.contains("me"),
      status: msgEl.querySelector(".read-status") ? 
        (msgEl.querySelector(".read-status").classList.contains("read") ? "read" : "unread") : 
        ""
    };
    messages.push(message);
  });
  
  localStorage.setItem(key, JSON.stringify(messages));
}

function loadMessages() {
  const key = getStorageKey();
  const storedMessages = localStorage.getItem(key);
  
  msgArea.innerHTML = "";
  
  if (storedMessages) {
    try {
      const messages = JSON.parse(storedMessages);
      messages.forEach(message => {
        const div = document.createElement("div");
        div.className = `message ${message.isMe ? "me" : "other"}`;
        div.dataset.id = message.id;
        div.textContent = message.content;
        
        // 为自己发送的消息添加已读/未读状态
        if (message.isMe) {
          const status = document.createElement("span");
          status.className = `read-status ${message.status}`;
          status.textContent = message.status === "read" ? "已读" : "未读";
          div.appendChild(status);
        }
        
        msgArea.appendChild(div);
      });
    } catch (e) {
      console.error("加载消息失败:", e);
    }
  }
  
  // 🔥 加载记录后自动滚动到底部
  scrollToBottom();
}

// 生成唯一消息ID
function generateMessageId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// ==============================================
// 发送消息（🔥 带已读/未读状态标签）
// ==============================================
function send() {
  const to = targetId.textContent;
  const txt = msgInput.value.trim();
  if (!txt || to === "未选择") return showTip("请选择对象并输入消息");

  const div = document.createElement("div");
  div.className = "message me";
  div.dataset.id = generateMessageId();
  div.textContent = txt;

  // 🔥 添加未读状态标签
  const status = document.createElement("span");
  status.className = "read-status unread";
  status.textContent = "未读";
  div.appendChild(status);

  msgArea.appendChild(div);
  scrollToBottom();
  msgInput.value = "";

  socket.emit("sendPrivateMsg", { to, from: currentUserId, content: txt });
  saveMessages();
}

sendBtn.onclick = send;
msgInput.addEventListener("keydown", e => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    send();
  }
});

// ==============================================
// 接收消息（🔥 自动发送已读回执）
// ==============================================
socket.on("newPrivateMsg", data => {
  if (data.to !== currentUserId) return;
  if (data.from !== targetId.textContent) return;

  const div = document.createElement("div");
  div.className = "message other";
  div.textContent = data.content;
  msgArea.appendChild(div);
  scrollToBottom();
  saveMessages();

  // 🔥 我正在查看此对话且页面可见 → 立即发送已读回执
  if (!document.hidden) {
    socket.emit("markAsRead", { reader: currentUserId, from: data.from });
  }
});

// ==============================================
// 🔥 新增：接收已读回执 → 更新所有未读为已读
// ==============================================
socket.on("messagesRead", data => {
  // data.reader 是对方（读者），data.from 是我（消息发送者）
  if (data.reader === targetId.textContent) {
    const unreads = msgArea.querySelectorAll(".read-status.unread");
    unreads.forEach(el => {
      el.textContent = "已读";
      el.classList.remove("unread");
      el.classList.add("read");
    });
    saveMessages();
  }
});

// ==============================================
// 🔥 新增：页面可见性变化时发送已读回执
// ==============================================
document.addEventListener("visibilitychange", () => {
  if (!document.hidden && targetId.textContent !== "未选择") {
    // 当页面变为可见且有聊天对象时，发送已读回执
    emitReadReceipt();
  }
});

// ==============================================
// 🔥 新增：当用户滚动到消息区域时发送已读回执
// ==============================================
msgArea.addEventListener("scroll", () => {
  if (targetId.textContent !== "未选择") {
    // 当用户滚动消息区域时，发送已读回执
    emitReadReceipt();
  }
});

// ==============================================
// 双向销毁（清空双方记录 + 清空本地存储）
// ==============================================
socket.on("clearBothChat", data => {
  if (data.from === targetId.textContent && data.to === currentUserId) {
    msgArea.innerHTML = "";
    saveMessages();
    showTip("对方已双向销毁，双方记录已永久清空");
  }
});

clearBothBtn.onclick = () => {
  const to = targetId.textContent;
  if (to === "未选择") return showTip("请先选择聊天对象");
  if (!confirm("确定双向销毁？双方聊天记录将永久清空！")) return;

  msgArea.innerHTML = "";
  saveMessages();
  socket.emit("clearBothChat", { to, from: currentUserId });
  showTip("✅ 已双向销毁聊天记录");
};

// ==============================================
// 页面加载时初始化
// ==============================================
window.addEventListener("load", () => {
  initPage();
});