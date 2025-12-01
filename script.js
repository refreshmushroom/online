// ============== 数据池 ==============
const dailyTaskPool = [
        "喝一杯水", "接一杯水", "站起来跳3下", "原地转3圈", 
        "在任意平台收藏一个自己感兴趣的帖子", "听一首自己喜欢的歌", "认真刷牙2分钟", "做3次深呼吸",
        "伸个懒腰", "学鸭子走路", "拍一张天空的照片","顺时针扭动手腕10次", "找到三个紫色物品", "对着空气来两拳",
        "对着生活笑一笑算辽", "试着约别人一起吃饭","绕着房间走一圈","找到一片落叶并仔细观赏上面的纹路",
        "闭目休息60秒", "阅读身边最近一个物品上的文字", "吃掉自己身边最近的食物","与任意NPC说早安/晚安",
];

const knowledgePool = [
        "通常情况下，假花不需要浇水",
        "想要房间整洁如新？试试打扫卫生吧",
        "前往超市，可以获得更多食物",
        "您无法在不携带电子产品的情况下使用它们",
        "通常情况下，空调外机的风比内机热",
        "若想通过电梯前往目标楼层，请正确选择楼层按钮",
        "不同等级下，建议您前往不同练级地点",
        "与NPC对战可能会被制止，若坚持对战可能解锁新地点",
        "佩戴合适的眼镜，可以有效提升您的游戏画质",
        "别担心！可通过进食解决饥饿状态",
        "本世界白天默认亮度为当日最高，夜晚则会降低",
        "您可通过商城购买心仪的物品",
        "您可以通过消耗金币获取载具，提升自身移速",
        "水下呼吸时间有限，请注意氧气值",
        "站立状态普遍比蹲下状态更高",
        "建议充电前先连接上电源",
        "盖上被子睡觉比不盖更热",
        "适当的锻炼可以提升您的体力值",
        "小知识：刚烧开的水比放置一会儿的水更烫",
        "与外域NPC沟通不畅？试试增加语言拓展包",
];
// === 纸牌解读库（52张，完全按你原样保留）===
const cardInterpretations = {
    '♠A': '商业上的交易、谈判都会很顺利。',
    '♠K': '最近会有喜事。',
    '♠Q': '会遇到一个很中意的人。',
    '♠J': '沉沦于玩乐，会落得身败名裂的下场。',
    '♠10': '生活不安定，又逢意外灾难。',
    '♠9': '有非常好的属下和家庭。',
    '♠8': '有精神方面的焦虑症。',
    '♠7': '会有意想不到的事发生。',
    '♠6': '会给别人很好的印象。',
    '♠5': '平安无事，但若能从事新的工作，就会失败。',
    '♠4': '为了纠纷的事情，将会十分忙碌。',
    '♠3': '过去的事会曝光。',
    '♠2': '幸福的生活会有麻烦介入。',

    '♥A': '碰到初恋情人，并旧情复燃。',
    '♥K': '会有新朋友。',
    '♥Q': '与人合伙事业会成功。',
    '♥J': '受长辈的提拔嘉奖。',
    '♥10': '好运当头。',
    '♥9': '无论是年长者还是晚辈，都会信任你。',
    '♥8': '恋爱中的人，一定会达到目的。',
    '♥7': '素不相识的人，会坦白地向你透露心中的爱慕。',
    '♥6': '某人正暗恋着你。',
    '♥5': '有人会约你。',
    '♥4': '会被情人误会。',
    '♥3': '注意会掉东西。',
    '♥2': '会收到珍贵的礼物。',

    '♦A': '被麻烦事缠身。',
    '♦K': '注意意外事故。',
    '♦Q': '受到别人嫉妒。',
    '♦J': '计划会失败。',
    '♦10': '会遇到扒手。',
    '♦9': '失去财产。',
    '♦8': '被情人厌恶。',
    '♦7': '缺钱。',
    '♦6': '找到一线希望。',
    '♦5': '任何事都与愿相违。',
    '♦4': '和家人疏远。',
    '♦3': '情人背叛你。',
    '♦2': '注意生病。',

    '♣A': '事情会朝目标发展。',
    '♣K': '判断容易产生错误。',
    '♣Q': '过于干涉别人，别人也会受不了的。',
    '♣J': '注意忘记东西与掉落东西。',
    '♣10': '要财运亨通，起头是很重要的。',
    '♣9': '长时间辛苦，有代价了。',
    '♣8': '很需要别人帮忙。',
    '♣7': '没有赌运。',
    '♣6': '为彼此失和而苦恼。',
    '♣5': '会有好点子。',
    '♣4': '会发生内讧。',
    '♣3': '运气不好，身体也有影响。',
    '♣2': '对他人的批评不要计较，否则会受骗。'
};

const suits = ['♠', '♥', '♦', '♣'];  // 注意：这里用单字符，匹配 cardInterpretations 的 key
const ranks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];



