// 配置socket.io连接，确保能正确连接到服务器
const socket = io("/", {
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
const onlineCount = document.getElementById("onlineCount");
const onlineSection = document.getElementById("onlineSection");
const onlineHeader = document.getElementById("onlineHeader");
const chatTargetSection = document.getElementById("chatTargetSection");
const targetDisplayBox = document.getElementById("targetDisplayBox");
const msgArea = document.getElementById("msgArea");
const msgInput = document.getElementById("msgInput");
const sendBtn = document.getElementById("sendBtn");
const clearBothBtn = document.getElementById("clearBothBtn");
const editNameBtn = document.getElementById("editNameBtn");
const unreadMessages = document.getElementById("unreadMessages");
const voiceCallBtn = document.getElementById("voiceCallBtn");
const videoCallBtn = document.getElementById("videoCallBtn");

// 附件相关元素
const attachBtn = document.getElementById("attachBtn");
const attachMenu = document.getElementById("attachMenu");
const imageBtn = document.getElementById("imageBtn");
const emojiBtn = document.getElementById("emojiBtn");
const fileBtn = document.getElementById("fileBtn");
const fileInput = document.getElementById("fileInput");
const generalFileInput = document.getElementById("generalFileInput");

let currentUserId = null;
let onlineUsersList = [];
let unreadCounts = {}; // 存储每个用户的未读消息数量
let isOnlineListVisible = false;

// 成语ID池
const IDIOMS = ["一心一意","一丝不苟","一尘不染","一举两得","一鸣惊人","一马当先","一路顺风","一言九鼎","一诺千金","一表人才","二话不说","二龙戏珠","二泉映月","二惠竞爽","二姓之好","二八佳人","二满三平","二童一马","二分明月","二缶钟惑","三心二意","三长两短","三番五次","三顾茅庐","三阳开泰","三生有幸","三思而行","三头六臂","三更半夜","三教九流","四面八方","四平八稳","四通八达","四海为家","四分五裂","四体不勤","四海升平","四脚朝天","四大皆空","四战之地","五光十色","五颜六色","五体投地","五湖四海","五彩缤纷","五风十雨","五谷丰登","五内如焚","五世其昌","五蕴皆空","六神无主","六根清净","六六大顺","六尘不染","六趣轮回","六通四辟","六马仰秣","六尺之孤","六出奇计","六卿分职","七上八下","七零八落","七手八脚","七嘴八舌","七情六欲","七步之才","七窍生烟","七擒七纵","七开八得","七扭八歪","八面玲珑","八面威风","八仙过海","八方呼应","八斗之才","八拜之交","八窗玲珑","八府巡按","八砖学士","八索九丘","九牛一毛","九死一生","九霄云外","九九归一","九流三教","九原可作","九合一匡","九关虎豹","九衢三市","九阍虎豹","十全十美","十万火急","十拿九稳","十恶不赦","十面埋伏","十室九空","十步芳草","十荡十决","十行俱下","十载寒窗","百发百中","百依百顺","百折不挠","百家争鸣","百里挑一","百年好合","百感交集","百废俱兴","百孔千疮","百媚千娇","千方百计","千军万马","千言万语","千山万水","千变万化","千钧一发","千载难逢","千丝万缕","千疮百孔","千锤百炼","万水千山","万众一心","万象更新","万紫千红","万古长青","万里无云","万念俱灰","万马奔腾","万无一失","万籁俱寂","天长地久","天经地义","天罗地网","天昏地暗","天诛地灭","天造地设","天高地厚","天寒地冻","天翻地覆","天公作美","日新月异","日积月累","日理万机","日以继夜","日月如梭","日上三竿","日暮途穷","日薄西山","日夜兼程","日进斗金","山清水秀","山高水长","山穷水尽","山盟海誓","山明水秀","山珍海味","山摇地动","山呼海啸","山重水复","山环水抱","风花雪月","风吹雨打","风平浪静","风调雨顺","风尘仆仆","风华正茂","风雨同舟","风云变幻","风起云涌","风驰电掣","春暖花开","春色满园","春光明媚","春意盎然","春回大地","春和景明","春寒料峭","春花秋月","春兰秋菊","春树暮云","秋色宜人","秋高气爽","秋水伊人","秋毫无犯","秋月春风","秋菊傲骨","秋收冬藏","秋色平分","秋意深浓","秋虫唧唧","冰雪聪明","冰清玉洁","冰天雪地","冰肌玉骨","冰壶秋月","冰魂雪魄","冰消瓦解","冰炭不投","冰寒于水","冰解云散","一帆风顺","两全其美","四季平安","五福临门","七星高照","八方来财","九九同心","百花齐放","万事如意","前程似锦","壮志凌云","光明磊落","乘风破浪","福星高照","气宇轩昂","卓尔不群","鹏程万里","如花似玉","金玉满堂","宁静致远","海阔天空","大公无私","心怀若谷","温文尔雅","厚德载物","自强不息","安居乐业","国泰民安","人寿年丰","繁荣昌盛","欣欣向荣","蒸蒸日上","花好月圆","举案齐眉","永结同心","相亲相爱","莫逆之交","志同道合","患难与共","情同手足","肝胆相照","勤学苦练","废寝忘食","学而不厌","孜孜不倦","博览群书","博学多才","见多识广","才高八斗","学富五车","满腹经纶","见义勇为","助人为乐","拾金不昧","乐善好施","扶危济困","雪中送炭","解囊相助","拔刀相助","仗义疏财","勇往直前","坚持不懈","持之以恒","顽强拼搏","百折不挠","坚韧不拔","坚定不移","矢志不渝","锲而不舍","生龙活虎","朝气蓬勃","神采奕奕","精神焕发","神采飞扬","正大光明","堂堂正正","廉洁奉公","严于律己","两袖清风","克己奉公","公而忘私","刚正不阿","繁花似锦","绿草如茵","绿树成荫","花团锦簇","姹紫嫣红","鸟语花香","山清水秀","湖光山色","波光粼粼","水天一色","青山绿水","层峦叠嶂","悬崖峭壁","奇峰异石","怪石嶙峋","山高水长","山高水远","山高水险","山高水深","山高水低","山高水阔","山高水长","山高水远","山高水险","山高水深","山高水低","山高水阔"];

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
  // 检查本地存储中是否有用户ID
  const storedUserId = localStorage.getItem("user_id");
  if (storedUserId) {
    currentUserId = storedUserId;
  } else {
    // 生成新的用户ID并保存
    currentUserId = generateRandomUserId();
    localStorage.setItem("user_id", currentUserId);
  }
  myId.textContent = currentUserId;
  
  // 立即显示上次选择的聊天对象
  const lastChatTarget = localStorage.getItem("last_chat_target");
  if (lastChatTarget && lastChatTarget !== "未选择") {
    targetId.textContent = lastChatTarget;
    loadMessages();
  } else {
    targetId.textContent = "未选择";
  }
  
  // 立即尝试连接
  if (socket.connected) {
    socket.emit("userJoin", currentUserId);
    socket.emit("requestOnlineList");
  }
  
  // 🔥 在线用户头部点击事件 - 折叠在线用户列表
  onlineHeader.addEventListener("click", () => {
    isOnlineListVisible = false;
    onlineSection.style.display = "none";
    targetDisplayBox.classList.remove("active");
  });
  
  // 🔥 附件按钮点击事件
  if (attachBtn) {
    attachBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      attachMenu.classList.toggle("show");
    });
    
    // 点击其他地方关闭附件菜单
    document.addEventListener("click", () => {
      attachMenu.classList.remove("show");
    });
    
    // 防止菜单内部点击关闭菜单
    attachMenu.addEventListener("click", (e) => {
      e.stopPropagation();
    });
    
    // 图片按钮点击事件
    if (imageBtn) {
      imageBtn.addEventListener("click", () => {
        attachMenu.classList.remove("show");
        fileInput.click();
      });
    }
    
    // 表情包按钮点击事件
    if (emojiBtn) {
      emojiBtn.addEventListener("click", () => {
        attachMenu.classList.remove("show");
        showEmojiPicker();
      });
    }
    
    // 文件按钮点击事件
    if (fileBtn) {
      fileBtn.addEventListener("click", () => {
        attachMenu.classList.remove("show");
        generalFileInput.click();
      });
    }
    
    // 图片选择事件
    if (fileInput) {
      fileInput.addEventListener("change", (e) => {
        const file = e.target.files[0];
        if (file) {
          sendImage(file);
          e.target.value = "";
        }
      });
    }
    
    // 文件选择事件
    if (generalFileInput) {
      generalFileInput.addEventListener("change", (e) => {
        const file = e.target.files[0];
        if (file) {
          sendFile(file);
          e.target.value = "";
        }
      });
    }
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
    onlineCount.textContent = otherUsers.length;
    
    // 显示在线用户列表
    onlineSection.innerHTML = "";
    otherUsers.forEach(user => {
      const userItem = document.createElement("div");
      userItem.className = "online-user-item";
      userItem.textContent = user;
      userItem.addEventListener("click", () => {
        targetId.textContent = user;
        localStorage.setItem("last_chat_target", user);
        loadMessages();
        // 隐藏在线用户列表
        onlineSection.style.display = "none";
        targetDisplayBox.classList.remove("active");
        isOnlineListVisible = false;
      });
      onlineSection.appendChild(userItem);
    });
  } else {
    onlineUser.textContent = "暂无其他在线用户";
    onlineCount.textContent = "0";
    onlineSection.innerHTML = "";
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

// 点击在线用户区域显示/隐藏在线用户列表
targetDisplayBox.addEventListener("click", () => {
  isOnlineListVisible = !isOnlineListVisible;
  if (isOnlineListVisible) {
    onlineSection.style.display = "flex";
    targetDisplayBox.classList.add("active");
  } else {
    onlineSection.style.display = "none";
    targetDisplayBox.classList.remove("active");
  }
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
  
  // 收集所有消息
  msgArea.querySelectorAll(".message-container").forEach(containerEl => {
    const msgEl = containerEl.querySelector(".message");
    if (msgEl) {
      const statusEl = containerEl.querySelector(".read-status");
      
      // 确定消息类型
      let type = "text";
      let content = msgEl.textContent.trim();
      let extra = {};
      
      // 检查是否为图片消息
      const img = msgEl.querySelector(".message-image");
      if (img) {
        type = "image";
        content = img.src;
      }
      
      // 检查是否为文件消息
      const fileEl = msgEl.querySelector(".message-file");
      if (fileEl) {
        type = "file";
        // 从下载按钮获取文件数据
        const downloadBtn = fileEl.querySelector(".message-file-download");
        if (downloadBtn) {
          content = downloadBtn.dataset.fileData || downloadBtn.getAttribute("data-file-data");
        }
        const fileName = fileEl.querySelector(".message-file-name");
        const fileSize = fileEl.querySelector(".message-file-size");
        if (fileName && fileSize) {
          extra = {
            name: fileName.textContent,
            size: fileSize.textContent
          };
        }
      }
      
      // 检查是否为表情包消息
      const emojiEl = msgEl.querySelector(".message-emoji");
      if (emojiEl) {
        type = "emoji";
        content = emojiEl.textContent;
      }
      
      const message = {
        id: msgEl.dataset.id || generateMessageId(),
        content,
        type,
        extra,
        isMe: msgEl.classList.contains("me"),
        status: statusEl ? statusEl.textContent : "",
        timestamp: Date.now()
      };
      messages.push(message);
    }
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
        showMessage(message, message.isMe);
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
// 显示消息
// ==============================================
function showMessage(messageData, isMe) {
  // 添加调试信息
  console.log("showMessage called with:", messageData);
  
  const { id, content, type, extra, from, to, timestamp } = messageData;
  
  // 创建消息容器
  const msgContainer = document.createElement("div");
  msgContainer.className = `message-container ${isMe ? "me" : "other"}`;
  
  // 创建消息气泡
  const msgBubble = document.createElement("div");
  msgBubble.className = `message ${isMe ? "me" : "other"}`;
  msgBubble.dataset.id = id;
  
  // 根据消息类型显示不同内容，添加默认值处理
  const messageType = type || "text";
  const messageContent = content || "";
  
  if (messageType === "text") {
    // 文本消息
    msgBubble.textContent = messageContent;
  } else if (messageType === "image") {
    // 图片消息
    const img = document.createElement("img");
    img.src = messageContent;
    img.className = "message-image";
    img.alt = "图片";
    // 点击图片查看大图
    img.addEventListener("click", () => {
      const imgDialog = document.createElement("div");
      imgDialog.className = "confirm-dialog-overlay";
      imgDialog.innerHTML = `
        <div style="max-width: 80vw; max-height: 80vh; background: white; border-radius: 12px; padding: 10px; position: relative;">
          <button style="position: absolute; top: 10px; right: 10px; width: 30px; height: 30px; background: rgba(0,0,0,0.3); color: white; border: none; border-radius: 50%; cursor: pointer; font-size: 16px; display: flex; align-items: center; justify-content: center;">×</button>
          <img src="${messageContent}" style="max-width: 100%; max-height: 70vh; object-fit: contain; border-radius: 8px; cursor: pointer;">
        </div>
      `;
      document.body.appendChild(imgDialog);
      
      const closeBtn = imgDialog.querySelector("button");
      const largeImg = imgDialog.querySelector("img");
      
      // 点击关闭按钮关闭弹窗
      closeBtn.addEventListener("click", () => {
        imgDialog.remove();
      });
      
      // 点击图片本身也关闭弹窗
      largeImg.addEventListener("click", () => {
        imgDialog.remove();
      });
      
      // 点击背景关闭弹窗
      imgDialog.addEventListener("click", (e) => {
        if (e.target === imgDialog) {
          imgDialog.remove();
        }
      });
    });
    msgBubble.appendChild(img);
  } else if (messageType === "file") {
    // 文件消息
    const fileEl = document.createElement("div");
    fileEl.className = "message-file";
    
    const fileIcon = document.createElement("span");
    fileIcon.className = "message-file-icon";
    fileIcon.textContent = "📄";
    
    const fileInfo = document.createElement("div");
    fileInfo.className = "message-file-info";
    
    const fileName = document.createElement("span");
    fileName.className = "message-file-name";
    fileName.textContent = extra?.name || "未知文件";
    
    const fileSize = document.createElement("span");
    fileSize.className = "message-file-size";
    fileSize.textContent = extra?.size || "";
    
    const downloadBtn = document.createElement("button");
    downloadBtn.className = "message-file-download";
    downloadBtn.textContent = "下载";
    downloadBtn.dataset.fileData = messageContent;
    downloadBtn.addEventListener("click", () => {
      const link = document.createElement("a");
      link.href = messageContent;
      link.download = extra?.name || "文件";
      link.click();
    });
    
    fileInfo.appendChild(fileName);
    fileInfo.appendChild(fileSize);
    fileEl.appendChild(fileIcon);
    fileEl.appendChild(fileInfo);
    fileEl.appendChild(downloadBtn);
    msgBubble.appendChild(fileEl);
  } else if (messageType === "emoji") {
    // 表情包消息
    const emojiEl = document.createElement("div");
    emojiEl.className = "message-emoji";
    emojiEl.textContent = messageContent;
    msgBubble.appendChild(emojiEl);
  } else {
    // 未知类型，默认显示为文本
    msgBubble.textContent = messageContent;
  }
  
  // 添加未读状态标签（仅自己发送的消息）
  if (isMe) {
    const status = document.createElement("span");
    status.className = "read-status unread";
    status.textContent = "未读";
    msgContainer.appendChild(msgBubble);
    msgContainer.appendChild(status);
  } else {
    msgContainer.appendChild(msgBubble);
  }
  
  msgArea.appendChild(msgContainer);
  scrollToBottom();
}

// ==============================================
// 发送消息
// ==============================================
function sendMessage(to, content, type = "text", extra = {}) {
  if (to === "未选择") return showTip("请先选择聊天对象");
  
  const messageId = generateMessageId();
  const messageData = {
    id: messageId,
    content,
    type,
    extra,
    from: currentUserId,
    to,
    timestamp: Date.now()
  };
  
  // 发送消息到服务器
  socket.emit("sendPrivateMsg", messageData);
  
  // 显示消息
  showMessage(messageData, true);
  
  // 保存消息
  saveMessages();
  
  return messageId;
}

// ==============================================
// 发送消息（文本）
// ==============================================
function send() {
  const to = targetId.textContent;
  const txt = msgInput.value.trim();
  if (!txt || to === "未选择") return showTip("请选择对象并输入消息");
  
  sendMessage(to, txt, "text");
  msgInput.value = "";
}

sendBtn.onclick = send;

// 回车键发送
msgInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    send();
  }
});

// ==============================================
// 发送图片
// ==============================================
function sendImage(file) {
  const to = targetId.textContent;
  if (to === "未选择") return showTip("请先选择聊天对象");
  
  const reader = new FileReader();
  reader.onload = (e) => {
    const imageData = e.target.result;
    sendMessage(to, imageData, "image");
  };
  reader.readAsDataURL(file);
}

// ==============================================
// 发送文件
// ==============================================
function sendFile(file) {
  const to = targetId.textContent;
  if (to === "未选择") return showTip("请先选择聊天对象");
  
  const reader = new FileReader();
  reader.onload = (e) => {
    const fileData = e.target.result;
    sendMessage(to, fileData, "file", {
      name: file.name,
      size: formatFileSize(file.size)
    });
  };
  reader.readAsDataURL(file);
}

// ==============================================
// 格式化文件大小
// ==============================================
function formatFileSize(bytes) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// ==============================================
// 显示表情包选择器
// ==============================================
function showEmojiPicker() {
  const to = targetId.textContent;
  if (to === "未选择") return showTip("请先选择聊天对象");
  
  // 常用表情包
  const emojis = [
    "😊", "😂", "😍", "🤔", "😢", "😡", "👍", "👎", "❤️", "🎉",
    "🔥", "✨", "🌟", "💯", "🤣", "😅", "😎", "😴", "😷", "🤩"
  ];
  
  // 移除已存在的弹窗
  const existingDialog = document.getElementById("emojiDialog");
  if (existingDialog) {
    existingDialog.remove();
  }
  
  // 创建表情包弹窗
  const dialog = document.createElement("div");
  dialog.id = "emojiDialog";
  dialog.className = "confirm-dialog-overlay";
  
  let emojiHTML = emojis.map(emoji => `
    <button class="emoji-btn" data-emoji="${emoji}">
      ${emoji}
    </button>
  `).join("");
  
  dialog.innerHTML = `
    <div class="emoji-dialog-content">
      <h3>选择表情</h3>
      <div class="emoji-grid">
        ${emojiHTML}
      </div>
    </div>
  `;
  
  document.body.appendChild(dialog);
  
  // 添加表情点击事件
  dialog.querySelectorAll(".emoji-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const emoji = btn.dataset.emoji;
      sendMessage(to, emoji, "emoji");
      dialog.remove();
    });
  });
  
  // 点击背景关闭
  dialog.addEventListener("click", (e) => {
    if (e.target === dialog) {
      dialog.remove();
    }
  });
}

