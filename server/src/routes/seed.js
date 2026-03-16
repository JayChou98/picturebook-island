import express from 'express';
import connectDB from '../config/database.js';
import Category from '../models/Category.js';
import PictureBook from '../models/PictureBook.js';
import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Seed data route (requires authentication)
router.post('/', protect, async (req, res) => {
  try {
    // Check if data already exists
    const existingCategories = await Category.countDocuments();
    const existingBooks = await PictureBook.countDocuments();

    if (existingCategories > 0 || existingBooks > 0) {
      return res.json({
        success: true,
        message: 'Database already seeded',
        counts: {
          categories: existingCategories,
          picturebooks: existingBooks
        }
      });
    }

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
      { name: '艺术', type: 'theme', icon: '??', order: 7 }
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
      },
      {
        title: '四季的颜色',
        author: '赵敏',
        illustrator: '孙杰',
        description: '跟着小蝴蝶一起感受四季的变化和美丽的色彩。',
        coverImage: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=400',
        ageRange: ['0-3', '3-6'],
        theme: ['自然', '艺术'],
        isPublished: true,
        pages: [
          { pageNumber: 1, imageUrl: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=800', text: '春天来了，小蝴蝶飞到了绿色的草地上，到处都是嫩绿的新芽。' },
          { pageNumber: 2, imageUrl: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=800', text: '夏天到了，小蝴蝶飞到海边，海是蓝色的，天是蓝色的，一切都是蓝色的。' },
          { pageNumber: 3, imageUrl: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=800', text: '秋天来了，小蝴蝶飞到果园，苹果是红色的，梨子是黄色的，叶子是金色的。' },
          { pageNumber: 4, imageUrl: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=800', text: '冬天到了，小蝴蝶躲在温暖的地方，外面是白色的，世界变成了童话王国。' },
          { pageNumber: 5, imageUrl: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=800', text: '四季真美丽，每个季节都有自己的颜色，就像我们的生活丰富多彩。' }
        ]
      },
      {
        title: '小星星找朋友',
        author: '吴强',
        illustrator: '郑梅',
        description: '一颗小星星在天空中寻找朋友，最终找到了属于它的位置。',
        coverImage: 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=400',
        ageRange: ['0-3'],
        theme: ['自然', '情感'],
        isPublished: true,
        pages: [
          { pageNumber: 1, imageUrl: 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=800', text: '夜空中有一颗小星星，它很孤单，想找个朋友一起玩。' },
          { pageNumber: 2, imageUrl: 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=800', text: '小星星问月亮姐姐："月亮姐姐，你能和我做朋友吗？"' },
          { pageNumber: 3, imageUrl: 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=800', text: '月亮姐姐说："当然可以，你看，天空中还有很多星星呢。"' },
          { pageNumber: 4, imageUrl: 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=800', text: '小星星往四周一看，原来它有这么多同伴，大家一起在夜空中闪闪发光。' },
          { pageNumber: 5, imageUrl: 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=800', text: '小星星笑了，它再也不孤单了，因为它找到了属于自己的家。' }
        ]
      },
      {
        title: '神奇的种子',
        author: '王芳',
        illustrator: '李华',
        description: '小女孩种下一颗神奇的种子，每天给它浇水，看着它慢慢长大。',
        coverImage: 'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=400',
        ageRange: ['3-6'],
        theme: ['自然', '成长'],
        isPublished: true,
        pages: [
          { pageNumber: 1, imageUrl: 'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=800', text: '小女孩从爷爷那里得到一颗神奇的种子，种子很小，像一粒沙子。' },
          { pageNumber: 2, imageUrl: 'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=800', text: '小女孩把种子种在花盆里，每天给它浇水，给它唱歌。' },
          { pageNumber: 3, imageUrl: 'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=800', text: '过了几天，种子发芽了，小小的绿芽从土里钻了出来。' },
          { pageNumber: 4, imageUrl: 'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=800', text: '小女孩继续照顾它，小芽越长越高，长出了叶子，开出了花。' },
          { pageNumber: 5, imageUrl: 'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=800', text: '原来这是一朵会微笑的花，它对小女孩说："谢谢你，是你让我开花。"' }
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