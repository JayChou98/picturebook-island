# Render 部署指南

本指南详细说明如何将绘本岛项目部署到 Render 平台。

## 前置准备

1. GitHub 账号（存放代码）
2. Render 账号（免费注册）
3. MongoDB Atlas 集群（参考 MONGODB_ATLAS_SETUP.md）

## 步骤 1: 准备代码仓库

### 1.1 创建 GitHub 仓库

1. 访问 https://github.com/new
2. 创建新仓库，命名为 `picturebook-island`
3. 选择 Public 或 Private（Private 需要配置 GitHub 集成）
4. 不要初始化 README、.gitignore 或 LICENSE

### 1.2 推送代码到 GitHub

```bash
# 在项目根目录执行
git init
git add .
git commit -m "Initial commit: PictureBook Island project"

# 关联远程仓库
git remote add origin https://github.com/YOUR_USERNAME/picturebook-island.git

# 推送代码
git branch -M main
git push -u origin main
```

## 步骤 2: 部署后端服务

### 2.1 创建新的 Web Service

1. 登录 https://dashboard.render.com
2. 点击 "New +" 按钮，选择 "Web Service"
3. 连接 GitHub 仓库：
   - 选择 "picturebook-island" 仓库
   - 点击 "Connect"
   - Render 会请求访问权限，点击 "Authorize"

### 2.2 配置后端服务

**基本信息：**
- **Name:** `picturebook-api`
- **Region:** 选择离用户最近的区域（推荐：Singapore Southeast Asia）
- **Branch:** `main`

**构建配置：**
- **Runtime:** `Node`
- **Build Command:** `cd server && npm install`
- **Start Command:** `cd server && npm start`

**实例类型：**
- **Instance Type:** `Free`
  - CPU: 0.1 vCPU
  - RAM: 512MB
  - 15分钟无访问自动休眠
  - 冷启动：30-60秒

**高级配置：**
- **Working Directory:** `server`（重要！）

### 2.3 配置环境变量

在 "Environment Variables" 部分添加以下变量：

| 变量名 | 值 | 说明 |
|--------|-----|------|
| `NODE_ENV` | `production` | 运行环境 |
| `PORT` | `3000` | 服务端口 |
| `MONGODB_URI` | `mongodb+srv://...` | MongoDB 连接字符串（从 Atlas 获取）|
| `JWT_SECRET` | 生成随机字符串 | JWT 签名密钥 |
| `CORS_ORIGIN` | `https://picturebook-island.onrender.com` | 前端地址 |

**生成 JWT_SECRET:**
```bash
# 使用 Node.js 生成
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 2.4 部署

1. 检查所有配置
2. 点击 "Create Web Service"
3. 等待构建完成（首次部署可能需要 2-5 分钟）
4. 查看日志确认部署成功

### 2.5 验证后端部署

部署完成后，Render 会分配一个 URL：
- 格式：`https://picturebook-api.onrender.com`

测试健康检查：
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

## 步骤 3: 部署前端静态站点

### 3.1 创建新的 Static Site

1. 在 Render 仪表板，点击 "New +"
2. 选择 "Static Site"

### 3.2 配置前端站点

**基本信息：**
- **Name:** `picturebook-web`
- **Region:** 与后端相同

**构建配置：**
- **Build Command:** `cd frontend && npm install && npm run build`
- **Publish Directory:** `frontend/dist`

**环境变量：**
| 变量名 | 值 |
|--------|-----|
| `VITE_API_URL` | `https://picturebook-api.onrender.com` |

### 3.3 部署前端

1. 点击 "Create Static Site"
2. 等待构建完成（约 1-2 分钟）
3. 前端将部署到：`https://picturebook-island.onrender.com`

## 步骤 4: 验证完整部署

### 4.1 测试前端访问

访问：https://picturebook-island.onrender.com

应该看到：
- 首页正常加载
- 可以浏览绘本
- 可以注册/登录用户

### 4.2 测试 API 连接

打开浏览器开发者工具（F12）> Network 标签
- 查看是否有 API 请求失败
- 检查 CORS 错误

### 4.3 测试关键功能

1. ✅ 用户注册和登录
2. ✅ 浏览绘本列表
3. ✅ 查看绘本详情
4. ✅ 阅读绘本
5. ✅ 收藏功能
6. ❓ 文件上传（需要额外配置云存储）

## 步骤 5: 配置自动部署

Render 支持自动部署：
- 当你推送代码到 GitHub main 分支时，Render 自动检测并重新部署
- 可以在服务设置中配置分支和部署钩子

## 步骤 6: 监控和日志

### 查看日志

1. 进入服务页面
2. 点击 "Logs" 标签
3. 实时查看应用日志

### 常见问题日志

**端口占用：**
```
Error: listen EADDRINUSE: address already in use :::3000
```
解决：Render 使用 `$PORT` 环境变量，确保代码使用 `process.env.PORT`

**数据库连接失败：**
```
MongoServerSelectionError: connect ETIMEDOUT
```
解决：检查 MongoDB Atlas IP 白名单和网络配置

**CORS 错误：**
```
Access to XMLHttpRequest at '...' from origin '...' has been blocked by CORS policy
```
解决：检查后端 `CORS_ORIGIN` 环境变量配置

## 步骤 7: 域名配置（可选）

### 绑定自定义域名

1. 在服务设置中，点击 "Domains"
2. 点击 "Add domain"
3. 输入域名，如 `picturebook.island`
4. Render 会提供 DNS 记录

### 配置 DNS

在域名注册商处添加：
```
类型: CNAME
名称: @ 或 www
值: picturebook-island.onrender.com
TTL: 3600 或默认
```

### HTTPS 证书

Render 自动为自定义域名提供 HTTPS 证书（Let's Encrypt），无需手动配置。

## 性能优化

### 减少冷启动时间

- 升级到付费实例（Standard $7/月起）
- 使用 Render Cron Jobs 定期访问保持活跃

### 配置缓存

在 Vite 配置中启用生产模式优化：
```typescript
// vite.config.ts
export default defineConfig({
  build: {
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor': ['vue', 'vue-router', 'pinia']
        }
      }
    }
  }
})
```

## 成本估算

### 免费方案
- 后端：$0/月（有限制）
- 前端：$0/月（100GB 带宽）
- 数据库：$0/月（MongoDB Atlas 512MB）

### 付费方案（生产推荐）
- 后端：$7/月（Standard 1X，无休眠）
- 前端：$0/月（通常足够）
- 数据库：$9/月（MongoDB Atlas M10，2GB）
- **总计：~$16/月**

## 故障排查

### 部署失败

1. 查看构建日志
2. 检查 package.json 脚本
3. 确认 Node.js 版本兼容性

### 应用无法访问

1. 检查服务状态（Running / Stopped）
2. 查看实时日志
3. 测试健康检查端点

### 数据库连接问题

1. 验证 MongoDB 连接字符串
2. 检查 IP 白名单
3. 确认数据库用户权限

## 升级到生产环境

当免费版不足以满足需求时：

1. 升级到付费实例（更快的启动时间，更多资源）
2. 启用自动备份（MongoDB Atlas M10+）
3. 配置监控和告警
4. 使用 CDN 加速静态资源
5. 配置负载均衡（高流量场景）

## 参考链接

- Render 文档：https://render.com/docs
- MongoDB Atlas 文档：https://www.mongodb.com/docs/atlas/
- Vite 生产构建：https://vitejs.dev/guide/build.html

祝部署顺利！🚀