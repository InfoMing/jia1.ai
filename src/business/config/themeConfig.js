/**
 * 全站主题配置。
 * 关闭 allowUserCustomization 后，“我的”入口自动隐藏，并始终使用 defaultTheme。
 */
export const themeConfig = {
  allowUserCustomization: true,
  defaultTheme: 'current'
}

export const themeOptions = {
  current: { label: '当前主题', primary: '#92d050', accent: '#c9ff85', soft: '#f7ffec', deep: '#4f7e1e', rgb: '146 208 80', accentRgb: '201 255 133', imageFilter: 'none' },
  technologyBlue: { label: '科技蓝色', primary: '#3978f6', accent: '#8ec5ff', soft: '#eef5ff', deep: '#2357b8', rgb: '57 120 246', accentRgb: '142 197 255', imageFilter: 'hue-rotate(115deg) saturate(1.25)' },
  green: { label: '绿色', primary: '#16a56a', accent: '#85e0b4', soft: '#edfff6', deep: '#0b7448', rgb: '22 165 106', accentRgb: '133 224 180', imageFilter: 'hue-rotate(45deg) saturate(.9) brightness(.9)' },
  pink: { label: '粉色', primary: '#e95b9d', accent: '#ffacd1', soft: '#fff0f7', deep: '#a9366d', rgb: '233 91 157', accentRgb: '255 172 209', imageFilter: 'hue-rotate(225deg) saturate(1.15)' },
  red: { label: '红色', primary: '#e55252', accent: '#ff9999', soft: '#fff1f1', deep: '#a72d2d', rgb: '229 82 82', accentRgb: '255 153 153', imageFilter: 'hue-rotate(255deg) saturate(1.2) brightness(.95)' }
}
