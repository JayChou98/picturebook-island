# 绘本岛 - 亲子阅读网站 产品需求文档

## 需求概述
构建一个温馨、童趣的亲子阅读网站"绘本岛"，为家长和孩子提供优质的在线绘本阅读体验，培养孩子的阅读兴趣。

## 技术架构

### 前端技术栈
- Vue 3.4 + TypeScript
- Vite 5.0（构建工具）
- Vue Router 4（路由）
- Pinia 2.1（状态管理）
- Tailwind CSS 3.4（样式框架）
- Axios（HTTP 请求）

### 后端技术栈
- Node.js 18+
- Express 4.18（Web 框架）
- MongoDB 6.0+（数据库）
- Mongoose 8.0（ODM）
- JWT（身份认证）
- Multer（文件上传）
- Bcrypt（密码加密）

## 品牌调性与设计风格

### 品牌调性
- 温馨：营造家庭亲子共读的温暖氛围
- 童趣：充满想象力和趣味性，符合儿童审美
- 色彩明亮：使用鲜艳活泼的色彩吸引儿童注意力

### 视觉风格
- 扁平化设计：简洁清晰，易于理解
- 卡通插画风：可爱的插画元素，富有童趣
- 圆角设计：所有按钮和卡片使用大圆角，更加柔和

### 配色方案
```css
/* 主色调 */
--primary-blue: #4A90E2;      /* 主蓝色 */
--primary-orange: #FF8C42;    /* 主橙色 */

/* 浅色调 */
--light-blue: #B8E0F4;        /* 浅蓝色 */
--light-orange: #FFB886;      /* 浅橙色 */
--light-yellow: #FFF4CC;      /* 浅黄色 */

/* 辅助色 */
--yellow: #FFD93D;            /* 黄色 */
--green: #6BCB77;             /* 绿色 */
--pink: #FF8B94;              /* 粉色 */

/* 中性色 */
--bg-primary: #FAFBFC;       /* 主背景 */
--bg-secondary: #FFFFFF;      /* 次级背景 */
--text-primary: #2C3E50;      /* 主文字 */
--text-secondary: #7F8C8D;     /* 次级文字 */
```

## 数据库设计

### 用户表（users）
```typescript
{
  _id: ObjectId,
  email: String (unique, required),
  password: String (required, hashed),
  nickname: String (required),
  childAge: String (enum: ['0-3', '3-6', '6-9']),
  avatar: String (URL),
  favorites: [ObjectId], // 收藏的绘本ID
  createdAt: Date,
  updatedAt: Date
}
```

### 绘本表（picturebooks）
```typescript
{
  _id: ObjectId,
  title: String (required),
  author: String (required),
  illustrator: String,
  description: String,
  coverImage: String (URL, required),
  ageRange: [String], // ['0-3', '3-6', '6-9']
  theme: [String], // ['动物', '自然', '成长', '科普', '情感']
  pages: [{
    pageNumber: Number,
    imageUrl: String,
    text: String
  }],
  views: Number,
  likes: Number,
  createdAt: Date,
  updatedAt: Date
}
```

### 分类表（categories）
```typescript
{
  _id: ObjectId,
  name: String (unique, required),
  type: String (enum: ['age', 'theme']),
  icon: String (URL),
  order: Number
}
```

### 收藏表（favorites）
```typescript
{
  _id: ObjectId,
  userId: ObjectId (required),
  picturebookId: ObjectId (required),
  createdAt: Date
}
```

## 核心功能模块

### 1. 用户注册/登录

**功能描述**：提供用户注册和登录功能，支持家长账号管理

**具体处理逻辑**：
- 注册功能：
  - 邮箱注册，密码强度验证
  - 昵称设置，孩子年龄段选择
  - 邮箱唯一性检查
  - 密码 bcrypt 加密存储
- 登录功能：
  - 邮箱 + 密码登录
  - JWT Token 生成和验证
  - 记住密码功能
  - 忘记密码（邮箱找回）
- 用户信息：
  - 登录状态保持
  - 个人信息展示和修改
  - 退出登录

**后端 API**：
```
POST   /api/auth/register     # 用户注册
POST   /api/auth/login        # 用户登录
POST   /api/auth/logout       # 用户退出
GET    /api/auth/me           # 获取当前用户信息
PUT    /api/auth/profile      # 更新用户信息
POST   /api/auth/forgot-password  # 忘记密码
```

**影响文件**：
- 后端：
  - src/server/models/User.js
  - src/server/routes/auth.js
  - src/server/controllers/authController.js
  - src/server/middleware/auth.js
- 前端：
  - frontend/src/types/user.ts
  - frontend/src/stores/auth.ts
  - frontend/src/views/LoginView.vue
  - frontend/src/views/RegisterView.vue
  - frontend/src/components/AuthForm.vue

---

### 2. 分类浏览绘本

