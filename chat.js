// 配置socket.io连接，确保能正确连接到服务器
const socket = io();

// DOM元素
const msgArea = document.getElementById("msgArea");
const msgInput = document.getElementById("msgInput");
const sendBtn = document.getElementById("sendBtn");
const targetId = document.getElementById("targetId");
const onlineUsersList = document.getElementById("onlineUser");
const unreadMessagesList = document.getElementById("unreadMessages");
const userNameDisplay = document.getElementById("myId");
const editNameBtn = document.getElementById("editNameBtn");
const clearBothBtn = document.getElementById("clearBothBtn");
const voiceCallBtn = document.getElementById("voiceCallBtn");
const videoCallBtn = document.getElementById("videoCallBtn");
const attachBtn = document.getElementById("attachBtn");
const attachMenu = document.getElementById("attachMenu");
const imageBtn = document.getElementById("imageBtn");
const emojiBtn = document.getElementById("emojiBtn");
const fileBtn = document.getElementById("fileBtn");
const fileInput = document.getElementById("fileInput");
const generalFileInput = document.getElementById("generalFileInput");
const emojiPicker = document.getElementById("emojiPicker");
const newMessageIndicator = document.getElementById("newMessageIndicator");
const newMessageBtn = document.getElementById("newMessageBtn");
const newMessageCount = document.getElementById("newMessageCount");

// 调试：检查DOM元素是否正确获取
console.log("=== DOM元素检查 ===");
console.log("msgArea:", msgArea);
console.log("newMessageIndicator:", newMessageIndicator);
console.log("newMessageBtn:", newMessageBtn);
console.log("newMessageCount:", newMessageCount);
console.log("==================");

let currentUserId = null;
let onlineUsers = [];
let unreadCounts = {}; // 存储每个用户的未读消息数量
let isOnlineListVisible = false;
let isAttachMenuVisible = false;
let isEmojiPickerVisible = false;
let burnAfterReadEnabled = false;
let burnDuration = 10;
let scheduledMessages = [];
let currentScheduledAttachment = null;
let mediaRecorder = null;
let audioChunks = [];
let recordingTimer = null;
let recordingStartTime = null;
let audioStream = null;

// 成语ID池
const IDIOMS = ["一心一意","一丝不苟","一尘不染","一举两得","一鸣惊人","一马当先","一路顺风","一言九鼎","一诺千金","一表人才","二话不说","二龙戏珠","二泉映月","二惠竞爽","二姓之好","二八佳人","二满三平","二童一马","二分明月","二缶钟惑","三心二意","三长两短","三番五次","三顾茅庐","三阳开泰","三生有幸","三思而行","三头六臂","三更半夜","三教九流","四面八方","四平八稳","四通八达","四海为家","四分五裂","四体不勤","四海升平","四脚朝天","四大皆空","四战之地","五光十色","五颜六色","五体投地","五湖四海","五彩缤纷","五风十雨","五谷丰登","五内如焚","五世其昌","五蕴皆空","六神无主","六根清净","六六大顺","六尘不染","六趣轮回","六通四辟","六马仰秣","六尺之孤","六出奇计","六卿分职","七上八下","七零八落","七手八脚","七嘴八舌","七情六欲","七步之才","七窍生烟","七擒七纵","七开八得","七扭八歪","八面玲珑","八面威风","八仙过海","八方呼应","八斗之才","八拜之交","八窗玲珑","八府巡按","八砖学士","八索九丘","九牛一毛","九死一生","九霄云外","九九归一","九流三教","九原可作","九合一匡","九关虎豹","九衢三市","九阍虎豹","十全十美","十万火急","十拿九稳","十恶不赦","十面埋伏","十室九空","十步芳草","十荡十决","十行俱下","十载寒窗","百发百中","百依百顺","百折不挠","百家争鸣","百里挑一","百年好合","百感交集","百废俱兴","百孔千疮","百媚千娇","千方百计","千军万马","千言万语","千山万水","千变万化","千钧一发","千载难逢","千丝万缕","千疮百孔","千锤百炼","万水千山","万众一心","万象更新","万紫千红","万古长青","万里无云","万念俱灰","万马奔腾","万无一失","万籁俱寂","天长地久","天经地义","天罗地网","天昏地暗","天诛地灭","天造地设","天高地厚","天寒地冻","天翻地覆","天公作美","日新月异","日积月累","日理万机","日以继夜","日月如梭","日上三竿","日暮途穷","日薄西山","日夜兼程","日进斗金","山清水秀","山高水长","山穷水尽","山盟海誓","山明水秀","山珍海味","山摇地动","山呼海啸","山重水复","山环水抱","风花雪月","风吹雨打","风平浪静","风调雨顺","风尘仆仆","风华正茂","风雨同舟","风云变幻","风起云涌","风驰电掣","春暖花开","春色满园","春光明媚","春意盎然","春回大地","春和景明","春寒料峭","春花秋月","春兰秋菊","春树暮云","秋色宜人","秋高气爽","秋水伊人","秋毫无犯","秋月春风","秋菊傲骨","秋收冬藏","秋色平分","秋意深浓","秋虫唧唧","冰雪聪明","冰清玉洁","冰天雪地","冰肌玉骨","冰壶秋月","冰魂雪魄","冰消瓦解","冰炭不投","冰寒于水","冰解云散","一帆风顺","两全其美","四季平安","五福临门","七星高照","八方来财","九九同心","百花齐放","万事如意","前程似锦","壮志凌云","光明磊落","乘风破浪","福星高照","气宇轩昂","卓尔不群","鹏程万里","如花似玉","金玉满堂","宁静致远","海阔天空","大公无私","心怀若谷","温文尔雅","厚德载物","自强不息","安居乐业","国泰民安","人寿年丰","繁荣昌盛","欣欣向荣","蒸蒸日上","花好月圆","举案齐眉","永结同心","相亲相爱","莫逆之交","志同道合","患难与共","情同手足","肝胆相照","勤学苦练","废寝忘食","学而不厌","孜孜不倦","博览群书","博学多才","见多识广","才高八斗","学富五车","满腹经纶","见义勇为","助人为乐","拾金不昧","乐善好施","扶危济困","雪中送炭","解囊相助","拔刀相助","仗义疏财","勇往直前","坚持不懈","持之以恒","顽强拼搏","百折不挠","坚韧不拔","坚定不移","矢志不渝","锲而不舍","生龙活虎","朝气蓬勃","神采奕奕","精神焕发","神采飞扬","正大光明","堂堂正正","廉洁奉公","严于律己","两袖清风","克己奉公","公而忘私","刚正不阿","繁花似锦","绿草如茵","绿树成荫","花团锦簇","姹紫嫣红","鸟语花香","山清水秀","湖光山色","波光粼粼","水天一色","青山绿水","层峦叠嶂","悬崖峭壁","奇峰异石","怪石嶙峋","山高水长","山高水远","山高水险","山高水深","山高水低","山高水阔"];

// ==============================================
// 生成随机用户ID
// ==============================================
function generateRandomUserId() {
  const randomIndex = Math.floor(Math.random() * IDIOMS.length);
  return IDIOMS[randomIndex];
}

// ==============================================
// 初始化应用
// ==============================================
function initApp() {
  // 从localStorage获取用户ID，如果没有则生成新的
  currentUserId = localStorage.getItem("chatUserId") || generateRandomUserId();
  localStorage.setItem("chatUserId", currentUserId);
  
  // 显示用户名
  if (userNameDisplay) {
    userNameDisplay.textContent = currentUserId;
  }
  
  // 连接到服务器
  socket.emit("userJoin", currentUserId);
  
  // 处理重连，重新注册用户
  socket.on("reconnect", () => {
    console.log("Socket reconnected, re-registering user:", currentUserId);
    socket.emit("userJoin", currentUserId);
  });
  
  // 监听游戏iframe消息
  window.addEventListener('message', (e) => {
    const data = e.data;
    if (!data || !data.type) return;
    
    const currentTarget = targetId.textContent;
    if (currentTarget === '未选择' || currentTarget === '点击选择用户...') return;
    
    // 处理游戏结果
    switch(data.type) {
      case 'diceResult':
        sendGameMessage(`🎲 摇色子：我摇了 ${data.roll} 点！`);
        break;
      case 'idiomResult':
        sendGameMessage(`📜 成语接龙：${data.idiom}（得分：${data.score}）`);
        break;
      case 'drawResult':
        sendImageMessage(data.image, `🎨 你画我猜 - 词语：${data.word}`);
        break;
    }
  });
  
  // 发送游戏消息
  function sendGameMessage(content) {
    const msg = { content, type: 'text' };
    sendMessageToServer(msg);
  }
  
  // 发送图片消息
  function sendImageMessage(imageData, caption) {
    const msg = { content: imageData, type: 'image', extra: { caption } };
    sendMessageToServer(msg);
  }
  
  // 统一发送消息到服务器
  function sendMessageToServer(messageData) {
    const to = targetId.textContent;
    if (to === "未选择" || to === "点击选择用户...") {
      showTip('⚠️ 请先选择聊天对象');
      return;
    }
    
    const fullMessage = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      from: currentUserId,
      to: to,
      content: messageData.content,
      type: messageData.type || 'text',
      timestamp: new Date().toISOString(),
      status: "unread",
      extra: messageData.extra || {}
    };
    
    // 如果启用了阅后即焚，添加焚毁标记
    if (burnAfterReadEnabled && messageData.type !== 'game') {
      fullMessage.extra.burnAfterRead = true;
      fullMessage.extra.burnDuration = burnDuration;
    }
    
    // 发送到服务器
    socket.emit("privateMessage", fullMessage);
    
    // 添加到本地存储
    addMessageToLocalStorage(fullMessage);
    
    // 显示消息
    displayMessage(fullMessage);
    
    console.log('[游戏消息] 已发送:', fullMessage);
  }
  
  // 绑定事件
  bindEvents();
  
  // 页面加载时，立即恢复上次选择的聊天对象和消息（无延迟）
  const savedTarget = localStorage.getItem("chat_current_target");
  if (savedTarget) {
    targetId.textContent = savedTarget;
    // 使用 requestAnimationFrame 确保DOM准备好后立即加载
    requestAnimationFrame(() => {
      loadMessages();
    });
  }
}

// ==============================================
// 绑定事件
// ==============================================
function bindEvents() {
  // 发送消息
  if (sendBtn) {
    sendBtn.addEventListener("click", send);
  }
  
  // 回车键发送消息
  if (msgInput) {
    msgInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        send();
      }
    });
  }
  
  // 监听窗口焦点变化，当窗口获得焦点时检查未读消息
  window.addEventListener("focus", () => {
    const currentTarget = targetId.textContent;
    if (currentTarget !== "未选择" && currentTarget !== "点击选择用户...") {
      // 延迟一下再发送已读回执，确保页面完全渲染
      setTimeout(() => {
        emitReadReceipt(currentTarget);
      }, 500);
      
      // 如果用户在底部，隐藏新消息提示
      if (isUserAtBottom()) {
        hideNewMessageIndicator();
      }
    }
  });
  
  // 监听滚动事件，当用户滚动查看消息时检查是否可见
  if (msgArea) {
    let scrollTimeout;
    msgArea.addEventListener("scroll", () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        const currentTarget = targetId.textContent;
        if (currentTarget !== "未选择" && currentTarget !== "点击选择用户..." && document.hasFocus()) {
          emitReadReceipt(currentTarget);
        }
        
        // 如果用户滚动到底部，隐藏新消息提示
        if (isUserAtBottom()) {
          hideNewMessageIndicator();
        }
      }, 300);
    });
  }
  
  // 新消息按钮点击事件
  if (newMessageBtn) {
    newMessageBtn.addEventListener("click", () => {
      console.log("点击新消息按钮，滚动到底部");
      scrollToBottom();
      hideNewMessageIndicator();
    });
  }
  
  // 选择聊天对象
  if (targetId) {
    console.log('targetId found:', targetId);
    
    // 创建下拉列表
    const dropdown = document.createElement("div");
    dropdown.className = "target-dropdown";
    dropdown.style.display = "none";
    dropdown.style.position = "absolute";
    dropdown.style.zIndex = "1000";
    targetId.parentElement.appendChild(dropdown);
    
    console.log('Dropdown created:', dropdown);
    
    // 确保父元素有相对定位
    const parent = targetId.parentElement;
    if (parent) {
      parent.style.position = "relative";
      console.log('Parent element:', parent);
    }
    
    // 点击目标显示区域，切换下拉列表
    const targetDisplay = document.getElementById("targetDisplayBox");
    console.log('targetDisplay:', targetDisplay);
    
    if (targetDisplay) {
      targetDisplay.style.cursor = "pointer";
      targetDisplay.style.userSelect = "none";
      
      // 为整个目标显示区域添加点击事件
      targetDisplay.addEventListener("click", (e) => {
        e.stopPropagation();
        console.log('targetDisplay clicked, current display:', dropdown.style.display);
        // 切换下拉列表显示状态
        if (dropdown.style.display === "block") {
          dropdown.style.display = "none";
          console.log('Dropdown closed');
        } else {
          dropdown.style.display = "block";
          // 立即更新下拉列表
          if (window.updateTargetDropdown) {
            window.updateTargetDropdown();
          }
          console.log('Dropdown opened');
        }
      });
      
      // 为箭头图标添加点击事件，作为备用
      const arrowIcon = targetDisplay.querySelector(".arrow-icon");
      if (arrowIcon) {
        arrowIcon.addEventListener("click", (e) => {
          e.stopPropagation();
          console.log('arrowIcon clicked');
          // 切换下拉列表显示状态
          if (dropdown.style.display === "block") {
            dropdown.style.display = "none";
          } else {
            dropdown.style.display = "block";
            // 立即更新下拉列表
            if (window.updateTargetDropdown) {
              window.updateTargetDropdown();
            }
          }
        });
      }
      
      // 为目标ID文本添加点击事件，作为备用
      targetId.addEventListener("click", (e) => {
        e.stopPropagation();
        console.log('targetId clicked');
        // 切换下拉列表显示状态
        if (dropdown.style.display === "block") {
          dropdown.style.display = "none";
        } else {
          dropdown.style.display = "block";
          // 立即更新下拉列表
          if (window.updateTargetDropdown) {
            window.updateTargetDropdown();
          }
        }
      });
    }
    
    // 点击其他地方关闭下拉列表
    document.addEventListener("click", (e) => {
      if (targetDisplay && !targetDisplay.contains(e.target) && !dropdown.contains(e.target)) {
        dropdown.style.display = "none";
        console.log('Dropdown closed by clicking outside');
      }
    });
    
    // 选择用户
    function selectUser(user) {
      targetId.textContent = user;
      dropdown.style.display = "none";
      console.log('User selected:', user);
      
      // 保存当前选择的用户到本地存储
      localStorage.setItem("chat_current_target", user);
      
      // 加载与该用户的历史消息
      loadMessages();
      
      // 切换聊天对象时，隐藏新消息提示
      hideNewMessageIndicator();
    }
    
    // 更新下拉列表
    window.updateTargetDropdown = function() {
      dropdown.innerHTML = "";
      console.log('Updating dropdown with online users:', onlineUsers);
      
      if (onlineUsers.length === 0) {
        const emptyItem = document.createElement("div");
        emptyItem.className = "dropdown-item";
        emptyItem.textContent = "暂无在线用户";
        emptyItem.style.color = "#9ca3af";
        emptyItem.style.cursor = "default";
        dropdown.appendChild(emptyItem);
        console.log('No online users');
        return;
      }
      
      onlineUsers.forEach(user => {
        if (user !== currentUserId) {
          const item = document.createElement("div");
          item.className = "dropdown-item";
          item.textContent = user;
          // 直接绑定点击事件，确保能正确触发
          item.onclick = function(e) {
            e.stopPropagation();
            selectUser(user);
          };
          dropdown.appendChild(item);
          console.log('Added user to dropdown:', user);
        }
      });
    };
    
    // 初始更新下拉列表
    window.updateTargetDropdown();
    console.log('Initial dropdown update completed');
  }
  
  // 确保在线用户列表更新时也更新下拉列表
  socket.on("onlineList", (users) => {
    onlineUsers = users;
    updateOnlineUsersUI();
    if (window.updateTargetDropdown) {
      window.updateTargetDropdown();
    }
    console.log('Online list updated:', users);
  });
  
  // 清空聊天记录（旧功能，保留兼容）
  if (clearBothBtn) {
    clearBothBtn.onclick = showClearChatDialog;
  }
  
  // ========== 多功能菜单功能 ==========
  const moreFeaturesBtn = document.getElementById('moreFeaturesBtn');
  const moreFeaturesDialog = document.getElementById('moreFeaturesDialog');
  const closeMoreFeaturesDialog = document.getElementById('closeMoreFeaturesDialog');
  
  // 子弹窗元素
  const scheduledSendDialog = document.getElementById('scheduledSendDialog');
  const burnAfterReadDialog = document.getElementById('burnAfterReadDialog');
  const deleteChatDialog = document.getElementById('deleteChatDialog');
  const gamesDialog = document.getElementById('gamesDialog');
  
  // 关闭按钮
  const closeScheduledSend = document.getElementById('closeScheduledSend');
  const closeBurnAfterRead = document.getElementById('closeBurnAfterRead');
  const closeDeleteChat = document.getElementById('closeDeleteChat');
  const closeGames = document.getElementById('closeGames');
  
  // 功能项按钮
  const scheduledSendBtn = document.getElementById('scheduledSendBtn');
  const burnAfterReadBtn = document.getElementById('burnAfterReadBtn');
  const deleteChatBtn = document.getElementById('deleteChatBtn');
  const gamesBtn = document.getElementById('gamesBtn');
  
  // 显示多功能菜单
  if (moreFeaturesBtn && moreFeaturesDialog) {
    moreFeaturesBtn.onclick = () => {
      moreFeaturesDialog.style.display = 'flex';
      console.log('[多功能菜单] 打开主菜单');
    };
  }
  
  // 关闭多功能菜单
  if (closeMoreFeaturesDialog) {
    closeMoreFeaturesDialog.onclick = () => {
      moreFeaturesDialog.style.display = 'none';
      console.log('[多功能菜单] 关闭主菜单');
    };
  }
  
  // 点击遮罩层关闭
  if (moreFeaturesDialog) {
    moreFeaturesDialog.onclick = (e) => {
      if (e.target === moreFeaturesDialog) {
        moreFeaturesDialog.style.display = 'none';
      }
    };
  }
  
  // 打开定时发送弹窗
  if (scheduledSendBtn) {
    scheduledSendBtn.onclick = () => {
      moreFeaturesDialog.style.display = 'none';
      scheduledSendDialog.style.display = 'flex';
      
      // 设置默认时间为当前时间+1小时
      const now = new Date();
      now.setHours(now.getHours() + 1);
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const day = String(now.getDate()).padStart(2, '0');
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const scheduledTimeInput = document.getElementById('scheduledTime');
      if (scheduledTimeInput) {
        scheduledTimeInput.value = `${year}-${month}-${day}T${hours}:${minutes}`;
      }
      
      console.log('[定时发送] 打开定时发送弹窗');
    };
  }
  
  // 打开阅后即焚弹窗
  if (burnAfterReadBtn) {
    burnAfterReadBtn.onclick = () => {
      moreFeaturesDialog.style.display = 'none';
      burnAfterReadDialog.style.display = 'flex';
      console.log('[阅后即焚] 打开阅后即焚弹窗');
    };
  }
  
  // 打开删除聊天记录弹窗
  if (deleteChatBtn) {
    deleteChatBtn.onclick = () => {
      moreFeaturesDialog.style.display = 'none';
      deleteChatDialog.style.display = 'flex';
      console.log('[删除聊天记录] 打开删除聊天记录弹窗');
    };
  }
  
  // 打开小游戏弹窗
  if (gamesBtn) {
    gamesBtn.onclick = () => {
      moreFeaturesDialog.style.display = 'none';
      gamesDialog.style.display = 'flex';
      console.log('[小游戏] 打开小游戏弹窗');
    };
  }
  
  // ========== 小游戏功能 ==========
  const gameGomoku = document.getElementById('gameGomoku');
  const gameDrawGuess = document.getElementById('gameDrawGuess');
  const gameDice = document.getElementById('gameDice');
  const gameIdiom = document.getElementById('gameIdiom');
  const gameMaze2P = document.getElementById('gameMaze2P');
  const gameTetris = document.getElementById('gameTetris');
  const gameMinesweeper = document.getElementById('gameMinesweeper');
  const gameMaze = document.getElementById('gameMaze');
  
  // 游戏iframe弹窗
  const gameFrameDialog = document.getElementById('gameFrameDialog');
  const gameFrame = document.getElementById('gameFrame');
  const gameFrameTitle = document.getElementById('gameFrameTitle');
  const closeGameFrame = document.getElementById('closeGameFrame');
  
  // 关闭游戏iframe
  if (closeGameFrame) {
    closeGameFrame.onclick = () => {
      gameFrameDialog.style.display = 'none';
      gameFrame.src = '';
      console.log('[小游戏] 关闭游戏窗口');
    };
  }
  
  // 点击遮罩层关闭
  if (gameFrameDialog) {
    gameFrameDialog.onclick = (e) => {
      if (e.target === gameFrameDialog) {
        gameFrameDialog.style.display = 'none';
        gameFrame.src = '';
      }
    };
  }
  
  // 打开游戏函数
  function openGame(gameType, title, isMultiplayer = false) {
    const currentTarget = targetId.textContent;
    if (isMultiplayer && (currentTarget === '未选择' || currentTarget === '点击选择用户...')) {
      showTip('⚠️ 请先选择一个聊天对象');
      return;
    }
    
    const url = `games/index.html?game=${gameType}&multi=${isMultiplayer ? 1 : 0}&opponent=${encodeURIComponent(currentTarget)}`;
    gameFrame.src = url;
    gameFrameTitle.textContent = title;
    gamesDialog.style.display = 'none';
    gameFrameDialog.style.display = 'flex';
    console.log(`[小游戏] 打开游戏: ${title}, 类型: ${gameType}`);
  }
  
  // 摇色子游戏
