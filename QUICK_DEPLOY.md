# 🚀 绘本岛云部署快速开始指南

## 📋 部署前准备清单

- [ ] GitHub 账号
- [ ] Render 账号（免费注册：https://render.com）
- [ ] MongoDB Atlas 账号（免费注册：https://www.mongodb.com/cloud/atlas）

## ⚡ 5分钟快速部署

### 第一步：配置数据库（2分钟）

1. **创建 MongoDB Atlas 集群**
   - 访问：https://www.mongodb.com/cloud/atlas/register
   - 注册账户并验证邮箱
   - 点击 "Build a Database" → 选择 "Free"
   - 选择云服务商和区域（推荐 AWS Singapore）
   - 创建集群

2. **配置访问权限**
   - 创建数据库用户（用户名：`picturebook-admin`）
   - 设置强密码（**保存此密码！**）
   - IP 白名单选择 "Allow Access from Anywhere" (0.0.0.0/0)

3. **获取连接字符串**
   - 点击 "Connect" → "Connect your application"
   - 复制连接字符串：
     ```
     mongodb+srv://picturebook-admin:<password>@cluster0.xxxxx.mongodb.net/picturebook-island?retryWrites=true&w=majority
     ```
   - 将 `<password>` 替换为实际密码

---

### 第二步：推送代码到 GitHub（1分钟）

```bash
# 在项目根目录执行
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/picturebook-island.git
git branch -M main
git push -u origin main
```

---

### 第三步：部署后端到 Render（1分钟）

1. 登录 https://dashboard.render.com
2. 点击 "New +" → 选择 "Web Service"
3. 连接 GitHub 仓库 `picturebook-island`
4. 配置：
   - **Name:** `picturebook-api`
   - **Region:** Singapore
   - **Runtime:** Node
   - **Build Command:** `cd server && npm install`
   - **Start Command:** `cd server && npm start`
   - **Instance Type:** Free
   - **Working Directory:** `server`
5. 添加环境变量：
   ```
   NODE_ENV=production
   PORT=3000
   MONGODB_URI=mongodb+srv://picturebook-admin:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/picturebook-island?retryWrites=true&w=majority
   JWT_SECRET=使用 node -e "console.log(require('crypto').randomBytes(32).toString('hex'))" 生成
   CORS_ORIGIN=https://picturebook-island.onrender.com
   ```
6. 点击 "Create Web Service"，等待部署完成

---

### 第四步：部署前端到 Render（1分钟）

1. 在 Render 点击 "New +" → 选择 "Static Site"
2. 配置：
   - **Name:** `picturebook-web`
   - **Build Command:** `cd frontend && npm install && npm run build`
   - **Publish Directory:** `frontend/dist`
3. 添加环境变量：
   ```
   VITE_API_URL=https://picturebook-api.onrender.com
   ```
4. 点击 "Create Static Site"，等待部署完成

---

## ✅ 验证部署

### 1. 测试后端 API
```bash
curl https://picturebook-api.onrender.com/api/health
```
应该返回：
```json
{
  "success": true,
  "message": "Server is running",
  "mongodb": "connected",
  "environment": "production"
}
```

### 2. 访问前端应用
打开浏览器访问：https://picturebook-island.onrender.com

### 3. 测试功能
- [ ] 注册新用户
- [ ] 浏览绘本
- [ ] 阅读绘本
- [ ] 收藏功能

---

## 🔑 重要信息

### 生成的 URL
- **后端 API:** `https://picturebook-api.onrender.com`
- **前端应用:** `https://picturebook-island.onrender.com`

### 重要密码和密钥
- MongoDB 数据库密码（请妥善保存）
- JWT_SECRET（请在 Render 环境变量中查看）
- MongoDB 连接字符串（请妥善保存）

---

## ⚠️ 已知限制

### 免费 Render 服务
- **休眠机制：** 15分钟无访问自动休眠
- **冷启动：** 首次访问需要 30-60 秒启动
- **解决方案：** 升级到 $7/月的 Standard 计划可消除休眠

### 文件上传功能
- **问题：** Render 免费版不支持持久化文件存储
- **当前状态：** 上传功能可能无法正常工作
- **解决方案：** 参考 CLOUDINARY_SETUP.md 配置云对象存储

---

## 🎯 下一步

1. **配置云存储（可选）：** 参考 CLOUDINARY_SETUP.md 启用文件上传
2. **绑定自定义域名（可选）：** 在 Render 服务设置中添加域名
3. **升级付费计划（可选）：** 如需更快的性能和可靠性
4. **配置监控（可选）：** 设置日志和告警

---

## 📚 详细文档

- **完整部署指南：** RENDER_DEPLOYMENT.md
- **MongoDB 配置：** MONGODB_ATLAS_SETUP.md
- **云存储配置：** CLOUDINARY_SETUP.md
- **故障排查：** DEPLOYMENT.md

---

## 🆘 遇到问题？

### 常见问题

**Q: 后端一直处于 "Building" 状态**
A: 构建可能需要 2-5 分钟，请耐心等待。查看日志了解详细进度。

**Q: API 返回 500 错误**
A: 检查环境变量配置，特别是 MONGODB_URI 和 JWT_SECRET

**Q: 前端无法连接后端**
A: 确认 VITE_API_URL 正确指向后端地址，检查 CORS 配置

**Q: 图片无法显示**
A: 免费版文件上传功能受限，需要配置云对象存储

**Q: 服务访问很慢**
A: 这是免费版的冷启动特性，升级到付费计划可解决

---

## 🎉 恭喜！

您的绘本岛应用已成功部署到公共网络！

现在可以通过以下地址访问：
- **前端：** https://picturebook-island.onrender.com
- **API：** https://picturebook-api.onrender.com/api/health

分享给朋友吧！📚✨