// ==============================================
// 接收消息
// ==============================================
socket.on("newPrivateMsg", data => {
  console.log("Received newPrivateMsg:", data);
  
  if (data.to !== currentUserId) return;
  
  // 检查是否正在与发送者聊天
  const isChattingWithSender = data.from === targetId.textContent;
  
  if (isChattingWithSender) {
    // 正在与发送者聊天，正常显示消息
    console.log("Displaying message immediately");
    showMessage(data, false);
    saveMessages();
  } else {
    // 未与发送者聊天，增加未读消息计数
    if (!unreadCounts[data.from]) {
      unreadCounts[data.from] = 0;
    }
    unreadCounts[data.from]++;
    
    // 保存消息到本地存储（用于后续查看）
    saveMessageFromOther(data);
    
    // 更新未读消息显示
    updateUnreadDisplay();
  }
});

// ==============================================
// 保存来自其他用户的消息（未选择聊天对象时）
// ==============================================
function saveMessageFromOther(data) {
  const partner = data.from;
  const key = "chat_" + [currentUserId, partner].sort().join("_");
  
  // 获取现有的消息记录
  let messages = [];
  const storedMessages = localStorage.getItem(key);
  if (storedMessages) {
    try {
      messages = JSON.parse(storedMessages);
    } catch (e) {
      console.error("解析消息失败:", e);
    }
  }
  
  // 添加新消息
  messages.push({
    id: generateMessageId(),
    content: data.content,
    type: data.type || "text",
    extra: data.extra || {},
    isMe: false,
    status: "",
    timestamp: Date.now()
  });
  
  // 保存到本地存储
  localStorage.setItem(key, JSON.stringify(messages));
}

