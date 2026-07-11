import { expect, test } from '@playwright/test'

test('导航展示 Logo、AI提示词、AI资讯与 coding 项目', async ({ page }) => {
  await page.goto('/')
  const header = page.locator('.ji-header')
  await expect(header.getByRole('link', { name: '返回首页' })).toBeVisible()
  const menuToggle = header.getByRole('button', { name: '切换导航菜单' })
  if (await menuToggle.isVisible()) await menuToggle.click()
  await expect(header.getByRole('link', { name: 'AI提示词' })).toBeVisible()
  await expect(header.getByRole('link', { name: '最新AI资讯' })).toHaveAttribute('href', 'https://maomu.com/news')
  await expect(header.getByRole('link', { name: '我的coding项目' })).toHaveAttribute('href', 'https://github.com/')
  await expect(header.getByRole('link')).toHaveCount(4)
  await expect(header.getByRole('button')).toHaveCount(page.viewportSize().width <= 768 ? 2 : 1)
})

test('用户主题支持保存、恢复和清空', async ({ page }) => {
  await page.goto('/')
  const header = page.locator('.ji-header')
  const menuToggle = header.getByRole('button', { name: '切换导航菜单' })
  if (await menuToggle.isVisible()) await menuToggle.click()

  await header.getByRole('button', { name: '我的', exact: true }).click()
  await header.getByRole('button', { name: /科技蓝/ }).click()
  await expect.poll(() => page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue('--ji-theme-primary').trim())).toBe('#3978f6')
  await expect.poll(() => page.locator('.ji-brand img').evaluate(element => getComputedStyle(element).filter)).toContain('hue-rotate(115deg)')
  expect(await page.evaluate(() => localStorage.getItem('jia1:theme'))).toBe('technologyBlue')

  await page.reload()
  await expect.poll(() => page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue('--ji-theme-primary').trim())).toBe('#3978f6')
  if (await menuToggle.isVisible()) await menuToggle.click()
  await header.getByRole('button', { name: '我的', exact: true }).click()
  await header.getByRole('button', { name: '清空自定义，使用网站默认' }).click()
  expect(await page.evaluate(() => localStorage.getItem('jia1:theme'))).toBeNull()
  await expect.poll(() => page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue('--ji-theme-primary').trim())).toBe('#92d050')
})

test('首页只保留宣传模块且没有业务死链', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { name: '佳一AI jia1.ai' })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'AI提示词' })).toBeVisible()
  await expect(page.locator('.ji-home-prompts .ji-prompt-card')).toHaveCount(4)
  await expect(page.getByRole('link', { name: '更多提示词 >' })).toHaveAttribute('href', '/aiPrompts')
  await expect(page.getByRole('heading', { name: '我们追寻的光' })).toBeVisible()
  await expect(page.getByRole('button', { name: '品牌宣传片' })).toBeVisible()
  await expect(page.getByRole('button', { name: '平台介绍' })).toBeVisible()
  await page.getByRole('button', { name: '品牌宣传片' }).click()
  await expect(page.getByRole('dialog', { name: '品牌宣传片' }).locator('video')).toHaveAttribute('src', /hero-.*\.mp4$/)
  await page.getByRole('button', { name: '关闭视频' }).click()
  await expect(page.getByRole('heading', { name: '我是谁？' })).toBeVisible()
  await expect(page.getByRole('heading', { name: '我能为你提供什么？' })).toBeVisible()
  await expect(page.locator('.ji-role-card header img')).toHaveCount(3)
  expect(await page.locator('.ji-role-card header img').evaluateAll(images => images.every(image => image.complete && image.naturalWidth > 0))).toBe(true)
  await expect(page.getByText('适合谁？', { exact: true })).toHaveCount(0)
  await expect(page.getByText('成为谁？', { exact: true })).toHaveCount(0)
  await expect(page.getByText('精选课程', { exact: true })).toHaveCount(0)
  await expect(page.getByText('商业转化', { exact: true })).toHaveCount(0)
  const paths = await page.locator('a[href]').evaluateAll(nodes => nodes.map(node => new URL(node.href).pathname))
  expect([...new Set(paths)].sort()).toEqual(['/', '/aiPrompts'])
})

test('AI提示词由文档生成并支持分类筛选', async ({ page }) => {
  await page.goto('/aiPrompts')
  await expect(page.locator('.ji-prompt-card')).toHaveCount(7)
  await page.getByRole('button', { name: '灵感模式' }).click()
  await expect(page.locator('.ji-prompt-card')).toHaveCount(6)
  await page.getByRole('button', { name: '图像' }).click()
  await expect(page.getByRole('heading', { name: '不会打光，也能做出电影感人物肖像' })).toBeVisible()
  await expect(page.locator('.ji-prompt-card')).toHaveCount(3)
  await expect(page.locator('.ji-prompt-card__link').first()).toHaveAttribute('target', '_blank')
})

test('旧业务与未知地址返回首页', async ({ page }) => {
  for (const path of ['/tool.html', '/live-courses', '/enterprise-service', '/unknown-page']) {
    await page.goto(path)
    await expect(page).toHaveURL(/\/$/)
  }
})
