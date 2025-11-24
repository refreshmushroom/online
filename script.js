    // 任务数据
    const dailyTaskPool = [
        "喝一杯水", "接一杯水", "站起来跳3下", "原地转3圈", 
        "在任意平台收藏一个自己喜欢/感兴趣的帖子", "听一首自己喜欢的歌", "认认真真刷2分钟牙", "做3次深呼吸",
        "伸个懒腰", "学鸭子走路", "拍一张天空的照片","顺时针扭动手腕10次", "找到三个紫色物品", "对着空气来两拳",
        "对着生活笑一笑算辽", "确认自己明天有那些紧急工作", "试着约别人一起吃饭","绕着房间走一圈",
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
        "白天亮度将自动调整至最高，夜晚则会降低",
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

// ============== 用户数据 ==============
let userData = {
    level: 0,
    experience: 0,
    dailyTasks: [],
    longTermTask: null, // 新增字段
    lastReset: null
};

// ============== 初始化 ==============
window.onload = function () {
    loadUserData();
    initApp();
};

function initApp() {
    const today = new Date().toDateString();

    if (!userData.lastReset || userData.lastReset !== today) {
        userData.dailyTasks = generateRandomTasks(3);
        userData.lastReset = today;
        saveUserData();
    }

    renderTasks();
    updateKnowledge();
    displayLongTermTask(); // 显示长期任务

    const birthDate = document.getElementById('birthDate').value;
    if (birthDate) {
        calculateExperience();
    }
}

// ============== 经验值计算 ==============
function calculateExperience() {
    const birthDateInput = document.getElementById('birthDate').value;
    if (!birthDateInput) return;

    const birthDate = new Date(birthDateInput);
    const today = new Date();

    let years = today.getFullYear() - birthDate.getFullYear();
    let months = today.getMonth() - birthDate.getMonth();
    if (months < 0) {
        years--;
        months += 12;
    }

    const totalMonths = years * 12 + months;
    userData.level = Math.floor(totalMonths / 12);
    userData.experience = Math.floor((totalMonths % 12) / 12 * 100);

    saveUserData();
    updateExperienceDisplay();
}

function updateExperienceDisplay() {
    document.getElementById('levelDisplay').textContent = `${userData.level}级 ${userData.experience}%`;
    document.getElementById('progressFill').style.width = `${userData.experience}%`;
}

// ============== 任务生成与渲染 ==============
function generateRandomTasks(count) {
    const shuffled = [...dailyTaskPool].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count).map(task => ({ text: task, completed: false }));
}

function toggleTaskCompletion(index) {
    userData.dailyTasks[index].completed = !userData.dailyTasks[index].completed;
    saveUserData();
    renderTasks();
}

function renderTasks() {
    const list = document.getElementById('dailyTasks');
    list.innerHTML = '';

    // 先渲染未完成，再渲染已完成
    const pending = userData.dailyTasks.filter(t => !t.completed);
    const completed = userData.dailyTasks.filter(t => t.completed);

    [...pending, ...completed].forEach((task, i) => {
        const originalIndex = userData.dailyTasks.findIndex(t => t.text === task.text && t.completed === task.completed);
        const li = document.createElement('li');
        li.className = `task-item ${task.completed ? 'completed' : ''}`;
        li.innerHTML = `
            <div class="task-text">${task.text}</div>
            <div class="task-checkbox ${task.completed ? 'completed' : ''}" 
                 onclick="toggleTaskCompletion(${originalIndex})">✓</div>
        `;
        list.appendChild(li);
    });
}

// ============== 长期任务逻辑 ==============
function setLongTermTask() {
    const goal = document.getElementById('longTermGoal').value.trim();
    const deadline = document.getElementById('deadline').value;
    const plan = document.getElementById('dailyPlan').value.trim();

    if (!goal || !deadline || !plan) {
        alert('请填写完整信息');
        return;
    }

    userData.longTermTask = { goal, deadline, plan, createdAt: new Date().toISOString() };
    saveUserData();
    displayLongTermTask();

    // 清空表单
    document.getElementById('longTermGoal').value = '';
    document.getElementById('deadline').value = '';
    document.getElementById('dailyPlan').value = '';
}

function displayLongTermTask() {
    const container = document.getElementById('longTermDisplay');
    container.innerHTML = '';

    if (!userData.longTermTask) return;

    const { goal, deadline, plan } = userData.longTermTask;
    const daysLeft = Math.ceil((new Date(deadline) - new Date()) / (1000 * 60 * 60 * 24));

    const div = document.createElement('div');
    div.className = 'long-term-task';
    div.innerHTML = `
        <div class="task-text">${goal}</div>
        <div class="task-text">每日计划：${plan}</div>
        <div class="countdown">倒计时：${daysLeft > 0 ? daysLeft + '天' : '已到期'}</div>
    `;
    container.appendChild(div);
}

// ============== 小知识 ==============
function updateKnowledge() {
    const idx = Math.floor(Math.random() * knowledgePool.length);
    document.getElementById('knowledgeText').textContent = knowledgePool[idx];
}

// ============== 数据持久化 ==============
function saveUserData() {
    localStorage.setItem('悬赏金任务板', JSON.stringify(userData));
}

function loadUserData() {
    const saved = localStorage.getItem('悬赏金任务板');
    if (saved) {
        try {
            userData = JSON.parse(saved);
            // 确保字段存在
            userData.level = userData.level || 0;
            userData.experience = userData.experience || 0;
            userData.dailyTasks = userData.dailyTasks || [];
            userData.longTermTask = userData.longTermTask || null;
            userData.lastReset = userData.lastReset || null;
        } catch (e) {
            console.error('本地数据损坏，使用默认值');
            resetUserData();
        }
    } else {
        resetUserData();
    }
}

function resetUserData() {
    userData = {
        level: 0,
        experience: 0,
        dailyTasks: [],
        longTermTask: null,
        lastReset: null
    };
}
