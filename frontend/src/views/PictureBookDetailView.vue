<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
    <div v-if="loading" class="flex justify-center py-12">
      <LoadingSpinner />
    </div>
    <div v-else-if="error" class="max-w-md mx-auto">
      <ErrorMessage :message="error" />
    </div>
    <div v-else-if="book">
      <!-- Back Button -->
      <button
        @click="$router.back()"
        class="mb-6 flex items-center text-gray-600 hover:text-primary-blue transition-colors"
      >
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
        返回
      </button>

      <!-- Book Header -->
      <div class="bg-white rounded-3xl shadow-soft p-6 md:p-8 mb-8">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <!-- Cover Image -->
          <div class="md:col-span-1">
            <div class="aspect-[3/4] rounded-2xl overflow-hidden shadow-lg">
              <img
                :src="coverImageUrl"
                :alt="book.title"
                class="w-full h-full object-cover"
              />
            </div>
          </div>

          <!-- Book Info -->
          <div class="md:col-span-2">
            <h1 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {{ book.title }}
            </h1>
            
            <div class="space-y-2 mb-6">
              <div class="flex items-center text-gray-600">
                <span class="w-20">作者：</span>
                <span>{{ book.author }}</span>
              </div>
              <div v-if="book.illustrator" class="flex items-center text-gray-600">
                <span class="w-20">插画：</span>
                <span>{{ book.illustrator }}</span>
              </div>
              <div class="flex items-center text-gray-600">
                <span class="w-20">页数：</span>
                <span>{{ book.pages.length }} 页</span>
              </div>
              <div class="flex items-center text-gray-600">
                <span class="w-20">阅读：</span>
                <span>{{ book.views }} 次</span>
              </div>
              <div class="flex items-center text-gray-600">
                <span class="w-20">喜欢：</span>
                <span>{{ book.likes }} 人</span>
              </div>
            </div>

            <!-- Tags -->
            <div class="flex flex-wrap gap-2 mb-6">
              <span
                v-for="age in book.ageRange"
                :key="age"
                class="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
              >
                {{ age }}
              </span>
              <span
                v-for="theme in book.theme"
                :key="theme"
                class="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm"
              >
                {{ theme }}
              </span>
            </div>

            <p class="text-gray-700 leading-relaxed mb-6">
              {{ book.description }}
            </p>

            <!-- Action Buttons -->
            <div class="flex flex-wrap gap-4">
              <router-link
                :to="`/read/${book._id}`"
                class="btn-primary px-8 py-3 text-lg flex items-center"
              >
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                开始阅读
              </router-link>
              
              <button
                v-if="authStore.isAuthenticated"
                @click="toggleFavorite"
                :disabled="favoritesStore.loading"
                :class="[
                  'px-6 py-3 rounded-full font-medium transition-all duration-300 flex items-center border-2',
                  isFavorited
                    ? 'bg-red-50 border-red-300 text-red-500'
                    : 'bg-white border-gray-300 text-gray-700 hover:border-red-300 hover:text-red-500'
                ]"
              >
                <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
                {{ isFavorited ? '已收藏' : '收藏' }}
              </button>

              <button
                @click="shareBook"
                class="px-6 py-3 rounded-full font-medium border-2 border-gray-300 text-gray-700 hover:border-primary-blue hover:text-primary-blue transition-all duration-300 flex items-center"
              >
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
                分享
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Page Previews -->
      <div class="bg-white rounded-3xl shadow-soft p-6 md:p-8">
        <h2 class="text-2xl font-bold mb-6">绘本预览</h2>
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <div
            v-for="(page, index) in book.pages.slice(0, 8)"
            :key="index"
            class="aspect-[3/4] rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow cursor-pointer"
            @click="startReading(index)"
          >
            <img
              :src="getPageImageUrl(page.imageUrl)"
              :alt="`第${index + 1}页`"
              class="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
        </div>
        <div v-if="book.pages.length > 8" class="text-center mt-6">
          <router-link
            :to="`/read/${book._id}`"
            class="btn-primary inline-flex items-center"
          >
            查看全部 {{ book.pages.length }} 页
            <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { useFavoritesStore } from '@/stores/favorites';
import { useReaderStore } from '@/stores/reader';
import { getImageUrl } from '@/utils/api';
import api from '@/utils/api';
import type { PictureBook } from '@/types/picturebook';
import LoadingSpinner from '@/components/LoadingSpinner.vue';
import ErrorMessage from '@/components/ErrorMessage.vue';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const favoritesStore = useFavoritesStore();
const readerStore = useReaderStore();

const book = ref<PictureBook | null>(null);
const loading = ref(true);
const error = ref<string | null>(null);
const isFavorited = ref(false);

const coverImageUrl = computed(() => {
  if (!book.value) return '';
  return getImageUrl(book.value.coverImage);
});

const getPageImageUrl = (imageUrl: string) => getImageUrl(imageUrl);

const loadBook = async () => {
  loading.value = true;
  try {
    const response = await api.get(`/picturebooks/${route.params.id}`);
    book.value = response.data.picturebook;

    // Increment views
    await api.put(`/picturebooks/${route.params.id}/views`);

    // Check if favorited
    if (authStore.isAuthenticated) {
      isFavorited.value = await favoritesStore.checkFavorite(book.value._id);
    }

    loading.value = false;
  } catch (err: any) {
    error.value = err.response?.data?.message || '加载失败';
    loading.value = false;
  }
};

const toggleFavorite = async () => {
  if (!book.value) return;
  const success = await favoritesStore.toggleFavorite(book.value._id);
  if (success) {
    isFavorited.value = !isFavorited.value;
  }
};

const shareBook = () => {
  const url = window.location.href;
  navigator.clipboard.writeText(url).then(() => {
    alert('链接已复制到剪贴板！');
  }).catch(() => {
    alert('复制失败，请手动复制链接');
  });
};

const startReading = (page = 0) => {
  if (book.value) {
    readerStore.setBook(book.value);
    readerStore.goToPage(page);
    router.push(`/read/${book.value._id}`);
  }
};

onMounted(() => {
  loadBook();
});
</script>