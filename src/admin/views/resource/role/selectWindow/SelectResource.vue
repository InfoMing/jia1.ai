<template>
  <div class="select-resource-main-wrap" v-loading="mainLoading">
    <div class="header-wrap">
      <span class="item-wrap">
        <span class="tip">当前角色: {{role ? role.name : ""}}</span>
      </span>
    </div>
    <div class="body-wrap flex flex-x-between">
      <div class="left-wrap">
        <base-table :columns="tableColumn" header-title-icon="resource" headerTitle="待加入资源"
          search-field="name,code@按名称/编码搜" :api="resourceApi" ref="addTableRef" :list="getPendingResourceListByObj">
        </base-table>
      </div>
      <div class="center-wrap flex flex-y-center">
        <div style="width:50px;margin:0 auto;">
          <el-button type="primary" size="small" style="margin-bottom:5px;"
            @click="updateRoleResource('add')">添加<i class="el-icon-arrow-right el-icon--right"></i>
          </el-button>
          <el-button type="primary" icon="el-icon-arrow-left" size="small"
            @click="updateRoleResource('delete')">移除
          </el-button>
        </div>
      </div>
      <div class="right-wrap">
        <base-table :columns="tableColumn" header-title-icon="resource" headerTitle="已加入资源"
          search-field="name,code@按名称/编码搜" :api="resourceApi" ref="deleteTableRef" :list="getRoleResourceListByObj">
        </base-table>
      </div>
    </div>
  </div>
</template>

<script>
import resourceApi from "@/admin/api/resource";
import roleApi from "@/admin/api/role";

export default {
  props: {
    role: { type: Object, default: () => {} },
  },
  data() {
    return {
      resourceApi: resourceApi,
      mainLoading: false,
      selectedResourceIds: [],
      tableColumn: [
        { prop: "name", label: "资源名称", show: true },
        { prop: "code", label: "资源编码", show: true },
        {
          prop: "type",
          label: "类型",
          width: "80",
          show: true,
          formatter: (row) => {
            if (row.type === null || row.type === undefined) return "";
            let typeMap = this.$code.get("my_sys_resource@type");
            return (typeMap && typeMap[String(row.type)]) || row.type;
          },
        },
      ],
    };
  },
  mounted() {
    this.initData();
  },
  methods: {
    initData() {
      this.loadSelectedResourceIds().then(() => {
        this.$refs.addTableRef.initData();
        this.$refs.deleteTableRef.initData();
      });
    },
    loadSelectedResourceIds() {
      if (!this.role || !this.role.id) return Promise.resolve();
      return roleApi.listResources(this.role.id, {
        pageParameter: { pageNum: 1, pageSize: 9999 }
      }).then(res => {
        if (res.code != 2000) return;
        const list = res.data.list || [];
        this.selectedResourceIds = list.map(v => v.id);
      });
    },
    getPendingResourceListByObj(obj, success, fail) {
      if (!this.role || !this.role.id) {
        fail();
        return;
      }
      obj = obj || {};
      const pageParameter = obj.pageParameter || { pageNum: 1, pageSize: 10 };
      resourceApi.getAllList({}).then(res => {
        if (res.code != 2000) {
          success(res);
          return;
        }
        const selectedSet = new Set(this.selectedResourceIds);
        let list = (res.data.list || []).filter(v => !selectedSet.has(v.id));
        list = this.filterResourceList(list, obj);
        const total = list.length;
        const pageNum = pageParameter.pageNum || 1;
        const pageSize = pageParameter.pageSize || 10;
        const start = (pageNum - 1) * pageSize;
        const end = start + pageSize;
        success({
          code: 2000,
          data: {
            list: list.slice(start, end),
            total: total
          }
        });
      }).catch(fail);
    },
    getRoleResourceListByObj(obj, success, fail) {
      if (!this.role || !this.role.id) {
        fail();
        return;
      }
      obj = obj || {};
      roleApi.listResources(this.role.id, obj).then(success).catch(fail);
    },
    filterResourceList(list, obj) {
      if (!obj || !obj.match || obj.match.length == 0) return list;
      return list.filter(resource => {
        return obj.match.some(item => {
          const value = resource[item.key];
          return value && value.indexOf(item.value) !== -1;
        });
      });
    },
    updateRoleResource(flag) {
      let refPro = flag == "add" ? "addTableRef" : "deleteTableRef";
      let selectArr = this.$refs[refPro].getSelectColumn();
      if (!selectArr || selectArr.length == 0) {
        this.$message.error("请先选中需要" + (flag == "add" ? "添加" : "删除") + "的资源后重试");
        return;
      }
      if (!this.role || !this.role.id) {
        this.$message.error("未获取到角色信息，请刷新后重试");
        return;
      }
      let resourceIds = selectArr.map(v => v.id).join(",");
      this.mainLoading = true;
      let promise = flag == "add"
        ? roleApi.addResources(this.role.id, selectArr.map(v => v.id))
        : roleApi.deleteResources(this.role.id, resourceIds);
      promise.then((res) => {
        this.mainLoading = false;
        if (res.code != 2000) return;
        if (this.$refs.addTableRef.$refs.multipleTable) this.$refs.addTableRef.$refs.multipleTable.clearSelection();
        if (this.$refs.deleteTableRef.$refs.multipleTable) this.$refs.deleteTableRef.$refs.multipleTable.clearSelection();
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
.select-resource-main-wrap {
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