if (gameDice) {
gameDice.onclick = () => openGame('dice', '🎲 摇色子', true); }
  
  // 五子棋
if (gameGomoku) {
gameGomoku.onclick = () => openGame('gomoku', '♟️ 五子棋', true); }
  
  // 你画我猜
if (gameDrawGuess) {
gameDrawGuess.onclick = () => openGame('draw', '🎨 你画我猜', true); }
  
  // 成语接龙
if (gameIdiom) {
gameIdiom.onclick = () => openGame('idiom', '📜 成语接龙', true); }
  
  // 双人迷宫
  if (gameMaze2P) {
    gameMaze2P.onclick = () => openGame('maze2p', '🏃 双人迷宫', true);
  }
  
  // 俄罗斯方块
  if (gameTetris) {
    gameTetris.onclick = () => openGame('tetris', '🧱 俄罗斯方块', false);
  }
  
  // 扫雷
  if (gameMinesweeper) {
    gameMinesweeper.onclick = () => openGame('minesweeper', '💣 扫雷', false);
  }
  
  // 迷宫
  if (gameMaze) {
    gameMaze.onclick = () => openGame('maze', '🌀 迷宫', false);
  }
  
  // 关闭子弹窗
  if (closeScheduledSend) {
    closeScheduledSend.onclick = () => {
      scheduledSendDialog.style.display = 'none';
    };
  }
  
  if (closeBurnAfterRead) {
    closeBurnAfterRead.onclick = () => {
      burnAfterReadDialog.style.display = 'none';
    };
  }
  
  if (closeDeleteChat) {
    closeDeleteChat.onclick = () => {
      deleteChatDialog.style.display = 'none';
    };
  }
  
  if (closeGames) {
    closeGames.onclick = () => {
      gamesDialog.style.display = 'none';
    };
  }
  
  // 点击子弹窗遮罩层关闭
  [scheduledSendDialog, burnAfterReadDialog, deleteChatDialog, gamesDialog].forEach(dialog => {
    if (dialog) {
      dialog.onclick = (e) => {
        if (e.target === dialog) {
          dialog.style.display = 'none';
        }
      };
    }
  });
  
  // 阅后即焚滑块实时更新
  const burnDurationSlider = document.getElementById('burnDuration');
  const burnDurationValue = document.getElementById('burnDurationValue');
  
  if (burnDurationSlider && burnDurationValue) {
    burnDurationSlider.oninput = () => {
      burnDurationValue.textContent = `${burnDurationSlider.value}秒`;
      burnDuration = parseInt(burnDurationSlider.value);
    };
  }
  
  // 启用阅后即焚
  const enableBurnAfterReadBtn = document.getElementById('enableBurnAfterRead');
  if (enableBurnAfterReadBtn) {
    enableBurnAfterReadBtn.onclick = async () => {
      burnAfterReadEnabled = true;
      burnDuration = parseInt(burnDurationSlider.value);
      burnAfterReadDialog.style.display = 'none';
      showTip(`🔥 阅后即焚已启用！消息将在对方阅读后 ${burnDuration} 秒后双向删除。`);
      console.log('[阅后即焚] 已启用，时长:', burnDuration, '秒');
    };
  }
  
  // 确认删除按钮 - 根据单选框选择执行操作
  const confirmDeleteChatBtn = document.getElementById('confirmDeleteChat');
  if (confirmDeleteChatBtn) {
    confirmDeleteChatBtn.onclick = () => {
      const currentTarget = targetId.textContent;
      if (currentTarget === "未选择" || currentTarget === "点击选择用户...") {
        alert("请先选择一个聊天对象！");
        return;
      }
      
      // 获取选中的删除类型
      const selectedType = document.querySelector('input[name="deleteType"]:checked');
      if (!selectedType) {
        alert("请选择删除方式！");
        return;
      }
      
      const deleteType = selectedType.value;
      
      // 删除本地记录
      const storageKey = `chat_messages_${currentUserId}_${currentTarget}`;
      localStorage.removeItem(storageKey);
      msgArea.innerHTML = '';
      
      // 如果是双向删除，通知对方
      if (deleteType === 'both') {
        socket.emit("clearBothChat", {
          from: currentUserId,
          to: currentTarget
        });
        console.log('[删除聊天记录] 双向删除 - 已删除本地记录，并通知对方:', currentTarget);
      } else {
        console.log('[删除聊天记录] 仅删除本地记录:', storageKey);
      }
      
      // 关闭弹窗
      deleteChatDialog.style.display = 'none';
      
      // 显示底部小提示
      showTip('✅ 删除成功');
    };
  }
  
  // ========== 定时发送功能 ==========
  const confirmScheduledSendBtn = document.getElementById('confirmScheduledSend');
  const scheduledMessageInput = document.getElementById('scheduledMessage');
  const attachImageBtn = document.getElementById('attachImageBtn');
  const attachFileBtn = document.getElementById('attachFileBtn');
  const scheduledAttachmentPreview = document.getElementById('scheduledAttachmentPreview');
  
  // 滚轮时间选择器
  let timePicker = {
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
    day: new Date().getDate(),
    hour: new Date().getHours(),
    minute: 0,
    second: 0
  };
  
  // 初始化时间选择器显示
  function updateTimePickerDisplay() {
    const yearInput = document.getElementById('yearInput');
    const monthInput = document.getElementById('monthInput');
    const dayInput = document.getElementById('dayInput');
    const hourInput = document.getElementById('hourInput');
    const minuteInput = document.getElementById('minuteInput');
    const secondInput = document.getElementById('secondInput');
    
    if (yearInput) yearInput.value = timePicker.year;
    if (monthInput) monthInput.value = String(timePicker.month).padStart(2, '0');
    if (dayInput) dayInput.value = String(timePicker.day).padStart(2, '0');
    if (hourInput) hourInput.value = String(timePicker.hour).padStart(2, '0');
    if (minuteInput) minuteInput.value = String(timePicker.minute).padStart(2, '0');
    if (secondInput) secondInput.value = String(timePicker.second).padStart(2, '0');
  }
  
  // 获取时间选择器选中的 Date 对象
  function getTimePickerDate() {
    return new Date(timePicker.year, timePicker.month - 1, timePicker.day, timePicker.hour, timePicker.minute, timePicker.second);
  }
  
  // 修改时间值
  function adjustTimeValue(key, delta) {
    const ranges = {
      year: [new Date().getFullYear(), new Date().getFullYear() + 10],
      month: [1, 12],
      day: [1, 31],
      hour: [0, 23],
      minute: [0, 59],
      second: [0, 59]
    };
    const [min, max] = ranges[key];
    timePicker[key] = Math.max(min, Math.min(max, timePicker[key] + delta));
    updateTimePickerDisplay();
  }
  
  // 同步输入框值到 timePicker
  function syncInputToPicker(key) {
    const input = document.getElementById(key + 'Input');
    if (!input) return;
    
    const ranges = {
      year: [new Date().getFullYear(), new Date().getFullYear() + 10],
      month: [1, 12],
      day: [1, 31],
      hour: [0, 23],
      minute: [0, 59],
      second: [0, 59]
    };
    const [min, max] = ranges[key];
    
    let val = parseInt(input.value);
    if (isNaN(val)) val = min;
    val = Math.max(min, Math.min(max, val));
    
    timePicker[key] = val;
    // 保持两位数字显示
    updateTimePickerDisplay();
  }
  
  // 初始化输入框事件
  function initInputEvents() {
    ['year', 'month', 'day', 'hour', 'minute', 'second'].forEach(key => {
      const input = document.getElementById(key + 'Input');
      if (!input) return;
      
      input.addEventListener('change', () => syncInputToPicker(key));
      input.addEventListener('blur', () => syncInputToPicker(key));
      input.addEventListener('input', () => {
        // 实时验证
        const ranges = {
          year: [new Date().getFullYear(), new Date().getFullYear() + 10],
          month: [1, 12],
          day: [1, 31],
          hour: [0, 23],
          minute: [0, 59],
          second: [0, 59]
        };
        const [min, max] = ranges[key];
        let val = parseInt(input.value);
        if (!isNaN(val) && (val < min || val > max)) {
          input.style.color = '#ff6b6b';
        } else {
          input.style.color = '#667eea';
        }
      });
    });
  }
  
  // 初始化箭头按钮事件
  function initArrowButtons() {
    document.querySelectorAll('.scroll-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const target = btn.dataset.target;
        const action = btn.dataset.action;
        const delta = action === 'increase' ? 1 : -1;
        adjustTimeValue(target, delta);
      });
    });
  }
  
  // 滚轮事件处理
  function setupScrollPicker(elementId, valueKey, min, max, step = 1) {
    const element = document.getElementById(elementId);
    if (!element) return;
    
    // 鼠标滚轮
    element.addEventListener('wheel', (e) => {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -step : step;
      timePicker[valueKey] = Math.max(min, Math.min(max, timePicker[valueKey] + delta));
      updateTimePickerDisplay();
    }, { passive: false });
    
    // 触屏滑动
    let startY = 0;
    let isTouching = false;
    
    element.addEventListener('touchstart', (e) => {
      startY = e.touches[0].clientY;
      isTouching = true;
    }, { passive: true });
    
    element.addEventListener('touchmove', (e) => {
      if (!isTouching) return;
      e.preventDefault();
    }, { passive: false });
    
    element.addEventListener('touchend', (e) => {
      if (!isTouching) return;
      isTouching = false;
      const endY = e.changedTouches[0].clientY;
      const deltaY = startY - endY;
      if (Math.abs(deltaY) > 10) {
        const delta = deltaY > 0 ? step : -step;
        timePicker[valueKey] = Math.max(min, Math.min(max, timePicker[valueKey] + delta));
        updateTimePickerDisplay();
      }
    });
  }
  
  // 初始化所有滚轮选择器
  function initTimePicker() {
    updateTimePickerDisplay();
    initArrowButtons();
    initInputEvents();
    setupScrollPicker('yearScroll', 'year', new Date().getFullYear(), new Date().getFullYear() + 10);
    setupScrollPicker('monthScroll', 'month', 1, 12);
    setupScrollPicker('dayScroll', 'day', 1, 31);
    setupScrollPicker('hourScroll', 'hour', 0, 23);
    setupScrollPicker('minuteScroll', 'minute', 0, 59);
    setupScrollPicker('secondScroll', 'second', 0, 59);
  }
  
  // 打开弹窗时初始化
  if (scheduledSendBtn) {
    scheduledSendBtn.onclick = () => {
      moreFeaturesDialog.style.display = 'none';
      scheduledSendDialog.style.display = 'flex';
      initTimePicker();
      renderScheduledList();
      console.log('[定时发送] 打开定时发送弹窗');
    };
  }
  
  // 附件选择
  if (attachImageBtn) {
    attachImageBtn.onclick = () => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.onchange = (e) => {
        const file = e.target.files[0];
        if (file) {
          currentScheduledAttachment = {
            type: 'image',
            file: file,
            name: file.name
          };
          scheduledAttachmentPreview.innerHTML = `
            <div class="attachment-preview">
              <span>🖼️ ${file.name}</span>
              <button class="remove-attachment" id="removeScheduledAttachment">×</button>
            </div>
          `;
          
          // 绑定移除按钮
          document.getElementById('removeScheduledAttachment').onclick = () => {
            currentScheduledAttachment = null;
            scheduledAttachmentPreview.innerHTML = '';
          };
          
          console.log('[定时发送] 添加图片附件:', file.name);
        }
      };
      input.click();
    };
  }
  
  if (attachFileBtn) {
    attachFileBtn.onclick = () => {
      const input = document.createElement('input');
      input.type = 'file';
      input.onchange = (e) => {
        const file = e.target.files[0];
        if (file) {
          currentScheduledAttachment = {
            type: 'file',
            file: file,
            name: file.name
          };
          scheduledAttachmentPreview.innerHTML = `
            <div class="attachment-preview">
              <span>📄 ${file.name}</span>
              <button class="remove-attachment" id="removeScheduledAttachment">×</button>
            </div>
          `;
          
          // 绑定移除按钮
          document.getElementById('removeScheduledAttachment').onclick = () => {
            currentScheduledAttachment = null;
            scheduledAttachmentPreview.innerHTML = '';
          };
          
          console.log('[定时发送] 添加文件附件:', file.name);
        }
      };
      input.click();
    };
  }
  
  // 确认定时发送
  if (confirmScheduledSendBtn) {
    confirmScheduledSendBtn.onclick = () => {
      const scheduledTimeInput = document.getElementById('scheduledTime');
      const messageContent = scheduledMessageInput.value.trim();
      
      // 优先使用手动输入，如果没有则使用滚轮选择器
      let scheduledTime;
      if (scheduledTimeInput && scheduledTimeInput.value) {
        scheduledTime = new Date(scheduledTimeInput.value);
      } else {
        scheduledTime = getTimePickerDate();
      }
      
      if (!scheduledTime || isNaN(scheduledTime.getTime())) {
        showTip('⚠️ 请选择发送时间');
        return;
      }
      
      if (!messageContent && !currentScheduledAttachment) {
        showTip('⚠️ 请输入消息内容或添加附件');
        return;
      }
      
      const now = new Date();
      
      if (scheduledTime <= now) {
        showTip('⚠️ 发送时间必须晚于当前时间');
        return;
      }
      
      const targetUser = targetId.textContent;
      if (targetUser === "未选择" || targetUser === "点击选择用户...") {
        showTip('⚠️ 请先选择一个聊天对象');
        return;
      }
      
      // 创建定时消息对象
      const scheduledMsg = {
        id: generateMessageId(),
        to: targetUser,
        content: messageContent,
        type: currentScheduledAttachment ? currentScheduledAttachment.type : 'text',
        attachment: currentScheduledAttachment,
        scheduledTime: scheduledTime.toISOString(),
        createdAt: now.toISOString(),
        status: 'pending' // pending 或 sent
      };
      
      // 添加到待发送列表
      scheduledMessages.push(scheduledMsg);
      
      // 保存到 localStorage
      saveScheduledMessages();
      
      // 设置定时器
      const delay = scheduledTime.getTime() - now.getTime();
      setTimeout(() => {
        sendScheduledMessage(scheduledMsg.id);
      }, delay);
      
      // 关闭弹窗并清空表单
      scheduledSendDialog.style.display = 'none';
      scheduledMessageInput.value = '';
      currentScheduledAttachment = null;
      if (scheduledAttachmentPreview) {
        scheduledAttachmentPreview.innerHTML = '';
      }
      
      // 重新渲染列表
      renderScheduledList();
      
      showTip('✅ 定时消息已设置');
      console.log('[定时发送] 设置定时消息:', scheduledMsg);
    };
  }
  
  // 保存定时消息到 localStorage
  function saveScheduledMessages() {
    localStorage.setItem(`scheduled_messages_${currentUserId}`, JSON.stringify(scheduledMessages));
    console.log('[定时发送] 已保存定时消息列表，共', scheduledMessages.length, '条');
  }
  
  // 加载定时消息
  function loadScheduledMessages() {
    const stored = localStorage.getItem(`scheduled_messages_${currentUserId}`);
    if (stored) {
      try {
        scheduledMessages = JSON.parse(stored);
        console.log('[定时发送] 加载了', scheduledMessages.length, '条定时消息');
        
        // 为每条消息设置定时器
        scheduledMessages.forEach(msg => {
          const scheduledTime = new Date(msg.scheduledTime);
          const now = new Date();
          const delay = scheduledTime.getTime() - now.getTime();
          
          if (delay > 0) {
            setTimeout(() => {
              sendScheduledMessage(msg.id);
            }, delay);
            console.log('[定时发送] 设置定时器，将在', delay, 'ms后发送');
          } else {
            console.log('[定时发送] 跳过已过期的定时消息:', msg.id);
          }
        });
      } catch (e) {
        console.error('[定时发送] 加载定时消息失败:', e);
        scheduledMessages = [];
      }
    }
  }
  
  // 发送定时消息
  function sendScheduledMessage(messageId) {
    const msgIndex = scheduledMessages.findIndex(m => m.id === messageId);
    if (msgIndex === -1) {
      console.log('[定时发送] 消息不存在或已发送:', messageId);
      return;
    }
    
    const msg = scheduledMessages[msgIndex];
    
    // 标记为已发送（保留在列表中供查看）
    msg.status = 'sent';
    saveScheduledMessages();
    
    const targetUser = msg.to;
    const currentTarget = targetId.textContent;
    
    // 构建消息数据
    const messageData = {
      id: msg.id,
      from: currentUserId,
      to: targetUser,
      content: msg.content,
      type: msg.type,
      extra: msg.attachment ? { attachmentName: msg.attachment.name } : null,
      timestamp: new Date().toISOString(),
      status: 'unread'
    };
    
    // 如果有附件，读取文件内容
    if (msg.attachment && msg.attachment.file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        messageData.content = e.target.result; // Base64
        socket.emit("sendPrivateMsg", messageData);
        
        // 如果是当前聊天对象，显示消息
        if (targetUser === currentTarget) {
          showMessage(messageData, true);
          saveMessages();
        }
        
        console.log('[定时发送] 已发送定时消息:', messageId);
      };
      reader.readAsDataURL(msg.attachment.file);
    } else {
      // 纯文本消息
      socket.emit("sendPrivateMsg", messageData);
      
      // 如果是当前聊天对象，显示消息
      if (targetUser === currentTarget) {
        showMessage(messageData, true);
        saveMessages();
      }
      
      console.log('[定时发送] 已发送定时消息:', messageId);
    }
  }
  
  // 渲染定时消息列表
  function renderScheduledList() {
    const listContainer = document.getElementById('scheduledList');
    const countElement = document.getElementById('scheduledCount');
    
    if (!listContainer || !countElement) return;
    
    countElement.textContent = `${scheduledMessages.length} 条`;
    
    if (scheduledMessages.length === 0) {
      listContainer.innerHTML = '<div class="empty-list-tip">暂无定时消息</div>';
      return;
    }
    
    // 按时间排序（最新的在前）
    const sorted = [...scheduledMessages].sort((a, b) => {
      return new Date(b.scheduledTime) - new Date(a.scheduledTime);
    });
    
    listContainer.innerHTML = sorted.map(msg => {
      const scheduledDate = new Date(msg.scheduledTime);
      const timeStr = scheduledDate.toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
      
      const isPending = msg.status === 'pending';
      const statusClass = isPending ? 'pending' : 'sent';
      const statusText = isPending ? '待发送' : '已发送';
      
      // 显示内容预览
      let contentPreview = msg.content || '';
      if (msg.type === 'image') {
        contentPreview = '[图片] ' + (msg.attachment?.name || '');
      } else if (msg.type === 'file') {
        contentPreview = '[文件] ' + (msg.attachment?.name || '');
      }
      
      return `
        <div class="scheduled-item" data-id="${msg.id}">
          <div class="scheduled-item-header">
            <span class="scheduled-item-time">🕒 ${timeStr}</span>
            <span class="scheduled-item-status ${statusClass}">${statusText}</span>
          </div>
          <div class="scheduled-item-to">发送给：${msg.to}</div>
          <div class="scheduled-item-row">
            <div class="scheduled-item-content"><strong>消息内容：</strong>${contentPreview}</div>
            ${isPending 
              ? `<button class="btn-cancel-scheduled" onclick="cancelScheduledMessage('${msg.id}')" title="取消发送">❌ 取消发送</button>`
              : `<button class="btn-delete-scheduled" onclick="deleteScheduledMessage('${msg.id}')" title="删除记录">🗑️ 删除记录</button>`
            }
          </div>
        </div>
      `;
    }).join('');
  }
  
  // 自定义确认对话框
  function showCustomConfirm(message, title = '确认操作') {
    return new Promise((resolve) => {
      const dialog = document.getElementById('customConfirmDialog');
      const titleEl = document.getElementById('confirmDialogTitle');
      const messageEl = document.getElementById('confirmDialogMessage');
      const okBtn = document.getElementById('confirmOkBtn');
      const cancelBtn = document.getElementById('confirmCancelBtn');
      
      if (!dialog || !titleEl || !messageEl || !okBtn || !cancelBtn) {
        resolve(false);
        return;
      }
      
      titleEl.textContent = title;
      messageEl.textContent = message;
      dialog.style.display = 'flex';
      
      const cleanup = () => {
        dialog.style.display = 'none';
        okBtn.removeEventListener('click', handleOk);
        cancelBtn.removeEventListener('click', handleCancel);
      };
      
      const handleOk = () => {
        cleanup();
        resolve(true);
      };
      
      const handleCancel = () => {
        cleanup();
        resolve(false);
      };
      
      okBtn.addEventListener('click', handleOk);
      cancelBtn.addEventListener('click', handleCancel);
    });
  }
  
  // 取消定时消息（未发送）
  window.cancelScheduledMessage = async function(messageId) {
    const confirmed = await showCustomConfirm('确定要取消这条定时发送消息吗？', '确认取消');
    if (!confirmed) {
      return;
    }
    
    const msgIndex = scheduledMessages.findIndex(m => m.id === messageId);
    if (msgIndex === -1) {
      showTip('⚠️ 消息不存在');
      return;
    }
    
    const msg = scheduledMessages[msgIndex];
    if (msg.status !== 'pending') {
      showTip('⚠️ 该消息已发送，无法取消');
      return;
    }
    
    // 从列表中移除
    scheduledMessages.splice(msgIndex, 1);
    saveScheduledMessages();
    
    // 重新渲染列表
    renderScheduledList();
    
    showTip('✅ 已取消定时发送');
    console.log('[定时发送] 已取消定时消息:', messageId);
  };
  
  // 删除定时消息记录（已发送）
  window.deleteScheduledMessage = async function(messageId) {
    const confirmed = await showCustomConfirm('确定要删除这条已发送的定时消息记录吗？', '确认删除');
    if (!confirmed) {
      return;
    }
    
    const msgIndex = scheduledMessages.findIndex(m => m.id === messageId);
    if (msgIndex === -1) {
      showTip('⚠️ 消息不存在');
      return;
    }
    
    const msg = scheduledMessages[msgIndex];
    if (msg.status !== 'sent') {
      showTip('⚠️ 该消息未发送，请使用取消功能');
      return;
    }
    
    // 从列表中移除
    scheduledMessages.splice(msgIndex, 1);
    saveScheduledMessages();
    
    // 重新渲染列表
    renderScheduledList();
    
    showTip('✅ 已删除记录');
    console.log('[定时发送] 已删除定时消息记录:', messageId);
  };
  
  // 页面加载时恢复定时消息
  loadScheduledMessages();
  
  // 生成唯一消息ID的辅助函数
  function generateMessageId() {
    return 'msg_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }
  
  // ========== 语音消息功能 ==========
  const voiceRecordBtn = document.getElementById('voiceRecordBtn');
  const voiceRecordPreview = document.getElementById('voiceRecordPreview');
  const recordingTime = document.getElementById('recordingTime');
  const stopRecordingBtn = document.getElementById('stopRecordingBtn');
  const voiceActionButtons = document.getElementById('voiceActionButtons');
  const playVoiceBtn = document.getElementById('playVoiceBtn');
  const cancelVoiceBtn = document.getElementById('cancelVoiceBtn');
  const sendVoiceBtn = document.getElementById('sendVoiceBtn');
  
  let isRecording = false;
  let isProcessing = false; // 标记是否正在处理录音数据
  let isCancelled = false; // 标记用户是否取消了录音
  let recordedAudioBlob = null;
  let recordedAudioDuration = 0;
  let audioPlayback = null; // 音频播放对象
  
  // 开始录音
  if (voiceRecordBtn) {
    voiceRecordBtn.onclick = async () => {
      // 如果正在录音，不允许再次点击
      if (isRecording) {
        console.log('[语音录制] 正在录音中，请先点击预览框上的"停止录音"按钮');
        return;
      }
      
      try {
        // 清除旧数据
        recordedAudioBlob = null;
        recordedAudioDuration = 0;
        audioChunks = [];
        isProcessing = false;
        isCancelled = false;
        
        // 获取麦克风权限
        audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
        console.log('[语音录制] 获得麦克风权限');
        
        // 创建 MediaRecorder
        mediaRecorder = new MediaRecorder(audioStream);
        audioChunks = [];
        
        // 监听数据可用事件
        mediaRecorder.ondataavailable = (event) => {
          audioChunks.push(event.data);
        };
        
        // 监听录音结束
        mediaRecorder.onstop = () => {
          // 清除计时器
          clearInterval(recordingTimer);
          recordingTimer = null;
          
          console.log('[语音录制] onstop 回调触发');
          console.log('[语音录制] isCancelled:', isCancelled);
          console.log('[语音录制] audioChunks 数量:', audioChunks.length);
          
          // 如果用户已经取消，不处理数据
          if (isCancelled) {
            console.log('[语音录制] 用户已取消，忽略 onstop 回调');
            isCancelled = false;
            isRecording = false;
            isProcessing = false;
            hideVoicePreview();
            return;
          }
          
          // 检查是否有音频数据
          if (audioChunks.length === 0) {
            console.error('[语音录制] 没有录制到任何音频数据！');
            alert('录制失败，未检测到音频数据，请重试。');
            isRecording = false;
            isProcessing = false;
            hideVoicePreview();
            return;
          }
          
          // 创建音频 Blob
          recordedAudioBlob = new Blob(audioChunks, { type: 'audio/webm' });
          console.log('[语音录制] 录音完成，大小:', recordedAudioBlob.size, 'bytes', 'chunks:', audioChunks.length);
          
          // 停止所有音轨
          if (audioStream) {
            audioStream.getTracks().forEach(track => track.stop());
            audioStream = null;
          }
          
          // 计算录音时长
          if (recordingStartTime) {
            recordedAudioDuration = Math.floor((Date.now() - recordingStartTime) / 1000);
          }
          
          // 重置状态
          isRecording = false;
          isProcessing = false;
          
          // 移除录音状态样式
          voiceRecordBtn.classList.remove('recording-active');
          
          // 显示操作按钮（播放、取消、发送）
          stopRecordingBtn.style.display = 'none';
          voiceActionButtons.style.display = 'flex';
          
          console.log('[语音录制] 录音完成，显示操作按钮');
        };
        
        // 开始录音 - 每100ms收集一次数据
        mediaRecorder.start(100);
        isRecording = true;
        isProcessing = false;
        isCancelled = false;
        recordingStartTime = Date.now();
        voiceRecordBtn.classList.add('recording-active');
        
        // 显示录音中状态
        voiceRecordPreview.style.display = 'block';
        voiceRecordPreview.className = 'voice-record-preview recording';
        
        // 显示停止录音按钮，隐藏操作按钮
        stopRecordingBtn.style.display = 'block';
        voiceActionButtons.style.display = 'none';
        
        // 初始化声波线并启动音量检测
        initWaveform(audioStream);
        
        // 启动计时器
        recordingTimer = setInterval(() => {
          const elapsed = Math.floor((Date.now() - recordingStartTime) / 1000);
          const minutes = String(Math.floor(elapsed / 60)).padStart(2, '0');
          const seconds = String(elapsed % 60).padStart(2, '0');
          recordingTime.textContent = `${minutes}:${seconds}`;
        }, 1000);
        
        console.log('[语音录制] 开始录音');
        
      } catch (error) {
        console.error('[语音录制] 获取麦克风失败:', error);
        alert('无法访问麦克风，请检查权限设置！');
      }
    };
  }
  
  // 停止录音按钮（在预览框上）
  if (stopRecordingBtn) {
    stopRecordingBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      console.log('[语音录制] 点击停止录音按钮');
      isProcessing = true;
      isCancelled = false;
      
      if (mediaRecorder && mediaRecorder.state === 'recording') {
        mediaRecorder.stop();
      }
    });
  }
  
  // 播放录音
  if (playVoiceBtn) {
    playVoiceBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      
      if (!recordedAudioBlob) {
        console.error('[语音播放] 没有可播放的录音');
        return;
      }
      
      // 如果已经在播放，停止它
      if (audioPlayback) {
        audioPlayback.pause();
        audioPlayback = null;
        playVoiceBtn.textContent = '▶ 播放';
        return;
      }
      
      // 创建音频对象并播放
      const audioUrl = URL.createObjectURL(recordedAudioBlob);
      audioPlayback = new Audio(audioUrl);
      
      audioPlayback.onended = () => {
        audioPlayback = null;
        playVoiceBtn.textContent = '▶ 播放';
        URL.revokeObjectURL(audioUrl);
      };
      
      audioPlayback.onerror = () => {
        console.error('[语音播放] 播放失败');
        audioPlayback = null;
        playVoiceBtn.textContent = '▶ 播放';
      };
      
      playVoiceBtn.textContent = '⏸ 暂停';
      audioPlayback.play();
      console.log('[语音播放] 开始播放录音');
    });
  }
  
  let audioContext = null; // Web Audio API 上下文
  let analyser = null; // 音频分析器
  let waveformAnimationId = null; // 波形动画ID
  
  // 初始化声波线并启动音量检测
  function initWaveform(stream) {
    const waveform = document.getElementById('voiceWaveform');
    if (!waveform) return;
    
    // 清空现有内容
    waveform.innerHTML = '';
    
    // 创建30个声波条
    const barCount = 30;
    for (let i = 0; i < barCount; i++) {
      const bar = document.createElement('div');
      bar.className = 'waveform-bar';
      waveform.appendChild(bar);
    }
    
    // 创建 Web Audio API 上下文
    try {
      audioContext = new (window.AudioContext || window.webkitAudioContext)();
      analyser = audioContext.createAnalyser();
      const source = audioContext.createMediaStreamSource(stream);
      source.connect(analyser);
      analyser.fftSize = 64; // 设置FFT大小
      
      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      
      // 启动音量检测循环
      function detectVolume() {
        if (!isRecording) return;
        
        analyser.getByteFrequencyData(dataArray);
        
        // 计算平均音量
        let sum = 0;
        for (let i = 0; i < bufferLength; i++) {
          sum += dataArray[i];
        }
        const average = sum / bufferLength;
        
        // 更新声波线
        const bars = waveform.querySelectorAll('.waveform-bar');
        bars.forEach((bar, index) => {
          // 根据音量调整高度
          const height = average > 10 ? (average / 255 * 46 + 4) : 4;
          bar.style.height = Math.min(height, 50) + 'px';
          
          // 有声音时改变颜色
          if (average > 10) {
            bar.classList.add('active');
          } else {
            bar.classList.remove('active');
          }
        });
        
        waveformAnimationId = requestAnimationFrame(detectVolume);
      }
      
      detectVolume();
      console.log('[语音录制] 音量检测已启动');
    } catch (error) {
      console.error('[语音录制] 启动音量检测失败:', error);
    }
  }
  
  // 隐藏语音预览
  function hideVoicePreview() {
    voiceRecordPreview.style.display = 'none';
    voiceRecordPreview.className = 'voice-record-preview';
    recordingTime.textContent = '00:00';
    voiceRecordBtn.classList.remove('recording-active');
    stopRecordingBtn.style.display = 'none';
    voiceActionButtons.style.display = 'none';
    
    // 清除播放
    if (audioPlayback) {
      audioPlayback.pause();
      audioPlayback = null;
    }
    
    // 停止音量检测
    if (waveformAnimationId) {
      cancelAnimationFrame(waveformAnimationId);
      waveformAnimationId = null;
    }
    
    // 关闭 Web Audio API 上下文
    if (audioContext) {
      audioContext.close();
      audioContext = null;
      analyser = null;
    }
    
    // 重置声波线
    const waveform = document.getElementById('voiceWaveform');
    if (waveform) {
      const bars = waveform.querySelectorAll('.waveform-bar');
      bars.forEach(bar => {
        bar.style.height = '4px';
        bar.classList.remove('active');
      });
    }
  }
  
  // 语音预览框拖拽功能
  let isDragging = false;
  let dragOffsetX = 0;
  let dragOffsetY = 0;
  
  voiceRecordPreview.addEventListener('mousedown', (e) => {
    // 如果点击的是按钮，不触发拖拽
    if (e.target.tagName === 'BUTTON' || e.target.closest('button')) {
      return;
    }
    
    isDragging = true;
    const rect = voiceRecordPreview.getBoundingClientRect();
    dragOffsetX = e.clientX - rect.left;
    dragOffsetY = e.clientY - rect.top;
    voiceRecordPreview.style.cursor = 'grabbing';
    e.preventDefault();
  });
  
  document.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    
    const x = e.clientX - dragOffsetX;
    const y = e.clientY - dragOffsetY;
    
    // 移除默认的居中定位，改用 left/top
    voiceRecordPreview.style.transform = 'none';
    voiceRecordPreview.style.left = x + 'px';
    voiceRecordPreview.style.top = y + 'px';
    voiceRecordPreview.style.bottom = 'auto';
    
    e.preventDefault();
  });
  
  document.addEventListener('mouseup', () => {
    if (isDragging) {
      isDragging = false;
      voiceRecordPreview.style.cursor = 'move';
    }
  });
  
  // 取消录音
  if (cancelVoiceBtn) {
    cancelVoiceBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      console.log('[语音录制] 点击取消按钮');
      
      // 停止录音（如果正在录）
      if (isRecording && mediaRecorder && mediaRecorder.state === 'recording') {
        isCancelled = true; // 标记为取消
        mediaRecorder.stop();
        return;
      }
      
      // 清除所有数据
      recordedAudioBlob = null;
      recordedAudioDuration = 0;
      audioChunks = [];
      isRecording = false;
      isProcessing = false;
      isCancelled = false;
      
      // 停止音频流
      if (audioStream) {
        audioStream.getTracks().forEach(track => track.stop());
        audioStream = null;
      }
      
      // 隐藏预览
      hideVoicePreview();
      
      console.log('[语音录制] 已取消');
    });
  }
  
  // 发送语音 - 使用 addEventListener 确保事件绑定成功
  if (sendVoiceBtn) {
    console.log('[语音初始化] sendVoiceBtn 元素已找到，绑定点击事件');
    
    // 先测试一下元素是否可以点击
    console.log('[语音初始化] 按钮信息:', {
      id: sendVoiceBtn.id,
      display: window.getComputedStyle(sendVoiceBtn).display,
      pointerEvents: window.getComputedStyle(sendVoiceBtn).pointerEvents,
      visibility: window.getComputedStyle(sendVoiceBtn).visibility
    });
    
    sendVoiceBtn.addEventListener('click', async (e) => {
      console.log('======== [语音发送] 点击事件触发 ========');
      console.log('[语音发送] event target:', e.target);
      console.log('[语音发送] recordedAudioBlob:', recordedAudioBlob);
      console.log('[语音发送] isRecording:', isRecording);
      console.log('[语音发送] isProcessing:', isProcessing);
      
      e.preventDefault();
      e.stopPropagation();
      
      // 如果录音还在进行中，先停止录音
      if (isRecording) {
        console.log('[语音发送] 录音还在进行中，自动停止录音');
        isCancelled = false;
        isProcessing = true;
        if (mediaRecorder && mediaRecorder.state === 'recording') {
          mediaRecorder.stop();
        }
        
        // 等待录音处理完成
        await new Promise(resolve => setTimeout(resolve, 500));
      }
      
      // 如果正在处理录音数据，等待处理完成
      if (isProcessing) {
        console.log('[语音发送] 正在处理录音数据，等待中...');
        // 轮询等待，最多等待3秒
        let waitCount = 0;
        const checkInterval = setInterval(() => {
          waitCount++;
          if (!isProcessing) {
            clearInterval(checkInterval);
            console.log('[语音发送] 处理完成，继续发送');
            sendVoiceBtn.click();
          } else if (waitCount > 30) { // 3秒超时
            clearInterval(checkInterval);
            console.error('[语音发送] 等待超时，isProcessing 仍然为 true');
            isProcessing = false; // 强制重置
            sendVoiceBtn.click();
          }
        }, 100);
        return;
      }
      
      if (!recordedAudioBlob || recordedAudioBlob.size === 0) {
        console.error('[语音发送] 没有可发送的语音！recordedAudioBlob:', recordedAudioBlob);
        alert('没有可发送的语音！请重新录制。');
        return;
      }
      
      const to = targetId.textContent;
      if (to === "未选择" || to === "点击选择用户...") {
        alert("请先选择聊天对象");
        return;
      }
      
      console.log('[语音发送] 开始发送语音，大小:', recordedAudioBlob.size, 'bytes');
      
      // 将 Blob 转换为 Base64
      const reader = new FileReader();
      reader.onload = (e) => {
        console.log('[语音发送] Blob 转换完成');
        const base64Audio = e.target.result;
        
        // 构建消息数据
        const messageData = {
          id: generateMessageId(),
          from: currentUserId,
          to: to,
          content: base64Audio,
          type: 'voice',
          extra: {
            duration: recordedAudioDuration
          },
          timestamp: new Date().toISOString(),
          status: 'unread'
        };
        
        // 如果启用了阅后即焚，添加焚毁标记
        if (burnAfterReadEnabled) {
          messageData.extra.burnAfterRead = true;
          messageData.extra.burnDuration = burnDuration;
          console.log('[阅后即焚] 语音消息将启用阅后即焚，时长:', burnDuration, '秒');
        }
        
        console.log('[语音发送] 显示消息到界面');
        // 显示消息
        showMessage(messageData, true);
        
        console.log('[语音发送] 发送到服务器');
        // 发送到服务器
        socket.emit("sendPrivateMsg", messageData);
        
        console.log('[语音发送] 保存到本地');
        // 保存消息
        saveMessages();
        
        // 关闭预览并重置
        voiceRecordPreview.style.display = 'none';
        isRecording = false;
        recordedAudioBlob = null;
        recordedAudioDuration = 0;
        recordingTime.textContent = '00:00';
        voiceActionButtons.style.display = 'none';
        stopRecordingBtn.style.display = 'none';
        
        console.log('======== [语音发送] 发送完成 ========');
      };
      
      reader.onerror = (err) => {
        console.error('[语音发送] FileReader 错误:', err);
        alert('语音转换失败，请重试！');
      };
      
      console.log('[语音发送] 开始读取 Blob...');
      reader.readAsDataURL(recordedAudioBlob);
    });
  } else {
    console.error('[语音初始化] sendVoiceBtn 元素未找到！');
  }
  
  // 修改昵称
  function bindEditNameEvent() {
    const editNameBtn = document.getElementById("editNameBtn");
    const userNameDisplay = document.getElementById("myId");
    
    if (editNameBtn && userNameDisplay) {
      editNameBtn.onclick = () => {
        // 保存原始昵称
        const originalName = currentUserId;
        
        // 创建修改昵称容器
        const editContainer = document.createElement("div");
        editContainer.className = "edit-name-container";
        
        // 创建输入框
        const input = document.createElement("input");
        input.type = "text";
        input.className = "inline-name-input";
        input.value = currentUserId;
        input.maxLength = 10;
        
        // 创建按钮容器
        const buttonContainer = document.createElement("div");
        buttonContainer.className = "edit-name-buttons";
        
        // 创建确认按钮
        const confirmBtn = document.createElement("button");
        confirmBtn.className = "edit-name-btn confirm";
        confirmBtn.textContent = "确认";
        
        // 创建取消按钮
        const cancelBtn = document.createElement("button");
        cancelBtn.className = "edit-name-btn cancel";
        cancelBtn.textContent = "取消";
        
        // 组装容器
        buttonContainer.appendChild(confirmBtn);
        buttonContainer.appendChild(cancelBtn);
        editContainer.appendChild(input);
        editContainer.appendChild(buttonContainer);
        
        // 替换昵称显示
        const parent = userNameDisplay.parentElement;
        parent.replaceChild(editContainer, userNameDisplay);
        
        // 自动聚焦并选中
        input.focus();
        input.select();
        
        // 确认按钮点击事件
        confirmBtn.addEventListener("click", () => {
          const newName = input.value.trim();
          if (newName && newName.length >= 2 && newName.length <= 10 && newName !== originalName) {
            const oldId = currentUserId;
            currentUserId = newName;
            localStorage.setItem("chatUserId", currentUserId);
            
            // 迁移聊天记录（将旧昵称下的消息迁移到新昵称）
            migrateChatHistory(oldId, currentUserId);
            
            // 通知服务器更新用户ID
            socket.emit("updateUserId", { oldId: oldId, newId: currentUserId });
            showTip("昵称修改成功");
          }
          
          // 恢复为文本显示
          const textDisplay = document.createElement("div");
          textDisplay.className = "user-name";
          textDisplay.id = "myId";
          textDisplay.textContent = currentUserId;
          parent.replaceChild(textDisplay, editContainer);
          
          // 重新获取userNameDisplay元素，确保它指向正确的元素
          window.userNameDisplay = document.getElementById("myId");
          
          // 重新绑定编辑事件
          bindEditNameEvent();
        });
        
        // 取消按钮点击事件
        cancelBtn.addEventListener("click", () => {
          // 恢复为文本显示
          const textDisplay = document.createElement("div");
          textDisplay.className = "user-name";
          textDisplay.id = "myId";
          textDisplay.textContent = originalName;
          parent.replaceChild(textDisplay, editContainer);
          
          // 重新获取userNameDisplay元素，确保它指向正确的元素
          window.userNameDisplay = document.getElementById("myId");
          
          // 重新绑定编辑事件
          bindEditNameEvent();
        });
        
        // 回车键保存
        input.addEventListener("keypress", (e) => {
          if (e.key === "Enter") {
            confirmBtn.click();
          }
        });
        
        // ESC键取消
        input.addEventListener("keydown", (e) => {
          if (e.key === "Escape") {
            cancelBtn.click();
          }
        });
      };
    }
  }
  
  // 初始绑定编辑事件
  bindEditNameEvent();
  
  // 语音通话
  if (voiceCallBtn) {
    voiceCallBtn.addEventListener("click", () => {
      const to = targetId.textContent;
      if (to === "未选择") {
        showTip("请先选择聊天对象");
        return;
      }
      startCall(to, "语音通话");
    });
  }
  
  // 视频通话
  if (videoCallBtn) {
    videoCallBtn.addEventListener("click", () => {
      const to = targetId.textContent;
      if (to === "未选择" || to === "点击选择用户...") {
        showTip("请先选择聊天对象");
        return;
      }
      startCall(to, "视频通话");
    });
  }
  
  // 附件按钮
  if (attachBtn) {
    attachBtn.addEventListener("click", () => {
      isAttachMenuVisible = !isAttachMenuVisible;
      if (isAttachMenuVisible) {
        attachMenu.classList.add("show");
        // 隐藏其他菜单
        if (isEmojiPickerVisible) {
          emojiPicker.classList.remove("show");
          isEmojiPickerVisible = false;
        }
      } else {
        attachMenu.classList.remove("show");
      }
    });
  }
  
  // 图片按钮
  if (imageBtn) {
    imageBtn.addEventListener("click", () => {
      attachMenu.classList.remove("show");
      fileInput.click();
    });
  }
  
  // 表情按钮
  if (emojiBtn) {
    emojiBtn.addEventListener("click", () => {
      attachMenu.classList.remove("show");
      isEmojiPickerVisible = !isEmojiPickerVisible;
      if (isEmojiPickerVisible) {
        emojiPicker.classList.add("show");
      } else {
        emojiPicker.classList.remove("show");
      }
    });
  }
  
  // 文件按钮
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
  
  // 表情选择事件
  if (emojiPicker) {
    const emojiItems = emojiPicker.querySelectorAll(".emoji-item");
    emojiItems.forEach(item => {
      item.addEventListener("click", () => {
        const emoji = item.textContent;
        sendEmoji(emoji);
        emojiPicker.classList.remove("show");
        isEmojiPickerVisible = false;
      });
    });
  }
  
  // 点击其他地方关闭菜单
  document.addEventListener("click", (e) => {
    if (!attachBtn || !attachBtn.contains(e.target) && !attachMenu.contains(e.target)) {
      attachMenu.classList.remove("show");
      isAttachMenuVisible = false;
    }
    if (emojiPicker && (!emojiBtn || !emojiBtn.contains(e.target) && !emojiPicker.contains(e.target))) {
      emojiPicker.classList.remove("show");
      isEmojiPickerVisible = false;
    }
  });
}

