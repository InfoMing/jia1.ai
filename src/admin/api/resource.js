import request from '@/common/utils/request'

/**
 * 资源管理-->资源管理
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

  list: (obj) => {
    obj.sort = {
      sortDirection: "asc",
      sortField: [
        "sort",
        "updateTime"
      ]
    };
    return request({
      url: baseUrl + "/list",
      method: 'post',
      data: obj,
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

  listByRoleId: (roleId, obj) => {
    obj.sort = {
      sortDirection: "asc",
      sortField: ["sort", "updateTime"]
    };
    return request({
      url: `${baseUrl}/${roleId}/roles/list`,
      method: 'post',
      data: obj
    });
  },

  batchImport: (resources) => {
    return request({
      url: `${baseUrl}/batchImport`,
      method: 'post',
      data: resources
    });
  },

  getAllList: (obj) => {
    obj.sort = {
      sortDirection: "asc",
      sortField: ["sort", "updateTime"]
    };
    obj.pageParameter = { pageNum: 1, pageSize: 9999 };
    return request({
      url: baseUrl + "/list",
      method: 'post',
      data: obj
    });
  },

  getListByObj: (obj) => {
    return request({
      url: baseUrl + "/list",
      method: 'post',
      data: obj
    });
  },
}
