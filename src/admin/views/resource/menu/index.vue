<template>
  <div class="base-page app-container app-container-backgroup" ref="page">
    <!-- 内容 -->
    <div class="inner-wrap app-container-padding background-fff">
      <tree tree-svg-icon="company" show-button="query,add,delete,edit" show-search
        :show-button="{query:'menu_query',add:'menu_add',delete:'menu_delete',edit:'menu_edit'}"
        :addNode="addMenuWindow" :deleteNode="removMenuWindow" :queryNode="showMenuWindow"
        :editNode="editMenuWindow" :api="api" :getListByObj="getMenuTree" ref="treeRef">
      </tree>
    </div>

    <!-- 编辑 -->
    <el-dialog :visible.sync="editVisible" width="80%" :show-close="true" :center="false">
      <span slot="title">这是头部提示</span>
      <span>
        <my-edit :data="detailData"> </my-edit>
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" size="small">操作</el-button>
        <el-button type="primary" size="small">操作</el-button>
        <el-button @click="editVisible = false" size="small">取 消</el-button>
        <el-button type="primary" @click="editVisible = false" size="small">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 菜单弹框 开始 ====================================================== -->
    <!-- 新增、编辑菜单 -->
    <el-dialog :visible.sync="editMenuPopoverShow" width="700px" :show-close="true" :center="false">
      <!-- <span slot="title">{{menuPopoverTitle}}</span> -->
      <!-- 编辑部分内容 -->
      <div class="my-edit-wrap">
        <div class="my-edit-header-wrap flex flex-item-center">
          <div class="title">{{menuPopoverTitle}}</div>
          <div class="line flex1"></div>
        </div>
        <div class="my-edit-body-wrap">
          <div class="my-edit-itew-wrap">
            <div class="label">上级菜单</div>
            <div class="value">
              <el-input disabled v-model="menuVo.parentName" placeholder="请输入内容">
              </el-input>
            </div>
          </div>
          <div class="my-edit-itew-wrap">
            <div class="label not-null">菜单名称</div>
            <div class="value">
              <el-input ref="pageTitle" v-model="menuVo.pageTitle" placeholder="显示在菜单栏中的名称">
              </el-input>
            </div>
          </div>
          <div class="my-edit-itew-wrap">
            <div class="label">菜单编号</div>
            <div class="value">
              <el-input v-model="menuVo.menuCode" placeholder="不允许重复"></el-input>
            </div>
          </div>
          <div class="my-edit-itew-wrap">
            <div class="label">图标名称</div>
            <div class="value">
              <el-input v-model="menuVo.pageIcon" placeholder="svg图标不含后缀"></el-input>
            </div>
          </div>
          <div class="my-edit-itew-wrap" style="width:100%;">
            <div class="label">请求路径</div>
            <div class="value">
              <el-input v-model="menuVo.requestPath" placeholder="路由中请求的地址，以'/'开头"></el-input>
            </div>
          </div>
          <div class="my-edit-itew-wrap" style="width:100%;">
            <div class="label">组件路径</div>
            <div class="value">
              <el-input v-model="menuVo.componentPath"
                placeholder="组件在views目录下的地址,以'/'开始，最后不要加'.vue'"></el-input>
            </div>
          </div>
          <div class="my-edit-itew-wrap">
            <div class="label">组件名称</div>
            <div class="value">
              <el-input v-model="menuVo.componentName" placeholder="组件名称不要加'.vue'"></el-input>
            </div>
          </div>
          <div class="my-edit-itew-wrap">
            <div class="label ">顺序</div>
            <div class="value">
              <el-input v-model="menuVo.dataOrder" placeholder="0-1000之间的整数"></el-input>
            </div>
          </div>
          <div class="my-edit-itew-wrap">
            <div class="label">是否显示</div>
            <div class="value">
              <el-radio v-model="menuVo.menuShow" label="1">显示</el-radio>
              <el-radio v-model="menuVo.menuShow" label="0">隐藏</el-radio>
            </div>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer" style="text-align:center;">
        <el-button type="primary" @click="saveMenu('1')" size="small">保 存</el-button>
        <el-button v-if="menuPopoverType == 'add'" @click="saveMenu('2')" size="small">保存为顶级菜单
        </el-button>
        <el-button @click="editMenuPopoverShow = false" size="small">取 消</el-button>
      </span>
    </el-dialog>

    <!-- 查询 -->
    <el-dialog :visible.sync="detailShow" width="80%" :show-close="true" :center="false">
      <!-- <span slot="title">这是头部提示</span> -->
      <span>
        <base-description :data="detailData"></base-description>
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="detailShow = false" size="small">关 闭</el-button>
      </span>
    </el-dialog>

    <!-- 菜单弹框 结束 ====================================================== -->

  </div>
</template>

