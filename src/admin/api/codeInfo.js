import request from '@/common/utils/request'

/**
 * 平台管理-->码表详细信息管理
 */

const baseUrl = "/adminapi/code";

export default {
  // 添加开始 ===========================================================================
  // 添加单条
  addOne: (obj) => {
    let mainCodeId = obj.mainCodeId;
    if (!mainCodeId) throw new Error("请求参数中的mainCodeId不能为空")
    delete obj.mainCodeId
    return request({
      url: `${baseUrl}/${mainCodeId}/codeInfo`,
      method: 'post',
      data: obj
    });
  },

  // 删除开始 ===========================================================================
  // 根据ids删除数据，ids是以英文逗号分隔的多个id
  deleteByIds: (obj) => {
    let mainCodeId = obj.mainCodeId;
    if (!mainCodeId) throw new Error("请求参数中的mainCodeId不能为空")
    delete obj.mainCodeId
    let id = obj.id;
    if (!id) throw new Error("请求参数中的id不能为空")
    return request({
      url: `${baseUrl}/${mainCodeId}/codeInfo/${id}`,
      method: 'delete'
    });
  },
  // 修改开始 ===========================================================================
  // 根据id修改数据
  updateById: (obj) => {
    let mainCodeId = obj.mainCodeId;
    if (!mainCodeId) throw new Error("请求参数中的mainCodeId不能为空")
    delete obj.mainCodeId
    let id = obj.id;
    if (!id) throw new Error("请求参数中的id不能为空")
    delete obj.id
    return request({
      url: `${baseUrl}/${mainCodeId}/codeInfo/${id}`,
      method: 'put',
      data: obj
    });
  },

  // 查询开始 ===========================================================================
  // 分页按条件查询
  list: (obj) => {
    let mainCodeId = obj.mainCodeId;
    if (!mainCodeId) throw new Error("请求参数中的mainCodeId不能为空")
    delete obj.mainCodeId

    obj.sort = {
      sortDirection: "asc",
      sortField: [
        "sort",
        "updateTime"
      ]
    };
    return request({
      url: `${baseUrl}/${mainCodeId}/codeInfo/list`,
      method: 'post',
      data: obj,
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
      params: {
        id: id
      }
    })
  },


}
