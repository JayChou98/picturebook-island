<template>
  <div class="min-h-screen bg-gradient-to-b from-blue-50 to-orange-50 py-8 px-4">
    <div class="max-w-4xl mx-auto">
      <h1 class="text-4xl font-bold text-gray-800 mb-2 text-center">
        上传绘本
      </h1>
      <p class="text-gray-600 text-center mb-8">
        分享你的创意，让孩子们享受阅读的乐趣
      </p>

      <form @submit.prevent="handleSubmit" class="bg-white rounded-2xl shadow-lg p-8">
        <!-- 基本信息 -->
        <div class="space-y-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              封面图片 *
            </label>
            <div class="flex items-center justify-center w-full">
              <div
                class="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors"
                @click="triggerCoverUpload"
              >
                <img
                  v-if="coverImagePreview"
                  :src="coverImagePreview"
                  alt="封面预览"
                  class="w-full h-full object-cover rounded-lg"
                />
                <div v-else class="flex flex-col items-center justify-center pt-5 pb-6">
                  <svg
                    class="w-12 h-12 mb-3 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                  <p class="mb-2 text-sm text-gray-500">
                    <span class="font-semibold">点击上传</span> 或拖拽图片到此处
                  </p>
                  <p class="text-xs text-gray-500">PNG, JPG, GIF (最大 5MB)</p>
                </div>
              </div>
              <input
                ref="coverInput"
                type="file"
                @change="handleCoverChange"
                accept="image/*"
                class="hidden"
                required
              />
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                标题 *
              </label>
              <input
                v-model="formData.title"
                type="text"
                required
                placeholder="输入绘本标题"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                作者 *
              </label>
              <input
                v-model="formData.author"
                type="text"
                required
                placeholder="输入作者姓名"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              />
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              插画师
            </label>
            <input
              v-model="formData.illustrator"
              type="text"
              placeholder="输入插画师姓名"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            />
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                适用年龄 *
              </label>
              <select
                v-model="formData.ageRange"
                required
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              >
                <option value="">选择年龄范围</option>
                <option value="0-3">0-3 岁</option>
                <option value="3-6">3-6 岁</option>
                <option value="6-9">6-9 岁</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                主题 *
              </label>
              <select
                v-model="formData.theme"
                required
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              >
                <option value="">选择主题</option>
                <option value="动物">动物</option>
                <option value="自然">自然</option>
                <option value="成长">成长</option>
                <option value="冒险">冒险</option>
                <option value="友谊">友谊</option>
                <option value="科普">科普</option>
                <option value="传统文化">传统文化</option>
              </select>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              描述 *
            </label>
            <textarea
              v-model="formData.description"
              required
              rows="4"
              placeholder="输入绘本描述..."
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            ></textarea>
          </div>
        </div>

        <!-- 页面管理 -->
        <div class="mt-8 pt-8 border-t border-gray-200">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-2xl font-bold text-gray-800">
              绘本页面
            </h2>
            <button
              type="button"
              @click="addPage"
              class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              + 添加页面
            </button>
          </div>

          <div
            v-if="pages.length === 0"
            class="text-center py-12 text-gray-500"
          >
            暂无页面，点击上方按钮添加
          </div>

          <div
            v-for="(page, index) in pages"
            :key="index"
            class="bg-gray-50 rounded-lg p-6 mb-4"
          >
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-lg font-semibold text-gray-800">
                第 {{ index + 1 }} 页
              </h3>
              <button
                type="button"
                @click="removePage(index)"
                class="text-red-500 hover:text-red-700 transition-colors"
              >
                删除
              </button>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  页面图片 *
                </label>
                <div
                  class="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:bg-gray-100 transition-colors min-h-32 flex flex-col items-center justify-center"
                  @click="triggerPageImageUpload(index)"
                >
                  <img
                    v-if="page.imagePreview"
                    :src="page.imagePreview"
                    alt="页面预览"
                    class="w-full h-32 object-cover rounded-lg mb-2"
                  />
                  <div v-else class="text-gray-500">
                    <svg
                      class="w-8 h-8 mx-auto mb-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                    点击上传图片
                  </div>
                  <input
                    :id="`pageInput${index}`"
                    type="file"
                    @change="(e) => handlePageImageChange(e, index)"
                    accept="image/*"
                    class="hidden"
                    required
                  />
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  文字内容 *
                </label>
                <textarea
                  v-model="page.text"
                  required
                  rows="4"
                  placeholder="输入页面文字..."
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                ></textarea>
              </div>
            </div>
          </div>
        </div>

        <!-- 提交按钮 -->
        <div class="mt-8 flex items-center justify-end space-x-4">
          <button
            type="button"
            @click="router.push('/explore')"
            class="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            取消
          </button>
          <button
            type="submit"
            :disabled="loading"
            class="px-6 py-3 bg-gradient-to-r from-blue-500 to-orange-500 text-white rounded-lg hover:from-blue-600 hover:to-orange-600 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ loading ? '上传中...' : '发布绘本' }}
          </button>
        </div>
      </form>
    </div>

    <ErrorMessage
      v-if="error"
      :message="error"
      @close="error = ''"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { createPictureBook } from '../utils/api';
