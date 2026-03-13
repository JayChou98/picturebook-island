🏝️ 绘本岛 - 亲子阅读网站

一个温馨、童趣的亲子阅读平台，帮助父母陪伴孩子快乐成长。

## 项目简介

绘本岛是一个现代化的亲子阅读网站，为家长和孩子提供丰富的绘本资源。平台支持在线阅读、个性化推荐、收藏管理等功能，致力于创造美好的亲子共读时光。

## 技术栈

### 后端
- Node.js + Express
- MongoDB + Mongoose
- JWT 认证
- Multer 文件上传

### 前端
- Vue 3 (Composition API)
- TypeScript
- Vite
- Vue Router
- Pinia (状态管理)
- Tailwind CSS
- Axios

## 功能特性

### 核心功能
- 🔐 用户注册/登录，JWT 认证
- 📚 绘本浏览与搜索
- 📖 在线阅读器，支持翻页动画
- ❤️ 收藏功能
- 🏠 个人书架与阅读历史
- 🎯 每日推荐与个性化推荐
- 👤 个人中心，资料管理

### 特色功能
- 🌙 夜间阅读模式
- 📱 响应式设计，完美适配移动端
- ⚡ 阅读进度自动保存
- 🎨 精美的 UI 设计，适合亲子使用
- 🔄 3D 翻页动画效果

## 项目结构

```
ai-project/
├── server/                 # 后端服务
│   ├── src/
│   │   ├── config/         # 配置文件
│   │   ├── controllers/    # 控制器
│   │   ├── middleware/     # 中间件
│   │   ├── models/         # 数据模型
│   │   ├── routes/         # 路由
│   │   ├── seed.js         # 数据种子脚本
│   │   └── server.js       # 入口文件
│   ├── package.json
│   └── .env
├── frontend/               # 前端应用
│   ├── src/
│   │   ├── components/     # 组件
│   │   ├── views/          # 页面
│   │   ├── stores/         # 状态管理
│   │   ├── types/          # TypeScript 类型
│   │   ├── utils/          # 工具函数
│   │   ├── router/         # 路由配置
│   │   ├── App.vue
│   │   └── main.ts
│   ├── package.json
│   ├── vite.config.ts
│   └── tailwind.config.js
└── README.md
```

## 快速开始

### 环境要求
- Node.js >= 16.0.0
- MongoDB >= 4.4
- npm 或 yarn

### 1. 安装依赖

后端：
```bash
cd server
npm install
```

前端：
```bash
cd frontend
npm install
```

### 2. 配置环境变量

在 `server` 目录下创建 `.env` 文件：

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/picturebook-island
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
NODE_ENV=development
```

### 3. 初始化数据库

```bash
cd server
npm run seed
```

这将创建测试账号：
- 邮箱：test@example.com
- 密码：password123

### 4. 启动服务

启动后端（端口 3000）：
```bash
cd server
npm run dev
```

启动前端（端口 5173）：
```bash
cd frontend
npm run dev
```

### 5. 访问应用

打开浏览器访问：http://localhost:5173

## 主要功能使用说明

### 用户认证
- 使用测试账号登录，或注册新账号
- 注册时需填写昵称、邮箱、密码和孩子年龄（0-3岁/3-6岁/6-9岁）

### 浏览绘本
- 支持按年龄、主题筛选
- 支持搜索绘本标题、作者
- 支持按最新/最热/最多喜欢排序

### 在线阅读
- 点击绘本卡片进入详情页
- 点击"开始阅读"进入阅读器
- 支持键盘左右键翻页
- 支持全屏模式和夜间模式
- 阅读进度自动保存

### 收藏管理
- 登录后可收藏喜欢的绘本
- 在"我的书架"查看收藏列表
- 支持继续阅读上次未读完的绘本

## 开发指南

### 后端开发

添加新的 API 接口：
1. 在 `src/models/` 创建数据模型
2. 在 `src/controllers/` 创建控制器
3. 在 `src/routes/` 添加路由
4. 在 `src/server.js` 注册路由

### 前端开发

添加新页面：
1. 在 `src/views/` 创建 Vue 组件
2. 在 `src/router/index.ts` 添加路由
3. 在 `src/components/NavBar.vue` 添加导航链接

添加新状态管理：
1. 在 `src/stores/` 创建 Pinia store
2. 在需要的组件中导入使用

## 部署说明

详细部署说明请参考 `DEPLOYMENT.md`

### 生产环境构建

后端：
```bash
cd server
npm install --production
```

前端：
```bash
cd frontend
npm run build
```

## 测试账号

```
邮箱：test@example.com
密码：password123
```

## 许可证

MIT

## 联系方式

如有问题或建议，请联系：
- 邮箱：contact@picturebook.island
- 电话：400-888-8888

---

**绘本岛** - 让阅读成为亲子之间最美好的陪伴 📚❤️