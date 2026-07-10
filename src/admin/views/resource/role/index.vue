<template>
  <div class="app-container base-page app-container-backgroup">
    <div class="app-container-padding background-fff" :style="{ 'height': clientHeight }">

      <base-table :columns="tableColumn" header-title-icon="role"
        :show-header-button="{ add: true, delete: true, edit: true }"
        :column-button="{}" headerTitle="角色管理" search-field="name,code@按名称或编号搜索"
        showHeightSearch :heightSearchObj="heightSearchObj" :set-obj="setObj" :main-obj="mainObj" :api="api"
        :paramValidated="paramValidated" ref="tableRef">

        <!-- 头部按钮 -->
        <template #buttonSlot>
          <el-button size="small" @click="openSelectRoleWindow" plain
            type="primary" icon="el-icon-s-tools">角色资源管理
          </el-button>
          <el-button size="small" @click="openSelectApiWindow" plain
            type="primary" icon="el-icon-s-tools">角色API管理
          </el-button>
          <el-button size="small" @click="openSelectUserWindow" plain type="primary"
            icon="el-icon-s-tools">角色用户管理
          </el-button>
        </template>

        <!-- 操作按钮 -->
        <template slot="columnButton" slot-scope="scope">
          <el-button title="查看" type="text" :disabled="isBuiltInRole(scope.row)" @click.stop="showRole(scope.row)">
            <svg-icon class="tree-svg-icon" icon-class="query1" />
          </el-button>
          <el-button title="编辑" type="text" :disabled="isBuiltInRole(scope.row)" @click.stop="editRole(scope.row)">
            <svg-icon class="tree-svg-icon" icon-class="edit1" />
          </el-button>
          <el-button title="删除" type="text" :disabled="isBuiltInRole(scope.row)" @click.stop="deleteRole(scope.row)">
            <svg-icon style="color: #f56c6c;" class="tree-svg-icon" icon-class="delete1" />
          </el-button>
        </template>

        <!-- 高级搜索 -->
        <template #heightSearchSlot>
          <div class="flex search-input-wrap">
            <span class="tip">角色名称</span>
            <el-input class="value" size="small" placeholder="模糊搜索" v-model="heightSearchObj.name" />
          </div>
          <div class="flex search-input-wrap">
            <span class="tip">角色编号</span>
            <el-input class="value" size="small" placeholder="模糊搜索" v-model="heightSearchObj.code" />
          </div>
          <div class="flex search-input-wrap">
            <span class="tip">状态</span>
            <el-select class="value" size="small" clearable v-model="heightSearchObj.status" placeholder="请选择">
              <el-option v-for="(item, key) in $code.get('common_status,not_name')" :key="key" :label="item"
                :value="key">
              </el-option>
            </el-select>
          </div>
        </template>

        <!-- 编辑框 -->
        <template #editOrAddInputSlot>
          <div class="my-edit-itew-wrap">
            <div class="label not-null">角色名称</div>
            <div class="value">
              <el-input v-myfocus v-model="mainObj.name" placeholder="请输入内容">
              </el-input>
            </div>
          </div>
          <div class="my-edit-itew-wrap">
            <div class="label not-null">角色编号</div>
            <div class="value">
              <el-input v-model="mainObj.code" placeholder="编号不允许重复">
              </el-input>
            </div>
          </div>
          <div class="my-edit-itew-wrap">
            <div class="label ">顺序</div>
            <div class="value">
              <el-input v-model="mainObj.sort" placeholder="0-1000之间的整数"></el-input>
            </div>
          </div>
          <div class="my-edit-itew-wrap">
            <div class="label ">状态</div>
            <div class="value">
              <el-select class="value" size="small" clearable v-model="mainObj.status" placeholder="请选择">
                <el-option v-for="(item, key) in $code.get('common_status,not_name')" :key="key" :label="item"
                :value="key">
                </el-option>
              </el-select>
            </div>
          </div>
          <div class="my-edit-itew-wrap" style="width: 100%;height:70px;line-height:70px;">
            <div class="label ">角色描述</div>
            <div class="value">
              <el-input type="textarea" v-model="mainObj.description" placeholder=""></el-input>
            </div>
          </div>
        </template>

      </base-table>
    </div>

    <!-- 角色资源管理界面 -->
    <el-dialog class="my-dialog-window-wrap" title="" :visible.sync="showSelectResourceWindow" width="90%" center
      :close-on-click-modal="false" top="5vh">
      <select-resource style="height:520px;" :role="currentRole" ref="selectResourceRef">
      </select-resource>
    </el-dialog>

    <!-- 角色下的API管理 -->
    <el-dialog class="my-dialog-window-wrap" title="" :visible.sync="showSelectApiWindow" width="900px" center
      :close-on-click-modal="false" top="5vh">
      <select-api :role="currentRole" style="height:520px;" ref="selectApiRef"></select-api>
    </el-dialog>

    <!-- 角色下的用户管理 -->
    <el-dialog class="my-dialog-window-wrap" title="" :visible.sync="showSelectUserWindow" width="900px" center
      :close-on-click-modal="false" top="5vh">
      <select-user :role="currentRole" style="height:520px;" ref="selectUserRef"></select-user>
    </el-dialog>
  </div>
</template>

