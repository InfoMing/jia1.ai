import { afterEach, describe, expect, it, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import aiPromptsPage from '@/business/views/aiPrompts/index.vue'

describe('AI 提示词页面', () => {
  afterEach(() => {
    document.body.innerHTML = ''
    vi.restoreAllMocks()
  })

  it('每个分类展示三条静态提示词', async () => {
    const wrapper = mount(aiPromptsPage)
    expect(wrapper.findAll('.ji-prompt-card')).toHaveLength(3)
    await wrapper.get('.ji-prompts__filters button:nth-child(2)').trigger('click')
    expect(wrapper.text()).toContain('电影感人物肖像')
    expect(wrapper.findAll('.ji-prompt-card')).toHaveLength(3)
  })

  it('复制失败时显示中文提示', async () => {
    Object.defineProperty(window.navigator, 'clipboard', { configurable: true, value: { writeText: vi.fn().mockRejectedValue(new Error('denied')) } })
    const wrapper = mount(aiPromptsPage, { attachTo: document.body })
    await wrapper.get('.ji-prompt-card button').trigger('click')
    await flushPromises()
    expect(document.body.textContent).toContain('复制失败，请手动选择提示词文本')
  })
})
