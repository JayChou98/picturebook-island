<template>
  <router-link
    :to="`/book/${book._id}`"
    class="card overflow-hidden group cursor-pointer"
  >
    <div class="aspect-[3/4] overflow-hidden bg-gray-100">
      <img
        :src="coverImageUrl"
        :alt="book.title"
        class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        loading="lazy"
      />
    </div>
    <div class="p-4">
      <h3 class="font-bold text-gray-900 mb-1 truncate">{{ book.title }}</h3>
      <p class="text-sm text-gray-500 mb-2 truncate">{{ book.author }}</p>
      <div class="flex items-center justify-between text-xs text-gray-400">
        <span>{{ book.views }} 阅读</span>
        <span>❤️ {{ book.likes }}</span>
      </div>
    </div>
  </router-link>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { getImageUrl } from '@/utils/api';
import type { PictureBookListItem } from '@/types/picturebook';

const props = defineProps<{
  book: PictureBookListItem;
}>();

const coverImageUrl = computed(() => getImageUrl(props.book.coverImage));
</script>