// ==============================================
// 发送消息
// ==============================================
function send() {
  const content = msgInput.value.trim();
  if (!content) return;
  
  const to = targetId.textContent;
  if (to === "未选择" || to === "点击选择用户...") {
    showTip("请先选择聊天对象");
    return;
  }
  
  const messageData = {
    id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
    from: currentUserId,
    to: to,
    content: content,
    type: "text",
    timestamp: new Date().toISOString(),
    status: "unread"
  };
  
  // 如果启用了阅后即焚，添加焚毁标记
  if (burnAfterReadEnabled) {
    messageData.extra = {
      burnAfterRead: true,
      burnDuration: burnDuration
    };
    console.log('[阅后即焚] 消息将启用阅后即焚，时长:', burnDuration, '秒');
  }
  
  // 显示消息
  showMessage(messageData, true);
  
  // 发送消息到服务器
  socket.emit("sendPrivateMsg", messageData);
  
  // 清空输入框
  msgInput.value = "";
  
  // 保存消息到本地存储
  saveMessages();
}

// ==============================================
// 发送图片
// ==============================================
function sendImage(file) {
  const to = targetId.textContent;
  if (to === "未选择" || to === "点击选择用户...") {
    showTip("请先选择聊天对象");
    return;
  }
  
  const reader = new FileReader();
  reader.onload = (e) => {
    const imageDataUrl = e.target.result;
    const messageData = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      from: currentUserId,
      to: to,
      content: imageDataUrl,
      type: "image",
      timestamp: new Date().toISOString(),
      status: "unread"
    };
    
    // 如果启用了阅后即焚，添加焚毁标记
    if (burnAfterReadEnabled) {
      messageData.extra = {
        burnAfterRead: true,
        burnDuration: burnDuration
      };
      console.log('[阅后即焚] 图片消息将启用阅后即焚，时长:', burnDuration, '秒');
    }
    
    // 显示消息
    showMessage(messageData, true);
    
    // 发送消息到服务器
    socket.emit("sendPrivateMsg", messageData);
    
    // 保存消息到本地存储
    saveMessages();
  };
  reader.readAsDataURL(file);
}

