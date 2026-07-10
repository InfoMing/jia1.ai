<template>
  <div class="drawer-container">
    <div>
      <h3 class="drawer-title">页面设置</h3>

      <div class="drawer-item">
        <span>显示标签栏</span>
        <el-switch v-model="tagsView" class="drawer-switch" />
      </div>

      <div class="drawer-item">
        <span>固定头部</span>
        <el-switch v-model="fixedHeader" class="drawer-switch" />
      </div>

      <div class="drawer-item">
        <span>显示Logo</span>
        <el-switch v-model="sidebarLogo" class="drawer-switch" />
      </div>

    </div>
  </div>
</template>

<script>
import { useSettingsStore } from '@/store'

export default {
  computed: {
    isShowJob() {
      return false
    },
    fixedHeader: {
      get() {
        return useSettingsStore().fixedHeader
      },
      set(val) {
        useSettingsStore().changeSetting({
          key: 'fixedHeader',
          value: val
        })
      }
    },
    tagsView: {
      get() {
        return useSettingsStore().tagsView
      },
      set(val) {
        useSettingsStore().changeSetting({
          key: 'tagsView',
          value: val
        })
      }
    },
    sidebarLogo: {
      get() {
        return useSettingsStore().sidebarLogo
      },
      set(val) {
        useSettingsStore().changeSetting({
          key: 'sidebarLogo',
          value: val
        })
      }
    },
    lang() {
      return 'zh'
    }
  },
  methods: {
    themeChange(val) {
      useSettingsStore().changeSetting({
        key: 'theme',
        value: val
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.drawer-container {
  padding: 24px;
  font-size: 14px;
  line-height: 1.5;
  word-wrap: break-word;

  .drawer-title {
    margin-bottom: 12px;
    color: rgba(0, 0, 0, .85);
    font-size: 14px;
    line-height: 22px;
  }

  .drawer-item {
    color: rgba(0, 0, 0, .65);
    font-size: 14px;
    padding: 12px 0;
  }

  .drawer-switch {
    float: right
  }
}
</style>
