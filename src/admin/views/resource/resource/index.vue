<template>
  <div class="app-container base-page app-container-backgroup"
    v-loading.fullscreen.lock="fullscreenLoading">
    <div class="app-container-padding background-fff flex flex-x-between"
      :style="{'height':clientHeight}">

      <left-right-layout width="400px">
        <!-- 左边目录树 -->
        <template #left>
          <div class="left-tree-wrap">
            <div class="left-toolbar">
              <el-tabs v-model="scopeFilter" type="card" @tab-click="onScopeFilterChange">
                <el-tab-pane label="公共" name="common" />
                <el-tab-pane label="用户" name="custom" />
                <el-tab-pane label="管理员" name="admin" />
              </el-tabs>
              <div class="toolbar-row">
                <el-button-group>
                  <el-button size="small" plain type="primary" icon="el-icon-circle-plus" @click="addDirNode()">添加</el-button>
                  <el-button size="small" plain type="danger" icon="el-icon-delete" @click="deleteSelectedDir" :disabled="!currentMenuObj">删除</el-button>
                  <el-button size="small" plain type="primary" icon="el-icon-edit-outline" @click="editSelectedDir" :disabled="!currentMenuObj">更新</el-button>
                  <el-button size="small" plain type="primary" :icon="currentMenuObj && currentMenuObj.isShow !== false ? 'el-icon-video-pause' : 'el-icon-video-play'" @click="toggleSelectedDirStatus" :disabled="!currentMenuObj">
                    {{ currentMenuObj && currentMenuObj.isShow !== false ? '禁用' : '启用' }}
                  </el-button>
                  <el-button size="small" plain type="primary" icon="el-icon-warning-outline" @click="querySelectedDir" :disabled="!currentMenuObj">查看</el-button>
                </el-button-group>
              </div>
              <div class="toolbar-row">
                <el-input size="small" clearable prefix-icon="el-icon-search" placeholder="搜索目录名称/编码" v-model="directorySearchText" @keyup.enter.native="searchDirectory">
                  <el-button slot="append" icon="el-icon-search" @click="searchDirectory"></el-button>
                </el-input>
              </div>
            </div>
            <div class="directory-tree-wrap" v-loading="directoryTreeLoading">
              <el-tree ref="directoryTreeRef" class="filter-tree" node-key="id" :data="directoryTreeData"
                :props="directoryTreeProps" :default-expand-all="true" :highlight-current="true"
                :filter-node-method="filterDirectoryNode" empty-text="暂无目录数据" @node-click="nodeClick">
                <div class="custom-tree-node" slot-scope="{ node, data }">
                  <span>
                    <svg-icon class="tree-svg-icon" icon-class="directory" />
                    {{ node.label }}
                  </span>
                  <el-tag size="small" :type="data.isShow !== false ? 'success' : 'info'">
                    {{ data.isShow !== false ? '启用' : '禁用' }}
                  </el-tag>
                </div>
              </el-tree>
            </div>
          </div>
        </template>

        <!-- 右边详细接口 -->
        <template #right>
          <base-table :columns="tableColumn" header-title-icon="company"
            :show-header-button="resourceHeaderButtons"
            :column-button="resourceColumnButtons" :headerTitle="resourceTableTitle"
            search-field="name,code@按名称/编码搜索" showHeightSearch :heightSearchObj="heightSearchObj"
            :set-obj="setObj" :main-obj="mainObj" :api="api" :paramValidated="paramValidated"
            :list="getListByObj" ref="tableRef">

            <!-- 自定义按钮 -->
            <template #buttonSlot>
              <el-button size="small" plain type="primary" @click="openImportWindow"
                icon="el-icon-upload2">导入
              </el-button>
              <el-button size="small" plain @click="refreshTree"
                icon="el-icon-refresh">刷新树
              </el-button>
            </template>

            <!-- 每个列表的内容 -->
            <template slot="columnButton" slot-scope="scope">
              <el-button title="后端API权限配置" type="text"
                @click.stop="openSelectApiWindow(scope.row)">
                API
              </el-button>
            </template>

            <!-- 高级搜索 -->
            <template #heightSearchSlot>
              <div class="flex search-input-wrap">
                <span class="tip">资源名称</span>
                <el-input class="value" size="small" placeholder="模糊搜索"
                  v-model="heightSearchObj.name" />
              </div>
              <div class="flex search-input-wrap">
                <span class="tip">资源编码</span>
                <el-input class="value" size="small" placeholder="模糊搜索"
                  v-model="heightSearchObj.code" />
              </div>
              <div class="flex search-input-wrap">
                <span class="tip">类型</span>
                <el-select class="value" size="small" clearable v-model="heightSearchObj.type"
                  placeholder="请选择">
                  <el-option v-for="(item,key) in $code.get('my_sys_resource@type,not_name')"
                    :key="key" :label="item" :value="key">
                  </el-option>
                </el-select>
              </div>
            </template>

            <!-- 编辑框 -->
            <template #editOrAddInputSlot>
              <div class="my-edit-itew-wrap">
                <div class="label">所属菜单</div>
                <div class="value">
                  <el-input disabled v-model="mainObj.menuName" placeholder="无法获取">
                  </el-input>
                </div>
              </div>
              <div class="my-edit-itew-wrap">
                <div class="label not-null">资源名称</div>
                <div class="value">
                  <el-input v-myfocus v-model="mainObj.name" placeholder="请输入内容">
                  </el-input>
                </div>
              </div>
              <div class="my-edit-itew-wrap">
                <div class="label not-null">资源编号</div>
                <div class="value">
                  <el-input v-model="mainObj.code" placeholder="同一菜单下不允许重复">
                  </el-input>
                </div>
              </div>
              <div class="my-edit-itew-wrap">
                <div class="label not-null">资源类型</div>
                <div class="value">
                  <el-select class="value" style="width: 100%;" size="small" clearable
                    v-model="mainObj.type" placeholder="请选择">
                    <el-option v-for="(item,key) in $code.get('my_sys_resource@type,not_name')"
                      :key="key" :label="item" :value="key">
                    </el-option>
                  </el-select>
                </div>
              </div>
              <div class="my-edit-itew-wrap">
                <div class="label ">顺序</div>
                <div class="value">
                  <el-input v-model="mainObj.dataOrder" placeholder="0-1000之间的整数"></el-input>
                </div>
              </div>
              <div class="my-edit-itew-wrap">
                <div class="label">是否显示</div>
                <div class="value">
                  <el-switch v-model="mainObj.isShow" active-color="#13ce66">
                  </el-switch>
                </div>
              </div>
              <div class="my-edit-itew-wrap">
                <div class="label">权限范围</div>
                <div class="value">
                  <el-select class="value" style="width: 100%;" size="small" clearable
                    v-model="mainObj.scope" placeholder="请选择">
                    <el-option label="通用(所有用户)" value="common"></el-option>
                    <el-option label="管理员(仅管理员)" value="admin"></el-option>
                    <el-option label="自定义(需角色绑定)" value="custom"></el-option>
                  </el-select>
                </div>
              </div>
              <div class="my-edit-itew-wrap" style="width: 100%;height:70px;line-height:70px;">
                <div class="label ">资源描述</div>
                <div class="value">
                  <el-input type="textarea" v-model="mainObj.dataDescribe" placeholder="">
                  </el-input>
                </div>
              </div>
            </template>

          </base-table>
        </template>
      </left-right-layout>
    </div>

    <!-- 选择api接口 -->
    <el-dialog class="my-dialog-window-wrap" title="" :visible.sync="showSelectApiWindow"
      width="1000px" center :close-on-click-modal="false" top="5vh">
      <select-api :resource="currentResource" style="height:520px;" ref="selectApiRef">
      </select-api>
    </el-dialog>

    <!-- 批量导入资源 -->
    <el-dialog class="my-dialog-window-wrap" title="批量导入资源" :visible.sync="showImportWindow"
      width="700px" center :close-on-click-modal="false" top="5vh">
      <import-resource style="height:500px;" ref="importResourceRef" @import="onBatchImport">
      </import-resource>
    </el-dialog>

    <!-- 目录新增/编辑弹窗 -->
    <el-dialog title="目录信息" :visible.sync="showDirDialog" width="500px" :close-on-click-modal="false" center>
      <el-form label-width="100px" size="small" v-loading="dirSubmitLoading">
        <el-form-item label="目录名称" class="not-null">
          <el-input v-model="dirForm.name" placeholder="请输入目录名称" />
        </el-form-item>
        <el-form-item label="目录编码" class="not-null">
          <el-input v-model="dirForm.code" placeholder="全局唯一" :disabled="dirForm._isEdit" />
        </el-form-item>
        <el-form-item label="所属模块">
          <el-select v-model="dirForm.scope" style="width:100%">
            <el-option label="公共模块" value="common" />
            <el-option label="用户模块" value="custom" />
            <el-option label="管理员模块" value="admin" />
          </el-select>
        </el-form-item>
        <el-form-item label="排序">
          <el-input v-model="dirForm.sort" placeholder="数字越小越靠前" />
        </el-form-item>
        <el-form-item label="图标">
          <el-input v-model="dirForm.pageIcon" placeholder="svg图标名称" />
        </el-form-item>
        <el-form-item label="描述">
          <el-input type="textarea" v-model="dirForm.description" />
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button size="small" @click="showDirDialog = false" :disabled="dirSubmitLoading">取消</el-button>
        <el-button size="small" type="primary" @click="saveDirNode" :loading="dirSubmitLoading">确定</el-button>
      </div>
    </el-dialog>

    <!-- 目录详情弹窗 -->
    <el-dialog title="目录详情" :visible.sync="showDirDetail" width="500px" :close-on-click-modal="false" center>
      <el-form label-width="100px" size="small">
        <el-form-item label="名称"><span>{{ dirForm.name }}</span></el-form-item>
        <el-form-item label="编码"><span>{{ dirForm.code }}</span></el-form-item>
        <el-form-item label="模块"><span>{{ dirForm.scope }}</span></el-form-item>
        <el-form-item label="排序"><span>{{ dirForm.sort }}</span></el-form-item>
        <el-form-item label="图标"><span>{{ dirForm.pageIcon }}</span></el-form-item>
        <el-form-item label="描述"><span>{{ dirForm.description }}</span></el-form-item>
        <el-form-item label="创建时间"><span>{{ dirForm.createTime }}</span></el-form-item>
      </el-form>
      <div slot="footer">
        <el-button size="small" @click="showDirDetail = false">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { copyValue, clearValue, isNum } from '@/common/utils';
