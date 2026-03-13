# 绘本岛云平台部署任务计划

- [ ] 任务 1：准备云平台账号和仓库
    - 1.1: 注册 Render.com 账号并连接 GitHub
    - 1.2: 注册 MongoDB Atlas 账号并创建免费集群
    - 1.3: 在 MongoDB Atlas 创建数据库用户和获取连接字符串
    - 1.4: 配置 MongoDB Atlas 网络访问权限（允许所有 IP 或 0.0.0.0/0）

- [ ] 任务 2：创建部署配置文件
    - 2.1: 在根目录创建 render.yaml 配置文件
    - 2.2: 创建 frontend/.env.production 文件
    - 2.3: 创建 server/.env.production 模板文件

- [ ] 任务 3：修改后端配置以适配云环境
    - 3.1: 修改 server.js 的 CORS 配置支持动态环境变量
    - 3.2: 确保服务器监听端口使用 process.env.PORT
    - 3.3: 添加健康检查接口（如有必要）

- [ ] 任务 4：修改前端配置以适配生产环境
    - 4.1: 修改 vite.config.ts 添加环境变量配置
    - 4.2: 确保 API 请求地址使用环境变量
    - 4.3: 检查所有静态资源路径是否正确

- [ ] 任务 5：配置 MongoDB Atlas 数据库
    - 5.1: 在 MongoDB Atlas 创建数据库连接字符串
    - 5.2: 配置网络访问白名单
    - 5.3: 创建数据库用户（读写权限）
    - 5.4: 测试数据库连接

- [ ] 任务 6：部署后端到 Render
    - 6.1: 在 Render 创建新的 Web Service
    - 6.2: 连接 GitHub 仓库的 server 目录
    - 6.3: 配置环境变量（MONGODB_URI, JWT_SECRET, NODE_ENV, CORS_ORIGIN）
    - 6.4: 配置构建命令和启动命令
    - 6.5: 等待部署完成并测试 API

- [ ] 任务 7：部署前端到 Render
    - 7.1: 在 Render 创建新的 Static Site
    - 7.2: 连接 GitHub 仓库的 frontend 目录
    - 7.3: 配置构建命令（npm run build）
    - 7.4: 配置环境变量（VITE_API_URL）
    - 7.5: 等待部署完成并测试前端访问

- [ ] 任务 8：集成云对象存储（解决文件上传问题）
    - 8.1: 注册 Cloudinary 账号并创建项目
    - 8.2: 安装 multer-cloudinary 依赖
    - 8.3: 创建云存储配置文件
    - 8.4: 修改 picturebookController.js 使用云存储上传
    - 8.5: 测试文件上传功能

- [ ] 任务 9：部署验证和功能测试
    - 9.1: 测试前端页面访问和加载
    - 9.2: 测试用户注册和登录功能
    - 9.3: 测试绘本浏览和阅读功能
    - 9.4: 测试收藏功能
    - 9.5: 测试文件上传功能（图片上传）
    - 9.6: 检查所有图片显示是否正常

- [ ] 任务 10：配置域名和 HTTPS（可选）
    - 10.1: 购买或使用已有域名
    - 10.2: 在 Render 配置自定义域名
    - 10.3: 配置 DNS 解析记录
    - 10.4: 验证 HTTPS 证书自动配置
    - 10.5: 测试自定义域名访问
