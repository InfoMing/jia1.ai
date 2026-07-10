import request from '@/common/utils/request'

/**
 * 资源管理-->用户管理
 */

const userapi_baseUrl = "/userapi/user";
const adminapi_baseUrl = "/adminapi/user";

export default {
  // 添加开始 ===========================================================================
  // 添加单条
  addOne: (obj) => {
    return request({
      url: adminapi_baseUrl,
      method: 'post',
      data: obj
    });
  },

  // 删除开始 ===========================================================================
  // 根据ids删除数据，ids是以英文逗号分隔的多个id
  deleteByIds: (ids) => {
    return request({
      url: `${adminapi_baseUrl}/${ids}`,
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
    delete obj.lastLoginTime
    return request({
      url: `${adminapi_baseUrl}/${id}`,
      method: 'put',
      data: obj
    });
  },

  // 查询开始 ===========================================================================
  // 分页按条件查询
  list: (obj) => {
    obj = obj || {};
    obj.sort = {
      sortDirection: "asc",
      sortField: [
        "updateTime"
      ]
    };
    return request({
      url: adminapi_baseUrl + "/list",
      method: 'post',
      data: obj,
    })
  },

  // 根据实体对象查询所有
  getAll: (obj) => {
    return request({
      url: adminapi_baseUrl,
      method: 'get',
      params: obj
    })
  },

  // 根据id查询
  getById: (id) => {
    return request({
      url: `${adminapi_baseUrl}/${id}`,
      method: 'get'
    })
  },

  // 用户-角色关联 ========================================================
  addRoles: (id, roleIds) => {
    return request({
      url: `${adminapi_baseUrl}/${id}/roles`,
      method: 'post',
      data: roleIds
    });
  },
  deleteRoles: (id, roleIds) => {
    return request({
      url: `${adminapi_baseUrl}/${id}/roles/${roleIds}`,
      method: 'delete'
    });
  },
  listRoles: (id, obj) => {
    obj = obj || {};
    obj.sort = { sortDirection: "asc", sortField: ["updateTime"] };
    return request({
      url: `${adminapi_baseUrl}/${id}/roles/list`,
      method: 'post',
      data: obj
    });
  },

  // 登录
  login: (data) => {
    return request({
      url: userapi_baseUrl + '/login',
      method: 'post',
      data
    })
  },

  // 注册
  register: (data) => {
    return request({
      url: userapi_baseUrl + '/register',
      method: 'post',
      data
    })
  },

  // 找回密码
  forgotPassword: (data) => {
    return request({
      url: userapi_baseUrl + '/forgotPassword',
      method: 'post',
      data
    })
  },

  // 重置密码
  resetPassword: (data) => {
    return request({
      url: userapi_baseUrl + '/resetPassword',
      method: 'post',
      data
    })
  },

  // 退出
  logout: (token) => {
    return request({
      url: userapi_baseUrl + '/logout',
      method: 'get',
      params: {
        token
      }
    })
  }

}