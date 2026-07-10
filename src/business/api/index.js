import { businessMock } from '@/business/mock'

/**
 * 解包统一响应。后续接入真实后端时只需要替换本文件的数据源。
 * @param {Promise<{code: number, message: string, data: unknown}>} request
 * @returns {Promise<unknown>}
 */
const unwrap = async request => {
  const response = await request
  if (response.code !== 2000) throw new Error(response.message || '请求失败')
  return response.data
}

export const businessApi = {
  getSession: () => unwrap(businessMock.getSession()),
  getCourses: () => unwrap(businessMock.getCourses()),
  getCourse: id => unwrap(businessMock.getCourse(id)),
  getLiveCourse: () => unwrap(businessMock.getLiveCourse()),
  getNewsletter: () => unwrap(businessMock.getNewsletter()),
  sendCode: account => unwrap(businessMock.sendCode(account)),
  login: payload => unwrap(businessMock.login(payload)),
  logout: () => unwrap(businessMock.logout()),
  createPayment: plan => unwrap(businessMock.createPayment(plan)),
  like: () => unwrap(businessMock.like()),
  getLikeState: () => unwrap(businessMock.getLikeState()),
  submitTicket: ticket => unwrap(businessMock.submitTicket(ticket))
}

