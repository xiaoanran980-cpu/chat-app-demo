const socket = io();
const myId = document.getElementById("myId");
const targetId = document.getElementById("targetId");
const onlineUser = document.getElementById("onlineUser");
const selectBtn = document.getElementById("selectBtn");
const msgArea = document.getElementById("msgArea");
const msgInput = document.getElementById("msgInput");
const sendBtn = document.getElementById("sendBtn");
const clearBothBtn = document.getElementById("clearBothBtn");

let currentUserId = null;

// 成语ID池
const IDIOMS = [
"一心一意","一丝不苟","一尘不染","一举两得","一鸣惊人","一马当先","一路顺风","一言九鼎","一诺千金","一表人才",
"二话不说","二龙戏珠","二泉映月","二惠竞爽","二姓之好","二八佳人","二满三平","二童一马","二分明月","二缶钟惑",
"三心二意","三长两短","三番五次","三顾茅庐","三阳开泰","三生有幸","三思而行","三头六臂","三更半夜","三教九流",
"四面八方","四平八稳","四通八达","四海为家","四分五裂","四体不勤","四海升平","四脚朝天","四大皆空","四战之地",
"五光十色","五颜六色","五体投地","五湖四海","五彩缤纷","五风十雨","五谷丰登","五内如焚","五世其昌","五蕴皆空",
"六神无主","六根清净","六六大顺","六尘不染","六趣轮回","六通四辟","六马仰秣","六尺之孤","六出奇计","六卿分职",
"七上八下","七零八落","七手八脚","七嘴八舌","七情六欲","七步之才","七窍生烟","七擒七纵","七开八得","七扭八歪",
"八面玲珑","八面威风","八仙过海","八方呼应","八斗之才","八拜之交","八窗玲珑","八府巡按","八砖学士","八索九丘",
"九牛一毛","九死一生","九霄云外","九九归一","九流三教","九原可作","九合一匡","九关虎豹","九衢三市","九阍虎豹",
"十全十美","十万火急","十拿九稳","十恶不赦","十面埋伏","十室九空","十步芳草","十荡十决","十行俱下","十载寒窗",
"百发百中","百依百顺","百折不挠","百家争鸣","百里挑一","百年好合","百感交集","百废俱兴","百孔千疮","百媚千娇",
"千方百计","千军万马","千言万语","千山万水","千变万化","千钧一发","千载难逢","千丝万缕","千疮百孔","千锤百炼",
"万水千山","万众一心","万象更新","万紫千红","万古长青","万里无云","万念俱灰","万马奔腾","万无一失","万籁俱寂",
"天长地久","天经地义","天罗地网","天昏地暗","天诛地灭","天造地设","天高地厚","天寒地冻","天翻地覆","天公作美",
"日新月异","日积月累","日理万机","日以继夜","日月如梭","日上三竿","日暮途穷","日薄西山","日夜兼程","日进斗金",
"山清水秀","山高水长","山穷水尽","山盟海誓","山明水秀","山珍海味","山摇地动","山呼海啸","山重水复","山环水抱",
"风花雪月","风吹雨打","风平浪静","风调雨顺","风尘仆仆","风华正茂","风雨同舟","风云变幻","风起云涌","风驰电掣",
"春暖花开","春色满园","春光明媚","春意盎然","春回大地","春和景明","春寒料峭","春花秋月","春兰秋菊","春树暮云",
"秋色宜人","秋高气爽","秋水伊人","秋毫无犯","秋月春风","秋菊傲骨","秋收冬藏","秋色平分","秋意深浓","秋虫唧唧",
"冰雪聪明","冰清玉洁","冰天雪地","冰肌玉骨","冰壶秋月","冰魂雪魄","冰消瓦解","冰炭不投","冰寒于水","冰解云散",
"一帆风顺","两全其美","四季平安","五福临门","七星高照","八方来财","九九同心","百花齐放","万事如意","前程似锦",
"壮志凌云","光明磊落","乘风破浪","福星高照","气宇轩昂","卓尔不群","鹏程万里","如花似玉","金玉满堂","宁静致远",
"海阔天空","大公无私","心怀若谷","温文尔雅","厚德载物","自强不息","安居乐业","国泰民安","人寿年丰","繁荣昌盛",
"欣欣向荣","蒸蒸日上","花好月圆","举案齐眉","永结同心","相亲相爱","莫逆之交","志同道合","患难与共","情同手足",
"肝胆相照","勤学苦练","废寝忘食","学而不厌","孜孜不倦","博览群书","博学多才","见多识广","才高八斗","学富五车",
"满腹经纶","见义勇为","助人为乐","拾金不昧","乐善好施","扶危济困","雪中送炭","解囊相助","拔刀相助","仗义疏财",
"勇往直前","坚持不懈","持之以恒","顽强拼搏","百折不挠","坚韧不拔","坚定不移","矢志不渝","锲而不舍","生龙活虎",
"朝气蓬勃","神采奕奕","精神焕发","神采飞扬","正大光明","堂堂正正","廉洁奉公","严于律己","两袖清风","克己奉公",
"公而忘私","刚正不阿","繁花似锦","绿草如茵","郁郁葱葱","百花争艳","花团锦簇","姹紫嫣红","五彩缤纷","美轮美奂",
"青山绿水","诗情画意","风景如画","锦绣河山","壮丽山河","湖光山色","水光山色","名山大川","洞天福地","欢天喜地",
"喜气洋洋","兴高采烈","心花怒放","眉开眼笑","笑逐颜开","欢歌笑语","欢喜若狂","欣喜若狂","乐不可支","平安无事",
"安然无恙","平安喜乐","吉祥如意","吉星高照","好运连连","福如东海","寿比南山","金榜题名","独占鳌头","名列前茅",
"一举夺魁","出类拔萃","超群绝伦","独具匠心","自由自在","无忧无虑","无拘无束","悠然自得","闲情逸致","随心所欲",
"自得其乐","逍遥自在","轻松愉快","心旷神怡","同心协力","同舟共济","齐心协力","万众一心","众志成城","团结一致",
"同心同德","群策群力","和衷共济","红红火火","热热闹闹","方兴未艾","蓬勃发展","前程远大","前途无量","大有作为",
"诚实守信","言行一致","表里如一","童叟无欺","忠厚老实","真诚相待","尊敬师长","尊老爱幼","孝敬父母","尊师重道",
"文明礼貌","彬彬有礼","谦虚谨慎","不骄不躁","宽宏大量","以德报怨","勤学好问","不耻下问","虚心好学","刻苦钻研",
"精益求精","勇于探索","敢于创新","发明创造","开拓进取","与时俱进","一尘不染","整整齐齐","井然有序","有条不紊",
"清清爽爽","整洁大方","朴素大方","井井有条","健康长寿","身心健康","体魄强健","精力充沛","精神饱满","身强力壮",
"长命百岁","福寿安康","平安健康","幸福美满","和睦相处","天伦之乐","其乐融融","幸福安康","美满和谐","甜蜜幸福",
"才华横溢","德才兼备","品学兼优","智勇双全","文武双全","德高望重","高风亮节","大义凛然","正气凛然","临危不惧",
"舍己为人","舍生忘死","无私奉献","奋不顾身","视死如归","英勇无畏","所向披靡","百战百胜","英俊潇洒","美丽大方",
"倾国倾城","貌美如花","楚楚动人","心灵手巧","多才多艺","能歌善舞","技艺超群","巧夺天工","出神入化","炉火纯青",
"登峰造极","超群出众","高瞻远瞩","远见卓识","深谋远虑","足智多谋","运筹帷幄","神机妙算","料事如神","英明果断",
"未雨绸缪","防患未然","吃苦耐劳","勤勤恳恳","任劳任怨","脚踏实地","兢兢业业","刻苦耐劳","奋发图强","艰苦奋斗",
"团结友爱","互相帮助","互相关心","互相尊重","亲如一家","亲密无间","同甘共苦","有福同享","平安顺利","一路顺风",
"化险为夷","转危为安","逢凶化吉","遇难成祥","兴旺发达","财源广进","生意兴隆","招财进宝","富贵荣华","家财万贯",
"富甲天下","腰缠万贯","富贵逼人","心想事成","美梦成真","事事顺心","大吉大利","福寿安康","笑口常开","好运常在",
"神采飞扬","精神抖擞","容光焕发","意气风发","威风凛凛","气势磅礴","气壮山河","威武雄壮","英姿飒爽","气势非凡",
"一板一眼","一丝不苟","认真负责","尽心竭力","一身正气","山明水秀","风光旖旎","赏心悦目","景色宜人","美不胜收",
"蔚为大观","如诗如画","美妙绝伦","乐在其中","开怀大笑","遵纪守法","勤劳勇敢","奋发向上","勤劳致富","勤俭持家",
"勤俭节约","珍惜粮食","爱惜公物","保护环境","爱护自然","绿色环保","双喜临门","四季安康","五福捧寿","八方进宝",
"百年好合","千载难逢","万事亨通","万事顺利","万事顺心","合家欢乐","阖家幸福","团圆美满","长寿百年","事业有成",
"大展宏图","步步高升","升官发财","飞黄腾达","事业顺利","财源滚滚","富贵有余","年年有余","岁岁平安","天天开心",
"永远幸福","快乐一生","携手并进","共创辉煌","共同发展","共同进步","共享幸福","文明和谐","民主法治","公平正义",
"诚信友爱","充满活力","安定有序","坚不可摧","牢不可破","坚如磐石","固若金汤","稳如泰山","始终如一","始终不渝",
"一往无前","攻无不克","无坚不摧","所向无敌","舍己救人","舍生取义","宁死不屈","顽强不屈","虚心求教","学以致用",
"学有所成","成绩优异","全面发展","洁白无瑕","焕然一新","窗明几净","秀丽端庄","温柔善良","贤惠大方","气质高雅",
"风华绝代","天生丽质","聪明伶俐","乖巧可爱","风流倜傥","玉树临风","仪表堂堂","气宇不凡","端庄儒雅","活力四射",
"团结一心","风雨同舟","休戚相关","生死与共","吉祥平安","幸福如意","快乐无忧","福泽深厚","万事大吉","前程万里",
"大有可为","旗开得胜","马到成功","捷报频传","完胜而归","斗志昂扬","信心百倍","胸有成竹","从容不迫","镇定自若",
"泰然自若","处变不惊","默默耕耘","埋头苦干","奋发有为","真诚友好","团结邻里","互帮互助","互敬互爱","一家和气",
"虚怀若谷","戒骄戒躁","闻过则喜","知错就改","从善如流","取长补短","相得益彰","相辅相成","大胆尝试","不断进取",
"永不止步","追求卓越","争创一流","勇攀高峰","不断超越","迎难而上","自力更生","励精图治","艰苦创业","持续进步",
"持续发展","飞速发展","笑口常开","永远快乐","幸福一生","平安一生","顺利一生","山河壮丽","日月同辉","春秋鼎盛",
"励精图治","龙飞凤舞","龙凤呈祥","苍松翠柏","竹报平安","梅开五福","兰桂齐芳","云开雾散","云淡风轻","云雾缭绕",
"气象万千","旭日东升","夕阳西下","朝霞满天","晚霞似锦","晨光熹微","暮色苍茫","夜幕降临","华灯初上","灯火通明",
"夜色阑珊","惊涛骇浪","波涛汹涌","波澜壮阔","浩浩荡荡","一望无际","无边无际","百川归海","海纳百川","有容乃大",
"平步青云","一步登天","无往不胜","大获全胜","水滴石穿","水到渠成","源远流长","细水长流","高山流水","依山傍水",
"峰回路转","柳暗花明","清风明月","蓝天白云","星光灿烂","灯火辉煌","夜色迷人","繁星点点","月色朦胧","花前月下",
"良辰美景","和风细雨","春风化雨","细雨绵绵","春雨潇潇","雨后春笋","雨露滋润","夏日炎炎","烈日炎炎","骄阳似火",
"绿树成荫","荷花映日","蝉鸣阵阵","热浪滚滚","暑气逼人","清凉一夏","清爽宜人","金风送爽","天高云淡","枫叶似火",
"丹桂飘香","五谷丰登","金秋时节","冬日暖阳","白雪皑皑","冰天雪地","银装素裹","寒风凛冽","雪花飞舞","腊梅怒放",
"松柏长青","岁寒三友","冬日可爱","盛世中华","国泰民安","风清气正","政通人和","物阜民丰","安居乐业","锦绣中华",
"励精图治","国富民强","长治久安","四海升平","山河无恙","人间皆安","英才辈出","俊杰廉悍","风华正茂","挥斥方遒",
"指点江山","激扬文字","天下为公","世界大同","四海一家","万民同乐","五福同享","六合同春","九州同庆","普天同庆",
"瑞气盈门","紫气东来","祥云瑞气","吉星拱照","财源亨通","事业亨通","家和业兴","人兴财旺","福满人间","喜满人间",
"春满人间","锦绣前程","光辉岁月","灿烂辉煌","光芒万丈","璀璨夺目","熠熠生辉","光彩照人","荣耀门庭","光耀祖宗",
"书香门第","诗礼传家","耕读传家","勤俭传家","忠厚传家","积善之家","余庆绵长","福禄绵长","寿禄绵长","喜乐绵长",
"岁岁平安","年年如意","月月吉祥","日日安康","时时好运","刻刻欢喜","分分平安","秒秒吉祥","永沐春风","常驻芳华",
"初心不改","矢志不移","坚守不渝","笃定前行","行稳致远","未来可期","前程似锦","前途光明","大道无垠","正道直行",
"光明正大","浩然正气","大义凛然","风骨凛然","气节如山","胸怀宽广","心胸开阔","海纳百川","有容乃大","壁立千仞",
"无欲则刚","志存高远","心怀天下","放眼世界","展望未来","开创未来","铸就辉煌","再创佳绩","再谱新篇","再立新功",
"建功立业","功勋卓著","彪炳史册","流芳百世","名垂青史","万古流芳","永垂不朽","永世长存","吉祥安康","万事顺遂"
];

