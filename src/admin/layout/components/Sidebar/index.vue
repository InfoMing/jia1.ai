// 左边菜单栏

<template>
  <div :class="{'has-logo':showLogo}">
    <!-- 头部logo -->
    <logo v-if="showLogo" :collapse="isCollapse" />
    <!-- 菜单容器 -->
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <!-- 菜单的每个项 -->
      <el-menu :default-active="activeMenu" :collapse="isCollapse"
        :background-color="variables.menuBg" :text-color="variables.menuText" :unique-opened="false"
        :active-text-color="variables.menuActiveText" :collapse-transition="false" mode="vertical">
        <sidebar-item v-for="route in permission_routes" :key="route.path" :item="route"
          :base-path="route.path" />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
import Logo from "./Logo.vue";
import SidebarItem from "./SidebarItem.vue";
import variables from "@/admin/styles/variables.js";
import { usePermissionStore, useAppStore, useSettingsStore } from '@/store'

export default {
  components: { SidebarItem, Logo },
  computed: {
    permission_routes() {
      return usePermissionStore().routes
    },
    sidebar() {
      return useAppStore().sidebar
    },
    activeMenu() {
      const route = this.$route;
      const { meta, path } = route;
      // 如果设置路径，侧边栏将突出显示您设置的路径
      if (meta.activeMenu) {
        return meta.activeMenu;
      }
      return path;
    },
    showLogo() {
      return useSettingsStore().sidebarLogo;
    },
    variables() {
      return variables;
    },
    isCollapse() {
      return !this.sidebar.opened;
    },
  },
};
</script>
