# 绘本岛 - 部署指南

本文档提供绘本岛项目的完整部署指南。

## 部署架构

```
┌─────────────┐
│   Nginx     │ (反向代理 + 静态文件服务)
└──────┬──────┘
       │
       ├─────────────────┐
       │                 │
┌──────▼──────┐   ┌──────▼──────┐
│   前端构建   │   │   后端 API  │
│  (静态文件)  │   │  (Node.js)  │
└─────────────┘   └──────┬──────┘
                        │
                ┌───────▼───────┐
                │   MongoDB     │
                └───────────────┘
```

## 服务器要求

### 最低配置
- CPU: 1 核
- 内存: 1GB
- 硬盘: 20GB
- 系统: Ubuntu 20.04 LTS 或更高版本

### 推荐配置
- CPU: 2 核
- 内存: 2GB+
- 硬盘: 40GB+
- 系统: Ubuntu 22.04 LTS

## 部署步骤

### 1. 服务器准备

```bash
# 更新系统
sudo apt update && sudo apt upgrade -y

# 安装基础工具
sudo apt install -y git curl wget

# 安装 Node.js (使用 nvm)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.bashrc
nvm install 18
nvm use 18

# 安装 MongoDB
wget -qO - https://www.mongodb.org/static/pgp/server-7.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list
sudo apt update
sudo apt install -y mongodb-org

# 启动 MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod

# 安装 Nginx
sudo apt install -y nginx
sudo systemctl start nginx
sudo systemctl enable nginx

# 安装 PM2 (进程管理)
sudo npm install -g pm2
```

### 2. 部署后端

```bash
# 克隆代码
cd /var/www
git clone <your-repo-url> picturebook-island
cd picturebook-island/server

# 安装依赖
npm install --production

# 创建 .env 文件
cat > .env << EOF
PORT=3000
MONGODB_URI=mongodb://localhost:27017/picturebook-island
JWT_SECRET=CHANGE-THIS-TO-A-VERY-STRONG-SECRET-KEY
NODE_ENV=production
EOF

# 初始化数据库
npm run seed

# 使用 PM2 启动
pm2 start src/server.js --name picturebook-api
pm2 save
pm2 startup
```

### 3. 部署前端

```bash
cd /var/www/picturebook-island/frontend

# 安装依赖
npm install

# 修改 API 地址
# 编辑 vite.config.ts，将 target 改为生产服务器地址
# 或构建后直接代理到后端

# 构建生产版本
npm run build

# 使用 PM2 启动开发服务器（或使用 nginx 直接服务静态文件）
# 方式1: 使用 nginx（推荐）
sudo cp -r dist/* /var/www/html/
```

### 4. 配置 Nginx

创建 Nginx 配置文件：

```bash
sudo nano /etc/nginx/sites-available/picturebook-island
```

添加以下内容：

```nginx
# 后端 API
server {
    listen 80;
    server_name api.picturebook.island;  # 修改为你的域名

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}

# 前端应用
server {
    listen 80;
    server_name picturebook.island;  # 修改为你的域名

    root /var/www/html;
    index index.html;

    # Gzip 压缩
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/javascript application/json;

    # 静态资源缓存
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # SPA 路由处理
    location / {
        try_files $uri $uri/ /index.html;
    }

    # API 代理到后端
    location /api {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # 文件上传
    location /uploads {
        proxy_pass http://localhost:3000;
    }
}
```

启用配置：

```bash
sudo ln -s /etc/nginx/sites-available/picturebook-island /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 5. 配置 SSL (HTTPS)

使用 Let's Encrypt 免费证书：

```bash
# 安装 Certbot
sudo apt install -y certbot python3-certbot-nginx

# 获取证书（自动配置）
sudo certbot --nginx -d picturebook.island -d api.picturebook.island

# 自动续期
sudo certbot renew --dry-run
```

### 6. 配置防火墙

```bash
# 配置 UFW
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw enable
```

### 7. 配置 MongoDB 安全

```bash
# 编辑 MongoDB 配置
sudo nano /etc/mongod.conf

# 启用认证（取消注释并修改）
# security:
#   authorization: enabled

# 重启 MongoDB
sudo systemctl restart mongod

# 创建管理员用户
mongosh
> use admin
> db.createUser({
  user: "admin",
  pwd: "your-strong-password",
  roles: [ { role: "userAdminAnyDatabase", db: "admin" } ]
})
> exit

