import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import aiPromptsPage from '@/business/views/aiPrompts/index.vue'
import promptDocument from '@/business/mock/aiPrompts.md?raw'
import { parseAiPrompts } from '@/business/mock/parseAiPrompts'

describe('AI 提示词页面', () => {
  it('从 Markdown 生成全部提示词模块', () => {
    const prompts = parseAiPrompts(promptDocument)
    expect(prompts).toHaveLength(13)
    expect(prompts[0]).toMatchObject({
      title: '复杂任务，一句话拆成可执行清单',
      image: 'prompt01.webp',
      imageSubtitle: '自动梳理目标、步骤、风险与验收标准',
      tags: ['任务规划', '效率提升'],
      platforms: ['chatgpt', 'jimeng', 'flow'],
      url: expect.stringContaining('https://www.feishu.cn/')
    })
    expect(prompts.every(prompt => prompt.url.startsWith('https://www.feishu.cn/'))).toBe(true)
    expect(prompts.at(-1).title).toBe('把零散想法整理成一份清晰方案')
    expect(prompts.at(-1).image).toBeUndefined()
  })

  it('支持分类切换和关键词搜索', async () => {
    const wrapper = mount(aiPromptsPage)
    expect(wrapper.findAll('.ji-prompt-card')).toHaveLength(7)

    await wrapper.get('.ji-prompts__mode button:nth-of-type(2)').trigger('click')
    expect(wrapper.findAll('.ji-prompt-card')).toHaveLength(6)
    await wrapper.get('.ji-prompts__filters button:nth-child(2)').trigger('click')
    expect(wrapper.findAll('.ji-prompt-card')).toHaveLength(3)
    expect(wrapper.text()).toContain('不会打光，也能做出电影感人物肖像')

    await wrapper.get('input[type="search"]').setValue('东方')
    expect(wrapper.findAll('.ji-prompt-card')).toHaveLength(1)
  })

  it('卡片链接在新页面安全打开', () => {
    const wrapper = mount(aiPromptsPage)
    const link = wrapper.get('.ji-prompt-card__link')
    expect(link.attributes('target')).toBe('_blank')
    expect(link.attributes('rel')).toBe('noopener noreferrer')
  })
})
