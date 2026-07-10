<template>
  <iframe
    :key="source"
    class="legacy-page"
    :src="source"
    :title="title"
    frameborder="0"
  />
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
// legacySource 只用于 iframe 内部加载，外层 Vue Router 始终展示规范 URL。
const source = computed(() => route.meta.legacySource)
const title = computed(() => route.meta.title || '刺猬星球 super-i')
</script>

<style scoped>
.legacy-page {
  display: block;
  width: 100%;
  height: 100vh;
  border: 0;
  background: #fff;
}
</style>
