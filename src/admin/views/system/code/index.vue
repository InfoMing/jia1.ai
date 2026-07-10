<template>
  <div class="app-container base-page app-container-backgroup flex" v-loading="allCodeLoading">
    <!-- 左边主要码表信息 -->
    <div class="left-wrap app-container-padding background-fff" :style="{ 'height': clientHeight }">
      <base-table :columns="code.tableColumn" header-title-icon="company"
        :show-header-button="{ add: 'code_main_add', delete: 'code_main_delete' }" header-title="码表索引"
        search-field="code,name@按编号或名称搜索" :set-obj="setCodeObj" :main-obj="code.mainObj" :api="code.api"
        :param-validated="codeParamValidated" :row-click="rowClick" :row-double-click="true"
        :column-button="{ edit: 'code_info_edit', query: 'code_info_query' }" :columnButtonWidth="'65px'" ref="codeRef">

        <!-- 头部按钮 -->
        <template #buttonSlot>
        </template>

        <!-- 编辑框 -->
        <template #editOrAddInputSlot>
          <div class="my-edit-itew-wrap">
            <div class="label not-null">编号</div>
            <div class="value">
              <el-input v-myfocus v-model="code.mainObj.code" placeholder="编号不允许重复">
              </el-input>
            </div>
          </div>
          <div class="my-edit-itew-wrap">
            <div class="label not-null">名称</div>
            <div class="value">
              <el-input ref="name" v-model="code.mainObj.name" placeholder="1-100个汉字">
              </el-input>
            </div>
          </div>
          <div class="my-edit-itew-wrap">
            <div class="label ">状态</div>
            <div class="value">
              <el-select v-model="code.mainObj.status" clearable placeholder="选择状态">
                <el-option v-for="item in code.status" :key="item.value" :label="item.label" :value="item.value"
                  :disabled="item.disabled">
                </el-option>
              </el-select>
            </div>
          </div>
          <div class="my-edit-itew-wrap">
            <div class="label ">类型</div>
            <div class="value">
              <el-select v-model="code.mainObj.type" clearable placeholder="选择类型">
                <el-option v-for="item in code.type" :key="item.value" :label="item.label" :value="item.value"
                  :disabled="item.disabled">
                </el-option>
              </el-select>
            </div>
          </div>
          <div class="my-edit-itew-wrap">
            <div class="label ">排序</div>
            <div class="value">
              <el-input v-model="code.mainObj.sort" placeholder="0-1000之间的整数"></el-input>
            </div>
          </div>
          <div class="my-edit-itew-wrap" style="width: 100%;height:70px;line-height:70px;">
            <div class="label ">描述</div>
            <div class="value">
              <el-input type="textarea" v-model="code.mainObj.description" placeholder="">
              </el-input>
            </div>
          </div>
        </template>

      </base-table>
    </div>

    <!-- 码表详细信息 -->
    <div class="right-wrap app-container-padding background-fff" :style="{ 'height': clientHeight }">
      <base-table :columns="info.tableColumn" header-title-icon="company"
        :show-header-button="{ add: 'code_info_add', delete: 'code_info_delete' }" headerTitle="详细信息"
        search-field="code,value,description@搜索编号或者描述"
        :column-button="{ delete: 'code_info_delete', query: 'code_info_query', edit: 'code_info_edit' }"
        :set-obj="setInfoObj" :main-obj="info.mainObj" :api="info.api" :param-validated="infoParamValidated"
        :list="getInfoListByObj" ref="infoRef">

        <!-- 头部按钮 -->
        <template #buttonSlot>
          <el-button v-show="'code_info_refresh'" size="small" plain type="primary" @click="refreshCache"
            icon="el-icon-refresh">
            刷新缓存
          </el-button>
        </template>

        <!-- 高级搜索 -->
        <template #heightSearchSlot>
          <el-input size="small" placeholder="编号Code" v-model="info.heightSearchObj.code" />
        </template>

        <!-- 编辑框 -->
        <template #editOrAddInputSlot>
          <div class="my-edit-itew-wrap">
            <div class="label">主码表名称</div>
            <div class="value">
              <el-input v-model="info.mainObj.codeName" placeholder="" disabled />
            </div>
          </div>
          <div class="my-edit-itew-wrap">
            <div class="label not-null">编号</div>
            <div class="value">
              <el-input v-myfocus v-model="info.mainObj.code" placeholder="编号不允许重复">
              </el-input>
            </div>
          </div>
          <div class="my-edit-itew-wrap">
            <div class="label not-null">码表值</div>
            <div class="value">
              <el-input ref="name" v-model="info.mainObj.value" placeholder="请输入内容">
              </el-input>
            </div>
          </div>
          <div class="my-edit-itew-wrap">
            <div class="label ">排序</div>
            <div class="value">
              <el-input v-model="info.mainObj.sort" placeholder="0-1000之间的整数"></el-input>
            </div>
          </div>
          <div class="my-edit-itew-wrap" style="width: 100%;height:70px;line-height:70px;">
            <div class="label ">描述</div>
            <div class="value">
              <el-input type="textarea" v-model="info.mainObj.description" placeholder="">
              </el-input>
            </div>
          </div>
        </template>

      </base-table>
    </div>

  </div>
