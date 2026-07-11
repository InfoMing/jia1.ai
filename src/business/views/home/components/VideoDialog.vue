<template>
  <Teleport to="body">
    <div v-if="open" class="si-media-dialog" role="dialog" aria-modal="true" aria-label="品牌宣传片" @click.self="$emit('close')">
      <div class="si-media-dialog__panel">
        <button type="button" aria-label="关闭视频" @click="$emit('close')">×</button>
        <video :src="assets.heroVideo" :poster="assets.heroPoster" controls autoplay playsinline />
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { Teleport } from 'vue'
import { homeAssets as assets } from '@/business/config/home-content'

defineProps({ open: Boolean })
defineEmits(['close'])
</script>

<style lang="scss" scoped>
.si-media-dialog { position: fixed; inset: 0; z-index: 1000; padding: 24px; display: grid; place-items: center; background: rgba(0,0,0,.72); backdrop-filter: blur(6px); }
.si-media-dialog__panel { position: relative; width: min(94vw,980px); overflow: hidden; border-radius: 22px; background: #000; box-shadow: 0 24px 70px rgba(0,0,0,.4); }
.si-media-dialog video { width: 100%; display: block; background: #000; }
.si-media-dialog button { position: absolute; z-index: 2; top: 12px; right: 12px; width: 38px; height: 38px; border: 0; border-radius: 50%; color: #fff; background: rgba(0,0,0,.58); font-size: 25px; cursor: pointer; }
</style>
