<template>
  <div class="app-container base-page app-container-backgroup">
    <div class="user-wrap background-fff" :style="{ 'height': clientHeight, 'padding': '10px' }">

      <base-table :columns="tableColumn" header-title-icon="role" headerTitle="用户管理" :show-header-button="{ add: true, delete: true, edit: true }"
        :column-button="{ delete: true, query: true, edit: true }" search-field="name,nickname@按姓名或昵称搜索"
        showHeightSearch :heightSearchObj="heightSearchObj" :set-obj="setObj" :main-obj="mainObj" :api="api"
        :paramValidated="paramValidated" ref="tableRef">

        <template #buttonSlot>
          <el-button size="small" @click="openSelectRoleWindow" plain type="primary"
            icon="el-icon-s-tools">管理用户角色
          </el-button>
        </template>

        <template #heightSearchSlot>
          <div class="flex search-input-wrap">
            <span class="tip">姓名</span>
            <el-input class="value" size="small" placeholder="模糊搜索" v-model="heightSearchObj.name" />
          </div>
          <div class="flex search-input-wrap">
            <span class="tip">登录账号</span>
            <el-input class="value" size="small" placeholder="模糊搜索" v-model="heightSearchObj.loginCode" />
          </div>
          <div class="flex search-input-wrap">
            <span class="tip">性别</span>
            <el-input class="value" size="small" placeholder="模糊搜索" v-model="heightSearchObj.sex" />
          </div>
          <div class="flex search-input-wrap">
            <span class="tip">状态</span>
            <el-select class="value" size="small" clearable v-model="heightSearchObj.status" placeholder="请选择">
              <el-option v-for="(item, key) in $code.get('common_status,not_name')" :key="key" :label="item"
                :value="key">
              </el-option>
            </el-select>
          </div>
          <div class="flex search-input-wrap">
            <span class="tip">昵称</span>
            <el-input class="value" size="small" placeholder="模糊搜索" v-model="heightSearchObj.nickname" />
          </div>
          <div class="flex search-input-wrap">
            <span class="tip">身份证号</span>
            <el-input class="value" size="small" placeholder="模糊搜索" v-model="heightSearchObj.idNumber" />
          </div>
          <div class="flex search-input-wrap">
            <span class="tip">手机号码</span>
            <el-input class="value" size="small" placeholder="模糊搜索" v-model="heightSearchObj.phoneNumber" />
          </div>
        </template>

        <template #editOrAddInputSlot>
          <div class="my-edit-itew-wrap">
            <div class="label not-null">姓名</div>
            <div class="value">
              <el-input v-myfocus v-model="mainObj.name" placeholder="请输入内容">
              </el-input>
            </div>
          </div>
          <div class="my-edit-itew-wrap">
            <div class="label not-null">昵称</div>
            <div class="value">
              <el-input v-model="mainObj.nickname" placeholder="">
              </el-input>
            </div>
          </div>
          <div class="my-edit-itew-wrap">
            <div class="label">身份证号码</div>
            <div class="value">
              <el-input v-model="mainObj.idNumber" placeholder="不允许重复">
              </el-input>
            </div>
          </div>
          <div class="my-edit-itew-wrap">
            <div class="label not-null">登录编号</div>
            <div class="value">
              <el-input v-model="mainObj.loginCode" placeholder="编号不允许重复">
              </el-input>
            </div>
          </div>
          <div class="my-edit-itew-wrap">
            <div class="label">密码</div>
            <div class="value">
              <el-input v-model="mainObj.password" placeholder="">
              </el-input>
            </div>
          </div>
          <div class="my-edit-itew-wrap">
            <div class="label">手机号码</div>
            <div class="value">
              <el-input v-model="mainObj.phoneNumber" placeholder="">
              </el-input>
            </div>
          </div>
          <div class="my-edit-itew-wrap">
            <div class="label">头像</div>
            <div class="value">
              <el-input v-model="mainObj.headPortraitUrl" placeholder="">
              </el-input>
            </div>
          </div>
          <div class="my-edit-itew-wrap">
            <div class="label">性别</div>
            <div class="value">
              <el-input v-model="mainObj.sex" placeholder="">
              </el-input>
            </div>
          </div>
          <div class="my-edit-itew-wrap">
            <div class="label">生日</div>
            <div class="value">
              <el-input v-model="mainObj.birthday" placeholder="">
              </el-input>
            </div>
          </div>
          <div class="my-edit-itew-wrap">
            <div class="label">邮箱</div>
            <div class="value">
              <el-input v-model="mainObj.mail" placeholder="">
              </el-input>
            </div>
          </div>
          <div class="my-edit-itew-wrap">
            <div class="label">状态</div>
            <div class="value">
              <el-select class="value" size="small" clearable v-model="mainObj.status" placeholder="请选择">
                <el-option v-for="(item, key) in $code.get('common_status,not_name')" :key="key" :label="item"
                  :value="key.toLowerCase()">
                </el-option>
              </el-select>
            </div>
          </div>
          <div class="my-edit-itew-wrap" style="width: 100%;height:70px;line-height:70px;">
            <div class="label ">用户备注</div>
            <div class="value">
              <el-input type="textarea" v-model="mainObj.description" placeholder=""></el-input>
            </div>
          </div>
        </template>

      </base-table>
    </div>

    <el-dialog class="my-dialog-window-wrap" title="" :visible.sync="showSelectRoleWindow" width="900px" center
      :close-on-click-modal="false" top="5vh">
      <select-role style="height:520px;" :user="currentUser" ref="selectRoleRef" />
    </el-dialog>
  </div>
