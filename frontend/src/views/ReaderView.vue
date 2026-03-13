<template>
  <div
    :class="[
      'min-h-screen transition-colors duration-300',
      readerStore.isNightMode ? 'bg-gray-900' : 'bg-gray-100'
    ]"
  >
    <!-- Reader Header -->
    <div
      :class="[
        'fixed top-0 left-0 right-0 z-50 p-4 transition-colors duration-300',
        readerStore.isNightMode ? 'bg-gray-800' : 'bg-white'
      ]"
    >
      <div class="max-w-7xl mx-auto flex items-center justify-between">
        <button
          @click="closeReader"
          :class="[
            'flex items-center px-4 py-2 rounded-full transition-colors',
            readerStore.isNightMode
              ? 'text-gray-300 hover:bg-gray-700'
              : 'text-gray-600 hover:bg-gray-100'
          ]"
        >
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
          退出阅读
        </button>

        <div
          :class="[
            'text-lg font-medium',
            readerStore.isNightMode ? 'text-gray-200' : 'text-gray-900'
          ]"
        >
          {{ readerStore.currentBook?.title }}
        </div>

        <div class="flex items-center space-x-2">
          <button
            @click="readerStore.toggleNightMode"
            :class="[
              'p-2 rounded-full transition-colors',
              readerStore.isNightMode
                ? 'text-yellow-400 hover:bg-gray-700'
                : 'text-gray-600 hover:bg-gray-100'
            ]"
          >
            <svg v-if="readerStore.isNightMode" class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            <svg v-else class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          </button>
          <button
            @click="readerStore.toggleFullscreen"
            :class="[
              'p-2 rounded-full transition-colors',
              readerStore.isNightMode
                ? 'text-gray-300 hover:bg-gray-700'
                : 'text-gray-600 hover:bg-gray-100'
            ]"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 4l-5-5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Reader Content -->
    <div class="pt-20 pb-32 px-4">
      <div class="max-w-4xl mx-auto">
        <div v-if="readerStore.currentBook">
          <!-- Page View -->
          <div
            :class="[
              'page bg-white rounded-2xl shadow-2xl overflow-hidden',
              pageTurning && 'page-turning'
            ]"
          >
            <div class="aspect-[4/3] relative">
              <img
                :src="getImageUrl(currentPageData.imageUrl)"
                :alt="`第${readerStore.currentPage + 1}页`"
                class="w-full h-full object-cover"
              />
            </div>
            <div
              :class="[
                'p-6 md:p-8',
                readerStore.isNightMode ? 'bg-gray-800' : 'bg-gray-50'
              ]"
            >
              <p
                :class="[
                  'text-xl md:text-2xl text-center leading-relaxed',
                  readerStore.isNightMode ? 'text-gray-200' : 'text-gray-800'
                ]"
              >
                {{ currentPageData.text }}
              </p>
            </div>
          </div>

          <!-- Page Navigation -->
          <div class="flex items-center justify-between mt-8 max-w-2xl mx-auto">
            <button
              @click="prevPage"
              :disabled="readerStore.currentPage === 0"
              :class="[
                'flex items-center px-6 py-3 rounded-full transition-all duration-300',
                readerStore.currentPage === 0
                  ? 'opacity-30 cursor-not-allowed'
                  : readerStore.isNightMode
                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  : 'bg-white text-gray-700 hover:bg-gray-100 shadow-md'
              ]"
            >
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
              </svg>
              上一页
            </button>

            <div
              :class="[
                'text-lg font-medium',
                readerStore.isNightMode ? 'text-gray-300' : 'text-gray-600'
              ]"
            >
              {{ readerStore.currentPage + 1 }} / {{ readerStore.currentBook.pages.length }}
            </div>

            <button
              @click="nextPage"
              :disabled="readerStore.currentPage === readerStore.currentBook.pages.length - 1"
              :class="[
                'flex items-center px-6 py-3 rounded-full transition-all duration-300',
                readerStore.currentPage === readerStore.currentBook.pages.length - 1
                  ? 'opacity-30 cursor-not-allowed'
                  : readerStore.isNightMode
                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  : 'bg-white text-gray-700 hover:bg-gray-100 shadow-md'
              ]"
            >
              下一页
              <svg class="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          <!-- Page Thumbnails -->
          <div class="mt-8">
            <div
              :class="[
                'grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3',
                readerStore.isNightMode ? 'bg-gray-800' : 'bg-white'
              ]"
              class="rounded-2xl p-4"
            >
              <div
                v-for="(page, index) in readerStore.currentBook.pages"
                :key="index"
                @click="goToPage(index)"
                :class="[
                  'aspect-[3/4] rounded-lg overflow-hidden cursor-pointer transition-all duration-300 border-2',
                  readerStore.currentPage === index
                    ? 'border-primary-blue scale-110 shadow-lg'
                    : readerStore.isNightMode
                    ? 'border-transparent opacity-60 hover:opacity-100'
                    : 'border-transparent opacity-80 hover:opacity-100'
                ]"
              >
                <img
                  :src="getImageUrl(page.imageUrl)"
                  :alt="`第${index + 1}页`"
                  class="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useReaderStore } from '@/stores/reader';
import { getImageUrl } from '@/utils/api';
import api from '@/utils/api';
import type { PictureBook } from '@/types/picturebook';

const route = useRoute();
const router = useRouter();
const readerStore = useReaderStore();

const pageTurning = ref(false);

const currentPageData = computed(() => {
  if (!readerStore.currentBook) return { imageUrl: '', text: '' };
  return readerStore.currentBook.pages[readerStore.currentPage] || { imageUrl: '', text: '' };
});

const loadBook = async () => {
  try {
    const response = await api.get(`/picturebooks/${route.params.id}`);
    readerStore.setBook(response.data.picturebook);
  } catch (err) {
    console.error('Failed to load book:', err);
    router.push('/');
  }
};

const nextPage = () => {
  pageTurning.value = true;
  readerStore.nextPage();
  setTimeout(() => {
    pageTurning.value = false;
  }, 300);
};

const prevPage = () => {
  pageTurning.value = true;
  readerStore.prevPage();
  setTimeout(() => {
    pageTurning.value = false;
  }, 300);
};

const goToPage = (page: number) => {
  pageTurning.value = true;
  readerStore.goToPage(page);
  setTimeout(() => {
    pageTurning.value = false;
  }, 300);
};

const closeReader = () => {
  readerStore.closeBook();
  router.back();
};

const handleKeyPress = (e: KeyboardEvent) => {
  switch (e.key) {
    case 'ArrowRight':
      nextPage();
      break;
    case 'ArrowLeft':
      prevPage();
      break;
    case 'Escape':
      closeReader();
      break;
  }
};

onMounted(async () => {
  await readerStore.loadProgress();
  await loadBook();
  document.addEventListener('keydown', handleKeyPress);
});

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeyPress);
});
</script>