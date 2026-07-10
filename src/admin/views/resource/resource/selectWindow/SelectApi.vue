// 资源管理：资源选择API
// 注意: 后端不支持 resource-API 直接关联，关联在角色层面（/adminapi/role/{id}/apis）完成
// 此组件作为展示层，所有API的增删操作需通过角色管理页面完成
// 左侧显示所有API，右侧暂留界面但禁用操作

<template>
  <div class="select-user-main-wrap" v-loading="mainLoading">
    <div class="body-wrap flex flex-x-between">
      <div class="left-wrap">
        <base-table :columns="tableColumn" header-title-icon="use" headerTitle="所有API"
          search-field="searchField,按名称/url/类名搜" :api="api" ref="addTableRef"
          pageLayout="sizes, total,prev, slot,next">
        </base-table>
      </div>
      <div class="center-wrap flex flex-y-center">
        <div style="width:50px;margin:0 auto;">
          <el-button type="primary" size="small" style="margin-bottom:5px;" disabled>
            添加<i class="el-icon-arrow-right el-icon--right"></i>
          </el-button>
          <el-button type="primary" icon="el-icon-arrow-left" size="small" disabled>
            移除
          </el-button>
        </div>
      </div>
      <div class="right-wrap">
        <base-table :columns="tableColumn" header-title-icon="use"
          :headerTitle="'【'+resource.name+'】关联的API(此功能在角色管理中完成)'"
          search-field="searchField,按名称/url/类名搜"
          :api="api" ref="deleteTableRef" :list="getListByObj"
          pageLayout="sizes, total,prev, slot,next" header-title-icon-style="color:#1890ff;">
        </base-table>
      </div>
    </div>
  </div>

</template>
 
<script>
import apiApi from "@/admin/api/api";
export default {
  props: {
    resource: { type: Object, default: () => {} },
  },
  data() {
    return {
      api: apiApi,
      mainLoading: false,
      tableColumn: [
        { prop: "name", label: "名称", show: true },
        { prop: "url", label: "url", show: true },
        { prop: "requestMethod", label: "请求类型", width: "80", show: true },
      ],
    };
  },
  mounted() {
    this.initData();
  },
  methods: {
    initData() {
      this.$refs.addTableRef.initData();
      this.$refs.deleteTableRef.initData();
    },
    // 右栏: 查询所有API（非关联查询，仅展示）
    getListByObj(obj, success, fail) {
      obj = obj || {};
      apiApi.list(obj).then(success).catch(fail);
    },
  },
};
</script>
 
<style lang="scss" scoped>
.select-user-main-wrap {
  text-align: left;
  .header-wrap {
    height: 40px;
    padding: 0;
    line-height: 40px;
    font-size: 16px;
    left: 20px;
    position: absolute;
    top: 10px;
    .item-wrap {
      display: inline-block;
      margin-right: 30px;
    }
    .tip {
      color: #909399;
      display: inline-block;
      margin-right: 5px;
    }
  }

  .body-wrap {
    height: 100%;
    padding: 0px 10px 10px;

    .left-wrap,
    .right-wrap {
      width: 45%;
    }

    .center-wrap {
      width: 10%;

      .el-button {
        margin: 0 0;
        padding: 5px;
      }
    }
  }
}
</style>