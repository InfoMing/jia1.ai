import request from '@/common/utils/request'

/**
 * 资源管理-->菜单相关接口
 * 后端无独立 Menu 实体，复用 Resource API（type=directory/menu）
 */

const baseUrl = "/adminapi/resource";

export default {
  addOne: (obj) => {
    return request({
      url: baseUrl,
      method: 'post',
      data: obj
    });
  },

  deleteByIds: (ids) => {
    return request({
      url: `${baseUrl}/${ids}`,
      method: 'delete'
    });
  },

  updateById: (obj) => {
    let id = obj.id;
    if (!id) throw new Error("请求参数中的id不能为空")
    delete obj.id
    return request({
      url: `${baseUrl}/${id}`,
      method: 'put',
      data: obj
    });
  },

  getListByObj: (obj) => {
    let params = { ...(obj || {}) };
    delete params.isAll
    params.sort = {
      sortDirection: "asc",
      sortField: ["sort", "updateTime"]
    };
    if (!params.pageParameter) {
      params.pageParameter = { pageNum: 1, pageSize: 9999 };
    }
    return request({
      url: baseUrl + "/list",
      method: 'post',
      data: params
    })
  },

  getById: (id) => {
    return request({
      url: `${baseUrl}/${id}`,
      method: 'get'
    })
  },

  getAll: (obj) => {
    return request({
      url: baseUrl,
      method: 'get',
      params: obj
    })
  },

  getUserMenu: () => {
    return request({
      url: baseUrl + "/list",
      method: 'post',
      data: {
        match: [
          { key: "type", value: "menu" },
          { key: "isShow", value: true }
        ],
        pageParameter: {
          pageNum: 1,
          pageSize: 999
        }
      }
    })
  },
}