// ============== 用户数据 ==============
let userData = {
    level: 0,
    experience: 0,
    dailyTasks: [],
    longTermTask: null, // 单个长期任务
    waterCount: 0,
    dailyCards: null,
    cardsDrawnDate: null,
    lastReset: null
};

// ============== 工具函数 ==============
function saveUserData() {
    localStorage.setItem('earthOnlineData', JSON.stringify(userData));
}

function loadUserData() {
    const data = localStorage.getItem('earthOnlineData');
    if (data) {
        try {
            Object.assign(userData, JSON.parse(data));
            // 兼容旧数据
            userData.longTermTask = userData.longTermTask || null;
            userData.dailyCards = userData.dailyCards || null;
            userData.cardsDrawnDate = userData.cardsDrawnDate || null;
        } catch (e) {
            console.error('加载用户数据失败', e);
        }
    }
}

function resetUserData() {
    userData = {
        level: 0,
        experience: 0,
        dailyTasks: [],
        longTermTask: null,
        waterCount: 0,
        dailyCards: null,
        cardsDrawnDate: null,
        lastReset: null
    };
    saveUserData();
}

// ============== 任务相关 ==============
function generateRandomTasks(count) {
    const shuffled = [...dailyTaskPool].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count).map(text => ({ text, completed: false }));
}

function renderTasks() {
    const list = document.getElementById('dailyTasks');
    if (!list) return;
    list.innerHTML = '';

    const today = new Date();

    // 渲染所有每日任务（包括长期任务的每日计划）
    userData.dailyTasks.forEach((task, index) => {
        const li = document.createElement('li');
        li.className = `task-item ${task.completed ? 'completed' : ''}`;

        // 如果是长期任务计划，动态更新倒计时
        let displayText = task.text;
        if (userData.longTermTask && task.isLongTermPlan) {
            const deadline = new Date(userData.longTermTask.deadline);
            const timeDiff = deadline - today;
            const daysLeft = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

            if (daysLeft > 0) {
                displayText = `${userData.longTermTask.plan} · 倒计时 ${daysLeft}天`;
            } else if (daysLeft === 0) {
                displayText = `${userData.longTermTask.plan} · 今天截止！`;
            } else {
                displayText = `${userData.longTermTask.plan} · 已到期`;
            }
        }

        const checkboxContent = task.completed ? '✓' : '';
        const checkboxClass = task.completed ? 'task-checkbox completed' : 'task-checkbox';

        li.innerHTML = `
            <div class="task-text">${displayText}</div>
            <div class="${checkboxClass}" onclick="toggleTaskCompletion(${index})">${checkboxContent}</div>
        `;
        list.appendChild(li);
    });
}

function toggleTaskCompletion(index) {
    userData.dailyTasks[index].completed = !userData.dailyTasks[index].completed;
    saveUserData();
    renderTasks();
}

// ============== 等级经验系统 ==============
function calculateExperience() {
    const birthDateInput = document.getElementById('birthDate').value;
    if (!birthDateInput) return;

    const birthDate = new Date(birthDateInput);
    const today = new Date();
    const diffTime = Math.abs(today - birthDate);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const experience = (diffDays * 100) % 100; // 百分比
    const level = Math.floor(diffDays / 365);

    userData.level = level;
    userData.experience = Math.round(experience);
    saveUserData();

    updateExperienceDisplay();
}

function updateExperienceDisplay() {
    document.getElementById('levelDisplay').textContent = `${userData.level}级 ${userData.experience}%`;
    document.getElementById('progressFill').style.width = `${userData.experience}%`;
}

// ============== 小知识 ==============
function updateKnowledge() {
    const knowledgeText = document.getElementById('knowledgeText');
    if (knowledgeText) {
        const random = knowledgePool[Math.floor(Math.random() * knowledgePool.length)];
        knowledgeText.textContent = random;
    }
}

// ============== 长期任务 ==============
function setLongTermTask() {
    const goal = document.getElementById('longTermGoal').value.trim();
    const deadline = document.getElementById('deadline').value;
    const plan = document.getElementById('dailyPlan').value.trim();

    if (!goal || !deadline || !plan) {
        alert('请填写完整信息');
        return;
    }

    // 移除旧的长期任务计划（如果存在）
    userData.dailyTasks = userData.dailyTasks.filter(task => !task.isLongTermPlan);

    // 添加新的长期任务
    userData.longTermTask = { goal, deadline, plan };

    // 将每日计划加入每日任务列表，并标记为长期计划
    userData.dailyTasks.unshift({
        text: plan,
        completed: false,
        isLongTermPlan: true
    });

    saveUserData();
    renderTasks();

    // 清空表单
    document.getElementById('longTermGoal').value = '';
    document.getElementById('deadline').value = '';
    document.getElementById('dailyPlan').value = '';
}

function displayLongTermTask() {
    // 不再单独显示，已整合进每日任务
}

