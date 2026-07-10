import request from '@/common/utils/request'

/**
 * 资源管理-->角色管理
 */

const baseUrl = "/adminapi/role";

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
      url: `${baseUrl}/${ids}`,
      method: 'delete'
    });
  },
  // 修改开始 ===========================================================================
  // 根据id修改数据
  updateById: (obj) => {
    let id = obj.id;
    if (!id) throw new Error("请求参数中的id不能为空")

    delete obj.id
    delete obj.createTime
    delete obj.createUserId
    delete obj.updateTime
    delete obj.updateUserId
    return request({
      url: `${baseUrl}/${id}`,
      method: 'put',
      data: obj
    });
  },

  // 查询开始 ===========================================================================
  // 分页按条件查询
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

  // 根据id查询
  getById: (id) => {
    return request({
      url: `${baseUrl}/${id}`,
      method: 'get'
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

  // 角色-用户关联 ========================================================
  addUsers: (id, userIds) => {
    return request({
      url: `${baseUrl}/${id}/users`,
      method: 'post',
      data: userIds
    });
  },
  deleteUsers: (id, userIds) => {
    return request({
      url: `${baseUrl}/${id}/users/${userIds}`,
      method: 'delete'
    });
  },
  listUsers: (id, obj) => {
    obj.sort = { sortDirection: "asc", sortField: ["updateTime"] };
    return request({
      url: `${baseUrl}/${id}/users/list`,
      method: 'post',
      data: obj
    });
  },

  // 角色-资源关联 ========================================================
  addResources: (id, resourceIds) => {
    return request({
      url: `${baseUrl}/${id}/resources`,
      method: 'post',
      data: resourceIds
    });
  },
  deleteResources: (id, resourceIds) => {
    return request({
      url: `${baseUrl}/${id}/resources/${resourceIds}`,
      method: 'delete'
    });
  },
  listResources: (id, obj) => {
    obj.sort = { sortDirection: "asc", sortField: ["sort", "updateTime"] };
    return request({
      url: `${baseUrl}/${id}/resources/list`,
      method: 'post',
      data: obj
    });
  },

  // 角色-API关联 ========================================================
  addApis: (id, apiIds) => {
    return request({
      url: `${baseUrl}/${id}/apis`,
      method: 'post',
      data: apiIds
    });
  },
  deleteApis: (id, apiIds) => {
    return request({
      url: `${baseUrl}/${id}/apis/${apiIds}`,
      method: 'delete'
    });
  },
  listApis: (id, obj) => {
    obj.sort = { sortDirection: "asc", sortField: ["updateTime"] };
    return request({
      url: `${baseUrl}/${id}/apis/list`,
      method: 'post',
      data: obj
    });
  },
}