# 🚀 绘本岛 - 快速启动指南

## 项目已启动成功！

### 🌐 访问地址

- **前端应用**: http://localhost:5173
- **后端 API**: http://localhost:3000

---

## 📋 测试账号

```
邮箱: test@example.com
密码: password123
```

---

## 🔧 如何重启项目

### 方法 1: 在 PowerShell 中运行

**启动后端** (新终端窗口):
```powershell
cd server
node src/server.js
```

**启动前端** (新终端窗口):
```powershell
cd frontend
node node_modules/vite/bin/vite.js
```

### 方法 2: 使用 npm (如果执行策略允许)

```powershell
# 设置执行策略（仅当前会话）
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass

# 启动后端
cd server
npm run dev

# 启动前端（另一个终端）
cd frontend
npm run dev
```

---

## 📊 运行状态

### 后端服务器
- ✅ 已启动在端口 3000
- ✅ MongoDB 连接正常
- ✅ API 接口可用

### 前端应用
- ✅ 已启动在端口 5173
- ✅ Vite 开发服务器运行中
- ✅ 支持热重载

---

## 🎯 功能测试清单

### 认证功能
- [ ] 访问首页
- [ ] 注册新账号
- [ ] 使用测试账号登录
- [ ] 修改个人信息

### 浘本浏览
- [ ] 浏览所有绘本
- [ ] 按年龄筛选
- [ ] 按主题筛选
- [ ] 搜索绘本
- [ ] 查看绘本详情

### 在线阅读
- [ ] 打开阅读器
- [ ] 翻页操作
- [ ] 全屏模式
- [ ] 夜间模式
- [ ] 进度保存

### 收藏功能
- [ ] 收藏绘本
- [ ] 取消收藏
- [ ] 查看我的书架
- [ ] 继续阅读

### 推荐功能
- [ ] 查看每日推荐
- [ ] 查看个性化推荐

---

## 🐛 常见问题

### 1. 端口被占用

**后端端口 3000 被占用**:
```powershell
# 查找占用端口的进程
netstat -ano | findstr :3000

# 终止进程
taskkill /PID <进程ID> /F
```

**前端端口 5173 被占用**:
```powershell
# 查找占用端口的进程
netstat -ano | findstr :5173

# 终止进程
taskkill /PID <进程ID> /F
```

### 2. MongoDB 连接失败

确保 MongoDB 正在运行:
```powershell
# 检查 MongoDB 服务
Get-Service -Name MongoDB

# 启动 MongoDB 服务
Start-Service -Name MongoDB
```

### 3. PowerShell 执行策略错误

如果遇到执行策略错误，运行:
```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
```

### 4. 依赖未安装

重新安装依赖:
```powershell
# 后端
cd server
Remove-Item -Recurse -Force node_modules
npm install

# 前端
cd frontend
Remove-Item -Recurse -Force node_modules
npm install
```

---

## ?? 开发模式

### 热重载

前端支持热重载，修改代码后自动刷新。

### 日志查看

- 前端日志在运行 Vite 的终端窗口
- 后端日志在运行 server.js 的终端窗口

---

## ?? 项目特色

- 🎨 温馨可爱的童趣设计
- ?? 响应式布局，支持移动端
- 📖 流畅的翻页动画
- 🌙 夜间阅读模式
- ❤️ 个人收藏和阅读历史
- 🎯 智能推荐系统

---

## 📞 技术支持

如有问题，请参考:
- README.md - 项目说明
- DEPLOYMENT.md - 部署指南

---

## 🎉 享受阅读！

祝您和孩子在绘本岛度过美好的阅读时光！