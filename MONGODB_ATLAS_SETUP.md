# MongoDB Atlas 配置指南

本指南将帮助您配置 MongoDB Atlas 免费版数据库。

## 步骤 1: 注册并创建账户

1. 访问 https://www.mongodb.com/cloud/atlas/register
2. 注册免费账户
3. 验证邮箱

## 步骤 2: 创建集群

1. 登录后，点击 "Build a Database"
2. 选择 "Free" 分层（M0 Sandbox）
3. 选择云服务商：
   - 推荐选择 "AWS" 或 "Google Cloud"
   - 选择离用户最近的区域（如：新加坡）
4. 设置集群名称（默认即可）或自定义如 `picturebook-island`
5. 点击 "Create Deployment"

## 步骤 3: 配置网络安全

### 3.1 创建数据库用户

1. 在 "Security" 部分，点击 "Create a database user"
2. 填写用户信息：
   - Username: `picturebook-admin`（或自定义）
   - Password: 设置强密码（至少 8 位，包含大小写字母、数字和特殊字符）
   - **重要：保存此密码，稍后需要使用！**
3. 选择 "Built-in Role" 为 `Read and write to any database`
4. 点击 "Create Database User"

### 3.2 配置 IP 访问列表

1. 在 "Security" 部分，找到 "Network Access"
2. 点击 "Add IP Address"
3. 选择 "Allow Access from Anywhere"（选项 0.0.0.0/0）
   - 这样可以确保从任何地方连接数据库
   - 生产环境中建议使用特定 IP 或 VPC
4. 点击 "Confirm"

## 步骤 4: 获取连接字符串

1. 集群创建完成后，点击 "Connect"
2. 选择 "Connect your application"
3. 选择 Node.js 版本和驱动版本
4. 复制连接字符串，格式如下：
   ```
   mongodb+srv://picturebook-admin:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority&appName=cluster0
   ```
5. **重要：**
   - 将 `<password>` 替换为您创建的实际密码
   - 在数据库名称后添加数据库名：`/picturebook-island`
   - 最终格式：
     ```
     mongodb+srv://picturebook-admin:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/picturebook-island?retryWrites=true&w=majority&appName=cluster0
     ```

## 步骤 5: 在 Render 配置环境变量

将获取的连接字符串配置到 Render 后端服务的环境变量中：

**环境变量名称:** `MONGODB_URI`
**环境变量值:** 
```
mongodb+srv://picturebook-admin:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/picturebook-island?retryWrites=true&w=majority&appName=cluster0
```

## 步骤 6: 测试连接

1. 使用 MongoDB Compass 或 mongosh 测试连接
2. 确认可以连接到数据库

## 免费版限制

- 存储：512MB
- 共享 RAM（不保证）
- 无自动备份（付费功能）
- 集群最多 3 个
- 可选择区域有限

## 安全提示

1. ⚠️ 永远不要将包含密码的连接字符串提交到版本控制系统
2. ⚠️ 使用强密码
3. ⚠️ 定期更新密码
4. ⚠️ 在生产环境中考虑使用特定 IP 白名单而非 0.0.0.0/0

## 故障排查

### 连接超时
- 检查 IP 白名单配置
- 确认防火墙设置
- 检查网络连接

### 认证失败
- 验证用户名和密码
- 确认用户权限设置正确
- 检查连接字符串格式

### 数据库不存在
- 连接字符串中的数据库名称会自动创建
- 如需指定现有数据库，确保名称正确