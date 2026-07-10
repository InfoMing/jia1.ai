<template>
  <div class="app-container base-page app-container-backgroup">
    <div class="app-container-padding background-fff" :style="{'height':clientHeight}">

      <base-table :columns="tableColumn" header-title-icon="company"
        :show-header-button="{add:'company_add',delete:'company_delete',edit:'company_edit',showColumn:true,export:'company_export'}"
        :column-button="{add:'company_add',delete:'company_delete',query:'company_query',edit:'company_edit'}"
        headerTitle="企业(公司/单位/组织)管理" search-field="name,按名称搜索" showHeightSearch
        :heightSearchObj="heightSearchObj" :set-obj="setObj" :main-obj="mainObj" :api="api"
        :paramValidated="paramValidated" columnButtonWidth="130px">

        <!-- 头部按钮 -->
        <template #buttonSlot>
        </template>

        <!-- 高级搜索 -->
        <template #heightSearchSlot>
          <el-input size="small" placeholder="编号Code" v-model="heightSearchObj.code" />
        </template>

        <!-- 编辑框 -->
        <template #editOrAddInputSlot>
          <div class="my-edit-itew-wrap">
            <div class="label">企业编号</div>
            <div class="value">
              <el-input v-model="mainObj.code" placeholder="编号不允许重复">
              </el-input>
            </div>
          </div>
          <div class="my-edit-itew-wrap">
            <div class="label not-null">企业名称</div>
            <div class="value">
              <el-input v-myfocus v-model="mainObj.name" placeholder="请输入内容">
              </el-input>
            </div>
          </div>
          <div class="my-edit-itew-wrap">
            <div class="label ">顺序</div>
            <div class="value">
              <el-input v-model="mainObj.dataOrder" placeholder="0-1000之间的整数"></el-input>
            </div>
          </div>
          <div class="my-edit-itew-wrap" style="width: 100%;height:70px;line-height:70px;">
            <div class="label ">企业描述</div>
            <div class="value">
              <el-input type="textarea" v-model="mainObj.dataDescribe" placeholder=""></el-input>
            </div>
          </div>
        </template>

      </base-table>
    </div>
  </div>
</template>

<script>
import { copyValue, clearValue } from '@/common/utils';
import thisApi from "@/admin/api/company";
export default {
  name: "Company",
  components: {},
  data() {
    return {
      clientHeight: "100%", // 页面高度，必须填写，用于表格计算高度
      // 高级搜索数据====================================================
      heightSearchObj: {
        code: "",
      },
      // table表格数据==================================================
      tableColumn: [
        { prop: "name", label: "企业名称", width: "180", show: true },
        { prop: "code", label: "企业编号", width: "180", show: true },
        { prop: "dataDescribe", label: "企业描述", show: true },
      ],

      // 增删改查相关数据 ==========================================
      // 详情数据
      mainObj: {
        id: "",
        code: "",
        name: "",
        dataDescribe: "",
        dataOrder: "",
      },

      // 操作api ==================================================
      api: thisApi,
    };
  },
  computed: {},
  created() {},
  methods: {
    // 给查看、新增、编辑赋初始值数据
    setObj(data, type) {
      if (type == "query") {
        let item = [
          { label: "企业名称", value: data.name },
          { label: "企业编号", value: data.code },
          { label: "顺序号", value: data.dataOrder },
          {
            label: "企业描述",
            value: data.dataDescribe,
            valueStyle: "width:45%;",
          },
          { label: "创建时间", value: data.createTime },
          { label: "更新时间", value: data.updateTime },
        ];
        let result = { title: "企业详情", column: 2, item: item };
        copyValue(result, this.mainObj);
      } else if (type == "add") {
        copyValue(data, this.mainObj);
        clearValue(this.mainObj);
      } else if (type == "edit") {
        copyValue(data, this.mainObj);
      }
    },
    // 校验参数
    paramValidated(type) {
      let data = this.mainObj;
      let errorInfo = "";
      // 新增
      if (type == "add") {
        if (!data.name) errorInfo = "企业名称不能为空";
        return errorInfo;
      }

      // 编辑
      if (!data.name) errorInfo = "企业名称不能为空";
      return errorInfo;
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
