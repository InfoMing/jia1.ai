import heroVideo from '@/business/assets/home/media/hero.mp4'
import heroPoster from '@/business/assets/home/heroPoster.jpg'
import communityQr from '@/business/assets/home/communityQr.jpg'
import communityPanel from '@/business/assets/home/communityPanel.png'
import showcase from '@/business/assets/home/showcase.jpg'
import careerImage from '@/business/assets/home/career.png'
import audienceSkill from '@/business/assets/home/icons/audienceSkill.svg'
import audienceCreative from '@/business/assets/home/icons/audienceCreative.svg'
import audienceManager from '@/business/assets/home/icons/audienceManager.svg'
import audienceDecorSkill from '@/business/assets/home/icons/audienceDecorSkill.svg'
import audienceDecorCreative from '@/business/assets/home/icons/audienceDecorCreative.svg'
import audienceDecorManager from '@/business/assets/home/icons/audienceDecorManager.svg'

// 首页组件统一从该映射读取资源，避免在展示组件中分散维护导入路径。
export const homeAssets = {
  heroVideo,
  heroPoster,
  communityQr,
  communityPanel,
  showcase,
  careerImage
}

// 首页可调整的静态业务数据集中维护，不在组件模板中硬编码。
export const homeContent = {
  community: { total: 225315, yesterday: 996 },
  audiences: [
    { key: 'skill', icon: audienceSkill, decor: audienceDecorSkill },
    { key: 'creative', icon: audienceCreative, decor: audienceDecorCreative },
    { key: 'manager', icon: audienceManager, decor: audienceDecorManager }
  ]
}