import thisApi from "@/admin/api/resource";
import menuApi from "@/admin/api/menu";
import SelectApi from "./selectWindow/SelectApi.vue";
import ImportResource from "./selectWindow/ImportResource.vue";

export default {
  name: "Resource",
  components: { SelectApi, ImportResource },
  data() {
    return {
      // 菜单信息 ====================================================
      mApi: menuApi,
      currentMenuObj: null, // 当前点击选中的菜单数据
      fullscreenLoading: false,
      directoryTreeLoading: false,
      directorySearchText: '',
      directoryTreeData: [],
      directoryTreeProps: {
        children: 'children',
        label: 'label',
      },

      clientHeight: "100%", // 页面高度，必须填写，用于表格计算高度
      // 高级搜索数据====================================================
      heightSearchObj: {
        name: "",
        url: "",
        type: "",
        requestType: "",
      },
      // table表格数据==================================================
      tableColumn: [
        { prop: "name", label: "资源名称", show: true },
        { prop: "code", label: "编号", show: true },
        { prop: "type_name", label: "资源类型", width: "100", show: false },
        { prop: "scope", label: "权限范围", width: "100", show: true },
        { prop: "dataDescribe", label: "资源描述", show: false },
      ],

      // 增删改查相关数据 ==========================================
      // 详情数据
      mainObj: {
        menuId: "",
        menuName: "",
        id: "",
        name: "",
        code: "",
        type: "",
        scope: "custom",
        isShow: true,
        dataDescribe: "",
        dataOrder: "",
        createUserId: "",
        updateUserId: "",
        createTime: "",
        updateTime: "",
      },

      // 操作api ==================================================
      api: thisApi,

      // 选择api后端接口相关 =====================================
      showSelectApiWindow: false,
      currentResource: null, // 当前选中的资源信息

      // 批量导入相关 ===========================================
      showImportWindow: false,

      // 模块过滤 =================================================
      scopeFilter: 'common',
      scopeLabelMap: {
        common: '公共',
        custom: '用户',
        admin: '管理员',
      },
      allDirectoryList: [],
      resourcePermission: {
        query: 'resource_page_query',
        add: 'resource_page_add',
        edit: 'resource_page_edit',
        delete: 'resource_page_delete',
        export: 'resource_page_export',
      },

      // 目录 CRUD ================================================
      showDirDialog: false,
      showDirDetail: false,
      dirSubmitLoading: false,
      dirForm: {
        id: '',
        name: '',
        code: '',
        scope: 'common',
        sort: 99,
        pageIcon: '',
        description: '',
        createTime: '',
        _parentId: '',
        _isEdit: false,
      },
      _dirNodeData: null,
    };
  },
  computed: {
    resourceTableTitle() {
      return this.scopeLabelMap[this.scopeFilter] + '资源管理'
    },
    resourceHeaderButtons() {
      return {
        add: this.resourcePermission.add,
        delete: this.resourcePermission.delete,
        query: this.resourcePermission.query,
        edit: this.resourcePermission.edit,
        showColumn: true,
        export: this.resourcePermission.export,
      }
    },
    resourceColumnButtons() {
      return {
        delete: this.resourcePermission.delete,
        edit: this.resourcePermission.edit,
      }
    },
  },
  created() {}, 
  mounted() {
    this.initData();
  },
  watch: {},
  methods: {
    // 资源相关 ============================================
    // 初始化数据
    initData() {
      this.loadDirectoryTree();
    },
    // 给查看、新增、编辑赋初始值数据
    setObj(data, type) {
      if (type == "query") {
        let item1 = new Array();
        this.tableColumn.map((v, k) => {
          item1.push({
            label: v.label,
            value: data[v.prop],
          });
        });
        let item = [
          {
            label: "所属菜单",
            value: this.currentMenuObj ? this.currentMenuObj.name : "无",
            valueStyle: "width:40%;",
          },
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

        let result = { title: "资源详情", column: 2, item: item1.concat(item) };
        copyValue(result, this.mainObj);
      } else if (type == "add") {
        // 验证
        if (!this.currentMenuObj) return "未选中菜单信息，请选中菜单后重试";

        copyValue(data, this.mainObj);
        clearValue(this.mainObj);
        // 其他赋值
        if (this.currentMenuObj) {
          this.mainObj.menuId = this.currentMenuObj.id;
          this.mainObj.menuName = this.currentMenuObj.name;
        }
        if (!this.mainObj.dataOrder) this.mainObj.dataOrder = 99;
        this.mainObj.scope = this.scopeFilter;
        this.mainObj.isShow = true;
      } else if (type == "edit") {
        // 验证
        if (!this.currentMenuObj) return "未选中菜单信息，请选中菜单后重试";

        copyValue(data, this.mainObj);
        // 其他赋值
        if (this.currentMenuObj) {
          this.mainObj.menuId = this.currentMenuObj.id;
          this.mainObj.menuName = this.currentMenuObj.name;
        }
        if (!this.mainObj.dataOrder) this.mainObj.dataOrder = 99;
      } else if (type == "page") {
        this.$code.forEach(data, {
          type: "my_sys_resource@type",
        });
      }
    },
    // 校验参数
    paramValidated(type) {
      let data = this.mainObj;
      let errorInfo = "";
      if (!data.name) errorInfo = "资源名称不能为空";
      if (!data.code) errorInfo = "资源编码不能为空";
      if (!data.menuId) errorInfo = "无法获取菜单信息，请刷新重试";
      if (!data.dataOrder) data.dataOrder = 99;
      if (!isNum(data.dataOrder)) errorInfo = "顺序号必须是数字";
      return errorInfo;
    },

    // 目录相关 =================================================
    // 获取目录数据：只加载 type=directory，并按 scope 过滤目录
    loadDirectoryTree() {
      this.directoryTreeLoading = true
      menuApi.getListByObj({
        match: [{ key: 'type', value: 1 }],
      }).then(res => {
        if (res.code === 2000 && res.data && res.data.list) {
          this.allDirectoryList = (res.data.list || []).filter(v => v.type === 1)
          this.directoryTreeData = this.filterAndBuildTree(this.allDirectoryList)
          this.$nextTick(() => this.searchDirectory())
        }
        this.directoryTreeLoading = false
      }).catch(() => {
        this.directoryTreeLoading = false
        this.$message.error('目录加载失败')
      })
    },

    // scope 切换时重新过滤树
    onScopeFilterChange() {
      this.currentMenuObj = null
      this.directoryTreeData = this.filterAndBuildTree(this.allDirectoryList)
      this.$nextTick(() => this.searchDirectory())
      this.$refs.tableRef.initData()
    },

    searchDirectory() {
      if (this.$refs.directoryTreeRef) this.$refs.directoryTreeRef.filter(this.directorySearchText)
    },

    filterDirectoryNode(value, data) {
      if (!value) return true
      const keyword = value.toLowerCase()
      return (data.name && data.name.toLowerCase().indexOf(keyword) !== -1) || (data.code && data.code.toLowerCase().indexOf(keyword) !== -1)
    },

    // 根据 scopeFilter 过滤目录列表并构建树
    filterAndBuildTree(list) {
      const scope = this.scopeFilter
      const directoryList = list || []
      if (!scope) return this.buildTreeFromFlat(directoryList)
      const directoryMap = {}
      const matchedIds = []
      directoryList.forEach(item => {
        directoryMap[item.id] = item
        if ((item.scope || 'common') === scope) matchedIds.push(item.id)
      })
      const visibleIds = new Set(matchedIds)
      let changed = true
      while (changed) {
        changed = false
        directoryList.forEach(item => {
          if (item.parentId && visibleIds.has(item.parentId) && !visibleIds.has(item.id)) {
            visibleIds.add(item.id)
            changed = true
          }
        })
      }
      matchedIds.forEach(id => {
        let parentId = directoryMap[id] && directoryMap[id].parentId
        while (parentId && directoryMap[parentId]) {
          if (!visibleIds.has(parentId)) visibleIds.add(parentId)
          parentId = directoryMap[parentId].parentId
        }
      })
      return this.buildTreeFromFlat(directoryList.filter(item => visibleIds.has(item.id)))
    },

    // 将扁平目录列表构建为 el-tree 所需层级结构（含 label/children）
    buildTreeFromFlat(list) {
      const map = {}
      list.forEach(item => {
        const pid = item.parentId || ''
        if (!map[pid]) map[pid] = []
        map[pid].push({ ...item, label: item.name, children: [] })
      })
      const mount = pid => (map[pid] || []).map(n => {
        n.children = mount(n.id)
        return n
      })
      return mount('')
    },

    // 菜单信息双击
    nodeClick(data, node) {
      if (this.currentMenuObj && this.currentMenuObj.id == data.id) return;
      this.currentMenuObj = data;
      this.$refs.tableRef.initData();
    },

    // 增删改查方法 ===========================
    // 分页查询：按选中的目录 parentId 过滤，只展示按钮、组件等具体资源
    getListByObj(data, success, fail) {
      let dir = this.currentMenuObj;
      if (!dir || !dir.id) {
        success({ code: 2000, data: { list: [], total: 0 } })
        return;
      }
      const query = { ...(data || {}) }
      query.term = (query.term || []).filter(item => item.key !== 'parentId' && item.key !== 'scope')
      query.term.push({ key: 'parentId', value: dir.id })
      query.term.push({ key: 'scope', value: this.scopeFilter })
      query.match = query.match || []
      thisApi.getListByObj(query).then(res => {
        if (res.code === 2000 && res.data && res.data.list) {
          res.data.list = res.data.list.filter(item => item.type !== 1)
          res.data.total = res.data.list.length
        }
        success(res)
      }).catch(fail)
    },

    // 目录 CRUD =================================================
    // 新增目录（从树节点按钮/右键点击时传入 data；从顶部工具栏点击时无参数，parentId 为空）
    addDirNode(data) {
      const parentId = data ? data.id : ''
      this._dirNodeData = data || null
      this.dirForm = { id: '', name: '', code: '', scope: this.scopeFilter, sort: 99, pageIcon: '', description: '', createTime: '', _parentId: parentId, _isEdit: false }
      this.showDirDialog = true
    },
    // 顶部工具栏：编辑选中的目录
    editSelectedDir() {
      if (!this.currentMenuObj) { this.$message.warning('请先选中一个目录'); return }
      this.editDirNode(this.currentMenuObj)
    },
    // 顶部工具栏：删除选中的目录
    deleteSelectedDir() {
      if (!this.currentMenuObj) { this.$message.warning('请先选中一个目录'); return }
      this.deleteDirNode(this.currentMenuObj)
    },
    // 顶部工具栏：查看选中的目录
    querySelectedDir() {
      if (!this.currentMenuObj) { this.$message.warning('请先选中一个目录'); return }
      this.queryDirNode(this.currentMenuObj)
    },
    toggleSelectedDirStatus() {
      if (!this.currentMenuObj) { this.$message.warning('请先选中一个目录'); return }
      const nextStatus = this.currentMenuObj.isShow === false
      const actionText = nextStatus ? '启用' : '禁用'
      this.$confirm(`确定${actionText}目录「${this.currentMenuObj.name}」？`, '提示', {
        confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'
      }).then(() => {
        thisApi.updateById({ id: this.currentMenuObj.id, isShow: nextStatus }).then(res => {
          if (res.code === 2000) {
            this.$message.success(actionText + '成功')
            this.refreshTree()
          } else {
            this.$message.error(actionText + '失败：' + (res.msg || ''))
          }
        }).catch(() => this.$message.error(actionText + '请求失败'))
      }).catch(() => {})
    },
    // 编辑目录
    editDirNode(data, node) {
      this._dirNodeData = data
      this.dirForm = {
        id: data.id, name: data.name, code: data.code, scope: data.scope || 'common',
        sort: data.sort || 99, pageIcon: data.pageIcon || '', description: data.description || '',
        createTime: data.createTime || '', _parentId: data.parentId, _isEdit: true
      }
      this.showDirDialog = true
    },
    // 删除目录
    deleteDirNode(data, node) {
      if (!data.id) return
      this.$confirm(`确定删除目录「${data.name}」及其所有子资源？`, '警告', {
        confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'
      }).then(() => {
        thisApi.deleteByIds(data.id).then(res => {
          if (res.code === 2000) {
            this.$message.success('已删除')
            this.refreshTree()
          } else {
            this.$message.error('删除失败：' + (res.msg || ''))
          }
        }).catch(() => this.$message.error('删除请求失败'))
      }).catch(() => {})
    },
    // 查看目录详情
    queryDirNode(data, node) {
      if (!data.id) return
      thisApi.getById(data.id).then(res => {
        if (res.code === 2000) {
          const d = res.data
          this.dirForm = {
            id: d.id, name: d.name, code: d.code, scope: d.scope || '',
            sort: d.sort, pageIcon: d.pageIcon || '', description: d.description || '',
            createTime: d.createTime, _parentId: d.parentId, _isEdit: true
          }
          this.showDirDetail = true
        } else {
          this.$message.error('查询失败')
        }
      }).catch(() => this.$message.error('查询请求失败'))
    },
    // 保存目录（新增/编辑）
    saveDirNode() {
      const form = this.dirForm
      if (!form.name || !form.code) {
        this.$message.warning('目录名称和编码不能为空')
        return
      }
      this.dirSubmitLoading = true
      if (form._isEdit) {
        // 编辑
        const payload = { id: form.id, name: form.name, scope: form.scope || 'common', sort: form.sort || 99, pageIcon: form.pageIcon || '', description: form.description || '', type: 1, parentId: form._parentId || null, code: form.code }
        thisApi.updateById(payload).then(res => {
          if (res.code === 2000) {
            this.$message.success('已更新')
            this.showDirDialog = false
            this.refreshTree()
          } else {
            this.$message.error('更新失败：' + (res.msg || ''))
          }
          this.dirSubmitLoading = false
        }).catch(() => {
          this.dirSubmitLoading = false
          this.$message.error('更新请求失败')
        })
      } else {
        // 新增
        const payload = { name: form.name, code: form.code, scope: form.scope, sort: form.sort, pageIcon: form.pageIcon, description: form.description, type: 1, parentId: form._parentId }
        thisApi.addOne(payload).then(res => {
          if (res.code === 2000) {
            this.$message.success('已创建')
            this.showDirDialog = false
            this.refreshTree()
          } else {
            this.$message.error('创建失败：' + (res.msg || ''))
          }
          this.dirSubmitLoading = false
        }).catch(() => {
          this.dirSubmitLoading = false
          this.$message.error('创建请求失败')
        })
      }
    },

    // 选择api接口相关 =================================================
    openSelectApiWindow(data) {
      // 当前的选中资源
      this.currentResource = data;
      // 显示
      this.showSelectApiWindow = true;
      // 调用初始化方法
      this.$nextTick(() => {
        this.$refs.selectApiRef.initData();
      });
    },

    // 批量导入相关 =================================================
    openImportWindow() {
      this.showImportWindow = true
      this.$nextTick(() => {
        this.$refs.importResourceRef.initData()
      })
    },
    onBatchImport(importList) {
      this.$confirm('确认导入 ' + importList.length + ' 个资源？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'info'
      }).then(() => {
        this.$message.info('正在导入...')
        thisApi.batchImport(importList).then(res => {
          if (res.code === 2000) {
            let info = '导入完成'
            if (res.data) {
              info += '：成功 ' + res.data.successCount + ' 个'
              if (res.data.conflictCount > 0) {
                info += '，冲突跳过 ' + res.data.conflictCount + ' 个（' + res.data.conflictCodes.join(', ') + '）'
              }
            }
            this.$message.success(info)
            this.showImportWindow = false
            // 刷新树和表格
            this.refreshTree()
          } else {
            this.$message.error('导入失败：' + res.msg)
          }
        }).catch(() => {
          this.$message.error('导入请求失败')
        })
      }).catch(() => {})
    },

    // 刷新树
    refreshTree() {
      this.currentMenuObj = null
      this.loadDirectoryTree()
      this.$refs.tableRef.initData()
    },

  },
};
</script>

<style lang="scss">
.left-tree-wrap {
  height: 100%;
  display: flex;
  flex-direction: column;
}
.left-toolbar {
  flex-shrink: 0;
  padding: 6px 8px;
  border-bottom: 1px solid #e8e8e8;
  background: #fafafa;
  .toolbar-row {
    display: flex;
    align-items: center;
    gap: 6px;
    flex-wrap: wrap;
    margin-bottom: 6px;
    .el-input { width: 100%; }
    .el-button-group .el-button { padding: 6px 10px; }
  }
  .toolbar-row:last-child { margin-bottom: 0; }
}
.directory-tree-wrap {
  flex: 1;
  overflow: auto;
  padding: 8px 0;
}
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-right: 8px;
  font-size: 13px;
}
</style>