// ==============================================
// 发送文件
// ==============================================
function sendFile(file) {
  const to = targetId.textContent;
  if (to === "未选择" || to === "点击选择用户...") {
    showTip("请先选择聊天对象");
    return;
  }
  
  const reader = new FileReader();
  reader.onload = (e) => {
    const fileDataUrl = e.target.result;
    const messageData = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      from: currentUserId,
      to: to,
      content: fileDataUrl,
      type: "file",
      extra: {
        name: file.name,
        size: file.size
      },
      timestamp: new Date().toISOString(),
      status: "unread"
    };
    
    // 如果启用了阅后即焚，添加焚毁标记
    if (burnAfterReadEnabled) {
      messageData.extra.burnAfterRead = true;
      messageData.extra.burnDuration = burnDuration;
      console.log('[阅后即焚] 文件消息将启用阅后即焚，时长:', burnDuration, '秒');
    }
    
    // 显示消息
    showMessage(messageData, true);
    
    // 发送消息到服务器
    socket.emit("sendPrivateMsg", messageData);
    
    // 保存消息到本地存储
    saveMessages();
  };
  reader.readAsDataURL(file);
}

// ==============================================
// 发送表情
// ==============================================
function sendEmoji(emoji) {
  const to = targetId.textContent;
  if (to === "未选择" || to === "点击选择用户...") {
    showTip("请先选择聊天对象");
    return;
  }
  
  const messageData = {
    id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
    from: currentUserId,
    to: to,
    content: emoji,
    type: "emoji",
    timestamp: new Date().toISOString(),
    status: "unread"
  };
  
  // 如果启用了阅后即焚，添加焚毁标记
  if (burnAfterReadEnabled) {
    messageData.extra = {
      burnAfterRead: true,
      burnDuration: burnDuration
    };
    console.log('[阅后即焚] 表情消息将启用阅后即焚，时长:', burnDuration, '秒');
  }
  
  // 显示消息
  showMessage(messageData, true);
  
  // 发送消息到服务器
  socket.emit("sendPrivateMsg", messageData);
  
  // 保存消息到本地存储
  saveMessages();
}

