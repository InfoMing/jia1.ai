import request from '@/common/utils/request'

/**
 * 资源管理-->股票相关接口
 */

const baseUrl = "/adminapi/gp";

export default {
  // 添加开始 ===========================================================================
  // 添加单条
  addOne: (obj) => {
    return request({
      url: baseUrl,
      method: 'post',
      data: obj
    });
  },

  // 删除开始 ===========================================================================
  // 根据code删除数据，同时删除股票和公司信息
  deleteByIds: (code) => {
    return request({
      url: baseUrl + '/' + code,
      method: 'delete'
    });
  },
  // 修改开始 ===========================================================================
  // 根据code修改数据（PUT /{code}）
  updateById: (obj) => {
    return request({
      url: baseUrl + '/' + obj.code,
      method: 'put',
      data: obj
    });
  },

  // 查询开始 ===========================================================================
  // 分页按条件查询（POST + JSON body）
  // BaseTable 默认调用 api.list，此处作为 getListByObj 的别名
  list: (obj) => {
    return request({
      url: baseUrl + "/list",
      method: 'post',
      data: obj
    })
  },

  // 分页按条件查询（与 list 相同，兼容 BaseTable 的命名）
  getListByObj: (obj) => {
    return request({
      url: baseUrl + "/list",
      method: 'post',
      data: obj
    })
  },

  // 根据code查询
  getByCode: (code) => {
    return request({
      url: baseUrl + "/" + code,
      method: 'get'
    })
  },

  // 查询市场指标
  getMarketData: (code) => {
    return request({
      url: baseUrl + "/market",
      method: 'get',
      params: { code }
    })
  },

  // 查询前10大流通股东
  getShareholders: (code) => {
    return request({
      url: baseUrl + "/shareholder",
      method: 'get',
      params: { code }
    })
  },

  // 同步市场指标
  syncMarket: (code) => {
    return request({
      url: baseUrl + "/sync/market",
      method: 'post',
      params: { code }
    })
  },

  // 同步前10大流通股东
  syncShareholder: (code) => {
    return request({
      url: baseUrl + "/sync/shareholder",
      method: 'post',
      params: { code }
    })
  }
}
