# MongoDB 安装与配置指南

## 问题诊断

注册接口返回 500 错误的原因：**MongoDB 未安装或未运行**

---

## 解决方案

### 方案 1: 使用 MongoDB Atlas（推荐 - 免费）

MongoDB Atlas 是 MongoDB 的云服务，提供免费额度，无需安装。

#### 步骤 1: 创建免费账户

1. 访问 https://www.mongodb.com/cloud/atlas
2. 点击 "Try Free" 注册免费账户

#### 步骤 2: 创建集群

1. 登录后点击 "Build a Database"
2. 选择 "FREE" 免费计划
3. 选择离您最近的云服务商和区域（如 AWS Singapore）
4. 集群名称保持默认，点击 "Create"

#### 步骤 3: 创建数据库用户

1. 集群创建中（约2-5分钟）
2. 在 "Security" 选项卡中点击 "Database Access"
3. 点击 "Add New Database User"
4. 填写用户名和密码（记住这个密码！）
5. 权限选择 "Read and write to any database"
6. 点击 "Add User"

#### 步骤 4: 配置 IP 白名单

1. 在 "Security" 选项卡中点击 "Network Access"
2. 点击 "Add IP Address"
3. 选择 "Allow Access from Anywhere" (0.0.0.0/0)
4. 点击 "Confirm"

#### 步骤 5: 获取连接字符串

1. 点击 "Database" 选项卡
2. 点击集群名称旁边的 "Connect" 按钮
3. 选择 "Connect your application"
4. 选择 Node.js 版本（如 6.0 或更高）
5. 复制连接字符串，格式类似：
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

#### 步骤 6: 更新 .env 文件

打开 `server/.env` 文件，将 MONGODB_URI 替换为：

```env
PORT=3000
MONGODB_URI=mongodb+srv://your-username:your-password@cluster0.xxxxx.mongodb.net/picturebook-island?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
NODE_ENV=development
```

**注意**: 将 `your-username` 和 `your-password` 替换为在步骤3中创建的数据库用户名和密码。

#### 步骤 7: 重启服务器

```powershell
# 停止当前运行的服务器（Ctrl+C）

# 重新启动后端
cd server
node src/server.js
```

---

### 方案 2: 安装本地 MongoDB

#### Windows 安装步骤

1. 下载 MongoDB Community Server
   - 访问: https://www.mongodb.com/try/download/community
   - 选择 Windows 版本
   - 下载 msi 安装包

2. 运行安装程序
   - 双击下载的 .msi 文件
   - 选择 "Complete" 完整安装
   - 勾选 "Install MongoDB as a Service"
   - 勾选 "Install MongoDB Compass"（可选，用于图形化管理）

3. 验证安装
   ```powershell
   # 检查 MongoDB 服务状态
   Get-Service MongoDB

   # 如果服务未运行，启动它
   Start-Service MongoDB
   ```

4. 测试连接
   ```powershell
   mongosh
   ```

5. 重启应用服务器
   ```powershell
   cd server
   node src/server.js
   ```

---

### 方案 3: 使用 Docker（需要安装 Docker）

如果您已安装 Docker，可以快速运行 MongoDB：

```powershell
# 拉取并运行 MongoDB
docker run --name picturebook-mongo -p 27017:27017 -d mongo:7.0

# 验证运行
docker ps
```

停止 MongoDB:
```powershell
docker stop picturebook-mongo
```

---

## 验证 MongoDB 连接

### 测试连接字符串

1. 修改 .env 文件后，重启服务器
2. 查看终端输出，应该看到：
   ```
   MongoDB Connected: <连接的主机>
   ```

### 运行数据种子脚本

```powershell
cd server
npm run seed
```

应该看到：
```
User created: test@example.com
Seeded 8 picturebooks
Seeded 3 age categories
Seeded 7 theme categories
Database seeded successfully!
```

---

## 常见问题

### Q: 连接超时错误

**解决方案**:
- 检查 MongoDB Atlas 的 IP 白名单配置
- 确保防火墙允许 27017 端口
- 如果使用 Atlas，确保连接字符串正确

### Q: 认证失败

**解决方案**:
- 检查 .env 中的用户名和密码是否正确
- 确认数据库用户已创建且有读写权限

### Q: 集群正在初始化

**解决方案**:
- MongoDB Atlas 集群创建需要 2-5 分钟
- 等待集群状态变为 "Ready" 后再连接

---

## 推荐方案

**对于开发和测试**: 使用 MongoDB Atlas（免费）

**优点**:
- 无需安装，快速配置
- 免费额度充足（512MB）
- 可视化管理界面
- 支持备份和监控
- 随时随地访问

**缺点**:
- 需要网络连接
- 首次设置需要几分钟

---

## 下一步

配置好 MongoDB 后，重新启动应用：

```powershell
# 重启后端
cd server
node src/server.js

# 重启前端（另一个终端）
cd frontend
node node_modules/vite/bin/vite.js
```

然后访问 http://localhost:5173 测试注册功能！