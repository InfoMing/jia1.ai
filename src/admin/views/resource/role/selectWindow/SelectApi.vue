<template>
  <div class="select-api-main-wrap" v-loading="mainLoading">
    <div class="header-wrap">
      <span class="item-wrap">
        <span class="tip">当前角色: {{role ? role.name : ""}}</span>
      </span>
    </div>
    <div class="body-wrap flex flex-x-between">
      <div class="left-wrap">
        <base-table :columns="tableColumn" header-title-icon="api" headerTitle="所有API"
          search-field="name,url,bean_name@按名称/url/类名搜" :api="apiApi" ref="addTableRef">
        </base-table>
      </div>
      <div class="center-wrap flex flex-y-center">
        <div style="width:50px;margin:0 auto;">
          <el-button type="primary" size="small" style="margin-bottom:5px;"
            @click="updateRoleApi('add')">添加<i class="el-icon-arrow-right el-icon--right"></i>
          </el-button>
          <el-button type="primary" icon="el-icon-arrow-left" size="small"
            @click="updateRoleApi('delete')">移除
          </el-button>
        </div>
      </div>
      <div class="right-wrap">
        <base-table :columns="tableColumn" header-title-icon="api" headerTitle="已加入API"
          search-field="name,url,bean_name@按名称/url/类名搜" :api="apiApi" ref="deleteTableRef" :list="getRoleApiListByObj">
        </base-table>
      </div>
    </div>
  </div>
</template>
 
<script>
import apiApi from "@/admin/api/api";
import roleApi from "@/admin/api/role";
export default {
  props: {
    role: { type: Object, default: () => {} },
  },
  data() {
    return {
      apiApi: apiApi,
      mainLoading: false,
      tableColumn: [
        { prop: "name", label: "名称", show: true },
        { prop: "url", label: "URL", show: true },
        { prop: "requestMethod", label: "请求类型", width: "90", show: true },
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
    getRoleApiListByObj(obj, success, fail) {
      if (!this.role || !this.role.id) {
        fail();
        return;
      }
      obj = obj || {};
      roleApi.listApis(this.role.id, obj).then(success).catch(fail);
    },
    updateRoleApi(flag) {
      let refPro = flag == "add" ? "addTableRef" : "deleteTableRef";
      let selectArr = this.$refs[refPro].getSelectColumn();
      if (!selectArr || selectArr.length == 0) {
        this.$message.error("请先选中需要" + (flag == "add" ? "添加" : "删除") + "的API后重试");
        return;
      }
      if (!this.role || !this.role.id) {
        this.$message.error("未获取到角色信息，请刷新后重试");
        return;
      }
      let apiIds = selectArr.map(v => v.id).join(",");
      this.mainLoading = true;
      let promise = flag == "add"
        ? roleApi.addApis(this.role.id, selectArr.map(v => v.id))
        : roleApi.deleteApis(this.role.id, apiIds);
      promise.then((res) => {
        this.mainLoading = false;
        if (res.code != 2000) return;
        this.initData();
        this.$message.success("更新成功");
      }).catch(() => {
        this.mainLoading = false;
      });
    },
  },
};
</script>
 
<style lang="scss" scoped>
.select-api-main-wrap {
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
    padding: 20px 10px 10px;

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
