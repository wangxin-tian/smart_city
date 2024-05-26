<script setup lang="ts">

import { onMounted } from 'vue';
import { initCity } from './enter';

onMounted(() => {
  // 初始化三维场景
  initCity();
});
</script>

<template>
  <canvas id="webgl">浏览器不支持webgl</canvas>
</template>

<style scoped>
</style>
