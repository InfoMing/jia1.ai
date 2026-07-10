import request from '@/common/utils/request'

/**
 * 平台管理-->码表主表管理
 */

const baseUrl = "/adminapi/code";

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

  // 查询所有的码表信息
  getCodeAndInfoAll: () => {
    return request({
      url: '/userapi/code',
      method: 'get'
    })
  },

  // 刷新码表缓存
  refreshCache: () => {
    return request({
      url: baseUrl + "/refreshCache",
      method: 'put'
    })
  },





}
