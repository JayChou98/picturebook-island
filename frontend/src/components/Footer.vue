<template>
  <footer class="bg-primary-dark text-white py-8 mt-16">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <!-- Brand -->
        <div>
          <div class="flex items-center space-x-2 mb-4">
            <span class="text-2xl">🏝️</span>
            <span class="text-xl font-bold">绘本岛</span>
          </div>
          <p class="text-gray-300 text-sm">
            温馨、童趣的亲子阅读平台，陪伴孩子快乐成长
          </p>
        </div>

        <!-- Links -->
        <div>
          <h3 class="font-semibold mb-4">快速链接</h3>
          <ul class="space-y-2 text-sm text-gray-300">
            <li><router-link to="/" class="hover:text-white transition-colors">首页</router-link></li>
            <li><router-link to="/explore" class="hover:text-white transition-colors">浏览绘本</router-link></li>
            <li><router-link to="/bookshelf" class="hover:text-white transition-colors">我的书架</router-link></li>
          </ul>
        </div>

        <!-- Contact -->
        <div>
          <h3 class="font-semibold mb-4">联系我们</h3>
          <ul class="space-y-2 text-sm text-gray-300">
            <li>📧 contact@picturebook.island</li>
            <li>📞 400-888-8888</li>
          </ul>
        </div>
      </div>

      <div class="border-t border-gray-700 mt-8 pt-8 text-center text-sm text-gray-400">
        <p>&copy; 2024 绘本岛. All rights reserved.</p>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
</script>