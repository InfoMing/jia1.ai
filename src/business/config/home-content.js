import heroVideo from '@/business/assets/home/media/hero.mp4'
import heroPoster from '@/business/assets/home/hero-poster.jpg'
import communityQr from '@/business/assets/home/community-qr.jpg'
import communityPanel from '@/business/assets/home/community-panel.png'
import showcase from '@/business/assets/home/showcase.jpg'
import showcaseMark from '@/business/assets/home/showcase-mark.svg'
import careerImage from '@/business/assets/home/career.png'
import audienceSkill from '@/business/assets/home/icons/audience-skill.svg'
import audienceCreative from '@/business/assets/home/icons/audience-creative.svg'
import audienceManager from '@/business/assets/home/icons/audience-manager.svg'
import audienceDecorSkill from '@/business/assets/home/icons/audience-decor-skill.svg'
import audienceDecorCreative from '@/business/assets/home/icons/audience-decor-creative.svg'
import audienceDecorManager from '@/business/assets/home/icons/audience-decor-manager.svg'

export const homeAssets = {
  heroVideo,
  heroPoster,
  communityQr,
  communityPanel,
  showcase,
  showcaseMark,
  careerImage
}

export const homeContent = {
  community: { total: 225315, yesterday: 996 },
  audiences: [
    { key: 'skill', icon: audienceSkill, decor: audienceDecorSkill },
    { key: 'creative', icon: audienceCreative, decor: audienceDecorCreative },
    { key: 'manager', icon: audienceManager, decor: audienceDecorManager }
  ]
}
