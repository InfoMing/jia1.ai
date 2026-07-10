<template>
  <div class="app-container base-page app-container-backgroup">
    <div class="app-container-padding background-fff" :style="{'height':clientHeight}">

      <base-table :columns="tableColumn" header-title-icon="resource"
        :show-header-button="{add:true,delete:true,edit:true,showColumn:true}"
        :column-button="{add:true,delete:true,query:true,edit:true}"
        headerTitle="股票基础信息管理" search-field="keyword,按代码/名称搜索" showHeightSearch
        :heightSearchObj="heightSearchObj" :set-obj="setObj" :main-obj="mainObj" :api="api"
        :paramValidated="paramValidated" columnButtonWidth="160px"
        :delete-obj="handleDelete" :delete-obj-array="handleDeleteArray">

        <!-- 头部按钮 -->
        <template #buttonSlot>
          <el-button size="small" plain type="primary" icon="el-icon-refresh" @click="handleSyncMarket">
            同步市场指标
          </el-button>
        </template>

        <!-- 高级搜索 -->
        <template #heightSearchSlot>
          <el-input size="small" placeholder="所属市场(SH/SZ/BJ/HK/US)" v-model="heightSearchObj.market" />
          <el-select size="small" placeholder="类型" v-model="heightSearchObj.type">
            <el-option label="股票" value="stock" />
            <el-option label="ETF" value="etf" />
            <el-option label="基金" value="fund" />
            <el-option label="指数" value="index" />
          </el-select>
        </template>

        <!-- 编辑框 -->
        <template #editOrAddInputSlot>
          <div class="my-edit-itew-wrap">
            <div class="label not-null">证券编码</div>
            <div class="value">
              <el-input v-model="mainObj.code" placeholder="如SH600519">
              </el-input>
            </div>
          </div>
          <div class="my-edit-itew-wrap">
            <div class="label not-null">证券名称</div>
            <div class="value">
              <el-input v-myfocus v-model="mainObj.name" placeholder="请输入内容">
              </el-input>
            </div>
          </div>
          <div class="my-edit-itew-wrap">
            <div class="label not-null">所属市场</div>
            <div class="value">
              <el-select v-model="mainObj.market" placeholder="请选择">
                <el-option label="上海A股" value="SH" />
                <el-option label="深圳A股" value="SZ" />
                <el-option label="北交所" value="BJ" />
                <el-option label="港股" value="HK" />
                <el-option label="美股" value="US" />
                <el-option label="黄金" value="GL" />
              </el-select>
            </div>
          </div>
          <div class="my-edit-itew-wrap">
            <div class="label">原始代码</div>
            <div class="value">
              <el-input v-model="mainObj.shortCode" placeholder="如600519">
              </el-input>
            </div>
          </div>
          <div class="my-edit-itew-wrap">
            <div class="label">证券全称</div>
            <div class="value">
              <el-input v-model="mainObj.fullName" placeholder="请输入内容">
              </el-input>
            </div>
          </div>
          <div class="my-edit-itew-wrap">
            <div class="label">类型</div>
            <div class="value">
              <el-select v-model="mainObj.type">
                <el-option label="股票" value="stock" />
                <el-option label="ETF" value="etf" />
                <el-option label="基金" value="fund" />
                <el-option label="指数" value="index" />
              </el-select>
            </div>
          </div>
          <div class="my-edit-itew-wrap">
            <div class="label">上市日期</div>
            <div class="value">
              <el-date-picker v-model="mainObj.listedDate" type="date" placeholder="选择日期" />
            </div>
          </div>
          <div class="my-edit-itew-wrap">
            <div class="label">公司成立日期</div>
            <div class="value">
              <el-date-picker v-model="mainObj.establishDate" type="date" placeholder="选择日期" />
            </div>
          </div>
          <div class="my-edit-itew-wrap" style="width:100%;">
            <div class="label">公司介绍</div>
            <div class="value">
              <el-input type="textarea" v-model="mainObj.companyIntro" placeholder="请输入公司介绍" :rows="3" />
            </div>
          </div>
        </template>

      </base-table>
    </div>
  </div>
