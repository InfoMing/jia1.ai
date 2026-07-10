<template>
  <div class="base-table-wrap">
    <div class="base-table-wrap" :style="{ 'width': tableWidth }" ref="allWrap">
      <div class="base-table-inner-wrap flex flex-y-between">
        <!-- 头部标题 -->
        <div class="table-header-wrap" v-if="headerTitle || showSearch || showHeightSearch || showHeaderButton"
          ref="headerWrap">
          <!-- 头部名称 -->
          <div class="table-header-search-wrap flex flex-x-between flex-item-center">
            <div v-if="headerTitle" class="table-header-left-wrap">
              <span class="header-title">
                <svg-icon :icon-class="headerTitleIcon ? headerTitleIcon : 'monitor'" :style="headerTitleIconStyle" />
                {{ headerTitle }}
              </span>
            </div>
            <div class="table-header-right-wrap">
              <el-input v-if="searchField" size="small"
                :placeholder="searchField.split('@').length > 1 ? searchField.split('@')[1] : '回车搜索'"
                v-model="searchValue" style="width: 200px;" @keyup.enter.native="searchFunction" clearable>
                <el-button slot="append" icon="el-icon-search" @click="searchFunction"></el-button>
              </el-input>
              <el-button v-if="showHeightSearch" style="margin-left: 10px;" size="small" type="primary"
                @click="heightSearchPageShow">
                更多查询</el-button>
            </div>
          </div>

          <!-- 头部按钮组 -->
          <div class="table-header-button-wrap" v-if="showHeaderButton">
            <!-- 自定义按钮组 -->
            <slot name="buttonSlot" />

            <el-button v-show="resolveBtn(showHeaderButton.query)" size="small" plain type="primary" @click="showColumn('TOP')"
              icon="el-icon-warning-outline">查看
            </el-button>
            <el-button v-show="resolveBtn(showHeaderButton.edit)" size="small" @click="editColumn('TOP')" plain type="primary"
              icon="el-icon-edit-outline">编辑
            </el-button>
            <el-button v-show="resolveBtn(showHeaderButton.add)" size="small" @click="addColumn('TOP')" plain type="primary"
              icon="el-icon-circle-plus">添加
            </el-button>
            <el-button v-show="resolveBtn(showHeaderButton.delete)" size="small" plain type="danger" icon="el-icon-delete"
              @click="deleteColumns">
              删除
            </el-button>

            <!-- 设置显示表头 -->
            <el-popover v-if="showHeaderButton.showColumn" placement="left" width="300">
              <show-table-column :columns="columns"></show-table-column>
              <el-button plain size="small" slot="reference" type="primary" icon="el-icon-setting">
                显示
              </el-button>
            </el-popover>
            <el-button v-show="resolveBtn(showHeaderButton.export)" plain size="small" slot="reference" type="primary">
              <svg-icon icon-class="daochu" />导出
            </el-button>
          </div>
        </div>
        <!-- table主数据 -->
        <div class="table-content-wrap" :style="{ 'height': tableHeight }">
          <!-- table每个列名称 -->
          <el-table :data="tableData" style="width: 100%" size="small" height="100%"
            :header-cell-style="{ background: '#f5f5f5', color: '#606266' }" v-loading="tableIsLoading"
            ref="multipleTable" @row-dblclick="rowDblclickFun" @row-click="rowClickFun" :row-style="rowStyle">
            <!-- 选中行 -->
            <el-table-column type="selection" width="25">
              <!--  v-if="showHeaderButton.export || showHeaderButton.delete || showHeaderButton.selectColumn" -->
            </el-table-column>
            <!-- 序号 -->
            <el-table-column v-if="showColumnIndex" type="index" width="55"> </el-table-column>

            <!-- 每一列数据 -->
            <template v-for="column in columns">
              <el-table-column v-if="column.show" :key="column.prop" :prop="column.prop" :label="column.label" :width="column.width"
                :fixed="column.fixed" :show-overflow-tooltip="showOverflowTooltip"
                :formatter="column.formatter">
              </el-table-column>
            </template>

            <!-- table操作 -->
            <el-table-column v-if="columnButton" label="操作" :width="columnButtonWidth">
              <template #default="scope">
                <span class="button-wrap">
                  <!-- 自定义按钮 -->
                  <slot name="columnButton" :row="scope.row"></slot>

                  <el-button v-show="resolveBtn(columnButton.add)" title="新增" type="text" @click.stop="addColumn(scope.row)">
                    <svg-icon class="tree-svg-icon" icon-class="add1" />
                  </el-button>
                  <el-button v-show="resolveBtn(columnButton.query)" title="查看" type="text" @click.stop="showColumn(scope.row)">
                    <svg-icon class="tree-svg-icon" icon-class="query1" />
                  </el-button>
                  <el-button v-show="resolveBtn(columnButton.edit)" title="编辑" type="text" @click.stop="editColumn(scope.row)">
                    <svg-icon class="tree-svg-icon" icon-class="edit1" />
                  </el-button>
                  <el-link type="danger" :underline="'never'"
                  v-show="resolveBtn(columnButton.delete)" title="删除" @click.stop="deleteColumn(scope.row)">
                    <svg-icon style="color: #f56c6c;" class="tree-svg-icon" icon-class="delete1" />
                  </el-link>
                </span>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <!-- 分页 -->
        <div class="page-wrap" v-if="showPage" ref="pageWrap">
          <el-pagination :page-sizes="tablePageSizeList" background :layout="pageLayout"
            :total="pageInfo.total" :pager-count="5" :current-page="pageInfo.currentPage" :page-size="pageInfo.pageSize"
            @current-change="currentPageChange" @size-change="sizeChange">
            <span class="current-page-wrap">
              {{ pageInfo.currentPage + '/' + Math.ceil(pageInfo.total / pageInfo.pageSize) }}
            </span>
          </el-pagination>
        </div>
      </div>
    </div>

    <!-- 高级查询 开始====================================== -->
    <div v-show="showHeightSearchPage" class="height-search-wrap" :style="{ 'width': heightSearchWidth }">
      <div class="height-search-inner-wrap">
        <div class="title">
          <svg-icon icon-class="query2" />高级查询
        </div>
        <div class="height-search-input-wrap">
          <slot name="heightSearchSlot" />
        </div>
        <div class="button">
          <el-button size="small" plain type="primary" icon="el-icon-search" @click="heightSearchFunction">搜索</el-button>
          <el-button size="small" plain icon="el-icon-refresh-left" @click="restHeightSearchFunction">重置
          </el-button>
        </div>
      </div>
    </div>
    <!-- 高级查询 结束====================================== -->

    <!-- 增删改查框 开始 =================================== -->
    <!-- 查询 -->
    <el-dialog :visible.sync="detailPopoverShow" width="80%" :show-close="true" :center="false">
      <span>
        <base-description :data="[mainObj]">
        </base-description>
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="detailPopoverShow = false" size="small">关 闭</el-button>
      </span>
    </el-dialog>

    <!-- 新增、编辑 -->
    <el-dialog :visible.sync="editPopover.show" width="700px" :show-close="true" :close-on-click-modal="false"
      :center="false">
      <div class="my-edit-wrap">
        <!-- 弹框标题 -->
        <div class="my-edit-header-wrap flex flex-item-center">
          <div class="title">{{ editPopover.type == 'add' ? '添加' : '编辑' }}</div>
          <div class="line flex1"></div>
        </div>
        <!-- 详细的编辑 新增表单 -->
        <div class="my-edit-body-wrap">
          <slot name="editOrAddInputSlot" />
        </div>
      </div>
      <span slot="footer" class="dialog-footer" style="text-align:center;">
        <el-button type="primary" @click="save" size="small">保 存</el-button>
        <el-button @click="editPopover.show = false" size="small">取 消</el-button>
      </span>
    </el-dialog>
    <!-- 增删改查框 结束 =================================== -->
  </div>
