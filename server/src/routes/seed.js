import express from 'express';
import connectDB from '../config/database.js';
import Category from '../models/Category.js';
import PictureBook from '../models/PictureBook.js';
import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Seed data route (requires authentication for security)
router.post('/', protect, async (req, res) => {
  try {
    // Only allow admins (check for specific email)
    if (req.user.email !== 'test@example.com') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Clear existing data
    await Category.deleteMany();
    await PictureBook.deleteMany();
    await User.deleteMany({ email: { $ne: req.user.email } }); // Don't delete the current user

    // Age categories
    const ageCategories = [
      { name: '0-3岁', type: 'age', icon: '👶', order: 1 },
      { name: '3-6岁', type: 'age', icon: '🧒', order: 2 },
      { name: '6-9岁', type: 'age', icon: '👦', order: 3 }
    ];

    // Theme categories
    const themeCategories = [
      { name: '动物', type: 'theme', icon: '🐱', order: 1 },
      { name: '自然', type: 'theme', icon: '🌳', order: 2 },
      { name: '成长', type: 'theme', icon: '🌱', order: 3 },
      { name: '科普', type: 'theme', icon: '🔬', order: 4 },
      { name: '情感', type: 'theme', icon: '💝', order: 5 },
      { name: '传统文化', type: 'theme', icon: '🎎', order: 6 },
      { name: '艺术', type: 'theme', icon: '🎨', order: 7 }
    ];

    // Sample picturebooks with placeholder images
    const samplePictureBooks = [
      {
        title: '小兔子的冒险之旅',
        author: '李明',
        illustrator: '王芳',
        description: '一只勇敢的小兔子踏上寻找彩虹的冒险旅程，在旅途中结识了许多好朋友。',
        coverImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400',
        ageRange: ['3-6'],
        theme: ['动物', '成长'],
        isPublished: true,
        pages: [
          { pageNumber: 1, imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800', text: '从前，有一只可爱的小兔子，它住在森林深处的小木屋里。' },
          { pageNumber: 2, imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800', text: '一天，小兔子听说彩虹的尽头有宝藏，于是决定踏上冒险之旅。' },
          { pageNumber: 3, imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800', text: '在路上，它遇到了一只善良的小鸟，小鸟为它指明了方向。' },
          { pageNumber: 4, imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800', text: '小兔子继续前进，它帮助了一只受伤的小松鼠，小松鼠告诉它彩虹的传说。' },
          { pageNumber: 5, imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800', text: '终于，小兔子找到了彩虹的尽头，那里有最美丽的花园和最真挚的友谊。' }
        ]
      },
      {
        title: '云朵的秘密',
        author: '张伟',
        illustrator: '刘静',
        description: '小男孩好奇地看着天空中的云朵，每朵云都有一个有趣的故事。',
        coverImage: 'https://images.unsplash.com/photo-1534088568595-a066f410bcda?w=400',
        ageRange: ['0-3', '3-6'],
        theme: ['自然', '科普'],
        isPublished: true,
        pages: [
          { pageNumber: 1, imageUrl: 'https://images.unsplash.com/photo-1534088568595-a066f410bcda?w=800', text: '小明喜欢抬头看天空，天空中有许多奇妙的云朵。' },
          { pageNumber: 2, imageUrl: 'https://images.unsplash.com/photo-1534088568595-a066f410bcda?w=800', text: '有的云像小绵羊，软绵绵的，在空中慢慢飘动。' },
          { pageNumber: 3, imageUrl: 'https://images.unsplash.com/photo-1534088568595-a066f410bcda?w=800', text: '有的云像小汽车，好像在天空的公路上奔跑。' },
          { pageNumber: 4, imageUrl: 'https://images.unsplash.com/photo-1534088568595-a066f410bcda?w=800', text: '还有的云像大城堡，里面住着快乐的云朵精灵。' },
          { pageNumber: 5, imageUrl: 'https://images.unsplash.com/photo-1534088568595-a066f410bcda?w=800', text: '小明想，长大后我要飞上天空，和云朵一起做游戏。' }
        ]
      },
      {
        title: '勇敢的小熊',
        author: '陈华',
        illustrator: '周丽',
        description: '小熊克服恐惧，学会了游泳，明白了勇敢的重要性。',
        coverImage: 'https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?w=400',
        ageRange: ['3-6', '6-9'],
        theme: ['动物', '成长'],
        isPublished: true,
        pages: [
          { pageNumber: 1, imageUrl: 'https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?w=800', text: '小熊胆子很小，最怕水，连小溪边都不敢靠近。' },
          { pageNumber: 2, imageUrl: 'https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?w=800', text: '夏天来了，朋友们都去河里游泳，小熊只能一个人在岸边看着。' },
          { pageNumber: 3, imageUrl: 'https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?w=800', text: '妈妈告诉小熊："勇敢不是不害怕，而是害怕也要试着去做。"' },
          { pageNumber: 4, imageUrl: 'https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?w=800', text: '小熊鼓起勇气，小心翼翼地走进水里，原来水一点也不可怕。' },
          { pageNumber: 5, imageUrl: 'https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?w=800', text: '小熊学会了游泳，和朋友们在水中快乐地玩耍，它明白了什么是真正的勇敢。' }
        ]
      }
    ];

    // Import categories
    await Category.insertMany([...ageCategories, ...themeCategories]);
    console.log('Categories imported!');

    // Import picturebooks
    await PictureBook.insertMany(samplePictureBooks);
    console.log('Picture books imported!');

    res.json({
      success: true,
      message: 'Database seeded successfully',
      counts: {
        categories: ageCategories.length + themeCategories.length,
        picturebooks: samplePictureBooks.length
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;