</template>

<script>
import { copyValue, clearValue } from '@/common/utils';
import thisApi from "@/admin/api/gp";
export default {
  name: "Gp",
  components: {},
  data() {
    return {
      clientHeight: "100%",
      // 高级搜索数据
      heightSearchObj: {
        market: "",
        type: "",
      },
      // table表格数据
      tableColumn: [
        { prop: "code", label: "证券编码", width: "150", show: true },
        { prop: "name", label: "证券名称", width: "150", show: true },
        { prop: "market", label: "市场", width: "80", show: true },
        { prop: "shortCode", label: "原始代码", width: "100", show: false },
        { prop: "fullName", label: "证券全称", width: "200", show: true },
        { prop: "type", label: "类型", width: "80", show: true },
        { prop: "listedDate", label: "上市日期", width: "120", show: true },
        { prop: "companyIntro", label: "公司介绍", show: false },
        { prop: "establishDate", label: "成立日期", width: "120", show: false },
        { prop: "status", label: "状态", width: "60", show: true },
        { prop: "isActive", label: "监控", width: "60", show: false },
      ],

      // 增删改查相关数据
      mainObj: {
        id: "",
        code: "",
        name: "",
        market: "",
        shortCode: "",
        fullName: "",
        type: "stock",
        listedDate: "",
        delistedDate: "",
        status: 1,
        isActive: true,
        companyIntro: "",
        establishDate: "",
      },

      // 操作api
      api: thisApi,
    };
  },
  computed: {},
  created() {},
  methods: {
    setObj(data, type) {
      if (type == "query") {
        let item = [
          { label: "证券编码", value: data.code },
          { label: "证券名称", value: data.name },
          { label: "所属市场", value: data.market },
          { label: "原始代码", value: data.shortCode },
          { label: "证券全称", value: data.fullName },
          { label: "类型", value: data.type },
          { label: "上市日期", value: data.listedDate },
          { label: "公司成立日期", value: data.establishDate },
          { label: "状态", value: data.status === 1 ? "上市" : "退市" },
          { label: "公司介绍", value: data.companyIntro, valueStyle: "width:80%;" },
          { label: "创建时间", value: data.createTime },
          { label: "更新时间", value: data.updateTime },
        ];
        let result = { title: "股票详情", column: 2, item: item };
        copyValue(result, this.mainObj);
      } else if (type == "add") {
        copyValue(data, this.mainObj);
        clearValue(this.mainObj);
        this.mainObj.type = "stock";
        this.mainObj.status = 1;
        this.mainObj.isActive = true;
      } else if (type == "edit") {
        copyValue(data, this.mainObj);
      }
    },
    paramValidated(type) {
      let data = this.mainObj;
      let errorInfo = "";
      if (type == "add") {
        if (!data.code) errorInfo = "证券编码不能为空";
        if (!data.name) errorInfo = "证券名称不能为空";
        if (!data.market) errorInfo = "所属市场不能为空";
        return errorInfo;
      }
      if (!data.code) errorInfo = "证券编码不能为空";
      return errorInfo;
    },
    /** 自定义删除（单条）— 按 code 删除 gp+company 两张表 */
    handleDelete(data, success) {
      if (!data || !data.code) {
        this.$message.warning("请选择要删除的股票");
        return;
      }
      this.$confirm(`确认删除 ${data.code} (${data.name})？删除后不可恢复。`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        thisApi.deleteByIds(data.code).then(success);
      }).catch(() => {});
    },
    /** 自定义批量删除 — 暂不开放 */
    handleDeleteArray(selectData, success) {
      this.$message.warning("暂不支持批量删除，请逐条操作");
    },
    /** 同步市场指标（选中当前行后触发） */
    handleSyncMarket() {
      const code = this.mainObj.code;
      if (!code) {
        this.$message.warning("请先选择一只股票");
        return;
      }
      this.$confirm(`确认同步 ${code} 的市场指标？`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        thisApi.syncMarket(code).then(res => {
          this.$message.success("同步成功");
        });
      }).catch(() => {});
    },
  },
};
</script>
