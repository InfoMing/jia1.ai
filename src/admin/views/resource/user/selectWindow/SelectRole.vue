<template>
  <div class="select-role-main-wrap" v-loading="mainLoading">
    <div class="header-wrap">
      <span class="item-wrap">
        <span class="tip">当前用户: {{user ? user.name : ""}}</span>
      </span>
    </div>

    <div class="body-wrap flex flex-x-between">
      <div class="left-wrap">
        <base-table :columns="tableColumn" header-title-icon="role" headerTitle="待加入角色"
          search-field="name,code@按名称/编号搜" :api="roleApi" ref="addTableRef" :list="getPendingRoleListByObj">
        </base-table>
      </div>
      <div class="center-wrap flex flex-y-center">
        <div style="width:50px;margin:0 auto;">
          <el-button type="primary" size="small" style="margin-bottom:5px;"
            @click="updateRoleUser('add')">添加<i class="el-icon-arrow-right el-icon--right"></i>
          </el-button>
          <el-button type="primary" icon="el-icon-arrow-left" size="small"
            @click="updateRoleUser('delete')">移除
          </el-button>
        </div>
      </div>
      <div class="right-wrap">
        <base-table :columns="tableColumn" header-title-icon="role" headerTitle="已拥有角色"
          search-field="name,code@按名称/编号搜" :api="roleApi" ref="deleteTableRef" :list="getRoleListByObj">
        </base-table>
      </div>
    </div>
  </div>
</template>
 
<script>
import roleApi from "@/admin/api/role";
import userApi from "@/admin/api/user";
export default {
  props: {
    user: { type: Object, default: () => {} },
  },
  data() {
    return {
      roleApi: roleApi,
      mainLoading: false,
      selectedRoleIds: [],
      tableColumn: [
        { prop: "name", label: "角色名称", show: true },
        { prop: "code", label: "编号", show: true },
      ],
    };
  },
  mounted() {
    this.initData();
  },
  methods: {
    initData() {
      this.loadSelectedRoleIds().then(() => {
        this.$refs.addTableRef.initData();
        this.$refs.deleteTableRef.initData();
      });
    },
    loadSelectedRoleIds() {
      if (!this.user || !this.user.id) return Promise.resolve();
      return userApi.listRoles(this.user.id, {
        pageParameter: { pageNum: 1, pageSize: 9999 }
      }).then(res => {
        if (res.code != 2000) return;
        const list = res.data.list || [];
        this.selectedRoleIds = list.map(v => v.id);
      });
    },
    getPendingRoleListByObj(obj, success, fail) {
      if (!this.user || !this.user.id) {
        fail();
        return;
      }
      obj = obj || {};
      const pageParameter = obj.pageParameter || { pageNum: 1, pageSize: 10 };
      roleApi.list({ pageParameter: { pageNum: 1, pageSize: 9999 } }).then(res => {
        if (res.code != 2000) {
          success(res);
          return;
        }
        const selectedSet = new Set(this.selectedRoleIds);
        let list = (res.data.list || []).filter(v => !selectedSet.has(v.id));
        list = this.filterRoleList(list, obj);
        const total = list.length;
        const pageNum = pageParameter.pageNum || 1;
        const pageSize = pageParameter.pageSize || 10;
        const start = (pageNum - 1) * pageSize;
        const end = start + pageSize;
        success({ code: 2000, data: { list: list.slice(start, end), total: total } });
      }).catch(fail);
    },
    getRoleListByObj(obj, success, fail) {
      if (!this.user || !this.user.id) {
        fail();
        return;
      }
      obj = obj || {};
      userApi.listRoles(this.user.id, obj).then(success).catch(fail);
    },
    filterRoleList(list, obj) {
      if (!obj || !obj.match || obj.match.length == 0) return list;
      return list.filter(role => {
        return obj.match.some(item => {
          const value = role[item.key];
          return value && value.indexOf(item.value) !== -1;
        });
      });
    },
    updateRoleUser(flag) {
      let refPro = flag == "add" ? "addTableRef" : "deleteTableRef";
      let selectArr = this.$refs[refPro].getSelectColumn();
      if (!selectArr || selectArr.length == 0) {
        this.$message.error("请先选中需要" + (flag == "add" ? "添加" : "删除") + "的角色后重试");
        return;
      }
      if (!this.user || !this.user.id) {
        this.$message.error("未获取到用户信息，请刷新后重试");
        return;
      }
      let roleIds = selectArr.map(v => v.id).join(",");

      this.mainLoading = true;
      let promise = flag == "add"
        ? userApi.addRoles(this.user.id, selectArr.map(v => v.id))
        : userApi.deleteRoles(this.user.id, roleIds);

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
.select-role-main-wrap {
  text-align: left;
  .header-wrap {
    height: 40px;
    padding: 0;
    line-height: 40px;
    font-size: 16px;
    left: 20px;
    position: absolute;
    top: 10px;
    border-bottom: 1px solid #dcdfe6;
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