// ==============================================
// 固定ID生成
// ==============================================
function getFixedUserId() {
  let uid = localStorage.getItem("fixed_user_id");
  if (!uid) {
    const used = JSON.parse(localStorage.getItem("used_idiom_ids") || "[]");
    let available = IDIOMS.filter(w => !used.includes(w));
    if (available.length > 0) {
      uid = available[Math.floor(Math.random() * available.length)];
      used.push(uid);
    } else {
      const base = IDIOMS[Math.floor(Math.random() * IDIOMS.length)];
      const num = used.filter(u => u.startsWith(base + "-")).length + 1;
      uid = base + "-" + num;
      used.push(uid);
    }
    localStorage.setItem("used_idiom_ids", JSON.stringify(used));
    localStorage.setItem("fixed_user_id", uid);
  }
  return uid;
}

currentUserId = getFixedUserId();
myId.textContent = currentUserId;

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
  socket.emit("userJoin", currentUserId);
});

socket.on("onlineList", (list) => {
  onlineUser.textContent = list.join(" | ");
  selectBtn.innerHTML = '<option value="未选择">未选择</option>';
  list.forEach(u => {
    if (u !== currentUserId) {
      const opt = document.createElement("option");
      opt.value = u;
      opt.textContent = u;
      selectBtn.appendChild(opt);
    }
  });
  const last = localStorage.getItem("last_chat_target");
  if (last && last !== "未选择" && list.includes(last)) {
    selectBtn.value = last;
    targetId.textContent = last;
    loadMessages();
  }
  // 移除自动发送已读回执的代码，避免刷新页面时未读消息变成已读
});

selectBtn.addEventListener("change", () => {
  const to = selectBtn.value;
  targetId.textContent = to;
  localStorage.setItem("last_chat_target", to);
  loadMessages();
  // 移除自动发送已读回执的代码，避免切换聊天对象时未读消息变成已读
  // 已读回执将在用户真正看到消息后通过其他方式发送
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
// 页面加载时自动恢复记录并滚动到底部
// ==============================================
window.addEventListener("load", () => {
  if (targetId.textContent !== "未选择") {
    loadMessages();
  }
});
