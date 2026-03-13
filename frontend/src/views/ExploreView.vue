<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
    <h1 class="text-3xl md:text-4xl font-bold mb-8 flex items-center">
      <span class="mr-2">📚</span>
      浏览绘本
    </h1>

    <!-- Filters -->
    <div class="bg-white rounded-2xl shadow-card p-6 mb-8">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <!-- Search -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">搜索</label>
          <input
            v-model="filters.search"
            type="text"
            class="input-field"
            placeholder="搜索绘本标题、作者..."
            @input="handleSearch"
          />
        </div>

        <!-- Age Filter -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">年龄范围</label>
          <select v-model="filters.ageRange" class="input-field" @change="applyFilters">
            <option value="">全部年龄</option>
            <option value="0-3">0-3岁</option>
            <option value="3-6">3-6岁</option>
            <option value="6-9">6-9岁</option>
          </select>
        </div>

        <!-- Theme Filter -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">主题</label>
          <select v-model="filters.theme" class="input-field" @change="applyFilters">
            <option value="">全部主题</option>
            <option v-for="theme in themes" :key="theme" :value="theme">
              {{ theme }}
            </option>
          </select>
        </div>
      </div>

      <!-- Sort Options -->
      <div class="mt-4 flex items-center space-x-4">
        <span class="text-sm text-gray-600">排序：</span>
        <button
          v-for="option in sortOptions"
          :key="option.value"
          @click="handleSort(option.value)"
          :class="[
            'px-4 py-1.5 rounded-full text-sm transition-colors',
            filters.sort === option.value
              ? 'bg-primary-blue text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          ]"
        >
          {{ option.label }}
        </button>
      </div>
    </div>

    <!-- Books Grid -->
    <div v-if="loading" class="flex justify-center py-12">
      <LoadingSpinner />
    </div>
    <div v-else-if="error" class="max-w-md mx-auto">
      <ErrorMessage :message="error" />
    </div>
    <div v-else-if="books.length === 0" class="text-center py-16">
      <div class="text-6xl mb-4">📭</div>
      <p class="text-gray-500">没有找到相关绘本</p>
    </div>
    <div v-else>
      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
        <PictureBookCard
          v-for="book in books"
          :key="book._id"
          :book="book"
        />
      </div>

      <!-- Pagination -->
      <div v-if="totalPages > 1" class="flex justify-center items-center space-x-2">
        <button
          @click="changePage(currentPage - 1)"
          :disabled="currentPage === 1"
          class="px-4 py-2 rounded-lg bg-white border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
        >
          上一页
        </button>
        <template v-for="page in displayedPages" :key="page">
          <span v-if="page === '...'" class="px-2">...</span>
          <button
            v-else
            @click="changePage(page as number)"
            :class="[
              'px-4 py-2 rounded-lg',
              currentPage === page
                ? 'bg-primary-blue text-white'
                : 'bg-white border border-gray-200 hover:bg-gray-50'
            ]"
          >
            {{ page }}
          </button>
        </template>
        <button
          @click="changePage(currentPage + 1)"
          :disabled="currentPage === totalPages"
          class="px-4 py-2 rounded-lg bg-white border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
        >
          下一页
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import api from '@/utils/api';
import type { FilterParams } from '@/types/common';
import PictureBookCard from '@/components/PictureBookCard.vue';
import LoadingSpinner from '@/components/LoadingSpinner.vue';
import ErrorMessage from '@/components/ErrorMessage.vue';

const route = useRoute();
const router = useRouter();

const books = ref<any[]>([]);
const loading = ref(true);
const error = ref<string | null>(null);
const currentPage = ref(1);
const totalPages = ref(1);

const themes = ['动物', '自然', '成长', '科普', '情感', '传统文化', '艺术'];

const sortOptions = [
  { label: '最新', value: 'createdAt' },
  { label: '最热', value: 'views' },
  { label: '最多喜欢', value: 'likes' }
];

const filters = ref<FilterParams>({
  search: '',
  ageRange: '',
  theme: '',
  sort: 'createdAt'
});

const displayedPages = computed(() => {
  const pages: (number | string)[] = [];
  const delta = 2;
  
  for (let i = 1; i <= totalPages.value; i++) {
    if (
      i === 1 ||
      i === totalPages.value ||
      (i >= currentPage.value - delta && i <= currentPage.value + delta)
    ) {
      pages.push(i);
    } else if (pages[pages.length - 1] !== '...') {
      pages.push('...');
    }
  }
  
  return pages;
});

const loadBooks = async () => {
  loading.value = true;
  error.value = null;
  
  try {
    const params = new URLSearchParams();
    if (filters.value.search) params.append('search', filters.value.search);
    if (filters.value.ageRange) params.append('ageRange', filters.value.ageRange);
    if (filters.value.theme) params.append('theme', filters.value.theme);
    if (filters.value.sort) params.append('sort', filters.value.sort);
    params.append('page', currentPage.value.toString());
    params.append('limit', '12');

    const response = await api.get(`/picturebooks?${params}`);
    books.value = response.data.picturebooks;
    totalPages.value = response.data.totalPages;
    loading.value = false;
  } catch (err: any) {
    error.value = err.response?.data?.message || '加载失败';
    loading.value = false;
  }
};

let searchTimeout: NodeJS.Timeout;
const handleSearch = () => {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    currentPage.value = 1;
    loadBooks();
  }, 500);
};

const applyFilters = () => {
  currentPage.value = 1;
  loadBooks();
};

const handleSort = (sort: string) => {
  filters.value.sort = sort;
  currentPage.value = 1;
  loadBooks();
};

const changePage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
    loadBooks();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
};

onMounted(() => {
  // Parse URL query params
  if (route.query.ageRange) {
    filters.value.ageRange = route.query.ageRange as string;
  }
  
  loadBooks();
});
</script>