</template>

<script>
import ShowTableColumn from "./ShowTableColumn/index.vue";
import { copyValue, clearValue, setFocus } from '@/common/utils';
import { btnShow } from "@/common/utils/user";
let time = null; //  用于判断是单击还是双击 为null

import { useBaseStore } from '@/store'

export default {
  name: "BaseTable",
  computed: {
    tablePageSizeList() {
      return useBaseStore().tablePageSizeList
    }
  },
  props: {
    // 操作api 若传以下方法，默认方法将失效===================================
    // 操作api对象，若要使用默认方法，此对象必须传
    api: { type: Object, default: () => { } },
    // 增加
    addObj: { type: Function },
    // 修改
    editObj: { type: Function },
    // 分页查询
    list: { type: Function },
    // 删除单项
    deleteObj: { type: Function },
    // 删除多条数据
    deleteObjArray: { type: Function },

    // 表格头部描述==================================
    headerTitle: { type: String, default: "" },
    // 表格头部描述ICON
    headerTitleIcon: { type: String, default: "" },
    // 表格头部描述ICON样式
    headerTitleIconStyle: { type: String, default: "" },
    // 表格列名
    columns: { type: Array, default: () => [] },
    // 是否显示按钮组
    showHeaderButton: { type: Object, default: () => { } },
    // 分页显示哪些操作
    pageLayout: {
      type: String,
      default: "sizes, total, prev, pager, next",
    },

    // 搜索的搜索字段名称和搜索提示，为空不显示搜索============
    searchField: { type: String, default: "" },
    // 是否显示高级搜索
    showHeightSearch: { type: Boolean, default: false },
    // 高级搜索宽度
    heightSearchWidth: { type: String, default: "300px" },
    // 高级搜索存储搜索对象
    heightSearchObj: { type: Object, default: () => { } },

    // 是否显示分页================================
    showPage: { type: Boolean, default: true },

    // 表格列的增删改查 ===========================
    // 表格列显示哪些操作按钮
    columnButton: { type: Object, default: () => { } },
    // 表格列宽度
    columnButtonWidth: { type: String, default: "120" },
    // 表格是否显示index索引列
    showColumnIndex: { type: Boolean, default: false },
    // 设置表格编辑的数据
    mainObj: { type: Object, default: () => { } },
    // 是否校验参数,校验不通过返回error信息
    paramValidated: { type: Function },
    // 是否需要给新增、查看、编辑赋初始值
    setObj: { type: Function },
    // 表格行双击事件
    rowDoubleClick: {
      type: [Boolean, Function],
      default: false
    },
    // 表格行单击事件
    rowClick: { type: Function },
    // 表格内容超出行后是否以省略号显示
    showOverflowTooltip: { type: Boolean, default: true },
  },
  components: { ShowTableColumn },
  data() {
    return {
      // 高级搜索相关
      searchValue: "",
      showHeightSearchPage: false,
      tableWidth: "100%",
      tableHeight: "100%",

      // 表格数据
      tableData: [],
      tableIsLoading: false,
      // 分页数据
      pageInfo: {
        total: 0, // 总条数
        currentPage: 1, // 当前页数
        pageSize: null, // 分页大小
      },
      // 搜索条件
      searchVo: {},

      // 增删改查相关
      detailPopoverShow: false, // 是否显示查看详情弹框
      detailData: [], // 查看详情数据

      editPopover: {
        type: "add", // add-新增，edit-编辑
        // 是否显示编辑弹框
        show: false,
      },

      // 单双击双击行选中的数据id
      selectRowId: "",
      clickTimer: null,
      clickDelay: 300, // 单击延迟时间（与双击间隔匹配）
      pendingClick: false // 标记是否有待处理的单击事件
    };
  },
  mounted() {
    // 数据初始化
    this.initData();
    // 获取表格高度
    this.getTableHeight();
    let that = this;
    window.onresize = () => {
      that.getTableHeight();
    };
  },

  created() {
    if (this.showPage) {
      // 设置分页数据的值
      this.pageInfo.pageSize = useBaseStore().tablePageDefaultSize;
    }
  },

  methods: {
    /*** element表格相关操作  开始 ==================================**/
    // 表格行双击事件
    rowDblclickFun(row, column, event) {
      clearTimeout(this.clickTimer); // 取消待执行的单击事件
      this.pendingClick = false;    // 标记单击事件无效
      if (typeof this.rowDoubleClick === "function") {
        this.selectRowId = row.id;
        this.rowDoubleClick(row, column, event);
        // this.$refs.multipleTable.toggleRowSelection(row, true);
      }
      if (typeof this.rowDoubleClick === "boolean" && this.rowDoubleClick) {
        this.selectRowId = row.id;
        this.showColumn(row)
      }
    },

    // 表格行单击事件
    rowClickFun(row, column, event) {
      this.selectRowId = row.id;
      this.pendingClick = true; // 标记有待处理的单击
      this.clickTimer = setTimeout(() => {
        if (!this.pendingClick || typeof this.rowClick !== "function") return;
        this.rowClick(row, column, event);
        this.pendingClick = false;
      }, this.clickDelay);
    },
    // 更改选中行背景色
    rowStyle({ row }) {
      // 选中状态
      if (this.selectRowId === row.id) {
        return {
          background: "#e8f4ff",
          cursor: "pointer",
          color: "#1890ff",
        };
      }

      // 未选中状态
      return {
        cursor: "pointer",
        color: "#606266",
        background: "#fff",
      };
    },

    // 获取选中的值
    getSelectColumn() {
      return this.$refs.multipleTable.selection;
    },

    // 设置选中的值
    setSelect() {
      this.$nextTick(() => {
        this.tableData.forEach((row) => {
          if (row && row.active) {
            this.$refs.multipleTable.toggleRowSelection(row, true);
          }
        });
      });
    },
    /*** element表格相关操作  结束 ==================================**/

    /*** 表格搜索初始化值相关  开始 ==================================**/
    // 初始化分页查询数据
    initData() {
      // 加载数据
      let param = this.searchVo ? this.searchVo : {};
      let pageParameter = {
        pageNum: this.pageInfo.currentPage,
        pageSize: this.pageInfo.pageSize
      }
      param.pageParameter = pageParameter
      this.listData(param);
      // 清理数据
      this.selectRowId = null
    },
    // 当分页大小发生改变时
    sizeChange(size) {
      this.pageInfo.currentPage = 1;
      this.pageInfo.pageSize = size;
      this.initData();
    },
    // 当页码改变时
    currentPageChange(num) {
      this.pageInfo.currentPage = num;
      this.initData();
    },

    // 普通搜索
    searchFunction() {
      // 封装搜索条件
      let vo = {};
      // 获取搜索字段，模糊搜索，多个或搜索
      let searchArr = this.searchField ? this.searchField.split("@") : [];
      if (searchArr.length > 0 && searchArr[0] && this.searchValue) {
        let fields = searchArr[0].split(",").filter(field => field.trim()); // 过滤空字段
        let matchArr = [];

        fields.forEach(v => {
          matchArr.push({
            key: v.trim(),  // 去除可能的空格
            value: this.searchValue
          });
        });

        if (matchArr.length > 0) {
          vo.match = matchArr;
          vo.conditionalRelation = "or";
        }
      }

      this.searchVo = vo;
      // 将搜索页码设置为1
      this.pageInfo.currentPage = 1;
      // 搜索
      this.initData();
    },
    // 搜索重置
    restHeightSearchFunction() {
      clearValue(this.heightSearchObj);
    },
    // 高级搜索
    heightSearchFunction() {
      // 封装搜索条件
      let vo = {};
      // 获取搜索字段，模糊搜索，多个或搜索
      let obj = this.heightSearchObj;
      let matchArr = [];
      for (const key in obj) {
        const value = obj[key];
        if (!value) continue
        matchArr.push({
          key: key.trim(),  // 去除可能的空格
          value: value
        });
      }
      if (matchArr.length > 0) {
        vo.match = matchArr;
      }
      this.searchVo = vo;
      // 将搜索页码设置为1
      this.pageInfo.currentPage = 1;
      // 搜索
      this.initData();
    },

    // 获取数据
    listData(obj) {
      // 显示加载框
      this.tableIsLoading = true;
      // 查询成功方法
      let success = (res) => {
        this.tableIsLoading = false; // 隐藏加载框
        if (res.code != 2000) return;
        let result = res.data;

        // 设置当前的table数据
        if (result.list.length == 0 || typeof this.setObj != "function") {
          this.tableData = result.list;
        } else {
          // 是否需要翻译，若翻译返回数据，则使用翻译返回的，若不存在，则使用当前的
          let pageList = this.setObj(result.list, "page");
          if (pageList && pageList.length > 0) this.tableData = pageList;
          else this.tableData = result.list;
        }

        // 设置分页数据
        if (!this.showPage) return;
        this.pageInfo.total = result.total;

        // 设置选中状态
        this.setSelect();
      };
      // 查询失败方法
      let error = (error) => {
        // 隐藏加载框
        this.tableIsLoading = false;
      };

      // 若自定义了分页查询方法，则使用自定义的
      if (typeof this.list == "function") {
        this.list(obj, success, error);
        return;
      }
      // 使用默认方法
      this.api.list(obj).then(success).catch(error);
    },
    /*** 表格搜索初始化值相关  结束 ==================================**/

    /*** 表格增删查改  开始 ==================================**/
    // 保存一条数据
    save() {
      // 深拷贝对象
      let reqData = {};
      copyValue(this.mainObj, reqData);

      // 判断是否通过校验
      if (typeof this.paramValidated == "function") {
        let errorInfo = this.paramValidated(this.editPopover.type);
        if (errorInfo) {
          this.$message.error(errorInfo);
          return;
        }
      }

      // 操作成功回调方法
      let success = (res) => {
        if (res.code != 2000) return;
        this.$message.success("操作成功");
        // 清除搜索条件并重新查询数据
        clearValue(this.mainObj);
        this.initData();
        // 关闭弹框
        this.editPopover.show = false;
      };

      // 更新
      if (this.editPopover.type == "edit") {
        if (typeof this.editObj == "function") {
          this.editObj(success);
          return;
        }
        this.api.updateById(reqData).then(success);
        return;
      }
      // 新增
      if (typeof this.addObj == "function") {
        this.addObj(success);
        return;
      }
      this.api.addOne(reqData).then(success);
    },

    // 查看详情
    showColumn(data) {
      // 若传入参数不存在，则是头部按钮事件
      if ("TOP" == data) {
        let selectData = this.$refs.multipleTable.selection;
        if (!selectData || selectData.length == 0) {
          this.$message.error("请选择要查看的数据");
          return;
        }
        if (selectData.length > 1) {
          this.$message.error(
            "无法查看" + selectData.length + "条数据，请选中一条数据再操作"
          );
          return;
        }
        data = selectData[0];
      }

      // 赋值
      let error = this.setObj(data, "query");
      if (error) {
        this.$message.error(error);
        return;
      }

      this.detailPopoverShow = true;
    },
    // 编辑弹框
    editColumn(data) {
      // 若传入参数不存在，则是头部按钮事件
      if ("TOP" == data) {
        let selectData = this.$refs.multipleTable.selection;
        if (!selectData || selectData.length == 0) {
          this.$message.error("请选择要编辑的数据");
          return;
        }
        if (selectData.length > 1) {
          this.$message.error(
            "无法编辑" + selectData.length + "条数据，请选中一条数据再操作"
          );
          return;
        }
        data = selectData[0];
      }

      // 赋值
      let error = this.setObj(data, "edit");
      if (error) {
        this.$message.error(error);
        return;
      }

      // 显示窗口
      this.editPopover.type = "edit";
      this.editPopover.show = true;
    },
    // 新增弹框
    addColumn(data) {
      // 若传入参数不存在，则是头部按钮事件
      if ("TOP" == data) {
        let selectData = this.$refs.multipleTable.selection;
        if (selectData && selectData.length == 1) {
          data = selectData[0];
        }
      }

      // 赋值
      let error = this.setObj(data, "add");
      if (error) {
        this.$message.error(error);
        return;
      }

      // 显示新增窗口
      this.editPopover.type = "add";
      this.editPopover.show = true;
    },
    // 删除弹框
    deleteColumn(data) {
      // 操作成功回调方法
      let success = (res) => {
        if (res.code == 2000) {
          this.$message.success("删除成功");
          this.initData();
        }
      };

      // 使用自定义的删除方法
      if (typeof this.deleteObj == "function") {
        this.deleteObj(data, success);
        return;
      }

      this.$confirm("删除后不可恢复，确认删除吗?", "", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        showClose: false, // 显示关闭按钮
        closeOnClickModal: false, // 点击其他地方关闭
        center: true, // 居中
      })
        .then(() => {
          this.api.deleteByIds(data.id).then(success);
        })
        .catch((error) => { });
    },
    // 删除多条数据
    deleteColumns() {
      // 获取需要删除的数据
      let selectData = this.$refs.multipleTable.selection;
      if (selectData.length == 0) {
        this.$message.error("请先选中要删除的数据");
        return;
      }
      // 删除成功后的回调函数
      let success = (res) => {
        if (res.code == 2000) {
          this.$message.success("删除成功");
          this.initData();
        }
      };

      // 若有自定义方法，则使用自定义方法
      if (typeof this.deleteObjArray == "function") {
        this.deleteObjArray(selectData, success);
        return;
      }

      let ids = "";
      selectData.forEach((v, k) => {
        ids += v.id + ",";
      });
      this.$confirm(
        "删除后不可恢复，确认删除" + selectData.length + "条数据吗?",
        "",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          showClose: false, // 显示关闭按钮
          closeOnClickModal: false, // 点击其他地方关闭
          center: true, // 居中
        }
      )
        .then(() => {
          // 删除方法
          this.api.deleteByIds(ids).then(success);
        })
        .catch((error) => { });
    },
    /*** 表格增删查改  结束 ==================================**/

    /*** 其他方法 开始 ==================================**/
    /***** 显示和隐藏高级搜索 */
    heightSearchPageShow() {
      this.showHeightSearchPage = !this.showHeightSearchPage;
      const show = this.showHeightSearchPage;
      if (show) this.tableWidth = "calc(100% - " + this.heightSearchWidth + ")";
      if (!show) this.tableWidth = "100%";
    },

    // 动态获取表格高度
    getTableHeight() {
      const all = this.$refs.allWrap.offsetHeight;
      const header = this.$refs.headerWrap.offsetHeight;
      const page = this.$refs.pageWrap.offsetHeight;
      this.tableHeight = all - header - page + "px";
    },
    /*** 其他方法 结束 ==================================**/

    /**
     * 解析按钮显隐
     * @param {boolean|string|function} value
     * @returns {boolean}
     */
    resolveBtn(value) {
      if (typeof value === 'function') return value();
      if (typeof value === 'string') return btnShow(value);
      return !!value;
    },
  },
};
</script>
<style lang="scss">
.base-table-wrap {
  height: 100%;
  width: 100%;
}

