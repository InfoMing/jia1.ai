import { expect, test } from '@playwright/test'

test('导航只保留 Logo 与 AI提示词', async ({ page }) => {
  await page.goto('/')
  const header = page.locator('.si-header')
  await expect(header.getByRole('link', { name: '返回首页' })).toBeVisible()
  await expect(header.getByRole('link', { name: 'AI提示词' })).toBeVisible()
  await expect(header.getByRole('link')).toHaveCount(2)
  await expect(header.getByRole('button')).toHaveCount(0)
})

test('首页只保留宣传模块且没有业务死链', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { name: '刺猬星球 super-i' })).toBeVisible()
  await expect(page.getByText('精选课程', { exact: true })).toHaveCount(0)
  await expect(page.getByText('商业转化', { exact: true })).toHaveCount(0)
  const paths = await page.locator('a').evaluateAll(nodes => nodes.map(node => new URL(node.href).pathname))
  expect([...new Set(paths)].sort()).toEqual(['/', '/ai-prompts'])
})

test('AI提示词支持分类切换和复制', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write'])
  await page.goto('/ai-prompts')
  await expect(page.locator('.si-prompt-card')).toHaveCount(3)
  await page.getByRole('button', { name: '图像' }).click()
  await expect(page.getByRole('heading', { name: '电影感人物肖像' })).toBeVisible()
  await page.locator('.si-prompt-card').filter({ hasText: '电影感人物肖像' }).getByRole('button', { name: '复制提示词 ↗' }).click()
  await expect(page.getByText('提示词已复制')).toBeVisible()
})

test('旧业务与未知地址返回首页', async ({ page }) => {
  for (const path of ['/tool.html', '/live-courses', '/enterprise-service', '/unknown-page']) {
    await page.goto(path)
    await expect(page).toHaveURL(/\/$/)
  }
})