// ============== 卡牌占卜（普通纸牌）==============
function drawDailyCards() {
    const today = new Date().toDateString();

    if (userData.dailyCards && userData.cardsDrawnDate === today) {
        renderCards(userData.dailyCards);
        const btn = document.getElementById('drawCardsBtn');
        if (btn) {
            btn.disabled = true;
            btn.textContent = '今日已抽取 ✨';
        }
        return;
    }

    // 生成3张新牌（字符串形式，如 '♠A'）
    const drawn = [];
    for (let i = 0; i < 3; i++) {
        const suit = suits[Math.floor(Math.random() * suits.length)];
        const rank = ranks[Math.floor(Math.random() * ranks.length)];
        drawn.push(suit + rank);
    }

    userData.dailyCards = drawn;
    userData.cardsDrawnDate = today;
    saveUserData();

    renderCards(drawn);

    const btn = document.getElementById('drawCardsBtn');
    if (btn) {
        btn.disabled = true;
        btn.textContent = '今日已抽取 ✨';
    }
}

function renderCards(cards) {
    const container = document.getElementById('cardsResult');
    if (!container) return;

    container.innerHTML = '';

    cards.forEach(cardKey => {
        const interpretation = cardInterpretations[cardKey] || '未知牌义';

        // 设置花色颜色
        let suitColor = '#000';
        if (cardKey.startsWith('♥') || cardKey.startsWith('♦')) {
            suitColor = '#e74c3c';
        }

        const cardEl = document.createElement('div');
        cardEl.style.padding = '12px';
        cardEl.style.borderRadius = '8px';
        cardEl.style.background = '#fff';
        cardEl.style.boxShadow = '0 2px 6px rgba(0,0,0,0.08)';
        cardEl.style.fontFamily = 'monospace';
        cardEl.innerHTML = `
            <div style="font-size: 1.4em; margin-bottom: 6px; color: ${suitColor};">${cardKey}</div>
            <div style="color: #2c3e50; line-height: 1.5;">${interpretation}</div>
        `;
        container.appendChild(cardEl);
    });
}

// ============== BMI 计算 ==============
function calculateBMI() {
    const heightInput = document.getElementById('heightInput').value;
    const weightInput = document.getElementById('weightInput').value;

    if (!heightInput || !weightInput) {
        alert('请输入身高和体重');
        return;
    }

    const height = parseFloat(heightInput);
    const weight = parseFloat(weightInput);

    if (height <= 0 || weight <= 0) {
        alert('身高和体重必须大于0');
        return;
    }

    const heightInMeters = height / 100;
    const bmi = (weight / (heightInMeters * heightInMeters)).toFixed(1);

    let message = `<strong>你的 BMI 是：${bmi}</strong><br><br>`;

    if (bmi <= 18.5) {
        message += '你的 BMI 值太低啦！要多吃肉蛋奶哦～<br>多注意身体健康，能量满满才能迎接每一天！';
    } else if (bmi <= 23.9) {
        message += '你的 BMI 指数很正常哦，继续保持！<br>你正在好好照顾自己，真棒！';
    } else if (bmi <= 27.9) {
        message += '你的 BMI 稍高一点点～<br>可以通过饮食控制和适当锻炼来调整哦！<br>比如多吃蔬菜水果、适量粗粮，少吃油腻或高热量食物，慢慢来，你已经在变更好的路上了！';
    } else {
        message += '你的 BMI 偏高啦～<br>别担心！通过合理的饮食和适度运动，完全可以改善。<br>建议多吃蔬菜水果和粗粮，减少高油高糖摄入，每天动一动，身体会越来越轻盈有活力！';
    }

    const resultDiv = document.getElementById('bmiResult');
    resultDiv.innerHTML = message;
    resultDiv.style.display = 'block';
}

// ============== 初始化 ==============
function initApp() {
    loadUserData();

    const today = new Date().toDateString();

    if (!userData.lastReset || userData.lastReset !== today) {
        userData.dailyTasks = generateRandomTasks(3);
        // 如果有长期任务，保留其计划
        if (userData.longTermTask) {
            userData.dailyTasks.unshift({
                text: userData.longTermTask.plan,
                completed: false,
                isLongTermPlan: true
            });
        }
        userData.lastReset = today;
        saveUserData();
    }

    renderTasks();
    updateKnowledge();
    displayLongTermTask();

    const birthDate = document.getElementById('birthDate').value;
    if (birthDate) {
        calculateExperience();
    } else if (userData.level !== undefined) {
        // 即使未输入生日，若已有等级数据也显示
        updateExperienceDisplay();
    }
}

// ============== 页面加载 ==============
document.addEventListener('DOMContentLoaded', () => {
    initApp();

    // 检查是否已抽牌
    setTimeout(() => {
        const today = new Date().toDateString();
        if (userData.dailyCards && userData.cardsDrawnDate === today) {
            renderCards(userData.dailyCards);
            const btn = document.getElementById('drawCardsBtn');
            if (btn) {
                btn.disabled = true;
                btn.textContent = '今日已抽取 ✨';
            }
        }
    }, 100);
});