</template>

<script>
import { copyValue, clearValue, copySourceValueToTargetAttribute } from '@/common/utils';
import codeApi from "@/admin/api/code";
import codeInfoApi from "@/admin/api/codeInfo";
export default {
  name: "Code",
  components: {},
  data() {
    return {
      clientHeight: "100%", // 页面高度，必须填写，用于表格计算高度
      allCodeLoading: false, // 加载框

      // 左边码表主信息
      code: {
        // api信息
        api: codeApi,
        // 表头列
        tableColumn: [
          { prop: "code", label: "编号", show: true },
          { prop: "name", label: "名称", show: true },
          { prop: "sort", label: "排序", show: true, width: '50px' },
          {
            prop: "type", label: "类型", show: true, width: '70px',
            formatter: (row, column, cellValue) =>
              this.code.type.find(item => item.value === cellValue) ?
                this.code.type.find(item => item.value === cellValue).label : cellValue
          },
          {
            prop: "status", label: "状态", show: true, width: '40px',
            formatter: (row, column, cellValue) =>
              this.code.status.find(item => item.value === cellValue) ?
                this.code.status.find(item => item.value === cellValue).label : cellValue
          },
        ],
        // 码表主信息
        mainObj: {
          id: "",
          code: "",
          name: "",
          description: "",
          sort: "",
          type: "",
          status: "",
        },
        // 当前点击到的数据
        currentClickData: {},
        type: [
          { value: 2, label: "自定义" },
          { value: 1, label: "系统" },
          { value: 3, label: "初始化", disabled: true }
        ],
        status: [
          { value: 1, label: "启用" },
          { value: 0, label: "禁用" }
        ]
      },

      // 右边码表详细信息
      info: {
        // api信息
        api: codeInfoApi,
        // 表头列
        tableColumn: [
          { prop: "code", label: "编号", show: true },
          { prop: "value", label: "值", show: true },
          { prop: "sort", label: "排序", show: true, width: '50px' },
          {
            prop: "status", label: "状态", show: true, width: '40px',
            formatter: (row, column, cellValue) =>
              this.code.status.find(item => item.value === cellValue) ?
                this.code.status.find(item => item.value === cellValue).label : cellValue
          },
          { prop: "description", label: "描述", show: true },
        ],
        // 码表主信息
        mainObj: {
          id: "",
          mainCodeId: "",
          codeName: "",
          code: "",
          value: "",
          name: "",
          description: "",
          parentId: "",
          parentName: "",
          sort: "",
        },
        // 高级搜索数据
        heightSearchObj: {
          code: "",
          value: "",
        },
        status: [
          { value: 1, label: "启用" },
          { value: 0, label: "禁用" }
        ]
      },
    };
  },
  computed: {},
  created() { },
  methods: {
    // 左边主码表信息 ====================================================
    // 给查看、新增、编辑赋初始值数据
    setCodeObj(data, type) {
      if (type == "query") {
        let status = this.code.status.find(item => item.value === data.status);
        status = status ? status.label : "";
        let type = this.code.type.find(item => item.value === data.type);
        type = type ? type.label : "";

        let item = [
          { label: "主键ID", value: data.id },
          { label: "编号", value: data.code },
          { label: "名称", value: data.name },
          { label: "状态", value: status },
          { label: "类型", value: type },
          { label: "排序", value: data.sort },
          { label: "描述", value: data.description, valueStyle: "width:90%;", span: 2 },
          { label: "创建人", value: data.createUserId },
          { label: "创建时间", value: data.createTime },
          { label: "更新人", value: data.updateUserId },
          { label: "更新时间", value: data.updateTime },
        ];
        let result = { title: "码表索引详情", column: 2, item: item };
        copyValue(result, this.code.mainObj);
      } else if (type == "add") {
        copyValue(data, this.code.mainObj);
        clearValue(this.code.mainObj);
        // 赋初值
        if (!this.code.mainObj.sort) this.code.mainObj.sort = 99;
        if (!this.code.mainObj.status) this.code.mainObj.status = 1;
        if (!this.code.mainObj.type) this.code.mainObj.type = 2;
      } else if (type == "edit") {
        copySourceValueToTargetAttribute(data, this.code.mainObj);
        // 赋值
        if (!this.code.mainObj.sort) this.code.mainObj.sort = 99;
      } else if (type == "page") {

      }
    },
    // 校验参数
    codeParamValidated(type) {
      let data = this.code.mainObj;
      let errorInfo = "";
      if (!data.name) errorInfo = "名称不能为空";
      if (!data.code) errorInfo = "编号不能为空";
      return errorInfo;
    },
    // 单击码表操作
    rowClick(row, column, event) {
      this.code.currentClickData = row;
      this.$refs.infoRef.initData();
    },
    // 双击码表操作
    rowDbClick(row, column, event) {
      console.log("双击事件开始啦")
    },
    // 右边详细信息 ====================================================
    // 给查看、新增、编辑赋初始值数据
    setInfoObj(data, type) {
      if (type == "query") {
        let status = this.info.status.find(item => item.value === data.status);
        status = status ? status.label : "";
        let item = [
          { label: "主键ID", value: data.id },
          { label: "编号", value: data.code },
          { label: "状态", value: status },
          { label: "排序", value: data.sort },
          { label: "创建人", value: data.createUserId },
          { label: "创建时间", value: data.createTime },
          { label: "更新人", value: data.updateUserId },
          { label: "更新时间", value: data.updateTime },
          { label: "描述", value: data.description, valueStyle: "width:90%;", span: 2 },
        ];
        let result = { title: "码表详细信息详情", column: 2, item: item };
        copyValue(result, this.info.mainObj);
      } else if (type == "add") {
        copyValue(data, this.info.mainObj);
        clearValue(this.info.mainObj);
        if (!this.code.currentClickData.id) {
          return "未选择主码表，请选择一条主码表后重新操作";
        }
        // 赋初值
        this.info.mainObj.mainCodeId = this.code.currentClickData.id;
        this.info.mainObj.codeName = this.code.currentClickData.name;
        this.info.mainObj.sort = 99;
      } else if (type == "edit") {
        copySourceValueToTargetAttribute(data, this.info.mainObj);
        if (!this.code.currentClickData.id) return;
        // 赋初值
        this.info.mainObj.mainCodeId = this.code.currentClickData.id;
        this.info.mainObj.codeName = this.code.currentClickData.name;
        if (this.info.mainObj.sort) this.info.mainObj.sort = 99;
      }
    },
    // 校验参数
    infoParamValidated(type) {
      let data = this.info.mainObj;
      let errorInfo = "";
      if (!data.value) errorInfo = "码表值不能为空";
      if (!data.code) errorInfo = "编号不能为空";
      return errorInfo;
    },
    // 分页查询
    getInfoListByObj(data, success, fail) {
      if (!this.code.currentClickData || !this.code.currentClickData.id) {
        // console.log("请求码表主信息id不存在");
        fail();
        return;
      }
      data = data ? data : {};
      data.mainCodeId = this.code.currentClickData.id;
      codeInfoApi.list(data).then(success).catch(fail);
    },

    // 刷新数据库缓存
    refreshCache() {
      this.$confirm("确定刷新缓存?", "", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        showClose: false, // 显示关闭按钮
        closeOnClickModal: false, // 点击其他地方关闭
        center: true, // 居中
      })
        .then(() => {
          this.allCodeLoading = true;
          codeApi
            .refreshCache()
            .then((res) => {
              this.allCodeLoading = false;
              if (!res.success) return;
              this.$message.success("刷新成功");
            })
            .catch((error) => (this.allCodeLoading = false));
        })
        .catch((error) => { });
    },
  },
};
</script>

<style scoped lang="scss">
.left-wrap,
.right-wrap {
  display: inline-block;
  overflow: hidden;
}

.left-wrap {
  width: 40%;
  min-width: 300px;
}

.right-wrap {
  width: 60%;
  min-width: 500px;
}
</style>
