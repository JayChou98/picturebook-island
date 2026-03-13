import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { PictureBookListItem } from '@/types/picturebook';
import api from '@/utils/api';

export const useFavoritesStore = defineStore('favorites', () => {
  const favorites = ref<PictureBookListItem[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const favoriteIds = computed(() => favorites.value.map(f => f._id));

  const loadFavorites = async (page = 1) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await api.get(`/favorites?page=${page}`);
      favorites.value = response.data.favorites;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to load favorites';
    } finally {
      loading.value = false;
    }
  };

  const toggleFavorite = async (picturebookId: string) => {
    const isFavorited = favoriteIds.value.includes(picturebookId);
    
    try {
      if (isFavorited) {
        await api.delete(`/favorites/${picturebookId}`);
        favorites.value = favorites.value.filter(f => f._id !== picturebookId);
      } else {
        await api.post('/favorites', { picturebookId });
      }
      
      // Reload favorites to sync
      await loadFavorites();
      return true;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to update favorites';
      return false;
    }
  };

  const checkFavorite = async (picturebookId: string): Promise<boolean> => {
    try {
      const response = await api.get(`/favorites/check/${picturebookId}`);
      return response.data.isFavorited;
    } catch (err) {
      return false;
    }
  };

  const isFavorite = (picturebookId: string) => {
    return favoriteIds.value.includes(picturebookId);
  };

  return {
    favorites,
    favoriteIds,
    loading,
    error,
    loadFavorites,
    toggleFavorite,
    checkFavorite,
    isFavorite
  };
});