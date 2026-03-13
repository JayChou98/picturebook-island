<template>
  <div class="min-h-screen bg-gradient-to-br from-primary-blue to-purple-600 flex items-center justify-center p-4">
    <div class="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md animate-fade-in">
      <div class="text-center mb-8">
        <div class="text-5xl mb-4">🏝️</div>
        <h1 class="text-3xl font-bold text-gradient">登录绘本岛</h1>
        <p class="text-gray-500 mt-2">欢迎回来！</p>
      </div>

      <form @submit.prevent="handleLogin" class="space-y-6">
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
            class="input-field"
            placeholder="请输入密码"
          />
        </div>

        <ErrorMessage v-if="authStore.error" :message="authStore.error" />

        <button
          type="submit"
          :disabled="authStore.loading"
          class="w-full btn-primary py-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {{ authStore.loading ? '登录中...' : '登录' }}
        </button>
      </form>

      <div class="mt-6 text-center">
        <p class="text-gray-600">
          还没有账号？
          <router-link to="/register" class="text-primary-blue font-medium hover:underline">
            立即注册
          </router-link>
        </p>
      </div>

      <div class="mt-4 p-4 bg-blue-50 rounded-xl text-sm text-blue-800">
        <p class="font-medium mb-1">测试账号：</p>
        <p>邮箱：test@example.com</p>
        <p>密码：password123</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useAuthStore } from '@/stores/auth';
import ErrorMessage from '@/components/ErrorMessage.vue';

const authStore = useAuthStore();
const email = ref('');
const password = ref('');

const handleLogin = async () => {
  await authStore.login({ email: email.value, password: password.value });
};
</script>