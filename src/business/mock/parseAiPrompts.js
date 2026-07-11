/**
 * 将约定格式的 Markdown 转换为页面模块。
 * 二级标题是模块标题，紧随其后的 `- key: value` 是模块字段。
 */
export const parseAiPrompts = document => {
  const modules = []
  let current

  document.split(/\r?\n/).forEach(line => {
    const title = line.match(/^##\s+(.+)$/)
    if (title) {
      current = { title: title[1].trim() }
      modules.push(current)
      return
    }

    const field = line.match(/^-\s+([a-zA-Z][a-zA-Z0-9]*):\s*(.*)$/)
    if (!field || !current) return
    const [, key, value] = field
    current[key] = ['tags', 'platforms'].includes(key)
      ? value.split(/[,，]/).map(item => item.trim()).filter(Boolean)
      : value.trim()
  })

  return modules
    .filter(item => item.title && item.url)
    .map(item => ({ ...item, tags: item.tags || [], platforms: item.platforms || [] }))
}
