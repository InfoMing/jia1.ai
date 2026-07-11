import { expect, test } from '@playwright/test'

test('导航只保留 Logo 与 AI提示词', async ({ page }) => {
  await page.goto('/')
  const header = page.locator('.ji-header')
  await expect(header.getByRole('link', { name: '返回首页' })).toBeVisible()
  await expect(header.getByRole('link', { name: 'AI提示词' })).toBeVisible()
  await expect(header.getByRole('link')).toHaveCount(2)
  await expect(header.getByRole('button')).toHaveCount(0)
})

test('首页只保留宣传模块且没有业务死链', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { name: '佳一AI jia1.ai' })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'AI提示词' })).toBeVisible()
  await expect(page.locator('.ji-home-prompt')).toHaveCount(4)
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
  const paths = await page.locator('a').evaluateAll(nodes => nodes.map(node => new URL(node.href).pathname))
  expect([...new Set(paths)].sort()).toEqual(['/', '/aiPrompts'])
})

test('AI提示词支持分类切换和复制', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write'])
  await page.goto('/aiPrompts')
  await expect(page.locator('.ji-prompt-card')).toHaveCount(3)
  await page.getByRole('button', { name: '图像' }).click()
  await expect(page.getByRole('heading', { name: '电影感人物肖像' })).toBeVisible()
  await page.locator('.ji-prompt-card').filter({ hasText: '电影感人物肖像' }).getByRole('button', { name: '复制提示词 ↗' }).click()
  await expect(page.getByText('提示词已复制')).toBeVisible()
})

test('旧业务与未知地址返回首页', async ({ page }) => {
  for (const path of ['/tool.html', '/live-courses', '/enterprise-service', '/unknown-page']) {
    await page.goto(path)
    await expect(page).toHaveURL(/\/$/)
  }
})
