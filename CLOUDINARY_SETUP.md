# Cloudinary 云存储配置指南

本指南说明如何配置 Cloudinary 来解决 Render 免费版的文件存储问题。

## 📋 为什么需要云存储？

Render 免费版不支持持久化文件存储：
- 上传的文件会在服务重启后丢失
- 不适合生产环境

**解决方案：** 使用 Cloudinary 免费版存储图片

## 🚀 Cloudinary 免费版特性

- **存储空间：** 25GB
- **每月带宽：** 25GB
- **每月转换：** 25GB
- **完全免费：** 适合中小型应用
- **自动 CDN：** 全球加速

## 步骤 1: 注册 Cloudinary

1. 访问 https://cloudinary.com/users/register/free
2. 注册免费账户
3. 验证邮箱

## 步骤 2: 创建项目

1. 登录后，Cloudinary 会自动创建一个 Cloud
2. 记录以下信息（在 Dashboard 中）：
   - **Cloud Name:** 例如 `your-cloud-name`
   - **API Key:** 例如 `123456789012345`
   - **API Secret:** 例如 `abc123def456...` （请妥善保存）

## 步骤 3: 安装依赖

在项目根目录安装 Cloudinary SDK：

```bash
cd server
npm install cloudinary multer-storage-cloudinary
```

## 步骤 4: 配置 Cloudinary

创建 `server/config/cloudinary.js`：

```javascript
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

export default cloudinary;
```

## 步骤 5: 更新 Multer 配置

修改 `server/config/multer.js`：

```javascript
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

// 配置 Cloudinary 存储
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'picturebook-island',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
    public_id: (req, file) => {
      return `${Date.now()}-${file.originalname}`;
    }
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(file.mimetype);
    const extname2 = allowedTypes.test(file.originalname.toLowerCase());
    
    if (extname && extname2) {
      cb(null, true);
    } else {
      cb(new Error('只支持图片格式！'));
    }
  }
});

export default upload;
```

## 步骤 6: 更新控制器

修改 `server/src/controllers/picturebookController.js` 中使用 Cloudinary URL 的部分：

```javascript
export const createPictureBook = async (req, res) => {
  try {
    const { title, author, illustrator, description, ageRange, theme } = req.body;
    
    // 验证封面图片
    if (!req.files || !req.files['coverImage'] || !req.files['coverImage'][0]) {
      return res.status(400).json({ message: '封面图片是必需的' });
    }

    // Cloudinary 返回的 URL
    const coverImageUrl = req.files['coverImage'][0].path;
    const pageImages = req.files['pages'] || [];
    
    // 解析页面数据
    let pagesData = [];
    if (typeof req.body.pages === 'string') {
      try {
        pagesData = JSON.parse(req.body.pages);
      } catch (e) {
        return res.status(400).json({ message: '页面数据格式错误' });
      }
    } else if (Array.isArray(req.body.pages)) {
      pagesData = req.body.pages;
    }

    // 创建绘本
    const picturebook = await PictureBook.create({
      title,
      author,
      illustrator,
      description,
      ageRange: [ageRange],
      theme: [theme],
      coverImage: coverImageUrl,
      pages: pagesData.map((page, index) => ({
        pageNumber: index + 1,
        imageUrl: pageImages[index] ? pageImages[index].path : page.imageUrl,
        text: page.text
      }))
    });

    res.status(201).json({
      success: true,
      picturebook
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
```

## 步骤 7: 在 Render 配置环境变量

在 Render 后端服务添加以下环境变量：

| 变量名 | 值 | 来源 |
|--------|-----|------|
| `CLOUDINARY_CLOUD_NAME` | `your-cloud-name` | Cloudinary Dashboard |
| `CLOUDINARY_API_KEY` | `123456789012345` | Cloudinary Dashboard |
| `CLOUDINARY_API_SECRET` | `abc123def456...` | Cloudinary Dashboard |

## 步骤 8: 测试部署

### 8.1 重新部署后端

1. 在 Render 仪表板，找到 `picturebook-api` 服务
2. 点击 "Manual Deploy" → 选择 "Clear build cache & deploy"
3. 等待重新部署完成

### 8.2 测试文件上传

1. 访问 https://picturebook-island.onrender.com
2. 登录账号
3. 点击"上传绘本"
4. 上传封面图片和页面图片
5. 提交后检查图片是否正常显示

### 8.3 验证 Cloudinary 存储

1. 登录 Cloudinary 控制台
2. 查看 "Media Library"
3. 应该能看到上传的图片（在 `picturebook-island` 文件夹中）

## 🎯 图片优化

Cloudinary 自动提供优化功能：

### 自动格式和转换
```javascript
// 在 URL 中添加转换参数
const optimizedUrl = cloudinary.url('public_id', {
  fetch_format: 'auto',
  quality: 'auto'
});

// 示例：https://res.cloudinary.com/your-cloud/image/upload/f_auto,q_auto/picturebook-island/image.jpg
```

### 图片裁剪和缩放
```javascript
const resizedUrl = cloudinary.url('public_id', {
  width: 400,
  height: 600,
  crop: 'fill'
});
```

### 图片压缩
```javascript
const compressedUrl = cloudinary.url('public_id', {
  quality: 60,
  fetch_format: 'jpg'
});
```

## 📊 费用说明

### Cloudinary 免费版
- 存储：25GB
- 带宽：25GB/月
- 转换：25GB/月
- **费用：** $0/月

### 何时升级付费版
- 存储空间接近 25GB
- 每月带宽超过 25GB
- 需要更多高级功能（如 AI 裁剪、智能缩放等）

付费版起价：$89/月（适合商业应用）

## 🔒 安全建议

1. **保护 API Secret：**
   - 不要将 CLOUDINARY_API_SECRET 提交到 Git
   - 使用环境变量存储
   - 定期轮换密钥

2. **限制上传类型：**
   - 在 Multer 配置中限制文件类型
   - 验证文件大小

3. **启用安全设置：**
   - 在 Cloudinary 控制台启用 "Auto-format" 和 "Auto-quality"
   - 配置 CDN 缓存策略

## 🐛 故障排查

### 上传失败

**问题：** `Invalid cloud name`
**解决：** 检查 CLOUDINARY_CLOUD_NAME 环境变量

**问题：** `Unauthorized`
**解决：** 验证 API Key 和 API Secret 是否正确

**问题：** `File too large`
**解决：** 在 Multer 配置中增加 fileSize 限制

### 图片无法显示

**问题：** 图片 URL 返回 403
**解决：** 检查 Cloudinary 的访问设置（应为 Public）

**问题：** 图片加载慢
**解决：** 检查 Cloudinary CDN 配置，确保启用了自动优化

## ?? 参考资源

- Cloudinary 官方文档：https://cloudinary.com/documentation/node_integration
- Multer-Storage-Cloudinary：https://github.com/cloudinary/multer-storage-cloudinary
- Cloudinary Node.js SDK：https://github.com/cloudinary/cloudinary_npm

## ✅ 完成检查

- [ ] 注册 Cloudinary 账号
- [ ] 获取 API 凭证
- [ ] 安装依赖包
- [ ] 配置 Cloudinary
- [ ] 更新 Multer 配置
- [ ] 更新控制器
- [ ] 在 Render 添加环境变量
- [ ] 重新部署后端
- [ ] 测试文件上传功能
- [ ] 验证图片显示

---

恭喜！文件上传功能现已完全可用！🎉