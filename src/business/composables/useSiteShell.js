import { inject } from 'vue'

export const SITE_SHELL_KEY = Symbol('site-shell')

/** 获取公共布局提供的登录状态与登录入口。 */
export const useSiteShell = () => inject(SITE_SHELL_KEY)

