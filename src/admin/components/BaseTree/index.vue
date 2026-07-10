<template>
  <div class="custom-theme" ref="allWrap" v-loading="allTreeLoading">
    <div class="header-wrap" ref="headerWrap">
      <el-input size="small" class="tree-search" prefix-icon="el-icon-search" placeholder="搜索"
        v-model="filterText" v-if="showSearch">
      </el-input>
    </div>
    <div class="tree-wrap scroll-bar" :style="{'height': treeHeight}">
      <el-tree class="filter-tree" :data="data" :props="defaultProps" :default-expand-all="showAll"
        :filter-node-method="filterNode" :highlight-current="true" ref="tree"
        :show-checkbox="showCheckbox" :draggable="draggable" @node-drag-end="onNodeDragEnd"
        empty-text="" @node-contextmenu="onNodeContextMenu"
        @node-click="(data,node,obj)=>nodeClickFunc(data,node)">
        <div class="custom-tree-node" slot-scope="{ node, data }">
          <span>
            <svg-icon class="tree-svg-icon"
              :icon-class="treeSvgIcon != '' ? treeSvgIcon : 'company'" />
            {{ node.label }}
          </span>
          <span class="button-wrap" v-show="showButton">
            <el-button v-show="showButton.query" title="查看" type="text"
              @click.stop="() => queryNode(data, node)">
              <svg-icon class="tree-svg-icon" icon-class="query1" />
            </el-button>
            <el-button v-show="showButton.add" title="添加" type="text"
              @click.stop="() => addNode(data, node)">
              <svg-icon class="tree-svg-icon" icon-class="add1" />
            </el-button>
            <el-button v-show="showButton.edit" title="编辑" type="text"
              @click.stop="() => editNode(data, node)">
              <svg-icon class="tree-svg-icon" icon-class="edit1" />
            </el-button>
            <el-button v-show="showButton.delete" title="删除" type="text"
              @click.stop="() => deleteNode(data, node)">
              <svg-icon style="color: #f56c6c;" class="tree-svg-icon" icon-class="delete1" />
            </el-button>
          </span>
        </div>
      </el-tree>

      <!-- 右键快捷菜单 -->
      <div v-show="contextMenu.visible" class="context-menu"
        :style="{ left: contextMenu.x + 'px', top: contextMenu.y + 'px' }"
        @click.stop="closeContextMenu">
        <div class="context-menu-item" v-for="(item, idx) in contextMenu.items" :key="idx"
          @click.stop="item.handler(contextMenu.data, contextMenu.node)">
          {{ item.label }}
        </div>
      </div>

      <!-- 为空展示 -->
      <div class="not-data" v-if="!data || data.length == 0">
        <div>
          <svg-icon icon-class="no-data" />
        </div>
        <div>
          <span>暂无数据</span>
          <span v-if="addNode">,您可以 <el-link @click="addNode" type="primary">添加</el-link>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    api: { type: Object, default: () => {} }, // 操作api对象，若要使用默认方法，此对象必须传
    getListByObj: { type: Function }, // 获取所有数据自定义方法
    setObj: { type: Function }, // 是否需要给新增、查看、编辑赋初始值

    showSearch: { type: Boolean, default: false }, // 是否显示搜索条件
    treeSvgIcon: { type: String, default: "" }, // 显示图标
    showButton: {
      type: Object,
      default: () => {
        return { query: "", edit: "", delete: "", add: "" };
      },
    }, // 显示操作按钮
    addNode: { type: Function }, // 节点增删改查
    deleteNode: { type: Function },
    queryNode: { type: Function },
    editNode: { type: Function },

    // 原有
    showCheckbox: { type: Boolean, default: false },
    showAll: { type: Boolean, default: false },
    nodeClick: { type: Function },
    nodeDoubleClick: { type: Function },

    // 拖拽排序
    draggable: { type: Boolean, default: false },
    nodeDragEnd: { type: Function },

    // 右键快捷菜单
    contextMenuItems: { type: Array, default: () => [] },
  },

  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    },
  },

  data() {
    return {
      filterText: "", // 筛选条件的值
      treeHeight: "100%",
      defaultProps: {
        children: "children",
        label: "label",
      },
      // 树data
      data: [],

      // 是否显示加载框
      allTreeLoading: false,

      // 右键菜单
      contextMenu: {
        visible: false,
        x: 0,
        y: 0,
        data: null,
        node: null,
        items: [],
      },
    };
  },

  mounted() {
    // 获取高度
    this.getTreeHeight();
    let that = this;
    window.onresize = () => {
      that.getTreeHeight();
    };
    //初始化数据
    this.initData();
  },

  methods: {
    // 初始化相关 ===============================================
    initData() {
      // 加载数据
      this.getListData({ isAll: true });
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    getTreeHeight() {
      if (!this.showSearch) {
        this.treeHeight = "100%";
        return;
      }
      this.treeHeight =
        this.$refs.allWrap.offsetHeight -
        this.$refs.headerWrap.offsetHeight +
        "px";
    },

    // 数据相关 ===================================================================
    // 获取树数据
    getListData(obj) {
      this.allTreeLoading = true; // 显示加载框
      // 查询成功方法
      let success = (res) => {
        this.allTreeLoading = false; // 隐藏加载框
        if (res.code != 2000) return;
        let result = res.data;

        // 设置当前的table数据
        if (result.list.length == 0 || typeof this.setObj != "function") {
          this.data = result.list;
        } else {
          // 是否需要翻译，若翻译返回数据，则使用翻译返回的，若不存在，则使用当前的
          let pageList = this.setObj(result.list, "page");
          if (pageList && pageList.length > 0) this.data = pageList;
          else this.data = result.list;
        }
      };
      // 查询失败方法
      let error = (error) => {
        // 隐藏加载框
        this.allTreeLoading = false;
      };

      // 若自定义了分页查询方法，则使用自定义的
      if (typeof this.getListByObj == "function") {
        this.getListByObj(obj, success, error);
        return;
      }
      // 使用默认方法
      this.api.getListByObj(obj).then(success).catch(error);
    },
    /*** 表格搜索初始化值相关  结束 ==================================**/
    /*** 其他  开始 ===============================================**/
    // tree单机双击事件
    nodeClickFunc(data, node) {
      if (typeof this.nodeClick == "function") {
        this.nodeClick(data, node);
      }
    },
    // 右键菜单
    onNodeContextMenu(event, data, node) {
      if (!this.contextMenuItems || this.contextMenuItems.length === 0) return
      event.preventDefault()
      this.contextMenu.visible = true
      this.contextMenu.x = event.clientX
      this.contextMenu.y = event.clientY
      this.contextMenu.data = data
      this.contextMenu.node = node
      this.contextMenu.items = this.contextMenuItems.map(item => ({
        label: item.label,
        handler: (d, n) => {
          this.closeContextMenu()
          item.handler(d, n)
        }
      }))
    },
    // 关闭右键菜单
    closeContextMenu() {
      this.contextMenu.visible = false
    },
    // 拖拽结束
    onNodeDragEnd(draggingNode, dropNode, dropType) {
      if (typeof this.nodeDragEnd == "function") {
        this.nodeDragEnd(draggingNode, dropNode, dropType)
      }
    },
    /*** 其他  结束 ===============================================**/
  },
};
</script>