# 创建应用数据库用户
mongosh
> use picturebook-island
> db.createUser({
  user: "picturebook-user",
  pwd: "your-app-password",
  roles: [ { role: "readWrite", db: "picturebook-island" } ]
})
> exit

# 更新 .env 文件中的 MongoDB URI
# MONGODB_URI=mongodb://picturebook-user:your-app-password@localhost:27017/picturebook-island
```

## 监控与维护

### 查看日志

```bash
# PM2 日志
pm2 logs picturebook-api

# Nginx 日志
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log

# MongoDB 日志
sudo tail -f /var/log/mongodb/mongod.log
```

### 重启服务

```bash
# 重启后端
pm2 restart picturebook-api

# 重启 Nginx
sudo systemctl reload nginx

# 重启 MongoDB
sudo systemctl restart mongod
```

### 备份数据库

创建备份脚本：

```bash
#!/bin/bash
# backup.sh
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/var/backups/picturebook-island"
mkdir -p $BACKUP_DIR

mongodump --uri="mongodb://localhost:27017/picturebook-island" --out=$BACKUP_DIR/backup_$DATE

# 压缩备份
tar -czf $BACKUP_DIR/backup_$DATE.tar.gz -C $BACKUP_DIR backup_$DATE
rm -rf $BACKUP_DIR/backup_$DATE

# 删除 7 天前的备份
find $BACKUP_DIR -type f -name "*.tar.gz" -mtime +7 -delete

echo "Backup completed: backup_$DATE.tar.gz"
```

设置定时任务：

```bash
crontab -e

# 每天凌晨 2 点备份
0 2 * * * /path/to/backup.sh >> /var/log/backup.log 2>&1
```

## 性能优化

### 1. 启用 MongoDB 索引

```bash
mongosh picturebook-island
> db.picturebooks.createIndex({ title: "text", description: "text" })
> db.favorites.createIndex({ userId: 1, picturebookId: 1 })
```

### 2. 启用 Nginx 缓存

在 Nginx 配置中添加：

```nginx
proxy_cache_path /var/cache/nginx levels=1:2 keys_zone=picturebook_cache:10m max_size=1g inactive=60m;

location /api {
    proxy_cache picturebook_cache;
    proxy_cache_valid 200 5m;
    # ... 其他配置
}
```

### 3. 前端优化

- 启用代码分割
- 图片懒加载
- CDN 加速静态资源

## 故障排查

### 后端无法启动
```bash
# 检查端口占用
sudo netstat -tlnp | grep 3000

# 检查 MongoDB 连接
mongosh --eval "db.adminCommand('ping')"

# 查看 PM2 日志
pm2 logs
```

### 前端无法访问
```bash
# 检查 Nginx 状态
sudo systemctl status nginx

# 检查配置
sudo nginx -t

# 查看 Nginx 错误日志
sudo tail -f /var/log/nginx/error.log
```

### 数据库连接失败
```bash
# 检查 MongoDB 状态
sudo systemctl status mongod

# 查看 MongoDB 日志
sudo tail -f /var/log/mongodb/mongod.log

# 测试连接
mongosh mongodb://localhost:27017/picturebook-island
```

## 扩展部署

### 使用 Docker (可选)

创建 `docker-compose.yml`：

```yaml
version: '3.8'

services:
  mongodb:
    image: mongo:7.0
    container_name: picturebook-mongo
    ports:
      - "27017:27017"
    volumes:
      - mongodb-data:/data/db
    environment:
      MONGO_INITDB_ROOT_USERNAME: admin
      MONGO_INITDB_ROOT_PASSWORD: password123

  backend:
    build: ./server
    container_name: picturebook-api
    ports:
      - "3000:3000"
    depends_on:
      - mongodb
    environment:
      MONGODB_URI: mongodb://admin:password123@mongodb:27017/picturebook-island?authSource=admin
      JWT_SECRET: your-secret-key
      NODE_ENV: production

  frontend:
    build: ./frontend
    container_name: picturebook-web
    ports:
      - "80:80"
    depends_on:
      - backend

volumes:
  mongodb-data:
```

启动：
```bash
docker-compose up -d
```

## 安全建议

1. 定期更新系统和依赖
2. 使用强密码和密钥
3. 启用 HTTPS
4. 配置防火墙规则
5. 限制 API 访问频率
6. 定期备份数据
7. 监控异常访问
8. 使用 HTTPS 部署

## 联系支持

如有部署问题，请联系技术支持：
- 邮箱：tech@picturebook.island
- 文档：https://docs.picturebook.island

---

祝部署顺利！🚀