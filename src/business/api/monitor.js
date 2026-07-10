import request from '@/common/utils/request'

const baseUrl = '/userapi/monitorRule'

export default {
  /** 创建监控规则 */
  save: (data) => request({ url: baseUrl, method: 'post', data }),

  /** 更新监控规则 */
  updateById: (data) => {
    const id = data.id
    if (!id) throw new Error('请求参数中的id不能为空')
    delete data.id
    return request({ url: `${baseUrl}/${id}`, method: 'put', data })
  },

  /** 删除监控规则 */
  deleteByIds: (ids) => request({ url: `${baseUrl}/${ids}`, method: 'delete' }),

  /** 分页查询监控规则 */
  list: (data) => {
    data = data || {}
    data.sort = data.sort || { sortDirection: 'desc', sortField: ['updateTime'] }
    return request({ url: `${baseUrl}/list`, method: 'post', data })
  },

  /** 根据id查询 */
  getById: (id) => request({ url: `${baseUrl}/${id}`, method: 'get' })
}
