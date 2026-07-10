<template>
  <div class="navbar-wrap">
    <div class="navbar">

      <!-- 点击收缩开启侧边菜单栏 -->
      <hamburger id="hamburger-container" :is-active="sidebar.opened" class="hamburger-container"
        @toggleClick="toggleSideBar" />

      <!-- 头部导航栏 -->
      <breadcrumb id="breadcrumb-container" class="breadcrumb-container" />

      <!-- 右侧菜单 -->
      <div class="right-menu">
        <template v-if="device!=='mobile'">
          <search id="header-search" class="right-menu-item" />
          <screenfull id="screenfull" class="right-menu-item hover-effect" />
        </template>

        <el-dropdown class="avatar-container right-menu-item hover-effect" trigger="click">
          <div class="avatar-wrapper">
            <!-- <img :src="avatar+'?imageView2/1/w/80/h/80'" class="user-avatar"> -->
            <svg-icon icon-class="avatar" class="user-avatar" />
            <i class="el-icon-caret-bottom" />
          </div>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="$router.push('/profile/index')">个人中心</el-dropdown-item>
              <el-dropdown-item @click="$router.push('/')">首页</el-dropdown-item>
              <el-dropdown-item @click="cacheDetailVisible = true">缓存详情</el-dropdown-item>
              <el-dropdown-item divided @click="logout">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>

    <LocalCacheDetail v-model:cache-detail-visible="cacheDetailVisible" />
  </div>
</template>

<script>
import Breadcrumb from "@/admin/components/Breadcrumb/index.vue";
import Hamburger from "@/admin/components/Hamburger/index.vue";
import Screenfull from "@/admin/components/Screenfull/index.vue";
import Search from "@/admin/components/HeaderSearch/index.vue";
import LocalCacheDetail from "@/admin/views/personal/LocalCacheDetail.vue";
import { logout } from "@/common/utils/user";
import { useAppStore } from '@/store'

export default {
  components: {
    Breadcrumb,
    Hamburger,
    Screenfull,
    Search,
    LocalCacheDetail,
  },
  data() {
    return {
      cacheDetailVisible: false,
    }
  },
  computed: {
    sidebar() {
      return useAppStore().sidebar
    },
    avatar() {
      return ''
    },
    device() {
      return useAppStore().device
    },
  },
  methods: {
    toggleSideBar() {
      useAppStore().toggleSideBar();
    },
    async logout() {
      logout();
    },
  },
};
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background 0.3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background 0.3s;

        &:hover {
          background: rgba(0, 0, 0, 0.025);
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
