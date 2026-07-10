<template>
  <div class="base-page app-container app-container-backgroup" ref="page">
    <div class="inner-wrap app-container-padding background-fff flex flex-y-between">
      <!-- 头部 -->
      <div class="header-wrap">
        <span class="header-title">
          <svg-icon icon-class="company" />
          <span>企业：</span>
          <el-select filterable v-model="currentCompany.id" placeholder="请选择查询企业" size="small"
            @change="companyChange" style="width:300px;">
            <el-option v-for="item in  companyArray" :key="item.id" :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </span>
        <!-- 待选项 -->
        <span class="wait-select-wrap">
          <span>最近查询:</span>
          <span @click="companyChange(v.id)" v-for="v in storeSelectCompanyArr"
            class="wait-item">{{v.name}}
          </span>
          <span class="wait-item">
            <svg-icon icon-class="delete1" @click="getCacheCompany('delete')" />
          </span>
        </span>
      </div>
      <!-- 内容部分 -->
      <div class="body-wrap">
        <!-- 左边树 -->
        <div class="tree-wrap">
          <tree tree-svg-icon="department"
            :show-button="{query:'department_query',add:'department_add',delete:'department_delete',edit:'department_edit'}"
            show-search :addNode="addWindow" :deleteNode="removWindow" :queryNode="showWindow"
            :editNode="editWindow" :api="api" :getListByObj="getDepartmentTree" ref="treeRef">
          </tree>
        </div>
      </div>
    </div>

    <!-- 相关操作弹框 开始========================================== -->
    <!-- 查询 -->
    <el-dialog :visible.sync="detailShow" width="80%" :show-close="true" :center="false">
      <span>
        <base-description :data="detailData"></base-description>
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="detailShow = false" size="small">关 闭</el-button>
      </span>
    </el-dialog>

    <!-- 新增、编辑 -->
    <el-dialog :visible.sync="editPopover.show" width="700px" :show-close="true"
      :close-on-click-modal="false" :center="false">
      <div class="my-edit-wrap">
        <!-- 弹框标题 -->
        <div class="my-edit-header-wrap flex flex-item-center">
          <div class="title">{{editPopover.type == 'add' ? '添加部门':'编辑部门'}}</div>
          <div class="line flex1"></div>
        </div>
        <!-- 详细的编辑 新增表单 -->
        <div class="my-edit-body-wrap">
          <div class="my-edit-itew-wrap">
            <div class="label">所属企业</div>
            <div class="value">
              <el-input disabled v-model="currentCompany.name" placeholder="">
              </el-input>
            </div>
          </div>
          <div class="my-edit-itew-wrap">
            <div class="label">上级部门</div>
            <div class="value">
              <el-input disabled v-model="mainObj.parentName" placeholder="">
              </el-input>
            </div>
          </div>
          <div class="my-edit-itew-wrap" style="width:100%;">
            <div class="label not-null">部门名称</div>
            <div class="value">
              <el-input v-myfocus v-model="mainObj.name" placeholder="请输入内容">
              </el-input>
            </div>
          </div>
          <div class="my-edit-itew-wrap">
            <div class="label not-null">部门编号</div>
            <div class="value">
              <el-input v-model="mainObj.code" placeholder="编号不允许重复"></el-input>
            </div>
          </div>
          <div class="my-edit-itew-wrap">
            <div class="label">部门层级</div>
            <div class="value">
              <el-input disabled v-model="mainObj.dataLevel" placeholder=""></el-input>
            </div>
          </div>
          <div class="my-edit-itew-wrap">
            <div class="label ">顺序</div>
            <div class="value">
              <el-input v-model="mainObj.dataOrder" placeholder="0-1000之间的整数"></el-input>
            </div>
          </div>
          <div class="my-edit-itew-wrap" style="width: 100%;height:70px;line-height:70px;">
            <div class="label ">部门描述</div>
            <div class="value">
              <el-input type="textarea" v-model="mainObj.dataDescribe" placeholder=""></el-input>
            </div>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer" style="text-align:center;">
        <el-button v-if="mainObj.parentId" type="primary" @click="save('1')" size="small">保 存
        </el-button>
        <el-button v-if="editPopover.type == 'add'" type="primary" @click="save('2')" size="small">
          保存为一级部门
        </el-button>
        <el-button @click="editPopover.show = false" size="small">取 消</el-button>
      </span>
    </el-dialog>
    <!-- 相关操作弹框 结束========================================== -->

  </div>
