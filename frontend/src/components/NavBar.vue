<template>
  <nav class="fixed top-0 left-0 right-0 bg-white shadow-card z-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        <!-- Logo -->
        <router-link to="/" class="flex items-center space-x-2">
          <span class="text-2xl">🏝️</span>
          <span class="text-xl font-bold text-gradient">绘本岛</span>
        </router-link>

        <!-- Desktop Navigation -->
        <div class="hidden md:flex items-center space-x-8">
          <router-link
            to="/"
            class="nav-link"
            :class="{ 'text-primary-blue': $route.path === '/' }"
          >
            首页
          </router-link>
          <router-link
            to="/explore"
            class="nav-link"
            :class="{ 'text-primary-blue': $route.path === '/explore' }"
          >
            浏览绘本
          </router-link>
          <router-link
            v-if="authStore.isAuthenticated"
            to="/bookshelf"
            class="nav-link"
            :class="{ 'text-primary-blue': $route.path === '/bookshelf' }"
          >
            我的书架
          </router-link>
          <router-link
            v-if="authStore.isAuthenticated"
            to="/upload"
            class="nav-link"
            :class="{ 'text-primary-blue': $route.path === '/upload' }"
          >
            上传绘本
          </router-link>
        </div>

        <!-- User Menu -->
        <div class="hidden md:flex items-center space-x-4">
          <template v-if="authStore.isAuthenticated">
            <router-link to="/profile" class="flex items-center space-x-2">
              <div class="w-8 h-8 rounded-full bg-primary-blue text-white flex items-center justify-center">
                {{ authStore.user?.nickname?.charAt(0) || 'U' }}
              </div>
              <span class="text-sm font-medium">{{ authStore.user?.nickname }}</span>
            </router-link>
            <button @click="authStore.logout" class="text-sm text-gray-600 hover:text-primary-blue">
              退出
            </button>
          </template>
          <template v-else>
            <router-link to="/login" class="btn-outline text-sm px-4 py-2">
              登录
            </router-link>
            <router-link to="/register" class="btn-primary text-sm px-4 py-2">
              注册
            </router-link>
          </template>
        </div>

        <!-- Mobile Menu Button -->
        <button
          @click="mobileMenuOpen = !mobileMenuOpen"
          class="md:hidden p-2 rounded-lg hover:bg-gray-100"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Mobile Menu -->
    <div v-if="mobileMenuOpen" class="md:hidden bg-white border-t border-gray-100">
      <div class="px-4 py-3 space-y-2">
        <router-link to="/" class="block py-2 text-gray-700">首页</router-link>
        <router-link to="/explore" class="block py-2 text-gray-700">浏览绘本</router-link>
        <router-link v-if="authStore.isAuthenticated" to="/bookshelf" class="block py-2 text-gray-700">
          我的书架
        </router-link>
        <router-link v-if="authStore.isAuthenticated" to="/upload" class="block py-2 text-gray-700">
          上传绘本
        </router-link>
        <router-link v-if="authStore.isAuthenticated" to="/profile" class="block py-2 text-gray-700">
          个人中心
        </router-link>
        <template v-if="!authStore.isAuthenticated">
          <router-link to="/login" class="block py-2 text-gray-700">登录</router-link>
          <router-link to="/register" class="block py-2 text-primary-blue font-medium">注册</router-link>
        </template>
        <button
          v-else
          @click="authStore.logout"
          class="block py-2 text-gray-700 w-full text-left"
        >
          退出登录
        </button>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();
const mobileMenuOpen = ref(false);
</script>

<style scoped>
.nav-link {
  @apply text-gray-600 hover:text-primary-blue transition-colors duration-200 font-medium;
}
</style>