// ==============================================
// 显示消息
// ==============================================
function showMessage(messageData, isOwnMessage = false) {
  // 添加调试信息
  console.log("showMessage called with:", messageData);
  
  const { id, from, to, content, type = "text", extra, timestamp, status } = messageData;
  
  // 关键修复：如果不是当前聊天对象的消息，不显示到 msgArea
  const currentTarget = targetId.textContent;
  if (!isOwnMessage && currentTarget !== from && currentTarget !== "未选择" && currentTarget !== "点击选择用户...") {
    console.log(`[showMessage] 消息发送者 ${from} 不是当前聊天对象 ${currentTarget}，不显示到 msgArea`);
    // 不显示消息到 DOM，但会在 newPrivateMsg 事件中增加未读计数
    return;
  }
  
  const messageContainer = document.createElement("div");
  messageContainer.className = `message-container ${isOwnMessage ? "me" : "other"}`;
  messageContainer.dataset.messageId = id;
  
  // 根据消息类型创建不同的消息内容
  let messageContent = "";
  if (type === "text" || type === "emoji") {
    messageContent = `<div class="message">${content}</div>`;
  } else if (type === "image") {
    messageContent = `<div class="message"><img src="${content}" alt="图片" onclick="showImagePreview('${content}')"></div>`;
  } else if (type === "file") {
    const fileName = extra?.name || "未知文件";
    const fileSize = extra?.size ? formatFileSize(extra.size) : "未知大小";
    messageContent = `<div class="message"><a href="${content}" download="${fileName}" class="file-link"><span class="file-icon">📄</span><div class="file-info"><div class="file-name">${fileName}</div><div class="file-size">${fileSize}</div></div></a></div>`;
  } else if (type === "voice") {
    // 语音消息
    const duration = extra?.duration || 0;
    const minutes = String(Math.floor(duration / 60)).padStart(2, '0');
    const seconds = String(duration % 60).padStart(2, '0');
    const durationStr = `${minutes}:${seconds}`;
    
    messageContent = `
      <div class="message voice-message">
        <audio class="voice-audio" src="${content}" preload="none"></audio>
        <button class="voice-play-btn" onclick="toggleVoicePlay(this)">
          <span class="play-icon">▶️</span>
        </button>
        <span class="voice-duration">${durationStr}</span>
        <button class="voice-transcript-btn" onclick="showTranscriptPlaceholder()">转文字</button>
      </div>
    `;
  } else {
    // 处理未知类型
    messageContent = `<div class="message">${content}</div>`;
  }
  
  // 显示消息状态
  let statusHTML = "";
  if (isOwnMessage) {
    statusHTML = `<div class="read-status ${status}">${status === "read" ? "已读" : "未读"}</div>`;
  } else {
    // 对于收到的消息，也显示已读状态
    statusHTML = `<div class="read-status ${status}">${status === "read" ? "已读" : "未读"}</div>`;
  }
  
  messageContainer.innerHTML = `
    ${messageContent}
    ${statusHTML}
    <div class="message-time" data-timestamp="${timestamp}">${formatMessageTime(timestamp)}</div>
  `;
  
  // 关键修复：在添加消息之前判断用户是否在底部
  const wasAtBottom = isUserAtBottom();
  console.log("添加消息前，用户是否在底部:", wasAtBottom);
  
  msgArea.appendChild(messageContainer);
  
  console.log("=== 开始处理消息显示 ===");
  console.log("消息类型:", isOwnMessage ? "自己发送" : "收到消息");
  
  if (isOwnMessage) {
    // 自己发送的消息，总是滚动到底部
    console.log("自己发送的消息，滚动到底部");
    scrollToBottom();
    hideNewMessageIndicator();
  } else {
    // 收到的消息
    const currentTarget = targetId.textContent;
    console.log("收到消息 - 当前目标:", currentTarget, "发送者:", from, "是否匹配:", currentTarget === from);
    if (currentTarget === from) {
      // 使用添加消息前的判断结果
      if (wasAtBottom) {
        // 用户在底部，自动滚动，不显示提示
        console.log("用户在底部，自动滚动到底部，不显示新消息提示");
        scrollToBottom();
        hideNewMessageIndicator();
      } else {
        // 用户不在底部，显示新消息提示
        console.log("用户不在底部，显示新消息提示");
        showNewMessageIndicator();
      }
    } else {
      console.log("不是当前聊天对象的消息，不处理滚动");
    }
  }
  console.log("=== 消息处理完成 ===");
  
  // 为新添加的消息添加触摸支持
  messageContainer.addEventListener('touchstart', function(e) {
    // 移除其他消息的 touch-active 类
    msgArea.querySelectorAll('.message-container').forEach(c => c.classList.remove('touch-active'));
    // 添加当前消息的 touch-active 类
    this.classList.add('touch-active');
    
    // 3秒后自动隐藏
    setTimeout(() => {
      this.classList.remove('touch-active');
    }, 3000);
  });
}

// ==============================================
// 滚动到底部的辅助函数
// ==============================================
function scrollToBottom() {
  if (!msgArea) return;
  
  // 使用多种方法确保滚动成功
  msgArea.scrollTop = msgArea.scrollHeight;
  
  // 如果第一次滚动不成功，再次尝试
  setTimeout(() => {
    if (msgArea.scrollTop + msgArea.clientHeight < msgArea.scrollHeight - 10) {
      console.log("第一次滚动未到达底部，再次尝试");
      msgArea.scrollTop = msgArea.scrollHeight;
      msgArea.scrollTo({ top: msgArea.scrollHeight, behavior: 'smooth' });
    }
  }, 50);
}

// ==============================================
// 检查用户是否在底部
// ==============================================
function isUserAtBottom() {
  if (!msgArea) {
    console.log("isUserAtBottom: msgArea不存在，返回true");
    return true;
  }
  
  // 增加阈值到100px，更加宽容地判断用户是否在底部
  const threshold = 100;
  const scrollTop = msgArea.scrollTop;
  const clientHeight = msgArea.clientHeight;
  const scrollHeight = msgArea.scrollHeight;
  const currentPosition = scrollTop + clientHeight;
  const atBottom = currentPosition >= (scrollHeight - threshold);
  
  console.log("isUserAtBottom检查:", {
    scrollTop: scrollTop,
    clientHeight: clientHeight,
    scrollHeight: scrollHeight,
    currentPosition: currentPosition,
    threshold: threshold,
    diff: scrollHeight - currentPosition,
    atBottom: atBottom
  });
  
  return atBottom;
}

// ==============================================
// 显示新消息提示
// ==============================================
function showNewMessageIndicator() {
  if (!isNewMessageIndicatorVisible) {
    newMessageCounter++;
    newMessageCount.textContent = newMessageCounter;
    newMessageIndicator.style.display = 'block';
    isNewMessageIndicatorVisible = true;
    console.log("显示新消息提示，计数:", newMessageCounter);
  } else {
    newMessageCounter++;
    newMessageCount.textContent = newMessageCounter;
    console.log("更新新消息计数:", newMessageCounter);
  }
}

// ==============================================
// 隐藏新消息提示
// ==============================================
function hideNewMessageIndicator() {
  newMessageIndicator.style.display = 'none';
  isNewMessageIndicatorVisible = false;
  newMessageCounter = 0;
  console.log("隐藏新消息提示");
}

// ==============================================
// 格式化文件大小
// ==============================================
function formatFileSize(bytes) {
  if (bytes < 1024) return bytes + " B";
  else if (bytes < 1048576) return (bytes / 1024).toFixed(2) + " KB";
  else return (bytes / 1048576).toFixed(2) + " MB";
}

// ==============================================
// 显示图片预览
// ==============================================
function showImagePreview(imageUrl) {
  const imgDialog = document.createElement("div");
  imgDialog.className = "image-dialog-overlay";
  imgDialog.innerHTML = `
    <div class="image-dialog-content">
      <button class="image-dialog-close" onclick="this.parentElement.parentElement.remove()">×</button>
      <img src="${imageUrl}" alt="图片预览">
    </div>
  `;
  
  // 添加点击图片关闭功能
  const imgElement = imgDialog.querySelector("img");
  imgElement.addEventListener("click", () => {
    imgDialog.remove();
  });
  
  document.body.appendChild(imgDialog);
}

// ==============================================
// 保存消息到本地存储
// ==============================================
function saveMessages(targetUser = null) {
  const to = targetUser || targetId.textContent;
  if (to === "未选择" || to === "点击选择用户...") return;
  
  const messages = [];
  const messageContainers = msgArea.querySelectorAll(".message-container");
  
  messageContainers.forEach(container => {
    const messageId = container.dataset.messageId;
    const isOwnMessage = container.classList.contains("me");
    const messageBubble = container.querySelector(".message");
    
    if (!messageBubble) return;
    
    let type = "text";
    let content = "";
    let extra = null;
    
    if (messageBubble.classList.contains("voice-message")) {
      type = "voice";
      const audio = messageBubble.querySelector(".voice-audio");
      const durationEl = messageBubble.querySelector(".voice-duration");
      if (audio) {
        content = audio.src;
      }
      if (durationEl) {
        const durationParts = durationEl.textContent.split(':');
        if (durationParts.length === 2) {
          extra = {
            duration: parseInt(durationParts[0]) * 60 + parseInt(durationParts[1])
          };
        }
      }
    } else if (messageBubble.querySelector("img")) {
      type = "image";
      const img = messageBubble.querySelector("img");
      if (img) content = img.src;
    } else if (messageBubble.querySelector("a")) {
      type = "file";
      const fileLink = messageBubble.querySelector("a");
      if (fileLink) {
        content = fileLink.href;
        const fileName = fileLink.querySelector(".file-name");
        const fileSize = fileLink.querySelector(".file-size");
        if (fileName && fileSize) {
          extra = {
            name: fileName.textContent,
            size: parseFileSize(fileSize.textContent)
          };
        }
      }
    } else {
      content = messageBubble.textContent;
      // 检查是否是表情
      if (content.length === 1 && /[\u2600-\u26FF\u2700-\u27BF\u1F300-\u1F5FF\u1F600-\u1F64F\u1F680-\u1F6FF]/u.test(content)) {
        type = "emoji";
      }
    }
    
    // 获取状态
    let status = "unread";
    const statusEl = container.querySelector(".read-status");
    if (statusEl) {
      status = statusEl.classList.contains("read") ? "read" : "unread";
    }
    
    messages.push({
      id: messageId,
      from: isOwnMessage ? currentUserId : to,
      to: isOwnMessage ? to : currentUserId,
      content: content,
      type: type,
      extra: extra,
      timestamp: new Date().toISOString(),
      status: status
    });
    
    console.log(`[saveMessages] 保存消息:`, {
      id: messageId,
      from: isOwnMessage ? currentUserId : to,
      to: isOwnMessage ? to : currentUserId,
      content: content,
      targetUser: to,
      currentUserId: currentUserId
    });
  });
  
  localStorage.setItem(`chat_messages_${currentUserId}_${to}`, JSON.stringify(messages));
}