</template>

<script>
import Tree from "@/admin/components/BaseTree/index.vue";
import thisApi from "@/admin/api/department";
import companyApi from "@/admin/api/company";
import { copyValue, clearValue, setFocus } from '@/common/utils';
export default {
  name: "Departement",
  components: { Tree },
  data() {
    return {
      // 企业信息 ==============================
      companyArray: [], // 当前企业信息数组
      currentCompany: {
        // 当前选中的企业id及名称
        id: null,
        name: null,
      },
      storeSelectCompanyArr: [],

      // 部门信息 ==============================
      api: thisApi,
      mainObj: {
        // 增删改查对象
        code: null,
        companyId: null,
        companyName: null,
        dataLevel: null,
        dataOrder: null,
        dataDescribe: null,
        id: null,
        name: null,
        parentId: null,
        parentName: null,
      },
      detailShow: false, // 详情是否显示
      detailData: [], // 详情数据信息

      editPopover: {
        type: "add", // add-新增，edit-编辑
        // 是否显示编辑弹框
        show: false,
      },

      // 菜单相关 结束===========================
    };
  },
  computed: {},
  created() {},
  methods: {
    // 公共部分 开始 =======================================================
    // 初始化
    init() {
      // 加载企业信息
      this.getCompanyAll();
      // 加载本地查询的企业信息
      this.getCacheCompany("get", null);
    },
    // 公共部分 结束 =======================================================

    // 企业信息相关==============================================
    // 获取所有的企业信息
    getCompanyAll() {
      let obj = { isAll: true };
      companyApi.getListByObj(obj).then((res) => {
        if (res.code != 2000) return;
        let list = res.data.list;
        if (list.length == 0) return;
        // 赋值
        this.companyArray = list;
        let current = this.getCacheCompany("get");
        // 获取缓存数据，当前缓存存在数据则取本地缓存数据
        if (current) {
          this.currentCompany.id = current.id;
          this.currentCompany.name = current.name;
        } else {
          this.currentCompany.id = list[0].id;
          this.currentCompany.name = list[0].name;
        }
        // 加载部门信息
        this.$refs.treeRef.initData();
      });
    },
    // 企业信息改变
    companyChange(companyId) {
      // 给当前选中的企业数据更新
      this.companyArray.map((v) => {
        if (v.id == companyId) {
          this.currentCompany.id = companyId;
          this.currentCompany.name = v.name;
          this.getCacheCompany("set", v);
          return;
        }
      });
      // 重新查询部门信息
      this.$refs.treeRef.initData();
    },
    // 获取本地缓存中的历史选择过的企业信息
    getCacheCompany(type, company) {
      let key = "department_select_company_arr"; // 历史查询企业记录
      let currentKey = "department_select_company_current"; // 历史选中记录
      let indexKey = "department_select_company_arr_index"; // 历史选中记录的index标记
      // 若是删除
      if (type == "delete") {
        this.$cookie.remove(key);
        this.$cookie.remove(currentKey);
        this.$cookie.remove(indexKey);
        this.storeSelectCompanyArr = [];
        return;
      }

      // 取出数据返回
      let arr = this.$cookie.get(key);
      let index = this.$cookie.get(indexKey);
      let current = this.$cookie.get(currentKey);
      if (!arr) arr = [];
      else arr = JSON.parse(arr);
      if (!current) current = null;
      else current = JSON.parse(current);
      if (!index) index = 0;

      this.storeSelectCompanyArr = arr;
      if (type == "get") return current;

      // 若存储中已经有相同数据，则不处理
      for (let i = 0; i < arr.length; i++) {
        if (company.id == arr[i].id) return;
      }

      // 放入数据
      if (!company) return;
      if (index == 100) index = 0;
      arr[index % 5] = company;
      index++;
      this.$cookie.set(key, arr, { expires: 7 });
      this.$cookie.set(indexKey, index, { expires: 7 });
      this.$cookie.set(currentKey, company, { expires: 7 });
    },

    // 部门信息相关==============================================
    // 获取部门信息
    getDepartmentTree(obj, success, fail) {
      if (!this.currentCompany.id) return;
      // 加载框
      // 发起获取数据请求
      thisApi
        .getTreeByCompanyId(this.currentCompany.id)
        .then(success)
        .catch(fail);
    },
    // 查看详情
    showWindow(data, node) {
      let item = [
        {
          label: "所属企业",
          value: this.currentCompany.name,
          valueStyle: "width:40%",
        },
        {
          label: "上级部门",
          value: node.parent.data.label ? node.parent.data.label : "无",
        },
        { label: "部门编号", value: data.code },
        { label: "部门名称", value: data.name },
        { label: "顺序", value: data.dataOrder },
        {
          label: "部门描述",
          value: data.dataDescribe,
          valueStyle: "width:40%",
        },
        { label: "更新时间", value: data.updateTime },
        { label: "创建时间", value: data.createTime },
      ];

      this.detailData = [
        {
          title: "部门详情",
          column: 2,
          item: item,
        },
      ];
      this.detailShow = true;
    },
    // 新增弹框
    addWindow(data, node) {
      clearValue(this.mainObj); // 清空当前数据
      setFocus(this, "activeInput"); // 获取焦点
      // 设置值
      this.mainObj.parentId = data ? data.id : null;
      this.mainObj.parentName = data ? data.name : "无";
      this.mainObj.dataOrder = 99;
      this.mainObj.dataLevel = node ? node.level + 1 : 1;
      this.mainObj.companyId = this.currentCompany.id;

      // 显示页面
      this.editPopover.show = true;
      this.editPopover.type = "add";
    },
    // 编辑弹框
    editWindow(data, node) {
      copyValue(data, this.mainObj); // 将data赋值给this.mainObj
      this.mainObj.parentName = node.parent.data.label
        ? node.parent.data.label
        : "无"; // 上级菜单名称
      setFocus(this, "activeInput"); // 获取焦点
      // 层级
      if (!this.mainObj.dataLevel) {
        this.mainObj.dataLevel = node.level;
      }

      this.editPopover.type = "edit";
      this.editPopover.show = true;
    },
    // 删除弹框
    removWindow(data, node) {
      this.$confirm('删除后不可恢复，确认删除"' + data.name + '"吗?', "", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        showClose: false, // 显示关闭按钮
        closeOnClickModal: false, // 点击其他地方关闭
        center: true, // 居中
      })
        .then(() => {
          thisApi.deleteByIds(data.id).then((res) => {
            if (res.code != 2000) return;
            this.$message.success("删除成功");
            this.init();
          });
        })
        .catch(() => {});
    },
    // 保存
    save(flag) {
      // 校验参数
      let isOk = this.checkParameter(flag);
      if (!isOk) return;
      // 保存为顶级部门
      if (flag == "2") {
        this.mainObj.parentId = null;
        this.mainObj.dataLevel = 1;
      }
      if (this.editPopover.type == "edit") {
        // 更新
        thisApi.updateById(this.mainObj).then((res) => {
          if (res.code != 2000) return;
          this.$message.success("操作成功");
          this.editPopover.show = false;
          this.$refs.treeRef.initData();
        });
      } else {
        thisApi.addOne(this.mainObj).then((res) => {
          if (res.code != 2000) return;
          this.$message.success("操作成功");
          this.editPopover.show = false;
          this.$refs.treeRef.initData();
        });
      }
    },
    // 校验保存参数
    checkParameter(flag) {
      let error = "";
      // 部门名称
      if (!this.mainObj.name) error = "部门名称不能为空";
      // 部门编号
      if (!this.mainObj.code && !error) error = "编号不能为空";
      // 所属企业id
      if (!this.mainObj.companyId && !error)
        error = "企业信息无法获取，请刷新后重试";
      if (flag == "1" && !error && !this.mainObj.parentId)
        error = "上级部门信息无法获取，请刷新后重试";

      if (error) {
        this.$message.error(error);
        return false;
      }
      return true;
    },
  },

  mounted() {
    // 初始化
    this.init();
  },
};
</script>

<style scoped lang="scss">
.inner-wrap {
  height: 100%;
}

.header-wrap {
  padding: 0 10px 10px;
  .header-title {
    display: inline-block;
    color: #1890ff;
    font-weight: 800;
    span {
      padding-left: 5px;
    }
  }

  .wait-select-wrap {
    font-size: 12px;
    padding-left: 10px;
    .wait-item {
      cursor: pointer;
      color: #1890ff;
      display: inline-block;
      padding-left: 5px;
    }
  }
}

.body-wrap {
  height: 100%;

  .tree-wrap {
    height: 100%;
  }
}
</style>