<style lang="scss">
.custom-theme {
  height: 100%;
}
.tree-svg-icon {
  margin-right: 2px !important;
}
.header-wrap {
  padding: 0 10px;
  .tree-search {
    margin-bottom: 5px;
  }
}
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
  .button-wrap {
    button {
      padding: 5px;
      margin: 0 !important;
    }
    button:hover {
      background: #5b8df1;
      color: #fff !important;
    }
  }
}

.tree-wrap {
  overflow: auto;

  .not-data {
    text-align: center;
    color: #909399;
    font-size: 14px;
    svg {
      width: 200px;
      height: 200px;
    }
  }
}

.el-tree--highlight-current .el-tree-node.is-current > .el-tree-node__content,
.el-tree-node__content:hover {
  color: #1890ff !important;
  background: #e5efff !important;
}

.el-tree-node__content {
  height: 35px !important;
  font-weight: 800;
  border-radius: 5px;
}

.el-tree__empty-block {
  min-height: 10px;
}

.context-menu {
  position: fixed;
  z-index: 9999;
  background: #fff;
  border: 1px solid #e4e7ed;
  border-radius: 4px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  padding: 4px 0;
  min-width: 120px;
}
.context-menu-item {
  padding: 6px 16px;
  font-size: 13px;
  cursor: pointer;
  color: #303133;
}
.context-menu-item:hover {
  background: #ecf5ff;
  color: #409eff;
}
</style>
