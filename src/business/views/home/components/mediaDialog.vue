<template>
  <teleportComponent to="body">
    <div v-if="open" class="ji-media-dialog" role="dialog" aria-modal="true" aria-label="品牌宣传片" @click.self="$emit('close')">
      <div class="ji-media-dialog__panel">
        <button type="button" aria-label="关闭视频" @click="$emit('close')">×</button>
        <video :src="assets.heroVideo" :poster="assets.heroPoster" controls autoplay playsinline />
      </div>
    </div>
  </teleportComponent>
</template>

<script setup>
import { Teleport as teleportComponent } from 'vue'
import { homeAssets as assets } from '@/business/config/homeContent'

// 弹层传送到 body，避免被首页容器的 overflow 和层叠上下文裁切。
defineProps({ open: Boolean })
defineEmits(['close'])
</script>

<style lang="scss" scoped>
.ji-media-dialog { position: fixed; inset: 0; z-index: 1000; padding: 24px; display: grid; place-items: center; background: rgba(0,0,0,.72); backdrop-filter: blur(6px); }
.ji-media-dialog__panel { position: relative; width: min(94vw,980px); overflow: hidden; border-radius: 22px; background: #000; box-shadow: 0 24px 70px rgba(0,0,0,.4); }
.ji-media-dialog video { width: 100%; display: block; background: #000; }
.ji-media-dialog button { position: absolute; z-index: 2; top: 12px; right: 12px; width: 38px; height: 38px; border: 0; border-radius: 50%; color: #fff; background: rgba(0,0,0,.58); font-size: 25px; cursor: pointer; }
</style>
