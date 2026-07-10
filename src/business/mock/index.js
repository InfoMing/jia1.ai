import course1 from '@/business/assets/home/courses/course-1.webp'
import course2 from '@/business/assets/home/courses/course-2.webp'
import course3 from '@/business/assets/home/courses/course-3.webp'
import course4 from '@/business/assets/home/courses/course-4.webp'

const STORAGE_KEYS = {
  session: 'superi-demo:session',
  membership: 'superi-demo:membership',
  liked: 'superi-demo:liked',
  likes: 'superi-demo:likes',
  tickets: 'superi-demo:tickets'
}

const courses = [
  { id: 2910, image: course1, title: '【品牌短片】AI宠物广告完整流程', tag: '宠物广告流程', summary: '从创意、分镜、资产制作到成片的完整宠物广告工作流。' },
  { id: 2909, image: course2, title: '【提示词创作第六十七节】AI资产怎么做，画面才稳定？', tag: '资产稳画面', summary: '通过人物、场景、道具和色板资产保持画面一致性。' },
  { id: 2907, image: course3, title: '【提示词创作第六十六节】镜头角度，才是AI画面的电影感开关', tag: '角度决定氛围', summary: '学习用镜头角度和视觉叙事建立电影感。' },
  { id: 2904, image: course4, title: '【汽车品牌】如何用AI制作高级棚拍汽车广告', tag: '棚拍车片流程', summary: '完成高级棚拍汽车广告的画面、运镜与视频制作。' }
]

const wait = (value, duration = 180) => new Promise(resolve => window.setTimeout(() => resolve(value), duration))
const success = data => ({ code: 2000, message: '操作成功', data })
const failure = message => ({ code: 4000, message, data: null })
const read = (key, fallback = null) => {
  try {
    return JSON.parse(localStorage.getItem(key)) ?? fallback
  } catch {
    return fallback
  }
}
const write = (key, value) => localStorage.setItem(key, JSON.stringify(value))

/**
 * 前台 Mock 数据源。
 * 所有方法模拟后端统一响应结构，页面只能通过 business/api 调用。
 */
export const businessMock = {
  getSession: () => wait(success(read(STORAGE_KEYS.session)), 20),
  getCourses: () => wait(success(courses)),
  getCourse: id => {
    const course = courses.find(item => item.id === Number(id))
    return wait(course ? success(course) : failure('课程不存在'))
  },
  getLiveCourse: () => wait(success({
    title: 'AIGC 线上/线下直播实战课',
    teacher: 'Super-i × Tony33',
    features: ['直播演示与实操指导', '50人小班实时答疑', '赠送刺猬星球会员'],
    price: 99,
    discount: '99元抵1000元'
  })),
  getNewsletter: () => wait(success({
    title: '刺猬周报',
    description: '每周整理 AIGC 行业动态、实用工具和高质量案例。',
    issues: ['AI视频商业应用观察', '稳定角色资产工作流', '品牌创意与视觉趋势']
  })),
  sendCode: account => wait(account ? success({ expiresIn: 60, code: '246810' }) : failure('请输入手机号或邮箱')),
  login: payload => {
    const identity = payload.phone || payload.email
    if (!identity) return wait(failure('登录账号不能为空'))
    const session = { identity, name: identity.includes('@') ? identity.split('@')[0] : `用户${identity.slice(-4)}` }
    write(STORAGE_KEYS.session, session)
    return wait(success(session))
  },
  logout: () => {
    localStorage.removeItem(STORAGE_KEYS.session)
    return wait(success(true), 20)
  },
  createPayment: plan => {
    if (!plan) return wait(failure('请选择支付方案'))
    const membership = { plan, activatedAt: new Date().toISOString() }
    write(STORAGE_KEYS.membership, membership)
    return wait(success(membership), 600)
  },
  like: () => {
    const current = Number(read(STORAGE_KEYS.likes, 4957))
    if (read(STORAGE_KEYS.liked, false)) return wait(success({ count: current, duplicated: true }))
    write(STORAGE_KEYS.liked, true)
    write(STORAGE_KEYS.likes, current + 1)
    return wait(success({ count: current + 1, duplicated: false }))
  },
  getLikeState: () => wait(success({ count: Number(read(STORAGE_KEYS.likes, 4957)), liked: Boolean(read(STORAGE_KEYS.liked, false)) }), 20),
  submitTicket: ticket => {
    if (!ticket.detail?.trim()) return wait(failure('请描述您遇到的问题'))
    const tickets = read(STORAGE_KEYS.tickets, [])
    const record = { ...ticket, id: `SI-${Date.now()}`, createdAt: new Date().toISOString() }
    write(STORAGE_KEYS.tickets, [...tickets, record])
    return wait(success(record))
  }
}

