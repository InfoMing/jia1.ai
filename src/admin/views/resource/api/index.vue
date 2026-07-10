<template>
  <div class="app-container base-page app-container-backgroup">
    <div
      class="app-container-padding background-fff"
      :style="{ height: clientHeight }"
      v-loading="allLoadingShow"
    >
      <base-table
        :columns="tableColumn"
        header-title-icon="api"
        :show-header-button="{
          add: true,
          edit: true,
          delete: true,
          showColumn: true,
        }"
        headerTitle="程序扫描接口管理"
        search-field="name,url,beanName@按类/名称/url搜索"
        showHeightSearch
        :heightSearchObj="heightSearchObj"
        :column-button="{ query: true, edit: true, delete: true }"
        :set-obj="setObj"
        :main-obj="mainObj"
        :api="api"
        :paramValidated="paramValidated"
        ref="tableRef"
        :deleteObjArray="deleteObjArray"
      >
        <!-- 头部按钮 -->
        <template #buttonSlot>
          <el-button
            v-show="'api_scan'"
            size="small"
            @click="showScanWindow = true"
            plain
            type="primary"
            icon="el-icon-circle-plus"
          >
            扫描程序中的接口
          </el-button>
        </template>

        <!-- 高级搜索 -->
        <template #heightSearchSlot>
          <div class="flex search-input-wrap">
            <span class="tip">资源名称</span>
            <el-input
              class="value"
              size="small"
              placeholder="模糊搜索"
              v-model="heightSearchObj.name"
            />
          </div>
          <div class="flex search-input-wrap">
            <span class="tip">资源URl</span>
            <el-input
              class="value"
              size="small"
              placeholder="模糊搜索"
              v-model="heightSearchObj.url"
            />
          </div>
          <div class="flex search-input-wrap">
            <span class="tip">请求类型</span>
            <el-input
              class="value"
              size="small"
              placeholder="精准匹配"
              v-model="heightSearchObj.requestMethod"
            />
          </div>
          <div class="flex search-input-wrap">
            <span class="tip">API类型</span>
            <el-select
              class="value"
              size="small"
              clearable
              v-model="heightSearchObj.type"
              placeholder="请选择"
            >
              <el-option
                v-for="(item, key) in $code.get('base_api_type,not_name')"
                :key="key"
                :label="item"
                :value="key"
              />
            </el-select>
          </div>
          <div class="flex search-input-wrap">
            <span class="tip">状态</span>
            <el-select
              class="value"
              size="small"
              clearable
              v-model="heightSearchObj.status"
              placeholder="请选择"
            >
              <el-option
                v-for="(item, key) in $code.get('common_status,not_name')"
                :key="key"
                :label="item"
                :value="key"
              />
            </el-select>
          </div>
          <div class="flex search-input-wrap">
            <span class="tip">类名称</span>
            <el-input
              class="value"
              size="small"
              placeholder="模糊搜索"
              v-model="heightSearchObj.beanName"
            />
          </div>
        </template>

        <!-- 新增/编辑表单 -->
        <template #editOrAddInputSlot>
          <div class="my-edit-itew-wrap">
            <div class="label not-null">API名称</div>
            <div class="value">
              <el-input
                v-myfocus
                v-model="mainObj.name"
                placeholder="请输入内容"
              ></el-input>
            </div>
          </div>
          <div class="my-edit-itew-wrap">
            <div class="label not-null">API编码</div>
            <div class="value">
              <el-input
                v-model="mainObj.code"
                placeholder="编码不允许重复"
              ></el-input>
            </div>
          </div>
          <div class="my-edit-itew-wrap">
            <div class="label not-null">URL</div>
            <div class="value">
              <el-input
                v-model="mainObj.url"
                :placeholder="
                  mainObj.type === 3
                    ? '例如: /system/user'
                    : '例如: /api/v1/adminapi/user/list'
                "
              ></el-input>
            </div>
          </div>
          <div class="my-edit-itew-wrap">
            <div class="label not-null">请求类型</div>
            <div class="value">
              <el-select
                class="value"
                size="small"
                v-model="mainObj.requestMethod"
                placeholder="请选择"
                :disabled="mainObj.type === 3"
              >
                <el-option label="GET" value="GET" />
                <el-option label="POST" value="POST" />
                <el-option label="PUT" value="PUT" />
                <el-option label="DELETE" value="DELETE" />
              </el-select>
            </div>
          </div>
          <div class="my-edit-itew-wrap">
            <div class="label not-null">API类型</div>
            <div class="value">
              <el-select
                class="value"
                size="small"
                v-model="mainObj.type"
                placeholder="请选择"
                @change="onTypeChange"
              >
                <el-option
                  v-for="(item, key) in $code.get('base_api_type,not_name')"
                  :key="key"
                  :label="item"
                  :value="Number(key)"
                  v-if="key !== '1'"
                />
              </el-select>
            </div>
          </div>
          <div class="my-edit-itew-wrap">
            <div class="label">排序</div>
            <div class="value">
              <el-input
                v-model="mainObj.sort"
                placeholder="0-1000之间的整数"
              ></el-input>
            </div>
          </div>
          <div class="my-edit-itew-wrap">
            <div class="label">状态</div>
            <div class="value">
              <el-select
                class="value"
                size="small"
                clearable
                v-model="mainObj.status"
                placeholder="请选择"
              >
              <el-option
                v-for="(item, key) in $code.get('common_status,not_name')"
                :key="key"
                :label="item"
                :value="Number(key)"
              />
              </el-select>
            </div>
          </div>
        </template>
      </base-table>
    </div>

    <el-dialog
      class="scan-window-wrap"
      title=""
      :visible.sync="showScanWindow"
      width="400px"
      center
      :close-on-click-modal="false"
    >
      <span>此操作可能需要较长时间,确定扫描程序中所有接口吗？</span>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="showScanWindow = false"
          >取 消</el-button
        >
        <el-button size="small" type="primary" @click="refresh"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  copyValue,
  clearValue,
  copySourceValueToTargetAttribute,
} from '@/common/utils';
import thisApi from "@/admin/api/api";
export default {
  name: "ApiManager",
  components: {},
  data() {
    return {
      clientHeight: "100%", // 页面高度，必须填写，用于表格计算高度
      allLoadingShow: false, // 页面加载框
      // 高级搜索数据====================================================
      heightSearchObj: {
        name: "",
        url: "",
        status: "",
        requestMethod: "",
        type: "",
        beanName: "",
      },
      // table表格数据==================================================
      tableColumn: [
        { prop: "id", label: "ID", show: false },
        { prop: "name", label: "名称", width: "200", show: true },
        { prop: "code", label: "编码", width: "200", show: true },
        {
          prop: "type",
          label: "API类型",
          width: "100",
          show: true,
          formatter: (row) => {
            if (row.type === null || row.type === undefined) return "";
            let typeMap = this.$code.get("base_api_type");
            return (typeMap && typeMap[String(row.type)]) || row.type;
          },
        },
        { prop: "beanName", label: "类名称", width: "200", show: true },
        { prop: "url", label: "url", show: true },
        { prop: "requestMethod", label: "请求类型", width: "100", show: true },
        {
          prop: "status",
          label: "状态",
          show: true,
          width: "50",
          formatter: (row) => {
            if (row.status === null || row.status === undefined) return "";
            let statusMap = this.$code.get("common_status");
            return (
              (statusMap && statusMap[String(row.status)]) || row.status
            );
          },
        },
        { prop: "sort", label: "排序", width: "50", show: false },
      ],

      // 增删改查相关数据 ==========================================
      // 详情数据
      mainObj: {
        id: "",
        code: "",
        name: "",
        url: "",
        requestMethod: "GET",
        type: 2,
        status: 1,
        sort: 99,
        beanName: "",
        description: "",
      },

      // 操作api ==================================================
      api: thisApi,

      // 扫描相关 ================================================
      showScanWindow: false,
    };
  },
  computed: {},
  created() {},
  methods: {
    // 给查看、新增、编辑赋初始值数据
    setObj(data, type) {
      if (type == "query") {
        let item1 = new Array();
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

        let result = { title: "API详情", column: 2, item: item1.concat(item) };
        copyValue(result, this.mainObj);
      } else if (type == "add") {
        copyValue(data, this.mainObj);
        clearValue(this.mainObj);
        // 赋初值
        this.mainObj.type = 2;
        this.mainObj.status = 1;
        this.mainObj.requestMethod = "GET";
        if (!this.mainObj.sort) this.mainObj.sort = 99;
      } else if (type == "edit") {
        if (data.type === 1) {
          return "系统扫描的API不允许编辑";
        }
        copySourceValueToTargetAttribute(data, this.mainObj);
        // 赋初值
        if (!this.mainObj.sort) this.mainObj.sort = 99;
      } else if (type == "page") {
        // 翻译
        this.$code.forEach(data, {
          status: "common_status",
          type: "base_api_type",
        });
      }
    },
    // 校验参数
    paramValidated(type) {
      let data = this.mainObj;
      let errorInfo = "";
      // 新增
      if (type == "add") {
        if (!data.name) errorInfo = "API名称不能为空";
        if (!data.code) errorInfo = "API编码不能为空";
        if (!data.url) errorInfo = "URL不能为空";
        return errorInfo;
      }

      // 编辑
      if (!data.name) errorInfo = "API名称不能为空";
      if (!data.code) errorInfo = "API编码不能为空";
      if (!data.url) errorInfo = "URL不能为空";
      return errorInfo;
    },

    // API类型切换时处理
    onTypeChange() {
      if (this.mainObj.type === 3) {
        this.mainObj.requestMethod = "FRONTEND";
      } else if (this.mainObj.requestMethod === "FRONTEND") {
        this.mainObj.requestMethod = "GET";
      }
    },

    // 扫描api接口
    refresh() {
      this.showScanWindow = false;
      this.allLoadingShow = true;
      thisApi
        .refresh()
        .then((res) => {
          this.allLoadingShow = false;
          this.$message.success("处理成功");
          this.$refs.tableRef.initData();
        })
        .catch((error) => {
          this.allLoadingShow = false;
        });
    },

    // 增删改查方法 ===========================
    // 删除多条数据
    deleteObjArray(dataArray, success) {
      let ids = "";
      let hasError = false;
      // 校验，状态为失效的才可以删除
      for (let i = 0; i < dataArray.length; i++) {
        let v = dataArray[i];
        if (v.status == 1) {
          this.$message.error({
            message: `"${v.name}"是正常数据，只能删除失效的API`,
            duration: 5000,
          });
          hasError = true;
          return;
        }
        ids += v.id + ",";
      }

      if (hasError) return;

      this.$confirm(
        "删除后不可恢复，确认删除" + dataArray.length + "条数据吗?",
        "",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          showClose: false,
          closeOnClickModal: false,
          center: true,
        }
      )
        .then(() => {
          this.api.deleteByIds(ids).then(success);
        })
        .catch((error) => {});
    },
  },
};
</script>

<style lang="scss">
// 扫描弹窗
.scan-window-wrap {
  .scan-checkbox {
    text-align: center;
    padding-top: 10px;
    padding-bottom: 30px;
  }

  .el-dialog--center .el-dialog__body {
    padding: 25px 25px 10px;
    text-align: center;
  }
}
</style>
