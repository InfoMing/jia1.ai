import request from '@/common/utils/request'

const baseUrl = '/adminapi/security'

export default {
  /** 搜索证券 */
  search: (keyword) => request({ url: `${baseUrl}/search`, method: 'get', params: { keyword } })
}