.base-table-wrap {
  height: 100%;
  min-height: 300px;
  display: inline-block;
  min-width: 300px;

  .base-table-inner-wrap {
    height: 100%;
    width: 100%;
  }

  .table-header-wrap {
    .table-header-search-wrap {
      padding: 5px 0;
      border-bottom: 1px solid #dcdfe6;

      .table-header-left-wrap {
        display: inline-block;

        .header-title {
          display: inline-block;
          // color: #1890ff;
          color: #606266;
          font-weight: 800;
        }
      }
    }

    .table-header-button-wrap {
      width: 100%;
      padding-top: 10px;
      text-align: left;

      .button-wrap {
        display: inline-block;
      }

      button {
        margin: 0 2px 5px 0;
      }
    }
  }

  .table-content-wrap {
    height: 100%;
    width: 100%;
  }

  .page-wrap {
    padding-top: 10px;

    .current-page-wrap {
      font-size: 15px;
      font-weight: 400;
      margin: 0 5px;
      color: #606266;
      min-width: 0;
    }
  }
}

// 高级查询
.height-search-wrap {
  height: 100%;
  display: inline-block;
  vertical-align: top;
  padding-left: 10px;

  >div {
    height: 100%;
  }

  .title {
    color: rgb(24, 144, 255);
    font-weight: 800;
    border-bottom: 1px solid #dfe6ec;
    padding: 5px;
    margin-top: 10px;

    svg {
      display: inline-block;
      margin-right: 2px;
    }
  }

  .height-search-input-wrap {
    margin: 5px 0;
    overflow: auto;
    height: calc(100% - 90px);

    .search-input-wrap {
      margin-bottom: 10px;

      .tip {
        min-width: 100px;
        line-height: 1.7;
        display: inline-block;
        text-align: right;
        padding-right: 5px;
        color: #606266;
      }

      .value {
        width: calc(100% - 105px);
        display: inline-block;

        .el-select {
          width: 100%;
        }
      }
    }
  }

  .button {
    border-top: 1px solid #dfe6ec;
    text-align: center;
    padding: 4px 0;
  }
}

// .el-pager .number {
//   display: none;
// }
// .el-pager .active {
//   display: inline-block;
// }

// .el-pager li.btn-quicknext,
// .el-pager li.btn-quickprev {
//   display: none;
// }</style>
