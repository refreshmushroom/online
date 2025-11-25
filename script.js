// 用户数据结构
let userData = {
    level: 0,
    experience: 0,
    dailyTasks: [],
    longTermTasks: [], // 改为数组，最多3个
    lastReset: null
};

// 初始化应用
function initApp() {
    loadUserData();
    userData.waterCount = userData.waterCount || 0;
    const today = new Date().toDateString();

    if (!userData.lastReset || userData.lastReset !== today) {
        // 重置每日数据
        userData.waterCount = 0; // 👈 新增：每天清零饮水计数
        userData.dailyTasks = userData.dailyTasks.filter(t => t.longTermId !== undefined); // 保留长期任务
        const randomTasks = generateRandomTasks(3);
        userData.dailyTasks.push(...randomTasks.map(text => ({ text, completed: false })));
        userData.lastReset = today;
        saveUserData();
    }

    renderTasks();
    updateKnowledge();
    if (userData.level !== undefined) {
        updateExperienceDisplay();
    }
}

// 加载用户数据
function loadUserData() {
    const saved = localStorage.getItem('earthOnlineData');
    if (saved) {
        try {
            Object.assign(userData, JSON.parse(saved));
            // 兼容旧版单个 longTermTask
            if (userData.longTermTask && typeof userData.longTermTask === 'object' && !Array.isArray(userData.longTermTask)) {
                userData.longTermTasks = [userData.longTermTask];
                delete userData.longTermTask;
            }
            userData.longTermTasks = userData.longTermTasks || [];
            userData.dailyTasks = userData.dailyTasks || [];
        } catch (e) {
            resetUserData();
        }
    } else {
        resetUserData();
    }
}

// 重置用户数据
function resetUserData() {
    userData = {
        level: 0,
        experience: 0,
        dailyTasks: [],
        longTermTasks: [],
        waterCount: 0, // 👈 新增
        lastReset: null
    };
}

// 保存用户数据
function saveUserData() {
    localStorage.setItem('earthOnlineData', JSON.stringify(userData));
}

// 生成随机每日任务
function generateRandomTasks(count) {
    const tasks = [
        "喝一杯水", "接一杯水", "站起来跳3下", "原地转3圈", 
        "在任意平台收藏一个自己感兴趣的帖子", "听一首自己喜欢的歌", "认真刷牙2分钟", "做3次深呼吸",
        "伸个懒腰", "学鸭子走路", "拍一张天空的照片","顺时针扭动手腕10次", "找到三个紫色物品", "对着空气来两拳",
        "对着生活笑一笑算辽", "试着约别人一起吃饭","绕着房间走一圈","找到一片落叶并仔细观赏上面的纹路",
        "闭目休息60秒", "阅读身边最近一个物品上的文字", "吃掉自己身边最近的食物","与任意NPC说早安/晚安",
    ];
    const shuffled = [...tasks].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}

// 计算经验（根据出生日期）
function calculateExperience() {
    const birthInput = document.getElementById('birthDate').value;
    if (!birthInput) return;

    const birthDate = new Date(birthInput);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }

    if (age < 0 || age > 150) {
        alert('请输入合理的出生日期');
        return;
    }

    userData.level = age;
    userData.experience = Math.min(100, Math.max(0, ((today - birthDate) / (365.25 * 24 * 60 * 60 * 1000) - age) * 100));

    saveUserData();
    updateExperienceDisplay();
}

// 更新等级显示
function updateExperienceDisplay() {
    document.getElementById('levelDisplay').textContent = `${userData.level}级 ${Math.round(userData.experience)}%`;
    document.getElementById('progressFill').style.width = `${userData.experience}%`;
}