// ==============================================
// 更新未读消息显示
// ==============================================
function updateUnreadDisplay() {
  // 清空未读消息列表
  unreadMessages.innerHTML = "";
  
  // 检查是否有未读消息
  const hasUnread = Object.keys(unreadCounts).length > 0;
  
  if (hasUnread) {
    // 显示未读消息
    Object.entries(unreadCounts).forEach(([userId, count]) => {
      const unreadItem = document.createElement("div");
      unreadItem.className = "unread-item";
      unreadItem.innerHTML = `
        <span class="unread-user">${userId}</span>
        <span class="unread-count">${count}</span>
      `;
      
      // 点击未读消息跳转到对应的聊天
      unreadItem.addEventListener("click", () => {
        targetId.textContent = userId;
        localStorage.setItem("last_chat_target", userId);
        loadMessages();
        // 清除该用户的未读消息计数
        delete unreadCounts[userId];
        updateUnreadDisplay();
      });
      
      unreadMessages.appendChild(unreadItem);
    });
  } else {
    // 没有未读消息
    const noUnreadItem = document.createElement("div");
    noUnreadItem.className = "no-unread";
    noUnreadItem.textContent = "暂无未读消息";
    unreadMessages.appendChild(noUnreadItem);
  }
}

// ==============================================
// 🔥 新增：接收已读回执 → 更新所有未读为已读
// ==============================================
socket.on("messagesRead", data => {
  // data.reader 是对方（读者），data.from 是我（消息发送者）
  if (data.reader === targetId.textContent) {
    const unreads = msgArea.querySelectorAll(".message-container.me .read-status.unread");
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

// ==============================================
// 清空聊天记录弹窗
// ==============================================
function showClearChatDialog() {
  const to = targetId.textContent;
  if (to === "未选择") return showTip("请先选择聊天对象");

  // 移除已存在的弹窗
  const existingDialog = document.getElementById("customConfirmDialog");
  if (existingDialog) {
    existingDialog.remove();
  }

  // 创建弹窗容器
  const dialog = document.createElement("div");
  dialog.id = "customConfirmDialog";
  dialog.className = "confirm-dialog-overlay";
  
  dialog.innerHTML = `
    <div class="confirm-dialog-content">
      <div class="confirm-dialog-header">
        <span class="confirm-dialog-icon">🗑️</span>
        <h3 class="confirm-dialog-title">清空聊天记录</h3>
      </div>
      <p class="confirm-dialog-message">请选择清空方式：</p>
      <div class="clear-options">
        <label class="clear-option">
          <input type="radio" name="clearOption" value="self" checked>
          <div class="option-content">
            <span class="option-icon">👤</span>
            <div>
              <span class="option-title">只为自己清空</span>
              <span class="option-desc">仅清空本地聊天记录，对方记录不受影响</span>
            </div>
          </div>
        </label>
        <label class="clear-option">
          <input type="radio" name="clearOption" value="both">
          <div class="option-content">
            <span class="option-icon">👥</span>
            <div>
              <span class="option-title">双向清空</span>
              <span class="option-desc">清空双方聊天记录，此操作不可恢复</span>
            </div>
          </div>
        </label>
      </div>
      <div class="confirm-dialog-buttons">
        <button class="confirm-dialog-btn cancel" id="clearCancelBtn">取消</button>
        <button class="confirm-dialog-btn confirm" id="clearConfirmBtn">确定</button>
      </div>
    </div>
  `;
  
  document.body.appendChild(dialog);
  
  // 添加事件监听
  document.getElementById("clearConfirmBtn").addEventListener("click", () => {
    const selectedOption = document.querySelector('input[name="clearOption"]:checked').value;
    
    if (selectedOption === "self") {
      // 只为自己清空
      msgArea.innerHTML = "";
      saveMessages();
      showTip("✅ 已清空本地聊天记录");
    } else {
      // 双向清空
      msgArea.innerHTML = "";
      saveMessages();
      socket.emit("clearBothChat", { to, from: currentUserId });
      showTip("✅ 已双向销毁聊天记录");
    }
    
    dialog.remove();
  });
  
  document.getElementById("clearCancelBtn").addEventListener("click", () => {
    dialog.remove();
  });
  
  // 点击背景关闭
  dialog.addEventListener("click", (e) => {
    if (e.target === dialog) {
      dialog.remove();
    }
  });
}

clearBothBtn.onclick = showClearChatDialog;

// ==============================================
// 修改昵称功能
// ==============================================
editNameBtn.onclick = () => {
  const newName = prompt("请输入新的昵称（2-10个字符）：", currentUserId);
  if (!newName) return;
  if (newName.length < 2 || newName.length > 10) return showTip("昵称长度应在2-10个字符之间");
  
  // 保存新的用户ID到本地存储
  localStorage.setItem("user_id", newName);
  
  // 发送更新用户ID的事件
  socket.emit("updateUserId", {
    oldId: currentUserId,
    newId: newName
  });
  
  // 更新当前用户ID
  currentUserId = newName;
  myId.textContent = currentUserId;
  
  showTip("✅ 昵称修改成功");
};

// ==============================================
// 自定义确认弹窗
// ==============================================
function showConfirmDialog(title, message, onConfirm, onCancel) {
  // 移除已存在的弹窗
  const existingDialog = document.getElementById("customConfirmDialog");
  if (existingDialog) {
    existingDialog.remove();
  }

  // 创建弹窗容器
  const dialog = document.createElement("div");
  dialog.id = "customConfirmDialog";
  dialog.className = "confirm-dialog-overlay";
  
  dialog.innerHTML = `
    <div class="confirm-dialog-content">
      <div class="confirm-dialog-header">
        <span class="confirm-dialog-icon">⚠️</span>
        <h3 class="confirm-dialog-title">${title}</h3>
      </div>
      <p class="confirm-dialog-message">${message}</p>
      <div class="confirm-dialog-buttons">
        <button class="confirm-dialog-btn cancel" id="confirmCancelBtn">取消</button>
        <button class="confirm-dialog-btn confirm" id="confirmOkBtn">确定</button>
      </div>
    </div>
  `;
  
  document.body.appendChild(dialog);
  
  // 添加事件监听
  document.getElementById("confirmOkBtn").addEventListener("click", () => {
    if (onConfirm) onConfirm();
    dialog.remove();
  });
  
  document.getElementById("confirmCancelBtn").addEventListener("click", () => {
    if (onCancel) onCancel();
    dialog.remove();
  });
  
  // 点击背景关闭
  dialog.addEventListener("click", (e) => {
    if (e.target === dialog) {
      dialog.remove();
    }
  });
}

// ==============================================
// 页面加载时初始化
// ==============================================
window.addEventListener("load", () => {
  initPage();
});

// ==============================================
// 语音通话功能
// ==============================================
let localStream = null;
let remoteStream = null;
let peerConnection = null;
let isInCall = false;

// 发起语音通话
voiceCallBtn.onclick = () => {
  const to = targetId.textContent;
  if (to === "未选择") return showTip("请先选择聊天对象");
  
  if (isInCall) return showTip("您正在通话中");
  
  // 显示通话请求弹窗
  showCallRequestDialog(to, "语音通话");
};

// 发起视频通话
videoCallBtn.onclick = () => {
  const to = targetId.textContent;
  if (to === "未选择") return showTip("请先选择聊天对象");
  
  if (isInCall) return showTip("您正在通话中");
  
  // 显示通话请求弹窗
  showCallRequestDialog(to, "视频通话");
};

// 显示通话请求弹窗
function showCallRequestDialog(to, callType) {
  const dialog = document.createElement("div");
  dialog.id = "callRequestDialog";
  dialog.className = "call-dialog-overlay";
  
  dialog.innerHTML = `
    <div class="call-dialog-content">
      <div class="call-dialog-header">
        <h3>${callType}请求</h3>
      </div>
      <div class="call-dialog-body">
        <div class="call-status">正在呼叫 ${to}...</div>
        <div class="call-timer">00:00</div>
      </div>
      <div class="call-dialog-buttons">
        <button class="call-btn end-call" id="cancelCallBtn">取消</button>
      </div>
    </div>
  `;
  
  document.body.appendChild(dialog);
  
  // 开始计时
  let seconds = 0;
  const timer = setInterval(() => {
    seconds++;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    dialog.querySelector(".call-timer").textContent = `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  }, 1000);
  
  // 取消按钮
  document.getElementById("cancelCallBtn").addEventListener("click", () => {
    clearInterval(timer);
    dialog.remove();
    // 发送取消通话请求
    socket.emit("callReject", {
      to,
      from: currentUserId,
      reason: "取消通话"
    });
  });
  
  // 发送通话请求
  socket.emit("callRequest", {
    to,
    from: currentUserId,
    callType,
    timestamp: Date.now()
  });
  
  // 等待对方响应
  const responseTimeout = setTimeout(() => {
    clearInterval(timer);
    dialog.remove();
    showTip("对方未响应，通话请求已超时");
  }, 60000); // 60秒超时
  
  // 监听对方响应
  const handleCallAccept = (data) => {
    if (data.from === to && data.to === currentUserId) {
      clearInterval(timer);
      clearTimeout(responseTimeout);
      dialog.remove();
      startCall(to, callType);
      socket.off("callAccept", handleCallAccept);
    }
  };
  
  const handleCallReject = (data) => {
    if (data.from === to && data.to === currentUserId) {
      clearInterval(timer);
      clearTimeout(responseTimeout);
      dialog.remove();
      showTip(`对方拒绝了${callType}请求`);
      socket.off("callReject", handleCallReject);
    }
  };
  
  socket.on("callAccept", handleCallAccept);
  socket.on("callReject", handleCallReject);
}

// 开始通话
async function startCall(to, callType) {
  try {
    // 获取本地媒体流
    const constraints = {
      audio: true,
      video: callType === "视频通话"
    };
    
    localStream = await navigator.mediaDevices.getUserMedia(constraints);
    
    // 创建 PeerConnection
    peerConnection = new RTCPeerConnection({
      iceServers: [
        {
          urls: ["stun:stun.l.google.com:19302", "stun:stun1.l.google.com:19302"]
        }
      ]
    });
    
    // 添加本地流
    localStream.getTracks().forEach(track => {
      peerConnection.addTrack(track, localStream);
    });
    
    // 处理远程流
    peerConnection.ontrack = (event) => {
      remoteStream = event.streams[0];
      // 显示远程流
      showCallInterface(to, callType, true);
    };
    
    // 处理ICE候选
    peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit("iceCandidate", {
          to,
          from: currentUserId,
          candidate: event.candidate
        });
      }
    };
    
    // 创建offer
    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);
    
    // 发送offer
    socket.emit("callOffer", {
      to,
      from: currentUserId,
      offer,
      callType
    });
    
    isInCall = true;
  } catch (error) {
    console.error("开始通话失败:", error);
    showTip("获取媒体设备失败，请检查权限");
    isInCall = false;
  }
}

// 显示通话界面
function showCallInterface(caller, callType, hasRemoteStream) {
  // 移除已存在的通话界面
  const existingCall = document.getElementById("callInterface");
  if (existingCall) {
    existingCall.remove();
  }
  
  const callInterface = document.createElement("div");
  callInterface.id = "callInterface";
  callInterface.className = "call-interface";
  
  callInterface.innerHTML = `
    <div class="call-interface-content">
      <div class="call-info">
        <div class="caller-name">${caller}</div>
        <div class="call-status">${callType}中</div>
        <div class="call-timer" id="callTimer">00:00</div>
      </div>
      <div class="call-streams">
        <div class="remote-stream" id="remoteStream">
          ${hasRemoteStream ? '<video autoplay playsinline style="width: 100%; height: 100%; object-fit: cover; border-radius: 12px;"></video>' : '<div class="no-stream">对方未加入</div>'}
        </div>
        <div class="local-stream" id="localStream">
          <video autoplay playsinline muted style="width: 100%; height: 100%; object-fit: cover; border-radius: 8px;"></video>
        </div>
      </div>
      <div class="call-controls">
        <button class="call-control-btn" id="muteBtn" title="静音">
          <span class="btn-icon">🎤</span>
          <span class="btn-text">静音</span>
        </button>
        <button class="call-control-btn" id="speakerBtn" title="扬声器">
          <span class="btn-icon">🔊</span>
          <span class="btn-text">扬声器</span>
        </button>
        <button class="call-control-btn end-call" id="endCallBtn" title="结束通话">
          <span class="btn-icon">🔴</span>
          <span class="btn-text">结束</span>
        </button>
      </div>
    </div>
  `;
  
  document.body.appendChild(callInterface);
  
  // 显示本地流
  const localVideo = document.getElementById("localStream").querySelector("video");
  if (localVideo && localStream) {
    localVideo.srcObject = localStream;
  }
  
  // 显示远程流
  if (hasRemoteStream) {
    const remoteVideo = document.getElementById("remoteStream").querySelector("video");
    if (remoteVideo && remoteStream) {
      remoteVideo.srcObject = remoteStream;
    }
  }
  
  // 开始计时
  let seconds = 0;
  const timer = setInterval(() => {
    seconds++;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    document.getElementById("callTimer").textContent = `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  }, 1000);
  
  // 静音按钮
  document.getElementById("muteBtn").addEventListener("click", () => {
    const audioTracks = localStream.getAudioTracks();
    if (audioTracks.length > 0) {
      const isMuted = audioTracks[0].enabled;
      audioTracks[0].enabled = !isMuted;
      const btn = document.getElementById("muteBtn");
      if (isMuted) {
        btn.innerHTML = '<span class="btn-icon">🎤</span><span class="btn-text">静音</span>';
      } else {
        btn.innerHTML = '<span class="btn-icon">🔇</span><span class="btn-text">已静音</span>';
      }
    }
  });
  
  // 扬声器按钮
  document.getElementById("speakerBtn").addEventListener("click", () => {
    const btn = document.getElementById("speakerBtn");
    // 这里可以实现扬声器切换逻辑
    btn.innerHTML = '<span class="btn-icon">🔊</span><span class="btn-text">扬声器</span>';
  });
  
  // 结束通话按钮
  document.getElementById("endCallBtn").addEventListener("click", () => {
    endCall(caller);
    clearInterval(timer);
  });
}

// 结束通话
function endCall(to) {
  // 关闭本地流
  if (localStream) {
    localStream.getTracks().forEach(track => track.stop());
    localStream = null;
  }
  
  // 关闭远程流
  if (remoteStream) {
    remoteStream.getTracks().forEach(track => track.stop());
    remoteStream = null;
  }
  
  // 关闭 PeerConnection
  if (peerConnection) {
    peerConnection.close();
    peerConnection = null;
  }
  
  // 移除通话界面
  const callInterface = document.getElementById("callInterface");
  if (callInterface) {
    callInterface.remove();
  }
  
  // 发送结束通话通知
  socket.emit("callEnd", {
    to,
    from: currentUserId
  });
  
  isInCall = false;
  showTip("通话已结束");
}

// 监听通话请求
socket.on("callRequest", (data) => {
  if (data.to !== currentUserId) return;
  
  // 显示通话请求弹窗
  const dialog = document.createElement("div");
  dialog.id = "incomingCallDialog";
  dialog.className = "call-dialog-overlay";
  
  dialog.innerHTML = `
    <div class="call-dialog-content">
      <div class="call-dialog-header">
        <h3>来电</h3>
      </div>
      <div class="call-dialog-body">
        <div class="caller-name">${data.from}</div>
        <div class="call-status">${data.callType}</div>
      </div>
      <div class="call-dialog-buttons">
        <button class="call-btn accept" id="acceptCallBtn">接受</button>
        <button class="call-btn reject" id="rejectCallBtn">拒绝</button>
      </div>
    </div>
  `;
  
  document.body.appendChild(dialog);
  
  // 接受按钮
  document.getElementById("acceptCallBtn").addEventListener("click", () => {
    dialog.remove();
    // 发送接受通话响应
    socket.emit("callAccept", {
      to: data.from,
      from: currentUserId
    });
    // 开始通话
    startCall(data.from, data.callType);
  });
  
  // 拒绝按钮
  document.getElementById("rejectCallBtn").addEventListener("click", () => {
    dialog.remove();
    // 发送拒绝通话响应
    socket.emit("callReject", {
      to: data.from,
      from: currentUserId,
      reason: "拒绝通话"
    });
  });
});

// 监听通话接受
socket.on("callAccept", (data) => {
  if (data.to !== currentUserId) return;
  // 通话已在 startCall 函数中处理
});

// 监听通话拒绝
socket.on("callReject", (data) => {
  if (data.to !== currentUserId) return;
  // 通话拒绝已在 showCallRequestDialog 函数中处理
});

// 监听通话offer
socket.on("callOffer", async (data) => {
  if (data.to !== currentUserId) return;
  
  try {
    // 创建 PeerConnection
    peerConnection = new RTCPeerConnection({
      iceServers: [
        {
          urls: ["stun:stun.l.google.com:19302", "stun:stun1.l.google.com:19302"]
        }
      ]
    });
    
    // 获取本地媒体流
    const constraints = {
      audio: true,
      video: data.callType === "视频通话"
    };
    
    localStream = await navigator.mediaDevices.getUserMedia(constraints);
    
    // 添加本地流
    localStream.getTracks().forEach(track => {
      peerConnection.addTrack(track, localStream);
    });
    
    // 处理远程流
    peerConnection.ontrack = (event) => {
      remoteStream = event.streams[0];
      // 显示远程流
      showCallInterface(data.from, data.callType, true);
    };
    
    // 处理ICE候选
    peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit("iceCandidate", {
          to: data.from,
          from: currentUserId,
          candidate: event.candidate
        });
      }
    };
    
    // 设置远程描述
    await peerConnection.setRemoteDescription(new RTCSessionDescription(data.offer));
    
    // 创建answer
    const answer = await peerConnection.createAnswer();
    await peerConnection.setLocalDescription(answer);
    
    // 发送answer
    socket.emit("callAnswer", {
      to: data.from,
      from: currentUserId,
      answer
    });
    
    isInCall = true;
  } catch (error) {
    console.error("处理通话offer失败:", error);
    showTip("获取媒体设备失败，请检查权限");
  }
});

// 监听通话answer
socket.on("callAnswer", async (data) => {
  if (data.to !== currentUserId) return;
  
  try {
    // 设置远程描述
    await peerConnection.setRemoteDescription(new RTCSessionDescription(data.answer));
    
    // 显示通话界面
    showCallInterface(data.from, "语音通话", true);
  } catch (error) {
    console.error("处理通话answer失败:", error);
  }
});

// 监听ICE候选
socket.on("iceCandidate", async (data) => {
  if (data.to !== currentUserId) return;
  
  try {
    if (peerConnection) {
      await peerConnection.addIceCandidate(new RTCIceCandidate(data.candidate));
    }
  } catch (error) {
    console.error("处理ICE候选失败:", error);
  }
});

// 监听通话结束
socket.on("callEnd", (data) => {
  if (data.to !== currentUserId) return;
  
  // 结束通话
  endCall(data.from);
});
