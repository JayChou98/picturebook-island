<template>
  <div id="app" class="min-h-screen bg-primary-light">
    <NavBar />
    <main class="pt-16">
      <router-view />
    </main>
    <Footer />
  </div>
</template>

<script setup lang="ts">
import NavBar from './components/NavBar.vue';
import Footer from './components/Footer.vue';
</script>

<style>
#app {
  font-family: 'Noto Sans SC', sans-serif;
}
</style>