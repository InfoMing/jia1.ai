import { describe, expect, it } from 'vitest'
import businessRoutes from '@/router/business'

const flatten = routes => routes.flatMap(route => [route, ...flatten(route.children || [])])
const routes = flatten(businessRoutes)

describe('极简前台路由', () => {
  it('只保留首页和 AI 提示词命名路由', () => {
    expect(routes.map(route => route.name).filter(Boolean)).toEqual(['home', 'aiPrompts'])
    expect(routes.find(route => route.name === 'aiPrompts')?.path).toBe('aiPrompts')
  })

  it('未知地址统一返回首页且不存在 html 路由', () => {
    const fallback = routes.find(route => route.path === '/:pathMatch(.*)*')
    expect(fallback.redirect).toEqual({ name: 'home' })
    expect(routes.some(route => route.path?.includes('.html'))).toBe(false)
  })
})
