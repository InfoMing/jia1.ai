import request from '@/common/utils/request'

/**
 * 资源管理-->部门管理
 */

const baseUrl = "/sys/department";

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
  // 根据ids删除数据，ids是以英文逗号分隔的多个id
  deleteByIds: (ids) => {
    return request({
      url: baseUrl,
      method: 'delete',
      params: {
        ids: ids
      }
    });
  },
  // 修改开始 ===========================================================================
  // 根据id修改数据
  updateById: (obj) => {
    return request({
      url: baseUrl,
      method: 'put',
      data: obj
    });
  },

  // 查询开始 ===========================================================================
  // 分页按条件查询
  getListByObj: (obj) => {
    return request({
      url: baseUrl + "/getListByVo",
      method: 'get',
      params: obj
    })
  },

  // 根据实体对象查询所有
  getAll: (obj) => {
    return request({
      url: baseUrl,
      method: 'get',
      params: obj
    })
  },

  // 根据id查询
  getById: (id) => {
    return request({
      url: baseUrl + "/getById",
      method: 'get',
      params: { id: id }
    })
  },

  // 根据企业id查询
  getTreeByCompanyId: (id) => {
    return request({
      url: baseUrl + "/getTreeByCompanyId",
      method: 'get',
      params: { companyId: id }
    })
  }


}