**功能描述**：按年龄和主题分类浏览绘本，支持筛选和搜索

**具体处理逻辑**：
- 年龄分类：
  - 0-3岁（婴幼儿）
  - 3-6岁（学龄前）
  - 6-9岁（小学低年级）
- 主题分类：
  - 动物世界
  - 自然探索
  - 成长故事
  - 科普知识
  - 情感教育
  - 传统文化
  - 艺术启蒙
- 功能特性：
  - 多选筛选（年龄 + 主题）
  - 实时搜索（书名、作者）
  - 排序功能（最新、最热、收藏最多）
  - 分页加载
  - 瀑布流或网格布局展示

**后端 API**：
```
GET    /api/picturebooks          # 获取绘本列表（支持筛选、搜索、分页）
GET    /api/picturebooks/:id      # 获取绘本详情
GET    /api/categories/age        # 获取年龄分类
GET    /api/categories/theme      # 获取主题分类
```

**影响文件**：
- 后端：
  - src/server/models/PictureBook.js
  - src/server/models/Category.js
  - src/server/routes/picturebooks.js
  - src/server/controllers/picturebookController.js
- 前端：
  - frontend/src/types/picturebook.ts
  - frontend/src/views/ExploreView.vue
  - frontend/src/views/CategoryView.vue
  - frontend/src/components/PictureBookCard.vue
  - frontend/src/components/FilterPanel.vue

---

### 3. 在线阅读（支持翻页动画）

**功能描述**：提供沉浸式的在线阅读体验，支持翻页动画和交互

**具体处理逻辑**：
- 阅读器功能：
  - 全屏阅读模式
  - 左右翻页（点击或滑动）
  - 页码跳转
  - 自动翻页（可选）
- 翻页动画：
  - 3D 翻页效果（CSS transform）
  - 淡入淡出过渡
  - 可在设置中切换动画效果
- 阅读体验：
  - 大图展示
  - 文字放大/缩小
  - 夜间模式
  - 进度条显示
  - 阅读时长统计
- 交互功能：
  - 收藏当前绘本
  - 分享绘本
  - 查看绘本信息
  - 返回书架

**后端 API**：
```
GET    /api/picturebooks/:id/pages  # 获取绘本页面
PUT    /api/picturebooks/:id/views  # 增加阅读量
```

**影响文件**：
- 后端：
  - src/server/controllers/picturebookController.js（更新阅读量）
- 前端：
  - frontend/src/views/ReaderView.vue
  - frontend/src/components/PageViewer.vue
  - frontend/src/components/PageTurner.vue
  - frontend/src/stores/reader.ts

---

### 4. 收藏与分享

**功能描述**：支持收藏喜欢的绘本，分享给朋友

**具体处理逻辑**：
- 收藏功能：
  - 添加/取消收藏
  - 查看收藏列表
  - 收藏数量统计
  - 收藏同步（多端）
- 分享功能：
  - 生成分享链接
  - 复制链接到剪贴板
  - 社交媒体分享（微信、QQ）
  - 分享统计
- 我的书架：
  - 收藏的绘本展示
  - 阅读历史
  - 继续阅读

**后端 API**：
```
POST   /api/favorites                    # 添加收藏
DELETE /api/favorites/:picturebookId     # 取消收藏
GET    /api/favorites                    # 获取收藏列表
GET    /api/favorites/check/:picturebookId  # 检查是否已收藏
POST   /api/share/:picturebookId         # 生成分享链接
GET    /api/share/:shareCode             # 访问分享链接
```

**影响文件**：
- 后端：
  - src/server/models/Favorite.js
  - src/server/routes/favorites.js
  - src/server/controllers/favoriteController.js
- 前端：
  - frontend/src/stores/favorites.ts
  - frontend/src/views/BookshelfView.vue
  - frontend/src/components/ShareModal.vue
  - frontend/src/composables/useShare.ts

---

### 5. 每日推荐

**功能描述**：基于用户偏好和历史记录，每日推荐精选绘本

**具体处理逻辑**：
- 推荐算法：
  - 基于孩子年龄段推荐
  - 基于阅读历史推荐相似绘本
  - 编辑精选优质绘本
  - 随机推荐新绘本
- 展示方式：
  - 首页推荐区
  - 每日更新
  - 推荐理由说明
  - 快速阅读入口
- 个性化：
  - 根据收藏记录调整推荐
  - 记录推荐点击
  - 推荐准确度统计

**后端 API**：
```
GET    /api/recommendations/daily       # 获取每日推荐
GET    /api/recommendations/personalized # 获取个性化推荐
POST   /api/recommendations/click       # 记录推荐点击
```

**影响文件**：
- 后端：
  - src/server/controllers/recommendationController.js
  - src/server/routes/recommendations.js
- 前端：
  - frontend/src/views/HomeView.vue
  - frontend/src/components/DailyRecommendation.vue

