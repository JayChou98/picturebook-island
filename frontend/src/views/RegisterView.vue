<template>
  <div class="min-h-screen bg-gradient-to-br from-primary-orange to-pink-500 flex items-center justify-center p-4">
    <div class="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md animate-fade-in">
      <div class="text-center mb-8">
        <div class="text-5xl mb-4">🎨</div>
        <h1 class="text-3xl font-bold text-gradient">注册绘本岛</h1>
        <p class="text-gray-500 mt-2">开启亲子阅读之旅</p>
      </div>

      <form @submit.prevent="handleRegister" class="space-y-5">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">昵称</label>
          <input
            v-model="nickname"
            type="text"
            required
            class="input-field"
            placeholder="请输入昵称"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">邮箱</label>
          <input
            v-model="email"
            type="email"
            required
            class="input-field"
            placeholder="请输入邮箱"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">密码</label>
          <input
            v-model="password"
            type="password"
            required
            minlength="6"
            class="input-field"
            placeholder="至少6位密码"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">孩子年龄</label>
          <select v-model="childAge" required class="input-field">
            <option value="">请选择年龄范围</option>
            <option value="0-3">0-3岁</option>
            <option value="3-6">3-6岁</option>
            <option value="6-9">6-9岁</option>
          </select>
        </div>

        <ErrorMessage v-if="authStore.error" :message="authStore.error" />

        <button
          type="submit"
          :disabled="authStore.loading"
          class="w-full btn-orange py-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {{ authStore.loading ? '注册中...' : '注册' }}
        </button>
      </form>

      <div class="mt-6 text-center">
        <p class="text-gray-600">
          已有账号？
          <router-link to="/login" class="text-primary-orange font-medium hover:underline">
            立即登录
          </router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useAuthStore } from '@/stores/auth';
import ErrorMessage from '@/components/ErrorMessage.vue';

const authStore = useAuthStore();
const nickname = ref('');
const email = ref('');
const password = ref('');
const childAge = ref<'0-3' | '3-6' | '6-9' | ''>('');

const handleRegister = async () => {
  if (childAge.value) {
    await authStore.register({
      nickname: nickname.value,
      email: email.value,
      password: password.value,
      childAge: childAge.value
    });
  }
};
</script>