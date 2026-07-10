import request from '@/common/utils/request'

/**
 * 平台管理-->定时任务配置
 */

const baseUrl = "/adminapi/scheduleJob";

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

  // 获取cron表达式最近运行的时间
  getLatelyRunTime: (cron, count) => {
    return request({
      url: baseUrl + "/getLatelyRunTime",
      method: 'get',
      params: { cron: cron, count: count }
    })
  },

  // 启动job
  startJob: (id) => {
    return request({
      url: baseUrl + "/start",
      method: 'get',
      params: { id: id }
    })
  },

  // 停用job
  stopJob: (id) => {
    return request({
      url: baseUrl + "/stop",
      method: 'get',
      params: { id: id }
    })
  },
}