import ErrorMessage from '../components/ErrorMessage.vue';

const router = useRouter();

const formData = ref({
  title: '',
  author: '',
  illustrator: '',
  description: '',
  ageRange: '3-6',
  theme: '',
});

const coverInput = ref<HTMLInputElement | null>(null);
const coverImagePreview = ref('');
const coverImageFile = ref<File | null>(null);

const pages = ref<Array<{
  imageFile: File | null;
  imagePreview: string;
  text: string;
}>>([]);

const loading = ref(false);
const error = ref('');

const triggerCoverUpload = () => {
  coverInput.value?.click();
};

const handleCoverChange = (e: Event) => {
  const target = e.target as HTMLInputElement;
  const file = target.files?.[0];
  if (file) {
    coverImageFile.value = file;
    const reader = new FileReader();
    reader.onload = (e) => {
      coverImagePreview.value = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  }
};

const addPage = () => {
  pages.value.push({
    imageFile: null,
    imagePreview: '',
    text: '',
  });
};

const removePage = (index: number) => {
  pages.value.splice(index, 1);
};

const triggerPageImageUpload = (index: number) => {
  const input = document.getElementById(`pageInput${index}`) as HTMLInputElement;
  input?.click();
};

const handlePageImageChange = (e: Event, index: number) => {
  const target = e.target as HTMLInputElement;
  const file = target.files?.[0];
  if (file) {
    pages.value[index].imageFile = file;
    const reader = new FileReader();
    reader.onload = (e) => {
      pages.value[index].imagePreview = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  }
};

const handleSubmit = async () => {
  if (pages.value.length === 0) {
    error.value = '请至少添加一页';
    return;
  }

  loading.value = true;
  error.value = '';

  try {
    const submitFormData = new FormData();
    submitFormData.append('title', formData.value.title);
    submitFormData.append('author', formData.value.author);
    submitFormData.append('illustrator', formData.value.illustrator || '');
    submitFormData.append('description', formData.value.description);
    submitFormData.append('ageRange', formData.value.ageRange);
    submitFormData.append('theme', formData.value.theme);

    // Add cover image
    if (coverImageFile.value) {
      submitFormData.append('coverImage', coverImageFile.value);
    }

    // Add pages data
    const pagesData = pages.value.map((page, index) => ({
      id: `page-${index}`,
      imageUrl: '',
      text: page.text,
    }));

    submitFormData.append('pages', JSON.stringify(pagesData));

    // Add page images
    pages.value.forEach((page, index) => {
      if (page.imageFile) {
        submitFormData.append('pages', page.imageFile);
      }
    });

    await createPictureBook(submitFormData);

    router.push('/explore');
  } catch (err: any) {
    error.value = err.response?.data?.message || '上传失败，请重试';
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
/* 确保图片预览正常显示 */
img {
  max-width: 100%;
  height: auto;
}
</style>