// ==============================================
// 迁移聊天记录（昵称修改时调用）
// ==============================================
function migrateChatHistory(oldId, newId) {
  console.log("================================");
  console.log("=== 开始迁移聊天记录 ===");
  console.log("旧昵称:", oldId);
  console.log("新昵称:", newId);
  console.log("当前localStorage中的所有键:");
  
  // 打印所有localStorage键（调试用）
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key) {
      console.log(`  [${i}] ${key}`);
    }
  }
  
  let migratedCount = 0;
  const keysToRemove = [];
  
  // 先收集所有聊天记录相关的键（避免遍历时修改localStorage导致的问题）
  const keysToMigrate = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith("chat_messages_")) {
      keysToMigrate.push(key);
      console.log("找到聊天记录键:", key);
    }
  }
  
  console.log(`共找到 ${keysToMigrate.length} 个聊天记录键`);
  
  if (keysToMigrate.length === 0) {
    console.log("⚠️ 没有找到任何聊天记录，可能还没有聊天数据");
    console.log("================================");
    return;
  }
  
  // 处理每个键
  keysToMigrate.forEach((key, index) => {
    console.log(`\n--- 处理第 ${index + 1} 个键: ${key} ---`);
    
    // 情况1: 匹配格式 chat_messages_${oldId}_${targetUser}
    // 例如: chat_messages_博览群书2_廉洁112
    if (key.startsWith(`chat_messages_${oldId}_`)) {
      console.log("  → 匹配情况1（我发起的聊天）");
      const targetUser = key.replace(`chat_messages_${oldId}_`, "");
      const newKey = `chat_messages_${newId}_${targetUser}`;
      console.log(`  → 新键名: ${newKey}`);
      
      const oldData = localStorage.getItem(key);
      if (oldData) {
        try {
          const messages = JSON.parse(oldData);
          console.log(`  → 消息数量: ${messages.length}`);
          
          // 更新消息中的 from 和 to 字段
          const updatedMessages = messages.map(msg => {
            const originalFrom = msg.from;
            const originalTo = msg.to;
            if (msg.from === oldId) msg.from = newId;
            if (msg.to === oldId) msg.to = newId;
            if (msg.from !== originalFrom || msg.to !== originalTo) {
              console.log(`    更新消息 ${msg.id}: from=${originalFrom}→${msg.from}, to=${originalTo}→${msg.to}`);
            }
            return msg;
          });
          
          // 保存到新键
          localStorage.setItem(newKey, JSON.stringify(updatedMessages));
          keysToRemove.push(key);
          migratedCount++;
          
          console.log(`  ✓ 已迁移: ${oldId}↔${targetUser} → ${newId}↔${targetUser}`);
        } catch (error) {
          console.error(`  ✗ 迁移失败: ${key}`, error);
        }
      }
    }
    // 情况2: 匹配格式 chat_messages_${targetUser}_${oldId}
    // 例如: chat_messages_廉洁112_博览群书2（对方视角的记录）
    else if (key.endsWith(`_${oldId}`)) {
      console.log("  → 匹配情况2（对方视角的记录）");
      const parts = key.replace("chat_messages_", "").split("_");
      if (parts.length === 2 && parts[1] === oldId) {
        const targetUser = parts[0];
        const newKey = `chat_messages_${targetUser}_${newId}`;
        console.log(`  → 新键名: ${newKey}`);
        
        // 避免重复处理
        if (!keysToMigrate.includes(newKey) && !localStorage.getItem(newKey)) {
          const oldData = localStorage.getItem(key);
          if (oldData) {
            try {
              const messages = JSON.parse(oldData);
              console.log(`  → 消息数量: ${messages.length}`);
              
              // 更新消息中的 from 和 to 字段
              const updatedMessages = messages.map(msg => {
                const originalFrom = msg.from;
                const originalTo = msg.to;
                if (msg.from === oldId) msg.from = newId;
                if (msg.to === oldId) msg.to = newId;
                if (msg.from !== originalFrom || msg.to !== originalTo) {
                  console.log(`    更新消息 ${msg.id}: from=${originalFrom}→${msg.from}, to=${originalTo}→${msg.to}`);
                }
                return msg;
              });
              
              // 保存到新键
              localStorage.setItem(newKey, JSON.stringify(updatedMessages));
              keysToRemove.push(key);
              migratedCount++;
              
              console.log(`  ✓ 已迁移: ${targetUser}→${oldId} → ${targetUser}→${newId}`);
            } catch (error) {
              console.error(`  ✗ 迁移失败: ${key}`, error);
            }
          }
        } else {
          console.log("  → 跳过（新键已存在）");
        }
      }
    } else {
      console.log("  → 不匹配，跳过");
    }
  });
  
  // 删除旧的键
  console.log(`\n--- 删除旧键 ---`);
  keysToRemove.forEach(key => {
    console.log(`  删除: ${key}`);
    localStorage.removeItem(key);
  });
  
  console.log(`\n================================`);
  console.log(`=== 迁移完成 ===`);
  console.log(`共迁移 ${migratedCount} 个聊天记录`);
  console.log(`已删除 ${keysToRemove.length} 个旧键`);
  console.log(`迁移后的localStorage键:`);
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith("chat_messages_")) {
      console.log(`  ${key}`);
    }
  }
  console.log("================================\n");
  
  // 验证迁移是否成功
  console.log("--- 验证迁移结果 ---");
  let verificationSuccess = true;
  keysToMigrate.forEach(key => {
    if (keysToRemove.includes(key)) {
      // 这个键应该被删除
      if (localStorage.getItem(key)) {
        console.error(`  ✗ 验证失败: 旧键 ${key} 仍然存在于localStorage`);
        verificationSuccess = false;
      } else {
        console.log(`  ✓ 旧键 ${key} 已成功删除`);
      }
    }
  });
  
  if (verificationSuccess) {
    console.log("  ✓ 所有旧键已成功删除");
  }
  
  console.log("--- 验证结束 ---\n");
  
  // 重新加载当前聊天消息
  const currentTarget = targetId.textContent;
  console.log("当前聊天对象:", currentTarget);
  if (currentTarget !== "未选择" && currentTarget !== "点击选择用户...") {
    console.log("准备重新加载聊天消息...");
    // 使用setTimeout确保DOM更新完成后再加载
    setTimeout(() => {
      console.log("开始加载消息:", currentTarget);
      console.log("新键名:", `chat_messages_${newId}_${currentTarget}`);
      const migratedData = localStorage.getItem(`chat_messages_${newId}_${currentTarget}`);
      console.log("找到的数据:", migratedData ? "有数据" : "无数据");
      if (migratedData) {
        try {
          const msgs = JSON.parse(migratedData);
          console.log("消息数量:", msgs.length);
        } catch (e) {
          console.error("解析失败:", e);
        }
      }
      loadMessages();
    }, 100);
  } else {
    console.log("⚠️ 当前没有选择聊天对象，无法重新加载消息");
  }
}
// ==============================================
// 解析文件大小
// ==============================================
function parseFileSize(sizeStr) {
  const match = sizeStr.match(/(\d+(\.\d+)?)\s*(B|KB|MB)/);
  if (!match) return 0;
  
  const size = parseFloat(match[1]);
  const unit = match[3];
  
  switch (unit) {
    case "KB":
      return size * 1024;
    case "MB":
      return size * 1024 * 1024;
    default:
      return size;
  }
}

// ==============================================
// 加载历史消息
// ==============================================
function loadMessages() {
  const to = targetId.textContent;
  console.log("=== loadMessages 开始 ===");
  console.log("to (目标用户):", to);
  console.log("currentUserId (当前用户):", currentUserId);
  
  if (to === "未选择" || to === "点击选择用户...") {
    console.log("没有选择聊天对象，清空消息区域");
    msgArea.innerHTML = "";
    return;
  }
  
  console.time('loadMessages');
  
  const storageKey = `chat_messages_${currentUserId}_${to}`;
  console.log("localStorage 键名:", storageKey);
  
  // 从本地存储加载最新的消息状态
  const rawMessages = localStorage.getItem(storageKey);
  console.log("localStorage 原始数据:", rawMessages);
  
  const messages = JSON.parse(rawMessages || "[]");
  console.log("解析后的消息数量:", messages.length);
  
  if (messages.length > 0) {
    console.log("消息详情:", messages);
  }
  
  if (messages.length === 0) {
    console.log("没有消息，清空后返回");
    msgArea.innerHTML = "";
    console.timeEnd('loadMessages');
    console.log("=== loadMessages 结束 ===\n");
    return;
  }
  
  // 使用文档片段批量添加消息，避免多次DOM操作
  const fragment = document.createDocumentFragment();
  
  messages.forEach((message, index) => {
    console.log(`处理第 ${index + 1} 条消息:`, {
      id: message.id,
      from: message.from,
      to: message.to,
      content: message.content,
      currentUserId: currentUserId,
      isOwnMessage: message.from === currentUserId
    });
    
    const isOwnMessage = message.from === currentUserId;
    const messageContainer = document.createElement("div");
    messageContainer.className = `message-container ${isOwnMessage ? "me" : "other"}`;
    messageContainer.dataset.messageId = message.id;
    
    // 根据消息类型创建不同的消息内容
    let messageContent = "";
    if (message.type === "text" || message.type === "emoji") {
      messageContent = `<div class="message">${message.content}</div>`;
    } else if (message.type === "image") {
      messageContent = `<div class="message"><img src="${message.content}" alt="图片" onclick="showImagePreview('${message.content}')"></div>`;
    } else if (message.type === "file") {
      const fileName = message.extra?.name || "未知文件";
      const fileSize = message.extra?.size ? formatFileSize(message.extra.size) : "未知大小";
      messageContent = `<div class="message"><a href="${message.content}" download="${fileName}" class="file-link"><span class="file-icon">📄</span><div class="file-info"><div class="file-name">${fileName}</div><div class="file-size">${fileSize}</div></div></a></div>`;
    } else if (message.type === "voice") {
      // 语音消息
      const duration = message.extra?.duration || 0;
      const minutes = String(Math.floor(duration / 60)).padStart(2, '0');
      const seconds = String(duration % 60).padStart(2, '0');
      const durationStr = `${minutes}:${seconds}`;
      
      messageContent = `
        <div class="message voice-message">
          <audio class="voice-audio" src="${message.content}" preload="none"></audio>
          <button class="voice-play-btn" onclick="toggleVoicePlay(this)">
            <span class="play-icon">▶️</span>
          </button>
          <span class="voice-duration">${durationStr}</span>
          <button class="voice-transcript-btn" onclick="showTranscriptPlaceholder()">转文字</button>
        </div>
      `;
    } else {
      messageContent = `<div class="message">${message.content}</div>`;
    }
    
    // 显示消息状态
    const status = message.status || "unread";
    const statusHTML = `<div class="read-status ${status}">${status === "read" ? "已读" : "未读"}</div>`;
    
    // 添加时间标记
    const timeHTML = `<div class="message-time" data-timestamp="${message.timestamp}">${formatMessageTime(message.timestamp)}</div>`;
    
    messageContainer.innerHTML = `
      ${messageContent}
      ${statusHTML}
      ${timeHTML}
    `;
    
    fragment.appendChild(messageContainer);
  });
  
  console.log("准备将消息添加到 DOM...");
  console.log("msgArea 当前子元素数量:", msgArea.children.length);
  console.log("fragment 中的子元素数量:", fragment.children.length);
  
  // 一次性添加所有消息到DOM
  msgArea.innerHTML = ""; // 确保先清空
  msgArea.appendChild(fragment);
  
  console.log("消息已添加到 DOM");
  console.log("msgArea 当前子元素数量:", msgArea.children.length);
  console.log("msgArea 的 innerHTML 长度:", msgArea.innerHTML.length);
  
  // 延迟检查消息是否还在 DOM 中
  setTimeout(() => {
    console.log("[延迟检查] msgArea 当前子元素数量:", msgArea.children.length);
    console.log("[延迟检查] msgArea 的 innerHTML 长度:", msgArea.innerHTML.length);
    console.log("[延迟检查] msgArea 的 innerHTML:", msgArea.innerHTML);
    
    // 检查第一条消息的样式
    const firstMsg = msgArea.querySelector(".message-container");
    if (firstMsg) {
      console.log("[延迟检查] 第一条消息元素:", firstMsg);
      console.log("[延迟检查] 第一条消息的 style.display:", firstMsg.style.display);
      console.log("[延迟检查] 第一条消息的 computed style:", window.getComputedStyle(firstMsg));
      
      const msgBubble = firstMsg.querySelector(".message");
      if (msgBubble) {
        console.log("[延迟检查] 消息气泡:", msgBubble);
        console.log("[延迟检查] 消息气泡的 computed style:", window.getComputedStyle(msgBubble));
      }
    } else {
      console.error("[延迟检查] 消息容器中没有找到任何消息！");
    }
  }, 100);
  
  // 验证第一条消息是否存在
  const firstMessage = msgArea.querySelector(".message-container");
  if (firstMessage) {
    console.log("✓ 第一条消息已成功添加到 DOM:", firstMessage);
  } else {
    console.error("✗ 消息容器中没有找到任何消息！");
    console.error("msgArea HTML:", msgArea.innerHTML.substring(0, 500));
  }
  
  // 检查 msgArea 是否存在
  console.log("msgArea 元素:", msgArea);
  console.log("msgArea 的 parentElement:", msgArea.parentElement);
  console.log("msgArea 是否可见:", msgArea.offsetParent !== null);
  
  // 加载完成后滚动到底部（等待所有内容渲染完成）
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      msgArea.scrollTop = msgArea.scrollHeight;
      // 再次确认，确保滚动到底部
      setTimeout(() => {
        msgArea.scrollTop = msgArea.scrollHeight;
      }, 100);
    });
  });
  
  // 等待图片加载完成后再次滚动到底部
  const images = msgArea.querySelectorAll('img');
  if (images.length > 0) {
    let loadedCount = 0;
    images.forEach(img => {
      if (img.complete) {
        loadedCount++;
      } else {
        img.onload = () => {
          loadedCount++;
          if (loadedCount === images.length) {
            msgArea.scrollTop = msgArea.scrollHeight;
          }
        };
      }
    });
    // 如果所有图片都已加载
    if (loadedCount === images.length) {
      setTimeout(() => {
        msgArea.scrollTop = msgArea.scrollHeight;
      }, 150);
    }
  }
  
  // 添加移动端触摸支持 - 点击消息显示时间
  msgArea.querySelectorAll('.message-container').forEach(container => {
    container.addEventListener('touchstart', function(e) {
      // 移除其他消息的 touch-active 类
      msgArea.querySelectorAll('.message-container').forEach(c => c.classList.remove('touch-active'));
      // 添加当前消息的 touch-active 类
      this.classList.add('touch-active');
      
      // 3秒后自动隐藏
      setTimeout(() => {
        this.classList.remove('touch-active');
      }, 3000);
    });
  });
  
  console.timeEnd('loadMessages');
}

// ==============================================
// 显示提示
// ==============================================
function showTip(text) {
  const tip = document.createElement("div");
  tip.className = "tip-box";
  tip.textContent = text;
  document.body.appendChild(tip);
  
  setTimeout(() => {
    tip.remove();
  }, 3000);
}

