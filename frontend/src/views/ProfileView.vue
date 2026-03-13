<template>
  <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
    <h1 class="text-3xl md:text-4xl font-bold mb-8 flex items-center">
      <span class="mr-2">👤</span>
      个人中心
    </h1>

    <!-- Profile Card -->
    <div class="bg-white rounded-3xl shadow-soft p-6 md:p-8 mb-8">
      <div class="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
        <!-- Avatar -->
        <div class="relative">
          <div class="w-24 h-24 rounded-full bg-primary-blue text-white flex items-center justify-center text-3xl font-bold">
            {{ authStore.user?.nickname?.charAt(0) || 'U' }}
          </div>
          <label class="absolute bottom-0 right-0 w-8 h-8 bg-primary-orange text-white rounded-full flex items-center justify-center cursor-pointer hover:bg-orange-500 transition-colors">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
            <input type="file" class="hidden" accept="image/*" @change="handleAvatarUpload" />
          </label>
        </div>

        <!-- User Info -->
        <div class="flex-1 text-center md:text-left">
          <h2 class="text-2xl font-bold text-gray-900 mb-2">
            {{ authStore.user?.nickname }}
          </h2>
          <p class="text-gray-500 mb-4">{{ authStore.user?.email }}</p>
          <div class="flex flex-wrap justify-center md:justify-start gap-2">
            <span class="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
              {{ authStore.user?.childAge }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Edit Profile Form -->
    <div class="bg-white rounded-3xl shadow-soft p-6 md:p-8 mb-8">
      <h3 class="text-xl font-bold text-gray-900 mb-6">编辑资料</h3>
      <form @submit.prevent="handleUpdateProfile" class="space-y-6">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">昵称</label>
          <input
            v-model="profileData.nickname"
            type="text"
            required
            class="input-field"
            placeholder="请输入昵称"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">孩子年龄</label>
          <select v-model="profileData.childAge" required class="input-field">
            <option value="0-3">0-3岁</option>
            <option value="3-6">3-6岁</option>
            <option value="6-9">6-9岁</option>
          </select>
        </div>

        <ErrorMessage v-if="authStore.error" :message="authStore.error" />

        <div class="flex space-x-4">
          <button
            type="button"
            @click="resetForm"
            class="flex-1 px-6 py-3 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors font-medium"
          >
            取消
          </button>
          <button
            type="submit"
            :disabled="authStore.loading"
            class="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ authStore.loading ? '保存中...' : '保存修改' }}
          </button>
        </div>
      </form>
    </div>

    <!-- Reading Statistics -->
    <div class="bg-white rounded-3xl shadow-soft p-6 md:p-8">
      <h3 class="text-xl font-bold text-gray-900 mb-6">阅读统计</h3>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div class="text-center p-4 bg-primary-light rounded-2xl">
          <div class="text-3xl font-bold text-primary-blue mb-1">
            {{ Object.keys(readerStore.readingProgress).length }}
          </div>
          <div class="text-sm text-gray-600">阅读书籍</div>
        </div>
        <div class="text-center p-4 bg-primary-light rounded-2xl">
          <div class="text-3xl font-bold text-primary-orange mb-1">
            {{ favoritesStore.favorites.length }}
          </div>
          <div class="text-sm text-gray-600">收藏书籍</div>
        </div>
        <div class="text-center p-4 bg-primary-light rounded-2xl">
          <div class="text-3xl font-bold text-warm-green mb-1">
            {{ totalPagesRead }}
          </div>
          <div class="text-sm text-gray-600">阅读页数</div>
        </div>
        <div class="text-center p-4 bg-primary-light rounded-2xl">
          <div class="text-3xl font-bold text-warm-pink mb-1">
            {{ streak }}
          </div>
          <div class="text-sm text-gray-600">连续阅读(天)</div>
        </div>
      </div>
    </div>

    <!-- Logout Button -->
    <div class="mt-8">
      <button
        @click="authStore.logout"
        class="w-full py-4 rounded-xl border-2 border-red-300 text-red-500 hover:bg-red-50 transition-colors font-medium"
      >
        退出登录
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useFavoritesStore } from '@/stores/favorites';
import { useReaderStore } from '@/stores/reader';
import ErrorMessage from '@/components/ErrorMessage.vue';

const authStore = useAuthStore();
const favoritesStore = useFavoritesStore();
const readerStore = useReaderStore();

const profileData = ref({
  nickname: authStore.user?.nickname || '',
  childAge: authStore.user?.childAge || '3-6'
});

const totalPagesRead = computed(() => {
  return Object.values(readerStore.readingProgress).reduce((sum, p) => sum + (p.currentPage + 1), 0);
});

const streak = computed(() => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const progressDates = Object.values(readerStore.readingProgress).map(p => 
    new Date(p.lastReadAt)
  ).sort((a, b) => b.getTime() - a.getTime());
  
  if (progressDates.length === 0) return 0;
  
  const latestDate = progressDates[0];
  latestDate.setHours(0, 0, 0, 0);
  
  const daysDiff = Math.floor((today.getTime() - latestDate.getTime()) / (1000 * 60 * 60 * 24));
  
  if (daysDiff > 1) return 0;
  
  let count = 1;
  for (let i = 1; i < progressDates.length; i++) {
    const prevDate = new Date(progressDates[i]);
    prevDate.setHours(0, 0, 0, 0);
    
    const currentCheck = new Date(progressDates[i - 1]);
    currentCheck.setHours(0, 0, 0, 0);
    
    const diff = Math.floor((currentCheck.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diff === 1) {
      count++;
    } else {
      break;
    }
  }
  
  return count;
});

const handleUpdateProfile = async () => {
  await authStore.updateProfile(profileData.value);
};

const resetForm = () => {
  profileData.value = {
    nickname: authStore.user?.nickname || '',
    childAge: authStore.user?.childAge || '3-6'
  };
};

const handleAvatarUpload = async (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  if (file) {
    try {
      const formData = new FormData();
      formData.append('avatar', file);
      const response = await authStore.api?.post('/auth/upload-avatar', formData);
      if (response?.data?.avatar) {
        await authStore.loadUser();
      }
    } catch (err) {
      console.error('Failed to upload avatar:', err);
    }
  }
};

onMounted(async () => {
  await favoritesStore.loadFavorites();
  await readerStore.loadProgress();
});
</script>