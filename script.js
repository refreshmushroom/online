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
    
    // 用户数据
    let userData = {
        level: 0,
        experience: 0,
        dailyTasks: [],
        customTasks: [],
        maxCustomTasks: 2,
        lastReset: null
    };

    // 页面加载时初始化
    window.onload = function() {
        loadUserData();
        initApp();
    };

    function initApp() {
        const today = new Date().toDateString();
        
        // 检查是否需要重置每日任务（每天只刷新一次）
        if (!userData.lastReset || userData.lastReset !== today) {
            userData.dailyTasks = generateRandomTasks(3);
            userData.lastReset = today;
            saveUserData();
        }
        
        // 更新界面
        updateTaskLimit();
        renderTasks();
        updateKnowledge();
        
        // 如果已有生日数据，更新经验值
        const birthDate = document.getElementById('birthDate').value;
        if (birthDate) {
            calculateExperience();
        }
    }

    // 计算经验值（按天数）
    function calculateExperience() {
        const birthDateInput = document.getElementById('birthDate').value;
        if (!birthDateInput) return;

        const birthDate = new Date(birthDateInput);
        const today = new Date();
        
        // 计算总天数
        const diffTime = Math.abs(today - birthDate);
        const totalDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        
        userData.level = Math.floor(totalDays / 365);
        userData.experience = Math.floor((totalDays % 365) / 365 * 100);

        saveUserData();
        updateExperienceDisplay();
    }

    // 更新经验值显示
    function updateExperienceDisplay() {
        const levelDisplay = document.getElementById('levelDisplay');
        levelDisplay.textContent = `${userData.level}级 ${userData.experience}%`;
        document.getElementById('progressFill').style.width = `${userData.experience}%`;
    }

    // 生成随机任务
    function generateRandomTasks(count) {
        const shuffled = [...dailyTaskPool].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, count).map(task => ({
            text: task,
            completed: false
        }));
    }

    // 添加自定义任务
    function addCustomTask() {
        const input = document.getElementById('customTaskInput');
        const taskText = input.value.trim();
        
        if (!taskText) {
            alert('请输入任务内容');
            return;
        }

        if (userData.customTasks.length >= userData.maxCustomTasks) {
            alert(`每日最多只能添加${userData.maxCustomTasks}条自定义任务`);
            return;
        }

        userData.customTasks.push({
            text: taskText,
            completed: false
        });
        
        input.value = '';
        saveUserData();
        renderTasks();
        updateTaskLimit();
    }

    // 切换任务完成状态
    function toggleTaskCompletion(taskIndex, taskType) {
        if (taskType === 'daily') {
            userData.dailyTasks[taskIndex].completed = !userData.dailyTasks[taskIndex].completed;
        } else if (taskType === 'custom') {
            userData.customTasks[taskIndex].completed = !userData.customTasks[taskIndex].completed;
        }
        saveUserData();
        renderTasks();
    }

    // 渲染所有任务
    function renderTasks() {
        const dailyTaskList = document.getElementById('dailyTasks');
        const customTaskList = document.getElementById('customTasks');
        
        dailyTaskList.innerHTML = '';
        customTaskList.innerHTML = '';
        
        // 分离已完成和未完成的任务
        const pendingDailyTasks = userData.dailyTasks.filter(task => !task.completed);
        const completedDailyTasks = userData.dailyTasks.filter(task => task.completed);
        
        const pendingCustomTasks = userData.customTasks.filter(task => !task.completed);
        const completedCustomTasks = userData.customTasks.filter(task => task.completed);
        
        // 渲染未完成的每日任务（勾选框为空）
        pendingDailyTasks.forEach((task, index) => {
            const originalIndex = userData.dailyTasks.findIndex(t => t.text === task.text && !t.completed);
            const li = document.createElement('li');
            li.className = 'task-item';
            li.innerHTML = `
                <div class="task-text">${task.text}</div>
                <div class="task-checkbox" onclick="toggleTaskCompletion(${originalIndex}, 'daily')"></div>
            `;
            dailyTaskList.appendChild(li);
        });
        
        // 渲染已完成的每日任务（显示 ✓）
        completedDailyTasks.forEach((task, index) => {
            const originalIndex = userData.dailyTasks.findIndex(t => t.text === task.text && t.completed);
            const li = document.createElement('li');
            li.className = 'task-item completed';
            li.innerHTML = `
                <div class="task-text">${task.text}</div>
                <div class="task-checkbox completed" onclick="toggleTaskCompletion(${originalIndex}, 'daily')">✓</div>
            `;
            dailyTaskList.appendChild(li);
        });
        
        // 渲染未完成的自定义任务（勾选框为空）
        pendingCustomTasks.forEach((task, index) => {
            const originalIndex = userData.customTasks.findIndex(t => t.text === task.text && !t.completed);
            const li = document.createElement('li');
            li.className = 'task-item';
            li.innerHTML = `
                <div class="task-text">${task.text}</div>
                <div class="task-checkbox" onclick="toggleTaskCompletion(${originalIndex}, 'custom')"></div>
            `;
            customTaskList.appendChild(li);
        });
        
        // 渲染已完成的自定义任务（显示 ✓）
        completedCustomTasks.forEach((task, index) => {
            const originalIndex = userData.customTasks.findIndex(t => t.text === task.text && t.completed);
            const li = document.createElement('li');
            li.className = 'task-item completed';
            li.innerHTML = `
                <div class="task-text">${task.text}</div>
                <div class="task-checkbox completed" onclick="toggleTaskCompletion(${originalIndex}, 'custom')">✓</div>
            `;
            customTaskList.appendChild(li);
        });
    }

    // 更新任务数量限制
    function updateTaskLimit() {
        const remaining = userData.maxCustomTasks - userData.customTasks.length;
        document.getElementById('taskLimit').textContent = `今日还可添加 ${remaining} 条任务`;
    }

    // 更新小知识
    function updateKnowledge() {
        const randomIndex = Math.floor(Math.random() * knowledgePool.length);
        document.getElementById('knowledgeText').textContent = knowledgePool[randomIndex];
    }

    // 保存用户数据
    function saveUserData() {
        localStorage.setItem('悬赏金任务板', JSON.stringify(userData));
    }

    // 加载用户数据
    function loadUserData() {
        const savedData = localStorage.getItem('悬赏金任务板');
        if (savedData) {
            userData = JSON.parse(savedData);
            userData.maxCustomTasks = userData.maxCustomTasks || 2;
            userData.dailyTasks = userData.dailyTasks || [];
            userData.customTasks = userData.customTasks || [];
            userData.lastReset = userData.lastReset || null;
        }
    }