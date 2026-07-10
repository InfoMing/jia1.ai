<template>
  <el-dialog :model-value="cacheDetailVisible" title="缓存详情" @update:model-value="$emit('update:cacheDetailVisible', $event)">
    <div v-if="cacheStatus">
      <el-descriptions :column="1" border>
        <el-descriptions-item label="缓存记录时刻">{{ cacheStatus.cachedAt }}</el-descriptions-item>
        <el-descriptions-item label="TTL 值（秒）">{{ cacheStatus.ttl }}</el-descriptions-item>
        <el-descriptions-item label="默认 TTL（秒）">{{ cacheStatus.defaultTtl }}</el-descriptions-item>
        <el-descriptions-item label="更新时间">{{ cacheStatus.updateTime }}</el-descriptions-item>
      </el-descriptions>
    </div>
    <template #footer>
      <el-button type="primary" @click="refreshCache">刷新码表</el-button>
      <el-button @click="$emit('update:cacheDetailVisible', false)">关闭</el-button>
    </template>
  </el-dialog>
</template>

<script>
import $code from '@/common/utils/code'

export default {
  name: 'LocalCacheDetail',
  props: {
    cacheDetailVisible: { type: Boolean, default: false }
  },
  emits: ['update:cacheDetailVisible'],
  computed: {
    cacheStatus() {
      return $code.cacheStatus()
    }
  },
  methods: {
    refreshCache() {
      $code.update()
    }
  }
}
</script>
