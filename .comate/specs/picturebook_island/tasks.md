# 绘本岛 - 亲子阅读网站 开发任务计划

## 后端开发任务

- [x] 任务 1：初始化后端项目
    - 1.1: 创建 server 目录和基础结构
    - 1.2: 初始化 package.json，安装依赖（express, mongoose, jsonwebtoken, bcryptjs, multer, dotenv, cors）
    - 1.3: 创建 .env 配置文件（PORT, MONGODB_URI, JWT_SECRET）
    - 1.4: 创建 server.js 入口文件，配置 Express 服务器
    - 1.5: 配置 CORS 和 body-parser
    - 1.6: 配置 MongoDB 连接
    - 1.7: 测试服务器启动和数据库连接

- [x] 任务 2：创建数据库模型
    - 2.1: 创建 User 模型（id, email, password, nickname, childAge, avatar, favorites, timestamps）
    - 2.2: 创建 PictureBook 模型（id, title, author, description, coverImage, ageRange, theme, pages, views, likes, timestamps）
    - 2.3: 创建 Category 模型（id, name, type, icon, order）
    - 2.4: 创建 Favorite 模型（userId, picturebookId, timestamps）
    - 2.5: 为模型添加索引和验证规则

- [x] 任务 3：实现认证中间件和工具
    - 3.1: 创建 JWT 配置和生成/验证函数
    - 3.2: 创建认证中间件（auth.js），验证 Token
    - 3.3: 创建错误处理中间件（error.js）
    - 3.4: 创建文件上传配置（multer.js）
    - 5.5: 创建工具函数（helper.js）用于密码加密、格式化等

- [x] 任务 4：实现用户认证 API
    - 4.1: 创建 POST /api/auth/register - 用户注册
    - 4.2: 创建 POST /api/auth/login - 用户登录
    - 4.3: 创建 POST /api/auth/logout - 用户退出
    - 4.4: 创建 GET /api/auth/me - 获取当前用户信息
    - 4.5: 创建 PUT /api/auth/profile - 更新用户信息
    - 4.6: 创建 POST /api/auth/upload-avatar - 上传头像
    - 4.7: 测试所有认证接口

- [x] 任务 5：实现绘本 API
    - 5.1: 创建 GET /api/picturebooks - 获取绘本列表（支持筛选、搜索、分页）
    - 5.2: 创建 GET /api/picturebooks/:id - 获取绘本详情
    - 5.3: 创建 POST /api/picturebooks - 创建绘本（管理员）
    - 5.4: 创建 PUT /api/picturebooks/:id - 更新绘本（管理员）
    - 5.5: 创建 DELETE /api/picturebooks/:id - 删除绘本（管理员）
    - 5.6: 创建 PUT /api/picturebooks/:id/views - 增加阅读量
    - 5.7: 测试所有绘本接口

- [x] 任务 6：实现分类 API
    - 6.1: 创建 GET /api/categories/age - 获取年龄分类
    - 6.2: 创建 GET /api/categories/theme - 获取主题分类
    - 6.3: 创建 POST /api/categories - 创建分类（管理员）
    - 6.4: 初始化默认分类数据

- [x] 任务 7：实现收藏 API
    - 7.1: 创建 POST /api/favorites - 添加收藏
    - 7.2: 创建 DELETE /api/favorites/:picturebookId - 取消收藏
    - 7.3: 创建 GET /api/favorites - 获取收藏列表
    - 7.4: 创建 GET /api/favorites/check/:picturebookId - 检查是否已收藏
    - 7.5: 测试所有收藏接口

- [x] 任务 8：实现推荐 API
    - 8.1: 创建 GET /api/recommendations/daily - 获取每日推荐
    - 8.2: 创建 GET /api/recommendations/personalized - 获取个性化推荐
    - 8.3: 创建 POST /api/recommendations/click - 记录推荐点击
    - 8.4: 实现简单的推荐算法（基于年龄和阅读历史）

- [x] 任务 9：实现分享功能
    - 9.1: 创建 POST /api/share/:picturebookId - 生成分享链接
    - 9.2: 创建 GET /api/share/:shareCode - 访问分享链接
    - 9.3: 实现分享链接生成和验证逻辑

- [x] 任务 10：初始化示例数据
    - 10.1: 创建数据种子脚本（seed.js）
    - 10.2: 导入 10-20 本精选绘本数据
    - 10.3: 导入默认分类数据
    - 10.4: 创建测试用户账号
    - 10.5: 运行数据初始化脚本

## 前端开发任务

- [x] 任务 11：初始化前端项目
    - 11.1: 创建 frontend 目录，使用 Vite 创建 Vue 3 + TypeScript 项目
    - 11.2: 安装依赖（vue-router, pinia, axios, tailwindcss）
    - 11.3: 配置 Tailwind CSS（自定义主题颜色）
    - 11.4: 配置 TypeScript 路径别名 (@/)
    - 11.5: 创建基础目录结构（components, views, stores, types, utils, composables）

