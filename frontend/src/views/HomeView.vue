<template>
  <div class="animate-fade-in">
    <!-- Hero Banner -->
    <div class="bg-gradient-to-br from-primary-blue via-purple-500 to-primary-orange py-16 px-4">
      <div class="max-w-7xl mx-auto text-center">
        <h1 class="text-4xl md:text-6xl font-bold text-white mb-4 animate-float">
          🏝️ 欢迎来到绘本岛
        </h1>
        <p class="text-xl text-white/90 mb-8">
          温馨、童趣的亲子阅读世界
        </p>
        <router-link
          to="/explore"
          class="inline-block bg-white text-primary-blue px-8 py-4 rounded-full font-bold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
        >
          开始探索 📚
        </router-link>
      </div>
    </div>

    <!-- Daily Recommendations -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h2 class="text-2xl md:text-3xl font-bold mb-8 flex items-center">
        <span class="mr-2">✨</span>
        每日推荐
      </h2>
      <div v-if="loading" class="flex justify-center py-12">
        <LoadingSpinner />
      </div>
      <div v-else-if="error" class="max-w-md mx-auto">
        <ErrorMessage :message="error" />
      </div>
      <div v-else class="grid grid-cols-2 md:grid-cols-4 gap-6">
        <PictureBookCard
          v-for="book in recommendations"
          :key="book._id"
          :book="book"
        />
      </div>
    </div>

    <!-- Age Categories -->
    <div class="bg-white py-12">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 class="text-2xl md:text-3xl font-bold mb-8 flex items-center">
          <span class="mr-2">👶</span>
          按年龄浏览
        </h2>
        <div class="grid grid-cols-3 gap-4 md:gap-6">
          <router-link
            v-for="category in ageCategories"
            :key="category._id"
            :to="`/explore?ageRange=${category.name}`"
            class="card p-6 text-center hover:scale-105 transition-transform duration-300"
          >
            <div class="text-4xl mb-3">{{ category.icon }}</div>
            <h3 class="font-bold text-gray-900">{{ category.name }}</h3>
          </router-link>
        </div>
      </div>
    </div>

    <!-- Popular Books -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h2 class="text-2xl md:text-3xl font-bold mb-8 flex items-center">
        <span class="mr-2">🔥</span>
        热门绘本
      </h2>
      <div v-if="loading" class="flex justify-center py-12">
        <LoadingSpinner />
      </div>
      <div v-else class="grid grid-cols-2 md:grid-cols-4 gap-6">
        <PictureBookCard
          v-for="book in popularBooks"
          :key="book._id"
          :book="book"
        />
      </div>
    </div>

    <!-- Call to Action -->
    <div class="bg-primary-orange py-12 px-4">
      <div class="max-w-4xl mx-auto text-center">
        <h2 class="text-2xl md:text-3xl font-bold text-white mb-4">
          加入我们的亲子阅读社区
        </h2>
        <p class="text-white/90 mb-6 text-lg">
          注册即可收藏喜欢的绘本，追踪阅读进度，获得个性化推荐
        </p>
        <router-link
          v-if="!authStore.isAuthenticated"
          to="/register"
          class="inline-block bg-white text-primary-orange px-8 py-4 rounded-full font-bold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
        >
          立即注册 🎉
        </router-link>
        <router-link
          v-else
          to="/explore"
          class="inline-block bg-white text-primary-orange px-8 py-4 rounded-full font-bold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
        >
          开始阅读 📖
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth';
import api from '@/utils/api';
import type { Category, PictureBookListItem } from '@/types';
import PictureBookCard from '@/components/PictureBookCard.vue';
import LoadingSpinner from '@/components/LoadingSpinner.vue';
import ErrorMessage from '@/components/ErrorMessage.vue';

const authStore = useAuthStore();

const recommendations = ref<PictureBookListItem[]>([]);
const popularBooks = ref<PictureBookListItem[]>([]);
const ageCategories = ref<Category[]>([]);
const loading = ref(true);
const error = ref<string | null>(null);

onMounted(async () => {
  try {
    // Load daily recommendations
    const recResponse = await api.get('/recommendations/daily');
    recommendations.value = recResponse.data.recommendations.slice(0, 4);

    // Load popular books
    const popularResponse = await api.get('/picturebooks?sort=views&limit=4');
    popularBooks.value = popularResponse.data.picturebooks;

    // Load age categories
    const catResponse = await api.get('/categories');
    ageCategories.value = catResponse.data.ageCategories || [];

    loading.value = false;
  } catch (err: any) {
    error.value = err.response?.data?.message || '加载数据失败';
    loading.value = false;
  }
});
</script>