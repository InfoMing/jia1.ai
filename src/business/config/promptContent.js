import promptDocument from '@/business/mock/aiPrompts.md?raw'
import { parseAiPrompts } from '@/business/mock/parseAiPrompts'
import summaryIcon from '@/business/assets/aiPrompts/summaryIcon.png'
import toolChatgpt from '@/business/assets/aiPrompts/toolChatgpt.png'
import toolJimeng from '@/business/assets/aiPrompts/toolJimeng.png'
import toolFlow from '@/business/assets/aiPrompts/toolFlow.png'

const promptImages = import.meta.glob('../assets/aiPrompts/*', { eager: true, query: '?url', import: 'default' })

// Markdown 中填写平台 key，组件通过该映射展示对应图标。
export const platformOptions = {
  chatgpt: { label: 'ChatGPT', icon: toolChatgpt },
  jimeng: { label: '即梦', icon: toolJimeng },
  flow: { label: 'Flow', icon: toolFlow }
}

export const promptItems = parseAiPrompts(promptDocument)
export const promptSummaryIcon = summaryIcon
export const resolvePromptImage = fileName => promptImages[`../assets/aiPrompts/${fileName}`] || ''
