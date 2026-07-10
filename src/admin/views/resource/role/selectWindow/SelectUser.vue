// 角色管理：角色选择用户
// 后端端点: POST /adminapi/role/{id}/users 添加 | DELETE /adminapi/role/{id}/users/{userIds} 移除
// POST /adminapi/role/{id}/users/list 查询已拥有用户 | POST /adminapi/user/list 查询全部用户

<template>
  <div class="select-user-main-wrap" v-loading="mainLoading">
    <div class="header-wrap">
      <span class="item-wrap">
        <span class="tip">当前角色: {{role?role.name:""}}</span>
      </span>
    </div>
    <div class="body-wrap flex flex-x-between">
      <div class="left-wrap">
        <base-table :columns="tableColumn" header-title-icon="user" headerTitle="所有用户"
          search-field="name,login_code@按姓名/账号搜" :api="userApi" ref="addTableRef">
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
        <base-table :columns="tableColumn" header-title-icon="user" headerTitle="已加入用户"
          search-field="name,login_code@按姓名/账号搜" :api="userApi" ref="deleteTableRef" :list="getRoleUserListByObj">
        </base-table>
      </div>
    </div>
  </div>

</template>
 
<script>
import userApi from "@/admin/api/user";
import roleApi from "@/admin/api/role";
export default {
  props: {
    role: { type: Object, default: () => {} },
  },
  data() {
    return {
      userApi: userApi,
      mainLoading: false,
      tableColumn: [
        { prop: "name", label: "姓名", show: true },
        { prop: "loginCode", label: "账号", show: true },
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

    // 右栏: 查询角色已拥有的用户
    getRoleUserListByObj(obj, success, fail) {
      if (!this.role || !this.role.id) {
        fail();
        return;
      }
      obj = obj || {};
      roleApi.listUsers(this.role.id, obj).then(success).catch(fail);
    },

    // 添加或移除用户
    updateRoleUser(flag) {
      let refPro = flag == "add" ? "addTableRef" : "deleteTableRef";
      let selectArr = this.$refs[refPro].getSelectColumn();
      if (!selectArr || selectArr.length == 0) {
        this.$message.error("请先选中需要" + (flag == "add" ? "添加" : "删除") + "的用户后重试");
        return;
      }
      if (!this.role || !this.role.id) {
        this.$message.error("未获取到角色信息，请刷新后重试");
        return;
      }
      let userIds = selectArr.map(v => v.id).join(",");

      this.mainLoading = true;
      let promise = flag == "add"
        ? roleApi.addUsers(this.role.id, selectArr.map(v => v.id))
        : roleApi.deleteUsers(this.role.id, userIds);

      promise.then((res) => {
        this.mainLoading = false;
        if (res.code != 2000) return;
        if (this.$refs.addTableRef.$refs.multipleTable) this.$refs.addTableRef.$refs.multipleTable.clearSelection();
        if (this.$refs.deleteTableRef.$refs.multipleTable) this.$refs.deleteTableRef.$refs.multipleTable.clearSelection();
        this.$refs.deleteTableRef.initData();
        this.$message.success("更新成功");
      }).catch(() => {
        this.mainLoading = false;
      });
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