<script>
import { copyValue, clearValue, copySourceValueToTargetAttribute } from '@/common/utils';
import thisApi from "@/admin/api/role";
import SelectResource from "./selectWindow/SelectResource.vue";
import SelectApi from "./selectWindow/SelectApi.vue";
import SelectUser from "./selectWindow/SelectUser.vue";
export default {
  name: "Role",
  components: { SelectUser, SelectApi, SelectResource },
  data() {
    return {
      clientHeight: "100%", // 页面高度，必须填写，用于表格计算高度
      // 高级搜索数据====================================================
      heightSearchObj: {
        name: "",
        code: "",
        status: "",
      },
      // table表格数据==================================================
      tableColumn: [
        { prop: "name", label: "角色名称", width: "180", show: true },
        { prop: "code", label: "编号", width: "180", show: true },
        {
          prop: "status",
          label: "状态",
          width: "180",
          show: true,
          formatter: (row) => {
            if (row.status === null || row.status === undefined) return "";
            let statusMap = this.$code.get("common_status");
            return (statusMap && statusMap[String(row.status)]) || row.status;
          },
        },
        { prop: "description", label: "角色描述", show: true },
      ],

      // 增删改查相关数据 ==========================================
      // 详情数据
      mainObj: {
        id: "",
        code: "",
        name: "",
        description: "",
        sort: "",
        status: ""
      },
      currentRole: {},

      // 操作api ==================================================
      api: thisApi,

      // 选择用户 =================================================
      showSelectUserWindow: false,
      // 选择API =================================================
      showSelectApiWindow: false,
      // 选择角色 =================================================
      showSelectResourceWindow: false,
    };
  },
  computed: {},
  created() { },
  methods: {
    isBuiltInRole(row) {
      return row && ['supperAdmin', 'systemAdmin', 'user'].indexOf(row.code) !== -1;
    },
    showRole(row) {
      if (this.isBuiltInRole(row)) return;
      this.$refs.tableRef.showColumn(row);
    },
    editRole(row) {
      if (this.isBuiltInRole(row)) return;
      this.$refs.tableRef.editColumn(row);
    },
    deleteRole(row) {
      if (this.isBuiltInRole(row)) return;
      this.$refs.tableRef.deleteColumn(row);
    },
    // 给查看、新增、编辑赋初始值数据
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

        let result = { title: "角色详情", column: 2, item: item1.concat(item) };
        copyValue(result, this.mainObj);
      } else if (type == "add") {
        copyValue(data, this.mainObj);
        clearValue(this.mainObj);
        // 赋初值
        if (!this.mainObj.sort) this.mainObj.sort = 99;
        if (!this.mainObj.status) this.mainObj.status = 1;
      } else if (type == "edit") {
        copySourceValueToTargetAttribute(data, this.mainObj);
        // 赋初值
        if (!this.mainObj.sort) this.mainObj.sort = 99;
        if (!this.mainObj.status) this.mainObj.status = 1;
      } else if (type == "page") {
        this.$code.forEach(data, {
          status: "common_status",
        });
      }
    },
    // 校验参数
    paramValidated(type) {
      let data = this.mainObj;
      let errorInfo = "";
      // 新增
      if (type == "add") {
        if (!data.name) errorInfo = "角色名称不能为空";
        if (!data.code) errorInfo = "角色编号不能为空";
        return errorInfo;
      }

      // 编辑
      if (!data.name) errorInfo = "角色名称不能为空";
      if (!data.code) errorInfo = "角色编号不能为空";
      return errorInfo;
    },
    // 获取选中数据
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
      if (size == 1) this.currentRole = selectArr[0];

      return true;
    },

    // 选择用户 =================================================
    openSelectRoleWindow() {
      // 获取选中数据
      let isOk = this.getSelectData(1);
      if (!isOk) return;
      // 显示
      this.showSelectResourceWindow = true;
      // 调用初始化方法
      this.$nextTick(() => {
        this.$refs.selectResourceRef.initData();
      });
    },
    // 选择API =================================================
    openSelectApiWindow() {
      // 获取选中数据
      let isOk = this.getSelectData(1);
      if (!isOk) return;
      // 显示
      this.showSelectApiWindow = true;
      // 调用初始化方法
      this.$nextTick(() => {
        this.$refs.selectApiRef.initData();
      });
    },
    // 选择用户 =================================================
    openSelectUserWindow() {
      // 获取选中数据
      let isOk = this.getSelectData(1);
      if (!isOk) return;
      // 显示
      this.showSelectUserWindow = true;
      // 调用初始化方法
      this.$nextTick(() => {
        this.$refs.selectUserRef.initData();
      });
    },
    // 增删改查方法 ===========================
    // 增加
    // addObj(success) {
    //   thisApi.addOne(this.mainObj).then(success);
    // },
    // // 修改
    // editObj(success) {
    //   thisApi.updateById(this.mainObj).then(success);
    // },
    // // 分页查询
    // getListByObj(data, success, fail) {
    //   thisApi.getListByObj(data).then(success).catch(fail);
    // },
    // // 删除单项
    // deleteObj(data, success) {
    //   thisApi.deleteByIds(data).then(success);
    // },
    // // 删除多条数据
    // deleteObjArray(dataArray, success) {
    //   thisApi.deleteByIds(dataArray).then(success);
    // },
  },
};
</script>

<style lang="scss" scoped>
.my-dialog-window-wrap {
  min-width: 600px;
}
</style>