// ==============================================
// 显示清空聊天记录对话框
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
        <h3>清空聊天记录</h3>
      </div>
      <div class="confirm-dialog-body">
        <p>请选择清空方式：</p>
        <div class="clear-options">
          <label class="clear-option">
            <input type="radio" name="clearType" value="self" checked>
            <div class="option-content">
              <div class="option-icon">👤</div>
              <div class="option-text">
                <div class="option-title">只为自己清空</div>
                <div class="option-desc">仅清空本地聊天记录，对方记录不受影响</div>
              </div>
            </div>
          </label>
          <label class="clear-option">
            <input type="radio" name="clearType" value="both">
            <div class="option-content">
              <div class="option-icon">👥</div>
              <div class="option-text">
                <div class="option-title">双向清空</div>
                <div class="option-desc">清空双方聊天记录，此操作不可恢复</div>
              </div>
            </div>
          </label>
        </div>
      </div>
      <div class="confirm-dialog-footer">
        <button class="confirm-dialog-btn cancel" onclick="this.closest('#customConfirmDialog').remove()">取消</button>
        <button class="confirm-dialog-btn confirm" id="confirmClearBtn">确认</button>
      </div>
    </div>
  `;
  
  document.body.appendChild(dialog);
  
  // 确认按钮
  document.getElementById("confirmClearBtn").addEventListener("click", () => {
    const clearType = dialog.querySelector('input[name="clearType"]:checked').value;
    
    if (clearType === "self") {
      // 仅清空本地记录
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
}

// ==============================================
// 发送已读回执
// ==============================================
function emitReadReceipt(to) {
  if (to === "未选择" || to === "点击选择用户...") return;
  
  // 严格检查：窗口必须是活动的
  if (!document.hasFocus()) return;
  
  // 检查当前是否正在与该用户聊天
  if (targetId.textContent !== to) return;
  
  // 只收集未读的收到的消息ID（不包括自己发送的）
  const messageIds = [];
  const messageContainers = msgArea.querySelectorAll(".message-container.other");
  messageContainers.forEach(container => {
    const messageId = container.dataset.messageId;
    const statusEl = container.querySelector(".read-status");
    
    // 只有状态为未读的消息才需要标记
    if (messageId && statusEl && !statusEl.classList.contains("read")) {
      // 检查消息是否在视口中（用户能看到）
      const rect = container.getBoundingClientRect();
      
      // 或者消息已经被滚动到可视区域上方（说明用户已经看过了）
      const hasBeenSeen = rect.bottom > 0 && rect.top < (window.innerHeight || document.documentElement.clientHeight);
      
      if (hasBeenSeen) {
        messageIds.push(messageId);
      }
    }
  });
  
  if (messageIds.length === 0) return;
  
  console.log("发送已读回执:", {
    from: currentUserId,
    to: to,
    messageIds: messageIds
  });
  
  socket.emit("markAsRead", {
    from: currentUserId,
    to: to,
    messageIds: messageIds
  });
  
  // 同时更新本地未读消息计数
  if (unreadCounts[to]) {
    unreadCounts[to] = 0;
    updateUnreadMessagesUI();
  }
  
  // 更新本地消息状态为已读
  const storedMessages = JSON.parse(localStorage.getItem(`chat_messages_${currentUserId}_${to}`) || "[]");
  const updatedMessages = storedMessages.map(msg => {
    if (msg.to === currentUserId && messageIds.includes(msg.id)) {
      return { ...msg, status: "read" };
    }
    return msg;
  });
  localStorage.setItem(`chat_messages_${currentUserId}_${to}`, JSON.stringify(updatedMessages));
  
  // 更新UI中的消息状态
  const receivedMessageContainers = msgArea.querySelectorAll(".message-container.other");
  receivedMessageContainers.forEach(container => {
    const messageId = container.dataset.messageId;
    if (messageIds.includes(messageId)) {
      const statusEl = container.querySelector(".read-status");
      if (statusEl) {
        statusEl.className = "read-status read";
        statusEl.textContent = "已读";
      }
    }
  });
}

// ==============================================
// Socket.IO 事件监听
// ==============================================

// 监听在线用户列表
socket.on("onlineList", (users) => {
  onlineUsers = users;
  updateOnlineUsersUI();
});

// 监听新消息
socket.on("newPrivateMsg", (data) => {
  // 添加调试信息
  console.log("Received newPrivateMsg:", data);
  
  const { from, to, id, content, type, extra, timestamp } = data;
  
  // 检查是否是发给当前用户的
  if (to !== currentUserId) return;
  
  // 显示消息
  console.log("Displaying message immediately");
  showMessage({
    id,
    from,
    to,
    content,
    type: type || "text",
    extra,
    timestamp,
    status: "unread"
  }, false);
  
  // 如果不是当前聊天对象，增加未读消息数
  if (targetId.textContent !== from) {
    unreadCounts[from] = (unreadCounts[from] || 0) + 1;
    updateUnreadMessagesUI();
  }
  // 已读回执会在showMessage函数中延迟检查消息是否可见后发送
  
  // 检查是否是阅后即焚消息（仅接收方触发焚毁计时器）
  if (extra?.burnAfterRead && !isOwnMessage) {
    console.log('[阅后即焚] 收到阅后即焚消息，时长:', extra.burnDuration, '秒');
    // 等待消息显示到 DOM 后启动焚毁计时器
    setTimeout(() => {
      const messageEl = msgArea.querySelector(`[data-message-id="${id}"]`);
      if (messageEl) {
        startBurnTimer(messageEl, id, extra.burnDuration, from);
      } else {
        console.warn('[阅后即焚] 未找到消息元素:', id);
      }
    }, 100);
  }
  
  // 保存消息到本地存储
  // 关键修复：根据消息发送者决定保存到哪个键
  const currentTarget = targetId.textContent;
  const storageTarget = (currentTarget === "未选择" || currentTarget === "点击选择用户...") ? from : from;
  const storageKey = `chat_messages_${currentUserId}_${storageTarget}`;
  
  // 直接保存消息数据到 localStorage（不依赖 DOM）
  const storedMessages = JSON.parse(localStorage.getItem(storageKey) || "[]");
  
  // 检查消息是否已存在（避免重复）
  const exists = storedMessages.some(msg => msg.id === id);
  if (!exists) {
    storedMessages.push({
      id,
      from,
      to,
      content,
      type: type || "text",
      extra,
      timestamp,
      status: "unread"
    });
    localStorage.setItem(storageKey, JSON.stringify(storedMessages));
    console.log(`[newPrivateMsg] 消息已保存到 localStorage:`, {
      storageKey,
      storageTarget,
      messageId: id,
      totalMessages: storedMessages.length
    });
  } else {
    console.log(`[newPrivateMsg] 消息已存在，跳过保存:`, id);
  }
  
  // 同时更新 DOM 中的聊天记录（如果是当前聊天对象的消息）
  if (from === currentTarget) {
    saveMessages();
  }
});

// 监听消息已读
socket.on("messagesRead", (data) => {
  console.log("收到已读回执:", data);
  
  const { from, to, messageIds } = data;
  
  // 检查是否是发给当前用户的
  if (to !== currentUserId) return;
  
  // 无论当前是否打开了与发送者的聊天窗口，都更新本地存储中的消息状态
  const storedMessages = JSON.parse(localStorage.getItem(`chat_messages_${currentUserId}_${from}`) || "[]");
  const updatedMessages = storedMessages.map(msg => {
    if (msg.from === currentUserId && messageIds.includes(msg.id)) {
      return { ...msg, status: "read" };
    }
    return msg;
  });
  localStorage.setItem(`chat_messages_${currentUserId}_${from}`, JSON.stringify(updatedMessages));
  
  // 无论当前是否打开了与发送者的聊天窗口，都更新UI中的消息状态
  // 这样，当用户打开聊天窗口时，不需要刷新就能看到最新的消息状态
  const messageContainers = msgArea.querySelectorAll(".message-container.me");
  messageContainers.forEach(container => {
    const messageId = container.dataset.messageId;
    if (messageIds.includes(messageId)) {
      const statusEl = container.querySelector(".read-status");
      if (statusEl) {
        statusEl.className = "read-status read";
        statusEl.textContent = "已读";
      }
    }
  });
  
  // 保存消息到本地存储
  saveMessages();
});

// 监听清空双方聊天记录
socket.on("clearBothChat", data => {
  if (data.from === targetId.textContent && data.to === currentUserId) {
    msgArea.innerHTML = "";
    saveMessages();
    showTip("对方已双向销毁，双方记录已永久清空");
  }
});

// 监听其他用户昵称更改（关键修复：对方改昵称时，迁移本地聊天记录）
socket.on("userNicknameChanged", (data) => {
  const { oldName, newName } = data;
  console.log("================================");
  console.log("收到其他用户昵称更改通知:");
  console.log("旧昵称:", oldName);
  console.log("新昵称:", newName);
  console.log("================================");
  
  // 迁移所有包含旧昵称的聊天记录键
  const keysToMigrate = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith("chat_messages_")) {
      // 检查键中是否包含旧昵称
      const parts = key.replace("chat_messages_", "").split("_");
      if (parts.includes(oldName)) {
        keysToMigrate.push(key);
      }
    }
  }
  
  console.log(`找到 ${keysToMigrate.length} 个需要迁移的键:`, keysToMigrate);
  
  if (keysToMigrate.length === 0) {
    console.log("没有找到需要迁移的聊天记录");
  }
  
  // 处理每个需要迁移的键
  keysToMigrate.forEach((oldKey, index) => {
    console.log(`\n--- 处理第 ${index + 1} 个键: ${oldKey} ---`);
    
    const parts = oldKey.replace("chat_messages_", "").split("_");
    if (parts.length !== 2) {
      console.log("  → 键格式不正确，跳过");
      return;
    }
    
    // 替换旧昵称为新昵称
    const newParts = parts.map(part => part === oldName ? newName : part);
    const newKey = `chat_messages_${newParts[0]}_${newParts[1]}`;
    
    console.log(`  → 新键名: ${newKey}`);
    
    // 检查新键是否已存在
    if (localStorage.getItem(newKey)) {
      console.log("  → 新键已存在，删除旧键");
      localStorage.removeItem(oldKey);
      return;
    }
    
    const oldData = localStorage.getItem(oldKey);
    if (oldData) {
      try {
        const messages = JSON.parse(oldData);
        console.log(`  → 消息数量: ${messages.length}`);
        
        // 更新消息中的 from 和 to 字段
        const updatedMessages = messages.map(msg => {
          const originalFrom = msg.from;
          const originalTo = msg.to;
          if (msg.from === oldName) msg.from = newName;
          if (msg.to === oldName) msg.to = newName;
          if (msg.from !== originalFrom || msg.to !== originalTo) {
            console.log(`    更新消息 ${msg.id}: from=${originalFrom}→${msg.from}, to=${originalTo}→${msg.to}`);
          }
          return msg;
        });
        
        // 保存到新键
        localStorage.setItem(newKey, JSON.stringify(updatedMessages));
        
        // 删除旧键
        localStorage.removeItem(oldKey);
        
        console.log(`  ✓ 已迁移: ${oldKey} → ${newKey}`);
        
        // 如果当前正在和该用户聊天，更新显示并重新加载
        const currentTarget = targetId.textContent;
        if (currentTarget === oldName) {
          console.log("  → 当前正在与该用户聊天，更新显示");
          targetId.textContent = newName;
        }
      } catch (error) {
        console.error(`  ✗ 迁移失败: ${oldKey}`, error);
      }
    }
  });
  
  console.log("\n================================");
  console.log("=== 昵称更改迁移完成 ===");
  console.log(`共迁移 ${keysToMigrate.length} 个聊天记录`);
  
  // 如果当前正在和该用户聊天，重新加载消息
  const currentTarget = targetId.textContent;
  if (currentTarget === oldName || currentTarget === newName) {
    console.log("当前聊天对象已更新，重新加载消息:", currentTarget);
    // 确保 targetId 显示的是新昵称
    if (currentTarget === oldName) {
      targetId.textContent = newName;
    }
    setTimeout(() => {
      console.log("开始重新加载聊天消息...");
      loadMessages();
    }, 100);
  }
  
  console.log("================================\n");
});

// ==============================================
// 更新在线用户UI
// ==============================================
function updateOnlineUsersUI() {
  if (!onlineUsersList) return;
  
  // 确保用户列表包含当前用户
  if (!onlineUsers.includes(currentUserId)) {
    onlineUsers.push(currentUserId);
  }
  
  // 更新下拉列表
  if (window.updateTargetDropdown) {
    window.updateTargetDropdown();
  }
}

// ==============================================
// 更新未读消息UI
// ==============================================
function updateUnreadMessagesUI() {
  if (!unreadMessagesList) return;
  
  unreadMessagesList.innerHTML = "";
  
  const usersWithUnread = Object.keys(unreadCounts).filter(user => unreadCounts[user] > 0);
  
  if (usersWithUnread.length === 0) {
    unreadMessagesList.innerHTML = "<div class='no-unread'>暂无未读消息</div>";
    return;
  }
  
  usersWithUnread.forEach(user => {
    const item = document.createElement("div");
    item.className = "unread-item";
    item.innerHTML = `
      <span class="unread-user">${user}</span>
      <span class="unread-count">${unreadCounts[user]}</span>
    `;
    
    item.addEventListener("click", () => {
      console.log("================================");
      console.log("点击未读消息项:", user);
      console.log("当前 currentUserId:", currentUserId);
      console.log("尝试加载的键名: chat_messages_" + currentUserId + "_" + user);
      console.log("localStorage 中该键的数据:", localStorage.getItem("chat_messages_" + currentUserId + "_" + user));
      
      // 更新聊天对象显示
      targetId.textContent = user;
      console.log("已更新 targetId.textContent 为:", targetId.textContent);
      
      // 清除该用户的未读消息数
      unreadCounts[user] = 0;
      updateUnreadMessagesUI();
      
      // 加载与该用户的聊天记录
      console.log("开始调用 loadMessages()...");
      loadMessages();
      console.log("loadMessages() 执行完毕");
      
      // 发送已读回执
      emitReadReceipt(user);
      
      console.log("================================\n");
    });
    
    unreadMessagesList.appendChild(item);
  });
}

// ==============================================
// 语音和视频通话功能
// ==============================================

let localStream = null;
let remoteStream = null;
let peerConnection = null;
let isInCall = false;

// 强制释放所有媒体流（包括隐藏的）
function releaseAllMediaStreams() {
  return new Promise((resolve) => {
    console.log("=== 开始释放所有媒体流 ===");
    
    let trackCount = 0;
    
    // 释放本地流
    if (localStream) {
      localStream.getTracks().forEach(track => {
        track.stop();
        trackCount++;
        console.log("停止本地流轨道:", track.kind, track.label);
      });
      localStream = null;
      console.log("本地流已释放");
    }
    
    // 释放远程流
    if (remoteStream) {
      remoteStream.getTracks().forEach(track => {
        track.stop();
        trackCount++;
        console.log("停止远程流轨道:", track.kind, track.label);
      });
      remoteStream = null;
      console.log("远程流已释放");
    }
    
    // 释放所有视频元素的 srcObject
    const videos = document.querySelectorAll('video');
    videos.forEach(video => {
      if (video.srcObject) {
        const tracks = video.srcObject.getTracks();
        tracks.forEach(track => {
          track.stop();
          trackCount++;
        });
        video.srcObject = null;
        console.log("释放视频元素 srcObject");
      }
    });
    
    console.log(`总共停止了 ${trackCount} 个媒体轨道`);
    console.log("=== 媒体流释放完成 ===");
    
    // 等待1000ms确保硬件完全释放（Windows浏览器需要更长时间）
    setTimeout(resolve, 1000);
  });
}

// 开始通话
async function startCall(to, callType) {
  if (isInCall) {
    showTip("您正在通话中");
    return;
  }
  
  // 强制清理所有可能的媒体流
  await releaseAllMediaStreams();
  
  // 获取媒体设备
  const constraints = {
    audio: true,
    video: callType === "视频通话"
  };
  
  console.log("发起通话，请求媒体设备:", constraints);
  
  navigator.mediaDevices.getUserMedia(constraints)
    .then(stream => {
      console.log("成功获取媒体设备");
      localStream = stream;
      
      // 显示通话请求弹窗
      showCallRequestDialog(to, callType);
    })
    .catch(error => {
      console.error("获取媒体设备失败:", error);
      
      let errorMsg = "获取媒体设备失败";
      if (error.name === "NotReadableError" || error.name === "TrackStartError") {
        errorMsg = "摄像头/麦克风被占用，请关闭其他使用摄像头的程序后重试";
      } else if (error.name === "NotAllowedError") {
        errorMsg = "请允许浏览器访问摄像头和麦克风";
      } else if (error.name === "NotFoundError") {
        errorMsg = "未找到摄像头或麦克风设备";
      }
      
      showTip(errorMsg);
    });
}

// 显示通话请求弹窗（小窗模式）
function showCallRequestDialog(to, callType) {
  const dialog = document.createElement("div");
  dialog.id = "callRequestDialog";
  dialog.className = "call-request-dialog";
  
  dialog.innerHTML = `
    <div class="call-request-content">
      <div class="call-request-icon">${callType === "视频通话" ? "📹" : "📞"}</div>
      <h3 class="call-request-title">${callType}请求</h3>
      <p class="call-request-text">正在呼叫 ${to}...</p>
      <div class="call-request-timer">00:00</div>
      <div class="call-request-buttons">
        <button class="call-request-btn reject" id="cancelCallBtn">取消</button>
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
    dialog.querySelector(".call-request-timer").textContent = `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  }, 1000);
  
  // 取消按钮
  document.getElementById("cancelCallBtn").addEventListener("click", () => {
    clearInterval(timer);
    clearTimeout(responseTimeout);
    dialog.remove();
    // 释放媒体流
    releaseAllMediaStreams();
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
    clearTimeout(responseTimeout);
    dialog.remove();
    // 释放媒体流
    console.log("通话超时，释放媒体流");
    releaseAllMediaStreams();
    showTip("对方未响应，通话已取消");
  }, 30000); // 30秒超时
  
  // 监听对方接受通话
  socket.once("callAccept", (data) => {
    if (data.to === currentUserId && data.from === to) {
      clearInterval(timer);
      clearTimeout(responseTimeout);
      dialog.remove();
    }
  });
  
  // 监听对方拒绝通话
  socket.once("callReject", async (data) => {
    if (data.to === currentUserId && data.from === to) {
      clearInterval(timer);
      clearTimeout(responseTimeout);
      dialog.remove();
      // 释放媒体流
      console.log("对方拒绝通话，释放本地媒体流");
      await releaseAllMediaStreams();
      showTip("对方拒绝了通话请求");
    }
  });
}

// 显示通话界面（小窗模式）
function showCallInterface(caller, callType, hasRemoteStream) {
  // 移除已存在的通话界面
  const existingCall = document.getElementById("callContainer");
  if (existingCall) {
    existingCall.remove();
  }
  
  // 创建通话容器
  const callContainer = document.createElement("div");
  callContainer.id = "callContainer";
  callContainer.className = "call-container";
  
  // 设置初始位置和大小
  callContainer.style.left = "20px";
  callContainer.style.bottom = "100px";
  callContainer.style.width = "320px";
  callContainer.style.height = "240px";
  
  // 根据通话类型构建不同的界面
  let videoAreaHTML = '';
  if (callType === '视频通话') {
    // 视频通话显示视频区域，保留放大按钮
    videoAreaHTML = `
      <div class="call-video">
        <div class="call-remote-video" id="remoteVideo">
          ${hasRemoteStream ? '<video autoplay playsinline></video>' : '<div class="call-no-stream">对方未加入</div>'}
        </div>
        <div class="call-local-video" id="localVideo">
          <video autoplay playsinline muted></video>
        </div>
      </div>
    `;
  } else {
    // 语音通话显示音频图标区域
    videoAreaHTML = `
      <div class="call-audio-area">
        <div class="audio-icon-large">🎧</div>
        <div class="audio-status-text">语音通话中...</div>
      </div>
    `;
  }
  
  // 视频通话显示放大按钮，语音通话不显示
  const resizeBtnHTML = callType === '视频通话' 
    ? '<button class="call-resize-btn" id="callResizeBtn">⤢</button>'
    : '';
  
  callContainer.innerHTML = `
    <div class="call-header">
      <div class="call-status">${callType}中</div>
      <div class="call-target">${caller}</div>
      ${resizeBtnHTML}
    </div>
    ${videoAreaHTML}
    <div class="call-controls-mini">
      <div class="call-btn-wrapper">
        <button class="call-control-btn mic" id="micBtn" title="麦克风">
          <span class="btn-icon">🎤</span>
        </button>
        <span class="btn-label" id="micLabel">已开启</span>
        <span class="btn-label-desc">麦克风</span>
      </div>
      <div class="call-btn-wrapper">
        <button class="call-control-btn speaker" id="speakerBtn" title="扬声器">
          <span class="btn-icon">🔊</span>
        </button>
        <span class="btn-label" id="speakerLabel">已开启</span>
        <span class="btn-label-desc">扬声器</span>
      </div>
      <div class="call-btn-wrapper">
        <button class="call-control-btn hangup" id="hangupBtn" title="挂断电话">
          <span class="btn-icon">📞</span>
        </button>
        <span class="btn-label">结束</span>
        <span class="btn-label-desc">挂断电话</span>
      </div>
    </div>
  `;
  
  document.body.appendChild(callContainer);
  
  // 同步绑定事件，确保点击响应迅速
  // 显示本地流（仅视频通话）
  if (callType === '视频通话') {
    const localVideoEl = callContainer.querySelector("#localVideo video");
    if (localVideoEl && localStream) {
      localVideoEl.srcObject = localStream;
    }
    
    // 显示远程流（仅视频通话）
    if (hasRemoteStream) {
      const remoteVideoEl = callContainer.querySelector("#remoteVideo video");
      if (remoteVideoEl && remoteStream) {
        remoteVideoEl.srcObject = remoteStream;
      }
    }
  }
  
  // 实现拖动功能
  let isDragging = false;
  let startX, startY, startLeft, startTop;
  
  const callHeader = callContainer.querySelector(".call-header");
  callHeader.addEventListener("mousedown", (e) => {
    isDragging = true;
    startX = e.clientX;
    startY = e.clientY;
    const rect = callContainer.getBoundingClientRect();
    startLeft = rect.left;
    startTop = rect.top;
    callContainer.style.cursor = "grabbing";
    e.preventDefault();
  });
  
  document.addEventListener("mousemove", (e) => {
    if (isDragging) {
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      callContainer.style.left = `${startLeft + dx}px`;
      callContainer.style.top = `${startTop + dy}px`;
      callContainer.style.bottom = "auto";
      callContainer.style.right = "auto";
    }
  });
  
  document.addEventListener("mouseup", () => {
    isDragging = false;
    callContainer.style.cursor = "grab";
  });
  
  // 实现缩放功能（仅视频通话）
  if (callType === '视频通话') {
    let isResizing = false;
    let resizeStartX, resizeStartY, resizeStartWidth, resizeStartHeight;
    
    const resizeBtn = callContainer.querySelector("#callResizeBtn");
    if (resizeBtn) {
      resizeBtn.addEventListener("mousedown", (e) => {
        isResizing = true;
        resizeStartX = e.clientX;
        resizeStartY = e.clientY;
        resizeStartWidth = callContainer.offsetWidth;
        resizeStartHeight = callContainer.offsetHeight;
        e.preventDefault();
      });
      
      document.addEventListener("mousemove", (e) => {
        if (isResizing) {
          const dx = e.clientX - resizeStartX;
          const dy = e.clientY - resizeStartY;
          const newWidth = Math.max(200, resizeStartWidth + dx);
          const newHeight = Math.max(150, resizeStartHeight + dy);
          callContainer.style.width = `${newWidth}px`;
          callContainer.style.height = `${newHeight}px`;
        }
      });
      
      document.addEventListener("mouseup", () => {
        isResizing = false;
      });
    }
  }
  
  // 静音按钮
  const micBtn = callContainer.querySelector("#micBtn");
  const micLabel = callContainer.querySelector("#micLabel");
  if (micBtn && micLabel) {
    micBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      console.log("麦克风按钮被点击");
      if (localStream) {
        const audioTracks = localStream.getAudioTracks();
        if (audioTracks.length > 0) {
          const currentlyEnabled = audioTracks[0].enabled;
          audioTracks[0].enabled = !currentlyEnabled;
          
          if (!currentlyEnabled) {
            micBtn.classList.remove("active");
            micBtn.querySelector('.btn-icon').textContent = '🎤';
            micLabel.textContent = '已开启';
          } else {
            micBtn.classList.add("active");
            micBtn.querySelector('.btn-icon').textContent = '🔇';
            micLabel.textContent = '已关闭';
          }
        }
      }
    });
  }
  
  // 扬声器按钮
  const speakerBtn = callContainer.querySelector("#speakerBtn");
  const speakerLabel = callContainer.querySelector("#speakerLabel");
  if (speakerBtn && speakerLabel) {
    let speakerEnabled = true;
    
    speakerBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      console.log("扬声器按钮被点击");
      speakerEnabled = !speakerEnabled;
      
      if (speakerEnabled) {
        speakerBtn.classList.remove("active");
        speakerBtn.querySelector('.btn-icon').textContent = '🔊';
        speakerLabel.textContent = '已开启';
      } else {
        speakerBtn.classList.add("active");
        speakerBtn.querySelector('.btn-icon').textContent = '🔇';
        speakerLabel.textContent = '已关闭';
      }
    });
  }
  
  // 结束通话按钮
  const hangupBtn = callContainer.querySelector("#hangupBtn");
  if (hangupBtn) {
    hangupBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      console.log("结束通话按钮被点击");
      endCall(caller);
    });
  }
}

// 结束通话
function endCall(to) {
  console.log("=== endCall 被调用 ===");
  console.log("通话对象:", to);
  console.log("通话前 isInCall:", isInCall);
  
  // 强制释放所有媒体流
  releaseAllMediaStreams();
  
  // 关闭 PeerConnection
  if (peerConnection) {
    peerConnection.close();
    peerConnection = null;
    console.log("PeerConnection 已关闭");
  }
  
  // 移除通话界面（小窗模式）
  const callContainer = document.getElementById("callContainer");
  if (callContainer) {
    callContainer.remove();
    console.log("通话界面已移除");
  }
  
  // 移除来电请求弹窗
  const incomingCallDialog = document.getElementById("incomingCallDialog");
  if (incomingCallDialog) {
    incomingCallDialog.remove();
    console.log("来电弹窗已移除");
  }
  
  // 移除呼叫请求弹窗（发起方）
  const callRequestDialog = document.getElementById("callRequestDialog");
  if (callRequestDialog) {
    callRequestDialog.remove();
    console.log("呼叫请求弹窗已移除");
  }
  
  // 发送结束通话通知
  socket.emit("callEnd", {
    to,
    from: currentUserId
  });
  
  // 清理本地状态
  isInCall = false;
  localStream = null;
  remoteStream = null;
  peerConnection = null;
  
  console.log("通话后 isInCall:", isInCall);
  console.log("=== endCall 完成 ===");
  
  showTip("通话已结束");
}

// 监听通话请求
socket.on("callRequest", (data) => {
  console.log("收到通话请求:", data);
  
  if (data.to !== currentUserId) {
    console.log("通话请求不是给我的，忽略。我的ID:", currentUserId, "请求目标:", data.to);
    return;
  }
  
  console.log("通话请求匹配，显示弹窗...");
  const { from, callType } = data;
  
  // 清理旧的来电弹窗（如果存在）
  const oldDialog = document.getElementById("incomingCallDialog");
  if (oldDialog) {
    console.log("移除旧的来电弹窗");
    oldDialog.remove();
  }
  
  // 显示通话请求弹窗
  const dialog = document.createElement("div");
  dialog.id = "incomingCallDialog";
  dialog.className = "call-request-dialog";
  
  dialog.innerHTML = `
    <div class="call-request-content">
      <div class="call-request-icon">${callType === "视频通话" ? "📹" : "📞"}</div>
      <h3 class="call-request-title">${callType}请求</h3>
      <p class="call-request-text">${from} 正在呼叫您...</p>
      <div class="call-request-buttons">
        <button class="call-request-btn reject" id="rejectCallBtn">拒绝</button>
        <button class="call-request-btn accept" id="acceptCallBtn">接受</button>
      </div>
    </div>
  `;
  
  document.body.appendChild(dialog);
  console.log("来电弹窗已添加到DOM");
  
  // 使用事件委托，等待DOM完全渲染后绑定事件
  setTimeout(() => {
    // 接受按钮
    const acceptBtn = document.getElementById("acceptCallBtn");
    if (acceptBtn) {
      acceptBtn.addEventListener("click", async () => {
        console.log("接受通话按钮被点击");
        dialog.remove();
        
        // 强制清理所有媒体流（等待500ms确保硬件完全释放）
        await releaseAllMediaStreams();
        
        // 获取媒体设备
        const constraints = {
          audio: true,
          video: callType === "视频通话"
        };
        
        console.log("接受通话，请求媒体设备:", constraints);
        
        try {
          const stream = await navigator.mediaDevices.getUserMedia(constraints);
          console.log("成功获取媒体设备");
          localStream = stream;
          
          // 发送接受通话通知
          socket.emit("callAccept", {
            to: from,
            from: currentUserId,
            callType: callType
          });
          
          // 创建 PeerConnection
          createPeerConnection(from, callType);
        } catch (error) {
          console.error("获取媒体设备失败:", error);
          console.error("错误名称:", error.name);
          console.error("错误信息:", error.message);
          
          let errorMsg = "获取媒体设备失败";
          if (error.name === "NotAllowedError" || error.name === "PermissionDeniedError") {
            errorMsg = "请允许浏览器访问摄像头和麦克风";
          } else if (error.name === "NotFoundError" || error.name === "DevicesNotFoundError") {
            errorMsg = "未找到摄像头或麦克风设备";
          } else if (error.name === "NotReadableError" || error.name === "TrackStartError") {
            errorMsg = "摄像头/麦克风被占用，请关闭其他程序后重试";
          } else if (error.name === "OverconstrainedError") {
            errorMsg = "设备不支持请求的媒体格式";
          }
          
          showTip(errorMsg);
          socket.emit("callReject", {
            to: from,
            from: currentUserId,
            reason: errorMsg
          });
        }
      });
    }
    
    // 拒绝按钮
    const rejectBtn = document.getElementById("rejectCallBtn");
    if (rejectBtn) {
      rejectBtn.addEventListener("click", () => {
        console.log("拒绝通话按钮被点击");
        dialog.remove();
        socket.emit("callReject", {
          to: from,
          from: currentUserId,
          reason: "拒绝通话"
        });
      });
    }
  }, 100);
});

// 监听通话接受
socket.on("callAccept", (data) => {
  if (data.to !== currentUserId) return;
  
  const { from, callType } = data;
  
  // 创建 PeerConnection
  createPeerConnection(from, callType);
});

// 监听通话拒绝
socket.on("callReject", (data) => {
  if (data.to !== currentUserId) return;
  
  showTip("对方拒绝了通话请求");
});

// 监听通话offer
socket.on("callOffer", async (data) => {
  if (data.to !== currentUserId) return;
  
  const { from, offer, callType } = data;
  
  try {
    // 创建 PeerConnection
    if (!peerConnection) {
      createPeerConnection(from, callType);
    }
    
    // 设置远程描述
    await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
    
    // 创建answer
    const answer = await peerConnection.createAnswer();
    await peerConnection.setLocalDescription(answer);
    
    // 发送answer
    socket.emit("callAnswer", {
      to: from,
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
  console.log("收到对方结束通话通知:", data);
  if (data.to !== currentUserId) return;
  
  // 只清理本地，不重新发送 callEnd（避免循环）
  console.log("清理本地通话状态...");
  
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
  const callContainer = document.getElementById("callContainer");
  if (callContainer) {
    callContainer.remove();
  }
  
  // 移除来电请求弹窗
  const incomingCallDialog = document.getElementById("incomingCallDialog");
  if (incomingCallDialog) {
    incomingCallDialog.remove();
  }
  
  // 移除呼叫请求弹窗
  const callRequestDialog = document.getElementById("callRequestDialog");
  if (callRequestDialog) {
    callRequestDialog.remove();
  }
  
  // 清理本地状态
  isInCall = false;
  
  console.log("本地通话已清理完成");
  showTip("通话已结束");
});

// 创建 PeerConnection
function createPeerConnection(to, callType) {
  // 配置ICE服务器
  const configuration = {
    iceServers: [
      {
        urls: ["stun:stun.l.google.com:19302", "stun:stun1.l.google.com:19302"]
      }
    ]
  };
  
  // 创建PeerConnection
  peerConnection = new RTCPeerConnection(configuration);
  
  // 添加本地流
  if (localStream) {
    localStream.getTracks().forEach(track => {
      peerConnection.addTrack(track, localStream);
    });
  }
  
  // 监听远程流
  peerConnection.ontrack = (event) => {
    remoteStream = event.streams[0];
    showCallInterface(to, callType, true);
  };
  
  // 监听ICE候选
  peerConnection.onicecandidate = (event) => {
    if (event.candidate) {
      socket.emit("iceCandidate", {
        to,
        from: currentUserId,
        candidate: event.candidate
      });
    }
  };
  
  // 监听连接状态
  peerConnection.onconnectionstatechange = () => {
    if (peerConnection.connectionState === "failed" || peerConnection.connectionState === "closed") {
      endCall(to);
    }
  };
  
  // 创建offer
  if (callType === "语音通话" || callType === "视频通话") {
    peerConnection.createOffer()
      .then(offer => {
        return peerConnection.setLocalDescription(offer);
      })
      .then(() => {
        socket.emit("callOffer", {
          to,
          from: currentUserId,
          offer: peerConnection.localDescription,
          callType: callType
        });
      })
      .catch(err => {
        console.error('创建 Offer 失败:', err);
      });
  }
}

// ==============================================
// 阅后即焚功能
// ==============================================

// 启动焚毁计时器
function startBurnTimer(messageElement, messageId, duration, senderId) {
  console.log('[阅后即焚] 启动焚毁计时器，消息ID:', messageId, '时长:', duration, '秒');
  
  // 创建倒计时显示元素
  const timerEl = document.createElement('div');
  timerEl.className = 'burn-timer';
  timerEl.textContent = `🔥 ${duration}s`;
  messageElement.appendChild(timerEl);
  
  let remaining = duration;
  const interval = setInterval(() => {
    remaining--;
    timerEl.textContent = `🔥 ${remaining}s`;
    
    if (remaining <= 0) {
      clearInterval(interval);
      
      // 播放焚毁动画
      messageElement.classList.add('burning-out');
      
      setTimeout(() => {
        // 本地删除消息
        messageElement.remove();
        removeFromLocalStorage(messageId);
        console.log('[阅后即焚] 消息已焚毁:', messageId);
        
        // 通知对方删除
        socket.emit("burnMessage", { 
          messageId, 
          to: senderId,
          from: currentUserId
        });
      }, 500); // 等待动画完成
    }
  }, 1000);
  
  // 保存 interval ID 以便清理
  messageElement.dataset.burnIntervalId = interval;
}

// 从 localStorage 中移除消息
function removeFromLocalStorage(messageId) {
  const currentTarget = targetId.textContent;
  if (currentTarget === "未选择" || currentTarget === "点击选择用户...") {
    return;
  }
  
  const storageKey = `chat_messages_${currentUserId}_${currentTarget}`;
  const storedMessages = JSON.parse(localStorage.getItem(storageKey) || "[]");
  const updatedMessages = storedMessages.filter(msg => msg.id !== messageId);
  
  localStorage.setItem(storageKey, JSON.stringify(updatedMessages));
  console.log('[阅后即焚] 已从 localStorage 移除消息:', messageId);
}

// 监听焚毁通知
socket.on("messageBurned", (data) => {
  const { messageId } = data;
  console.log('[阅后即焚] 收到焚毁通知:', messageId);
  
  const messageEl = msgArea.querySelector(`[data-message-id="${messageId}"]`);
  if (messageEl) {
    // 清除计时器
    if (messageEl.dataset.burnIntervalId) {
      clearInterval(parseInt(messageEl.dataset.burnIntervalId));
    }
    
    // 播放焚毁动画
    messageEl.classList.add('burning-out');
    
    setTimeout(() => {
      messageEl.remove();
      removeFromLocalStorage(messageId);
      console.log('[阅后即焚] 对方已焚毁消息，本地也已删除:', messageId);
    }, 500);
  }
});

// ==============================================
// 语音消息辅助函数
// ==============================================

// 切换语音播放
function toggleVoicePlay(btn) {
  const voiceMessage = btn.closest('.voice-message');
  const audio = voiceMessage.querySelector('.voice-audio');
  const playIcon = btn.querySelector('.play-icon');
  
  if (audio.paused) {
    // 暂停其他正在播放的语音
    document.querySelectorAll('.voice-audio').forEach(a => {
      if (a !== audio && !a.paused) {
        a.pause();
        a.currentTime = 0;
        const otherBtn = a.parentElement.querySelector('.play-icon');
        if (otherBtn) otherBtn.textContent = '▶️';
      }
    });
    
    audio.play();
    playIcon.textContent = '⏸️';
    console.log('[语音消息] 开始播放');
  } else {
    audio.pause();
    playIcon.textContent = '▶️';
    console.log('[语音消息] 暂停播放');
  }
  
  // 播放结束后重置图标
  audio.onended = () => {
    playIcon.textContent = '▶️';
    console.log('[语音消息] 播放结束');
  };
}

// 显示转文字占位提示
function showTranscriptPlaceholder() {
  alert('语音转文字功能待实现');
  console.log('[语音转文字] 功能待实现');
}

// ==============================================
// 时间标记功能
// ==============================================

// 格式化消息时间为 HH:MM:SS
function formatMessageTime(timestamp) {
  const date = new Date(timestamp);
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  return `${hours}:${minutes}:${seconds}`;
}

// 初始化应用
window.addEventListener("load", initApp);