import request from '@/common/utils/request'

const baseUrl = '/userapi/gp'

export default {
  /** 分页查询股票列表（POST + JSON body） */
  list: (params) => request({ url: `${baseUrl}/list`, method: 'post', data: params }),

  /** 查询单只股票详情（含公司信息） */
  getByCode: (code) => request({ url: `${baseUrl}/${code}`, method: 'get' }),

  /** 搜索补全 */
  search: (keyword) => request({ url: `${baseUrl}/search`, method: 'get', params: { keyword } })
}