<script>
import Tree from "@/admin/components/BaseTree/index.vue";
import thisApi from "@/admin/api/menu";
import { copyValue, clearValue, setFocus } from '@/common/utils';

export default {
  name: "Menu",
  components: { Tree },
  data() {
    return {
      // 菜单相关 开始===========================
      api: thisApi,
      detailShow: false, // 详情是否显示
      editMenuPopoverShow: false, // 菜单编辑新增是否显示
      menuPopoverTitle: "编辑菜单",
      menuPopoverType: "edit", // 操作类型，edit-编辑，add-新增
      menuVo: {
        id: "",
        parentName: "市场部",
        parentId: "123131",
        menuCode: "",
        pageTitle: "",
        pageIcon: "",
        requestPath: "",
        componentPath: "",
        dataOrder: "",
        componentName: "",
        menuShow: "",
      },

      editVisible: false, // 编辑弹框
      detailData: [], // 菜单详情数据
      // 菜单相关 结束===========================
    };
  },
  mounted() {
    // 初始化数据
    this.initData();
  },
  computed: {},
  created() {},
  methods: {
    // 公共部分 开始 =======================================================
    // 初始化
    initData() {
      // 加载菜单数据
      this.$refs.treeRef.initData();
    },
    // 公共部分 结束 =======================================================

    // 菜单相关操作 开始 =======================================================
    // 保存一条菜单数据
    saveMenu(flag) {
      // 校验参数
      if (!this.menuVo.pageTitle) {
        this.$message.error("菜单名称不能为空");
        return;
      }
      if (flag == "2") {
        this.menuVo.parentId = null;
      }
      if (this.menuPopoverType == "edit") {
        // 更新
        thisApi
          .updateById(this.menuVo)
          .then((res) => {
            if (res.code != 2000) return;
            this.$message.success("操作成功");
            this.editMenuPopoverShow = false;
            this.initData();
          })
          .catch((error) => {
            this.$message.error(error);
          });
      } else {
        thisApi
          .addOne(this.menuVo)
          .then((res) => {
            if (res.code != 2000) return;
            this.$message.success("操作成功");
            this.editMenuPopoverShow = false;
            this.initData();
          })
          .catch((error) => {
            this.$message.error(error);
          });
      }
    },
    // 获取菜单数据
    getMenuTree(obj, success, error) {
      obj = obj ? obj : {};
      obj.isAll = true;
      thisApi.getListByObj(obj).then(success).catch(error);
    },
    // 查看详情
    showMenuWindow(data, node) {
      let item = [
        {
          label: "上级菜单",
          value: node.parent.data.label ? node.parent.data.label : "无",
        },
        { label: "菜单编号", value: data.menuCode },
        { label: "菜单名称", value: data.pageTitle },
        { label: "图标名称", value: data.pageIcon },
        { label: "顺序", value: data.dataOrder },
        { label: "更新时间", value: data.updateTime },
        { label: "组件名称", value: data.componentName },
        { label: "请求路径", value: data.requestPath },
        { label: "组件路径", value: data.componentPath },
      ];

      this.detailData = [
        {
          title: "菜单详情",
          column: 2,
          item: item,
        },
      ];
      this.detailShow = true;
    },
    // 编辑弹框
    editMenuWindow(data, node) {
      copyValue(data, this.menuVo); // 将data赋值给this.menuVo
      this.menuVo.parentName = node.parent.data.label
        ? node.parent.data.label
        : "无"; // 上级菜单名称
      setFocus(this, "pageTitle"); // 获取焦点

      this.menuPopoverTitle = "编辑菜单信息";
      this.menuPopoverType = "edit";
      this.editMenuPopoverShow = true;
    },
    // 新增弹框
    addMenuWindow(data, node) {
      clearValue(this.menuVo); // 清空当前数据
      setFocus(this, "pageTitle"); // 获取焦点
      // 设置值
      this.menuVo.parentId = data.id;
      this.menuVo.parentName = data.pageTitle;
      this.menuVo.dataOrder = 99;
      // 显示页面
      this.editMenuPopoverShow = true;
      this.menuPopoverType = "add";
      this.menuPopoverTitle = "添加菜单信息";
    },
    // 删除弹框
    removMenuWindow(data, node) {
      this.$confirm('删除后不可恢复，确认删除"' + data.pageTitle + '"吗?', "", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        showClose: false,
        closeOnClickModal: false,
      })
        .then(() => {
          thisApi.deleteByIds(data.id).then((res) => {
            if (res.code != 2000) return;
            this.$message.success("删除成功");
            this.initData();
          });
        })
        .catch(() => {});
    },

    // 菜单相关操作 结束 =======================================================
  },

  mounted() {
    this.initData();
  },

  watch: {},
};
</script>
<style lang="scss">
.inner-wrap {
  display: inline-block;
  width: 100%;
  height: 100%;
  overflow: auto;
}
</style>
