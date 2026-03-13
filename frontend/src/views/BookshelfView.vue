<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
    <h1 class="text-3xl md:text-4xl font-bold mb-8 flex items-center">
      <span class="mr-2">📖</span>
      我的书架
    </h1>

    <!-- Tabs -->
    <div class="flex space-x-4 mb-8">
      <button
        @click="activeTab = 'favorites'"
        :class="[
          'px-6 py-2 rounded-full font-medium transition-colors',
          activeTab === 'favorites'
            ? 'bg-primary-blue text-white'
            : 'bg-white text-gray-600 hover:bg-gray-100'
        ]"
      >
        我的收藏
      </button>
      <button
        @click="activeTab = 'history'"
        :class="[
          'px-6 py-2 rounded-full font-medium transition-colors',
          activeTab === 'history'
            ? 'bg-primary-blue text-white'
            : 'bg-white text-gray-600 hover:bg-gray-100'
        ]"
      >
        阅读历史
      </button>
    </div>

    <!-- Favorites Tab -->
    <div v-if="activeTab === 'favorites'">
      <div v-if="loading" class="flex justify-center py-12">
        <LoadingSpinner />
      </div>
      <div v-else-if="favoritesStore.favorites.length === 0" class="text-center py-16">
        <div class="text-6xl mb-4">📭</div>
        <p class="text-gray-500 mb-6">还没有收藏任何绘本</p>
        <router-link to="/explore" class="btn-primary">
          去发现
        </router-link>
      </div>
      <div v-else class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <div
          v-for="book in favoritesStore.favorites"
          :key="book._id"
          class="relative group"
        >
          <PictureBookCard :book="book" />
          <button
            @click="removeFavorite(book._id)"
            class="absolute top-2 right-2 w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50"
          >
            <svg class="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Reading History Tab -->
    <div v-if="activeTab === 'history'">
      <div v-if="Object.keys(readerStore.readingProgress).length === 0" class="text-center py-16">
        <div class="text-6xl mb-4">📚</div>
        <p class="text-gray-500 mb-6">还没有阅读记录</p>
        <router-link to="/explore" class="btn-primary">
          开始阅读
        </router-link>
      </div>
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="progress in sortedProgress"
          :key="progress.picturebookId"
          class="card p-4 hover:shadow-hover transition-shadow cursor-pointer"
          @click="continueReading(progress)"
        >
          <div class="aspect-[3/4] rounded-xl overflow-hidden mb-4">
            <img
              v-if="progress.bookCover"
              :src="progress.bookCover"
              :alt="progress.bookTitle"
              class="w-full h-full object-cover"
            />
            <div v-else class="w-full h-full bg-gradient-to-br from-primary-blue to-purple-500 flex items-center justify-center">
              <span class="text-6xl">📖</span>
            </div>
          </div>
          <h3 class="font-bold text-gray-900 mb-2 truncate">{{ progress.bookTitle }}</h3>
          <div class="flex items-center justify-between text-sm text-gray-500 mb-3">
            <span>进度：{{ progress.currentPage + 1 }} / {{ progress.totalPages }}</span>
          </div>
          <div class="w-full bg-gray-200 rounded-full h-2">
            <div
              class="bg-primary-blue h-2 rounded-full transition-all duration-300"
              :style="{ width: `${((progress.currentPage + 1) / progress.totalPages) * 100}%` }"
            ></div>
          </div>
          <button class="w-full mt-4 btn-primary text-sm">
            继续阅读
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useFavoritesStore } from '@/stores/favorites';
import { useReaderStore } from '@/stores/reader';
import { useRouter } from 'vue-router';
import api from '@/utils/api';
import type { ReadingProgress } from '@/types/common';
import PictureBookCard from '@/components/PictureBookCard.vue';
import LoadingSpinner from '@/components/LoadingSpinner.vue';

const router = useRouter();
const favoritesStore = useFavoritesStore();
const readerStore = useReaderStore();

const activeTab = ref<'favorites' | 'history'>('favorites');
const loading = ref(true);

const sortedProgress = computed(() => {
  return Object.values(readerStore.readingProgress)
    .sort((a, b) => new Date(b.lastReadAt).getTime() - new Date(a.lastReadAt).getTime())
    .slice(0, 12);
});

const loadFavorites = async () => {
  loading.value = true;
  await favoritesStore.loadFavorites();
  loading.value = false;
};

const removeFavorite = async (bookId: string) => {
  await favoritesStore.toggleFavorite(bookId);
};

const continueReading = async (progress: ReadingProgress) => {
  try {
    const response = await api.get(`/picturebooks/${progress.picturebookId}`);
    readerStore.setBook(response.data.picturebook);
    readerStore.goToPage(progress.currentPage);
    router.push(`/read/${progress.picturebookId}`);
  } catch (err) {
    console.error('Failed to load book:', err);
  }
};

onMounted(async () => {
  await readerStore.loadProgress();
  await loadFavorites();
});
</script>