- [x] 任务 12：配置路由和状态管理
    - 12.1: 创建 router/index.ts，配置所有路由
    - 12.2: 创建 stores/auth.ts - 认证状态管理
    - 12.3: 创建 stores/reader.ts - 阅读器状态管理
    - 12.4: 创建 stores/favorites.ts - 收藏状态管理
    - 12.5: 创建 utils/api.ts - Axios 请求封装

- [x] 任务 13：创建基础 UI 组件
    - 13.1: 创建 NavBar.vue - 导航栏（含 Logo、导航链接、用户信息）
    - 13.2: 创建 Footer.vue - 页脚
    - 13.3: 创建 LoadingSpinner.vue - 加载动画
    - 13.4: 创建 ErrorMessage.vue - 错误提示
    - 13.5: 创建 ConfirmModal.vue - 确认弹窗

- [x] 任务 14：创建类型定义
    - 14.1: 创建 types/user.ts - 用户类型
    - 14.2: 创建 types/picturebook.ts - 绘本类型
    - 14.3: 创建 types/api.ts - API 响应类型
    - 14.4: 创建 types/common.ts - 通用类型

- [x] 任务 15：实现用户认证页面
    - 15.1: 创建 LoginView.vue - 登录页
    - 15.2: 创建 RegisterView.vue - 注册页
    - 15.3: 创建 AuthForm.vue - 认证表单组件
    - 15.4: 实现表单验证
    - 15.5: 集成认证状态管理
    - 15.6: 实现路由守卫（未登录跳转登录页）

- [x] 任务 16：实现首页
    - 16.1: 创建 HomeView.vue - 首页布局
    - 16.2: 创建 DailyRecommendation.vue - 每日推荐组件
    - 16.3: 实现热门绘本展示
    - 16.4: 实现分类入口
    - 16.5: 添加欢迎横幅

- [x] 任务 17：实现绘本浏览页面
    - 17.1: 创建 ExploreView.vue - 浏览页面
    - 17.2: 创建 PictureBookCard.vue - 绘本卡片组件
    - 17.3: 创建 FilterPanel.vue - 筛选面板（年龄、主题、排序）
    - 17.4: 实现绘本列表展示（网格布局）
    - 17.5: 实现分页加载
    - 17.6: 实现搜索功能

- [x] 任务 18：实现绘本详情页
    - 18.1: 创建 PictureBookDetailView.vue
    - 18.2: 展示绘本封面、标题、作者、描述
    - 18.3: 展示绘本页面预览
    - 18.4: 实现收藏按钮
    - 18.5: 实现分享按钮
    - 18.6: 添加开始阅读按钮

- [x] 任务 19：实现在线阅读器
    - 19.1: 创建 ReaderView.vue - 阅读器页面
    - 19.2: 创建 PageViewer.vue - 页面查看器
    - 19.3: 创建 PageTurner.vue - 翻页组件
    - 19.4: 实现 3D 翻页动画效果
    - 19.5: 实现点击翻页（左/右）
    - 19.6: 实现页码跳转
    - 19.7: 实现全屏模式
    - 19.8: 实现夜间模式
    - 19.9: 实现阅读进度保存

- [x] 任务 20：实现书架页面
    - 20.1: 创建 BookshelfView.vue - 书架页面
    - 20.2: 展示收藏的绘本
    - 20.3: 展示阅读历史
    - 20.4: 实现"继续阅读"功能
    - 20.5: 实现取消收藏功能

- [x] 任务 21：实现分享功能
    - 21.1: 创建 ShareModal.vue - 分享弹窗
    - 21.2: 实现生成分享链接
    - 21.3: 实现复制链接到剪贴板
    - 21.4: 实现社交媒体分享（微信、QQ）

- [x] 任务 22：实现个人中心
    - 22.1: 创建 ProfileView.vue - 个人中心
    - 22.2: 展示用户信息
    - 22.3: 实现修改个人信息
    - 22.4: 实现上传头像
    - 22.5: 展示阅读统计

- [x] 任务 23：实现响应式布局
    - 23.1: 适配移动端布局（< 768px）
    - 23.2: 适配平板端布局（768px - 1024px）
    - 23.3: 适配桌面端布局（> 1024px）
    - 23.4: 优化移动端导航
    - 23.5: 优化移动端阅读器

- [x] 任务 24：添加动画和交互
    - 24.1: 添加页面切换动画
    - 24.2: 添加卡片悬停效果
    - 24.3: 添加按钮点击反馈
    - 24.4: 优化翻页动画性能
    - 24.5: 添加加载动画

- [x] 任务 25：前后端联调和测试
    - 25.1: 测试用户注册/登录流程
    - 25.2: 测试绘本浏览和筛选
    - 25.3: 测试在线阅读功能
    - 25.4: 测试收藏和分享
    - 25.5: 测试每日推荐
    - 25.6: 测试响应式布局
    - 25.7: 修复发现的 bug
    - 25.8: 性能优化

- [x] 任务 26：项目构建和部署准备
    - 26.1: 后端项目构建测试
    - 26.2: 前端项目构建（npm run build）
    - 26.3: 生产环境配置
    - 26.4: 编写部署文档
