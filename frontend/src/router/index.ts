import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: () => import('@/views/HomeView.vue'),
      meta: { title: '首页' }
    },
    {
      path: '/explore',
      name: 'Explore',
      component: () => import('@/views/ExploreView.vue'),
      meta: { title: '浏览绘本' }
    },
    {
      path: '/upload',
      name: 'Upload',
      component: () => import('@/views/UploadPictureBookView.vue'),
      meta: { title: '上传绘本', requiresAuth: true }
    },
    {
      path: '/book/:id',
      name: 'BookDetail',
      component: () => import('@/views/PictureBookDetailView.vue'),
      meta: { title: '绘本详情' }
    },
    {
      path: '/read/:id',
      name: 'Reader',
      component: () => import('@/views/ReaderView.vue'),
      meta: { title: '阅读绘本' }
    },
    {
      path: '/bookshelf',
      name: 'Bookshelf',
      component: () => import('@/views/BookshelfView.vue'),
      meta: { title: '我的书架', requiresAuth: true }
    },
    {
      path: '/profile',
      name: 'Profile',
      component: () => import('@/views/ProfileView.vue'),
      meta: { title: '个人中心', requiresAuth: true }
    },
    {
      path: '/login',
      name: 'Login',
      component: () => import('@/views/LoginView.vue'),
      meta: { title: '登录' }
    },
    {
      path: '/register',
      name: 'Register',
      component: () => import('@/views/RegisterView.vue'),
      meta: { title: '注册' }
    }
  ]
});

// Navigation guards
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  
  // Update page title
  document.title = `${to.meta.title} - 绘本岛`;

  // Check if route requires authentication
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/login');
  } else {
    next();
  }
});

export default router;