</template>

<script>
import { copyValue, clearValue, copySourceValueToTargetAttribute } from '@/common/utils';
import thisApi from "@/admin/api/user";
import SelectRole from "./selectWindow/SelectRole.vue";
export default {
  name: "User",
  components: { SelectRole },
  data() {
    return {
      clientHeight: "100%",
      heightSearchObj: {
        name: null,
        nickname: null,
        idNumber: null,
        loginCode: null,
        phoneNumber: null,
        sex: null,
        birthday: null,
        mail: null,
        status: null,
      },
      tableColumn: [
        { prop: "name", label: "用户姓名", width: "180", show: true, fixed: "left" },
        { prop: "nickname", label: "昵称", width: "180", show: true },
        { prop: "idNumber", label: "身份证号码", width: "180", show: true },
        { prop: "loginCode", label: "登录编号", show: true },
        { prop: "phoneNumber", label: "手机号码", show: true },
        { prop: "headPortraitUrl", label: "头像", show: false },
        {
          prop: "sex",
          label: "性别",
          show: true,
          formatter: (row) => {
            if (row.sex === 1) return '男';
            if (row.sex === 0) return '女';
            return row.sex || '';
          },
        },
        { prop: "birthday", label: "生日", show: true },
        { prop: "mail", label: "邮箱", show: true },
        {
          prop: "status",
          label: "状态",
          show: true,
          formatter: (row) => {
            if (row.status === null || row.status === undefined) return "";
            let statusMap = this.$code.get("common_status");
            return (statusMap && statusMap[String(row.status)]) || row.status;
          },
        },
        { prop: "enable", label: "启用", show: false },
        { prop: "description", label: "用户描述", show: true },
        { prop: "lastLoginIp", label: "最后登录ip", show: true },
        { prop: "lastLoginTime", label: "最后登录时间", show: true },
        { prop: "createTime", label: "创建时间", show: true },
      ],
      mainObj: {
        id: null,
        name: null,
        nickname: null,
        idNumber: null,
        loginCode: null,
        phoneNumber: null,
        headPortraitUrl: null,
        sex: null,
        birthday: null,
        mail: null,
        status: null,
        description: null,
      },
      api: thisApi,
      showSelectRoleWindow: false,
      currentUser: {},
    };
  },
  methods: {
    initData() {
      this.$refs.tableRef.initData();
    },
    setObj(data, type) {
      if (type == "query") {
        let item1 = new Array();
        this.$code.forEach(data, {
          status: "common_status",
        });
        this.tableColumn.map((v, k) => {
          item1.push({
            label: v.label,
            value: data[v.prop + "_name"] || data[v.prop],
          });
        });

        let item = [
          {
            label: "创建时间",
            value: data.createTime,
            valueStyle: "width:40%;",
          },
          {
            label: "更新时间",
            value: data.updateTime,
            valueStyle: "width:40%;",
          },
        ];
        let result = { title: "用户详情", column: 2, item: item1.concat(item) };
        copyValue(result, this.mainObj);
      } else if (type == "add") {
        copyValue(data, this.mainObj);
        clearValue(this.mainObj);
        if (!this.mainObj.status) this.mainObj.status = 1;
      } else if (type == "edit") {
        copySourceValueToTargetAttribute(data, this.mainObj);
        if (!this.mainObj.status) this.mainObj.status = 1;
      }
    },
    paramValidated(type) {
      let data = this.mainObj;
      let errorInfo = "";
      if (!data.name) errorInfo = "用户姓名不能为空";
      if (!data.loginCode) errorInfo = "登录编号不能为空";
      return errorInfo;
    },
    openSelectRoleWindow() {
      let isOk = this.getSelectData(1);
      if (!isOk) return;
      this.showSelectRoleWindow = true;
      this.$nextTick(() => {
        this.$refs.selectRoleRef.initData();
      });
    },
    getSelectData(size) {
      if (!size) size = 999;
      let selectArr = this.$refs.tableRef.getSelectColumn();
      if (size == 1 && selectArr.length != size) {
        this.$message.error(
          "请选中一数据重试，当前选中" + selectArr.length + "条"
        );
        return false;
      }
      if (size && selectArr.length > size) {
        this.$message.error("只能选中" + selectArr.length + "条数据，请重试");
        return false;
      }
      if (size == 1) this.currentUser = selectArr[0];

      return true;
    },
  },
};
</script>

<style scoped>
.user-wrap {
  padding: 10px;
}
</style>
