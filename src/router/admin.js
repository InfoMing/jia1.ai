import { markRaw } from 'vue'
import Layout from '@/admin/layout/index.vue'

// markRaw 防止 Layout 被 Vue Router 内部转为响应式对象，避免性能警告
const _Layout = markRaw(Layout)

/**
 * constantRoutes
 * 没有权限要求的基页（后台路径统一加 /admin 前缀）
 * 所有角色可以访问
 */
export const constantRoutes = [
  // 根路径重定向到前台首页
  {
    path: '/',
    redirect: '/b/home'
  },
  // 后台平台管理首页（放在最前面）
  {
    path: '/admin',
    component: _Layout,
    alwaysShow: true,
    meta: {
      title: '平台',
      icon: 'lock'
    },
    children: [{
      path: 'home',
      name: 'adminHome',
      meta: {
        title: '首页',
        icon: 'home',
        affix: true
      },
      component: () => import('@/admin/views/common/home/index.vue')
    }]
  },
  // 股票管理（独立一级目录）
  {
    path: '/admin/stock',
    component: _Layout,
    alwaysShow: true,
    meta: {
      title: '股票',
      icon: 'money'
    },
    children: [{
      path: 'manage',
      meta: {
        title: '股票管理',
        icon: 'resource',
      },
      component: () => import('@/admin/views/resource/gp/index.vue')
    }]
  },
  // 后台系统管理
  {
    path: '/admin/system',
    component: _Layout,
    alwaysShow: true,
    meta: {
      title: '系统',
      icon: 'setting'
    },
    children: [
      {
        path: 'schedule',
        meta: {
          title: '定时任务',
          icon: 'schedule',
        },
        component: () => import('@/admin/views/system/schedule/index.vue')
      },
      {
        path: 'code',
        meta: {
          title: '码表',
          icon: 'data-dictionary',
        },
        component: () => import('@/admin/views/system/code/index.vue')
      },
      {
        path: 'user',
        meta: {
          title: '用户管理',
          icon: 'user',
        },
        component: () => import('@/admin/views/resource/user/index.vue')
      },
      {
        path: 'role',
        meta: {
          title: '角色管理',
          icon: 'role',
        },
        component: () => import('@/admin/views/resource/role/index.vue')
      },
      {
        path: 'resource',
        meta: {
          title: '资源管理',
          icon: 'resource',
        },
        component: () => import('@/admin/views/resource/resource/index.vue')
      },
      {
        path: 'api',
        meta: {
          title: 'API管理',
          icon: 'api',
        },
        component: () => import('@/admin/views/resource/api/index.vue')
      }
    ]
  },
  // 后台其他功能页
  {
    path: '/admin/redirect',
    component:_Layout,
    hidden: true,
    children: [{
      path: '/admin/redirect/:path(.*)',
      component: () => import('@/admin/views/common/redirect/index.vue')
    }]
  }, {
    path: '/admin/login',
    component: () => import('@/admin/views/common/login/index.vue'),
    hidden: true,
    meta: {
      title: '登录',
    }
  }, {
    path: '/admin/register',
    component: () => import('@/admin/views/common/login/register.vue'),
    hidden: true,
    meta: {
      title: '注册',
    }
  }, {
    path: '/admin/forgot-password',
    component: () => import('@/admin/views/common/login/forgotPassword.vue'),
    hidden: true,
    meta: {
      title: '忘记密码',
    }
  }, {
    path: '/admin/auth-redirect',
    component: () => import('@/admin/views/common/login/auth-redirect.vue'),
    hidden: true
  }, {
    path: '/admin/404',
    component: () => import('@/admin/views/common/error-page/404.vue'),
    hidden: true,
    meta: {
      title: '页面不存在',
    }
  }, {
    path: '/admin/500',
    component: () => import('@/admin/views/common/error-page/500.vue'),
    hidden: true,
    meta: {
      title: '服务器异常',
    }
  }, {
    path: '/admin/401',
    component: () => import('@/admin/views/common/error-page/401.vue'),
    hidden: true,
    meta: {
      title: '无权限',
    }
  }, {
    path: '/admin/profile',
    component:_Layout,
    redirect: '/admin/profile/index',
    hidden: true,
    children: [{
      path: 'index',
      component: () => import('@/admin/views/personal/personal/index.vue'),
      name: 'Profile',
      meta: {
        title: '个人中心',
        icon: 'user',
        noCache: true
      }
    }]
  }, {
    path: '/admin/cron/cronDetail',
    component: () => import('@/admin/views/system/schedule/cron/cronDetail.vue'),
    hidden: true
  },
]

export default constantRoutes
