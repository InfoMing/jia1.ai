<template>
  <el-dialog class="si-dialog si-media-dialog" :model-value="open" width="min(94vw, 980px)" append-to-body destroy-on-close @update:model-value="$emit('close')">
    <video :src="assets.heroVideo" :poster="assets.heroPoster" controls autoplay playsinline />
  </el-dialog>
</template>

<script setup>
import { ElDialog } from 'element-plus'
import { homeAssets as assets } from '@/business/config/home-content'

defineProps({ open: Boolean })
defineEmits(['close'])
</script>

<style lang="scss" scoped>
.si-media-dialog video { width: 100%; display: block; background: #000; }
:global(.si-media-dialog.el-dialog) { padding: 0; overflow: hidden; border-radius: 22px; }
:global(.si-media-dialog .el-dialog__header) { position: absolute; z-index: 2; right: 0; margin: 0; }
:global(.si-media-dialog .el-dialog__body) { background: #000; }
</style>