// 渲染任务列表
function renderTasks() {
    const list = document.getElementById('dailyTasks');
    list.innerHTML = '';

    const today = new Date();

    // === 1. 固定饮水任务（不可删除，可点击+1）===
    const waterItem = document.createElement('li');
    waterItem.className = 'task-item';
    waterItem.style.cursor = 'pointer';
    waterItem.innerHTML = `
        <div class="task-text">今日饮水了吗？ 今日喝了（${userData.waterCount}）杯水。</div>
        <div class="task-checkbox" style="visibility: hidden;"></div>
    `;
    waterItem.querySelector('.task-text').onclick = () => {
        userData.waterCount = (userData.waterCount || 0) + 1;
        saveUserData();
        renderTasks(); // 重新渲染以更新数字
    };
    list.appendChild(waterItem);

    // === 2. 同步长期任务倒计时并渲染 ===
    userData.dailyTasks = userData.dailyTasks.map(task => {
        if (task.longTermId !== undefined) {
            const lt = userData.longTermTasks.find(t => t.id === task.longTermId);
            if (lt) {
                const daysLeft = Math.ceil((new Date(lt.deadline) - today) / (1000 * 60 * 60 * 24));
                let countdown = '';
                if (daysLeft > 0) {
                    countdown = ` · 倒计时 ${daysLeft}天`;
                } else if (daysLeft === 0) {
                    countdown = ' · 今天截止！';
                } else {
                    countdown = ' · 已到期';
                }
                return { ...task, text: `${lt.plan}${countdown}` };
            }
        }
        return task;
    });

    // 渲染其他任务（长期 + 随机）
    userData.dailyTasks.forEach((task, index) => {
        const li = document.createElement('li');
        li.className = `task-item ${task.completed ? 'completed' : ''}`;

        const isLongTerm = task.longTermId !== undefined;

        const checkboxContent = task.completed ? '✓' : '';
        const checkboxClass = task.completed ? 'task-checkbox completed' : 'task-checkbox';

        const deleteBtn = isLongTerm 
            ? `<button class="delete-btn" onclick="removeLongTermTask(${task.longTermId})">×</button>`
            : '';

        li.innerHTML = `
            <div class="task-text">${task.text}</div>
            <div style="display: flex; align-items: center; gap: 8px;">
                <div class="${checkboxClass}" onclick="toggleTaskCompletion(${index})">${checkboxContent}</div>
                ${deleteBtn}
            </div>
        `;
        list.appendChild(li);
    });

    saveUserData();
}

// 切换任务完成状态
function toggleTaskCompletion(index) {
    userData.dailyTasks[index].completed = !userData.dailyTasks[index].completed;
    saveUserData();
    renderTasks();
}

// 设定长期任务（最多3个）
function setLongTermTask() {
    const goal = document.getElementById('longTermGoal').value.trim();
    const deadline = document.getElementById('deadline').value;
    const plan = document.getElementById('dailyPlan').value.trim();

    if (!goal || !deadline || !plan) {
        alert('请填写完整信息');
        return;
    }

    if (userData.longTermTasks.length >= 3) {
        alert('最多只能设置 3 个长期任务哦！');
        return;
    }

    const newTask = {
        id: Date.now(),
        goal,
        deadline,
        plan,
        createdAt: new Date().toISOString()
    };

    userData.longTermTasks.push(newTask);

    const daysLeft = calculateDaysLeft(deadline);
    let countdownText = '';
    if (daysLeft > 0) {
        countdownText = ` · 倒计时 ${daysLeft}天`;
    } else if (daysLeft === 0) {
        countdownText = ' · 今天截止！';
    } else {
        countdownText = ' · 已到期';
    }

    userData.dailyTasks.unshift({
        text: `${plan}${countdownText}`,
        completed: false,
        longTermId: newTask.id
    });

    saveUserData();
    renderTasks();

    // 清空表单
    document.getElementById('longTermGoal').value = '';
    document.getElementById('deadline').value = '';
    document.getElementById('dailyPlan').value = '';
}

// 删除长期任务
function removeLongTermTask(longTermId) {
    if (!confirm('确定要删除这个长期任务吗？')) return;

    userData.longTermTasks = userData.longTermTasks.filter(t => t.id !== longTermId);
    userData.dailyTasks = userData.dailyTasks.filter(task => task.longTermId !== longTermId);

    saveUserData();
    renderTasks();
}

// 计算剩余天数
function calculateDaysLeft(deadline) {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    return Math.ceil((deadlineDate - today) / (1000 * 60 * 60 * 24));
}

// 显示小知识
function updateKnowledge() {
    const knowledgeList = [
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
    const random = knowledgeList[Math.floor(Math.random() * knowledgeList.length)];
    document.getElementById('knowledgeText').textContent = random;
}

// BMI 计算
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
        message += '你的 BMI 值太低啦！要多吃肉蛋奶哦～<br>多注意身体健康!';
    } else if (bmi <= 23.9) {
        message += '你的 BMI 指数很正常哦，继续保持！<br>你正在好好照顾自己，真棒！';
    } else if (bmi <= 27.9) {
        message += '你的 BMI 稍高一点点～<br>可以通过饮食控制和适当锻炼来调整哦！<br>比如多吃蔬菜水果、适量粗粮，少吃油腻或高热量食物！';
    } else {
        message += '你的 BMI 偏高啦～<br>别担心！可以通过合理的饮食和适度运动改善。<br>建议多吃蔬菜水果和粗粮，减少高油高糖摄入，每天动一动，身体会越来越有活力的！';
    }

    const resultDiv = document.getElementById('bmiResult');
    resultDiv.innerHTML = message;
    resultDiv.style.display = 'block';
}

// 页面加载时初始化
document.addEventListener('DOMContentLoaded', initApp);
