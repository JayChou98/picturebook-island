# Render 环境变量配置指南

## 📋 必需的环境变量

在 Render 的 `picturebook-api` 服务中，需要配置以下环境变量：

### 1. MONGODB_URI
**重要：必须配置！**

获取步骤：
1. 登录 [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. 点击 "Connect" → "Drivers"
3. 复制连接字符串，格式类似：
   ```
   mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/picturebook-island?retryWrites=true&w=majority
   ```

### 2. JWT_SECRET
**重要：必须配置！**

生成一个安全的密钥（至少 32 个字符）：
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

或者使用这个示例（生产环境请更换）：
```
your-super-secret-jwt-key-change-this-in-production-change-this-to-something-secure
```

### 3. NODE_ENV
设置为：`production`

### 4. PORT
设置为：`3000`（Render 会自动覆盖）

---

## 🔧 如何在 Render 上配置环境变量

### 方法 1：通过 Render Dashboard

1. 登录 [Render Dashboard](https://dashboard.render.com)
2. 找到 `picturebook-api` 服务
3. 点击服务进入详情页
4. 滚动到 "Environment Variables" 部分
5. 点击 "Add Environment Variable"
6. 添加以下变量：

   | Key | Value |
   |-----|-------|
   | `MONGODB_URI` | 你的 MongoDB Atlas 连接字符串 |
   | `JWT_SECRET` | 生成的安全密钥 |
   | `NODE_ENV` | `production` |

7. 点击 "Save Changes"
8. 点击 "Manual Deploy" → "Clear build cache & deploy"

### 方法 2：通过 render.yaml

如果您的 `.env` 文件中有真实的值，可以更新 `render.yaml`：

```yaml
services:
  - type: web
    name: picturebook-api
    env: node
    buildCommand: cd server && npm install
    startCommand: cd server && npm start
    envVars:
      - key: NODE_ENV
        value: production
      - key: MONGODB_URI
        sync: false  # 手动设置
      - key: JWT_SECRET
        sync: false  # 手动设置
```

**注意：** `sync: false` 表示需要手动在 Render Dashboard 中设置这些值。

---

## ⚠️ 常见问题

### 问题 1：部署失败 "Instance failed"
**原因：** 环境变量未配置或值不正确

**解决：**
1. 检查 Render Dashboard 中的环境变量
2. 确认 `MONGODB_URI` 格式正确
3. 确认 `JWT_SECRET` 已设置

### 问题 2：MongoDB 连接超时
**原因：** MongoDB Atlas 网络访问限制

**解决：**
1. 在 MongoDB Atlas 的 Network Access 中
2. 添加 IP 地址：`0.0.0.0/0`（允许所有IP访问）
3. 或者添加 Render 的 IP 地址范围

### 问题 3：Token 验证失败
**原因：** `JWT_SECRET` 未配置或不一致

**解决：**
1. 确保 `JWT_SECRET` 已设置
2. 如果更改了密钥，需要重新生成 token

---

## ✅ 配置检查清单

配置完成后，检查以下项：

- [ ] MONGODB_URI 已配置且格式正确
- [ ] JWT_SECRET 已配置且足够安全
- [ ] NODE_ENV 设置为 `production`
- [ ] MongoDB Atlas Network Access 允许所有 IP（0.0.0.0/0）
- [ ] 服务成功部署并运行
- [ ] 健康检查端点返回正常：`https://picturebook-api.onrender.com/api/health`

---

## 🧪 测试环境变量

配置完成后，可以通过健康检查端点验证：

```bash
curl https://picturebook-api.onrender.com/api/health
```

预期返回：
```json
{
  "success": true,
  "message": "Server is running",
  "mongodb": "connected",
  "environment": "production"
}
```

如果 `mongodb` 显示 `disconnected`，说明数据库连接有问题，检查 `MONGODB_URI` 配置。