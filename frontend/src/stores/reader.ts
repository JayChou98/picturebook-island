import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { ReaderState, ReadingProgress } from '@/types/common';
import type { PictureBook } from '@/types/picturebook';

export const useReaderStore = defineStore('reader', () => {
  const currentBook = ref<PictureBook | null>(null);
  const currentPage = ref(0);
  const isFullscreen = ref(false);
  const isNightMode = ref(false);
  const readingProgress = ref<Record<string, ReadingProgress>>({});

  const setBook = (book: PictureBook) => {
    currentBook.value = book;
    currentPage.value = 0;
    
    // Restore reading progress if exists
    const savedProgress = readingProgress.value[book._id];
    if (savedProgress && savedProgress.currentPage < book.pages.length) {
      currentPage.value = savedProgress.currentPage;
    }
  };

  const nextPage = () => {
    if (currentBook.value && currentPage.value < currentBook.value.pages.length - 1) {
      currentPage.value++;
      saveProgress();
    }
  };

  const prevPage = () => {
    if (currentPage.value > 0) {
      currentPage.value--;
      saveProgress();
    }
  };

  const goToPage = (page: number) => {
    if (currentBook.value && page >= 0 && page < currentBook.value.pages.length) {
      currentPage.value = page;
      saveProgress();
    }
  };

  const toggleFullscreen = () => {
    isFullscreen.value = !isFullscreen.value;
  };

  const toggleNightMode = () => {
    isNightMode.value = !isNightMode.value;
  };

  const saveProgress = () => {
    if (currentBook.value) {
      readingProgress.value[currentBook.value._id] = {
        picturebookId: currentBook.value._id,
        currentPage: currentPage.value,
        totalPages: currentBook.value.pages.length,
        lastReadAt: new Date().toISOString()
      };
      localStorage.setItem('readingProgress', JSON.stringify(readingProgress.value));
    }
  };

  const loadProgress = () => {
    const saved = localStorage.getItem('readingProgress');
    if (saved) {
      readingProgress.value = JSON.parse(saved);
    }
  };

  const closeBook = () => {
    currentBook.value = null;
    currentPage.value = 0;
  };

  return {
    currentBook,
    currentPage,
    isFullscreen,
    isNightMode,
    readingProgress,
    setBook,
    nextPage,
    prevPage,
    goToPage,
    toggleFullscreen,
    toggleNightMode,
    saveProgress,
    loadProgress,
    closeBook
  };
});