---

## 项目结构

### 后端结构
```
server/
├── src/
│   ├── config/
│   │   ├── database.js       # MongoDB 配置
│   │   ├── jwt.js            # JWT 配置
│   │   └── multer.js         # 文件上传配置
│   ├── models/
│   │   ├── User.js
│   │   ├── PictureBook.js
│   │   ├── Category.js
│   │   └── Favorite.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── picturebooks.js
│   │   ├── favorites.js
│   │   └── recommendations.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── picturebookController.js
│   │   ├── favoriteController.js
│   │   └── recommendationController.js
│   ├── middleware/
│   │   ├── auth.js           # 认证中间件
│   │   ├── error.js          # 错误处理中间件
│   │   └── upload.js         # 文件上传中间件
│   ├── utils/
│   │   └── helper.js         # 工具函数
│   └── server.js             # 服务器入口
├── uploads/                   # 文件上传目录
├── .env                      # 环境变量
└── package.json
```

### 前端结构
```
frontend/
├── public/
│   └── favicon.ico
├── src/
│   ├── assets/
│   │   └── styles/
│   │       └── main.css      # 全局样式
│   ├── components/
│   │   ├── NavBar.vue        # 导航栏
│   │   ├── Footer.vue        # 页脚
│   │   ├── PictureBookCard.vue
│   │   ├── PageViewer.vue
│   │   ├── PageTurner.vue
│   │   ├── FilterPanel.vue
│   │   ├── AuthForm.vue
│   │   ├── ShareModal.vue
│   │   └── DailyRecommendation.vue
│   ├── composables/
│   │   ├── useAuth.ts
│   │   ├── useShare.ts
│   │   └── useLocalStorage.ts
│   ├── stores/
│   │   ├── auth.ts
│   │   ├── reader.ts
│   │   └── favorites.ts
│   ├── types/
│   │   ├── user.ts
│   │   ├── picturebook.ts
│   │   └── api.ts
│   ├── utils/
│   │   └── api.ts            # API 请求封装
│   ├── views/
│   │   ├── HomeView.vue      # 首页
│   │   ├── LoginView.vue
│   │   ├── RegisterView.vue
│   │   ├── ExploreView.vue  # 浏览绘本
│   │   ├── ReaderView.vue   # 阅读器
│   │   ├── BookshelfView.vue # 书架
│   │   └── ProfileView.vue  # 个人中心
│   ├── router/
│   │   └── index.ts
│   ├── App.vue
│   └── main.ts
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── tailwind.config.js
```

## 开发计划

### 阶段 1：后端基础架构
- 项目初始化和依赖安装
- MongoDB 连接配置
- 数据库模型定义
- JWT 认证系统
- 基础 API 路由

### 阶段 2：前端基础架构
- Vue 3 + Vite 项目搭建
- Tailwind CSS 配置
- 路由和状态管理配置
- API 请求封装
- 全局样式定义

### 阶段 3：用户系统
- 用户注册/登录功能
- 认证状态管理
- 个人信息管理
- 头像上传功能

### 阶段 4：绘本浏览
- 绘本列表展示
- 分类筛选功能
- 搜索功能
- 绘本详情页

### 阶段 5：阅读器开发
- 在线阅读器
- 翻页动画
- 阅读设置
- 阅读进度保存

### 阶段 6：收藏与分享
- 收藏功能
- 书架页面
- 分享功能
- 阅读历史

### 阶段 7：每日推荐
- 推荐算法实现
- 首页推荐展示
- 个性化推荐

### 阶段 8：优化与测试
- 性能优化
- 响应式适配
- 功能测试
- 部署上线

## 数据示例

### 初始绘本数据
准备 10-20 本精选绘本，包含：
- 封面图片
- 每页内容图片
- 文字描述
- 年龄和主题标签

### 初始分类数据
- 年龄分类：3 个
- 主题分类：7 个

## 安全与性能

### 安全措施
- 密码 bcrypt 加密
- JWT Token 认证
- SQL/NoSQL 注入防护
- XSS 攻击防护
- CSRF 防护
- 文件上传类型限制

### 性能优化
- 图片压缩和懒加载
- API 响应分页
- 缓存策略（Redis 可选）
- CDN 加速（生产环境）
- 前端代码分割

## 部署方案

### 开发环境
- 前端：Vite 开发服务器（端口 5173）
- 后端：Express 服务器（端口 3000）
- 数据库：本地 MongoDB（端口 27017）

### 生产环境
- 前端：Vercel / Netlify
- 后端：Render / Railway / Heroku
- 数据库：MongoDB Atlas
- 图片存储：Cloudinary / AWS S3

---

## 后续扩展方向

- 亲子互动功能（录音、绘画）
- 社区评论和评分
- 绘本创作工具
- 付费绘本系统
- 家长管理面板
- 阅读数据统计
- 多语言支持