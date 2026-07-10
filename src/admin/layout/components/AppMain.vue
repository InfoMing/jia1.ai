<template>
  <section class="app-main">
    <router-view v-slot="{ Component, route }">
      <transition name="fade-transform" mode="out-in">
        <keep-alive :include="cachedViews">
          <component :is="Component" :key="route.path" />
        </keep-alive>
      </transition>
    </router-view>
  </section>
</template>

<script>
import { useTagsViewStore } from '@/store'

export default {
  name: "AppMain",
  computed: {
    cachedViews() {
      return useTagsViewStore().cachedViews;
    },
  },
};
</script>

<style lang="scss" scoped>
.app-main {
  /* 50 = navbar, 34 = tags-view */
  min-height: calc(100vh - 50px);
  width: 100%;
  position: relative;
  overflow: hidden;
}
</style>
