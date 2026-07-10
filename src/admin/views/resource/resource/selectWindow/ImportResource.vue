<template>
  <div class="import-resource-wrap">
    <div class="header-toolbar">
      <el-select size="small" v-model="scopeFilter" placeholder="选择模块" @change="reloadTree" style="width:140px">
        <el-option label="全部模块" value="" />
        <el-option label="公共模块" value="common" />
        <el-option label="用户模块" value="custom" />
        <el-option label="管理员模块" value="admin" />
      </el-select>
      <el-button size="small" plain type="primary" @click="doImport">导入选中</el-button>
      <el-button size="small" plain @click="checkAll">全选</el-button>
      <el-button size="small" plain @click="uncheckAll">取消全选</el-button>
    </div>
    <div class="hint-bar">
      <span>勾选需要导入的目录，系统将自动为该目录生成默认子资源（菜单和按钮）</span>
    </div>
    <div class="tree-wrap scroll-bar" v-loading="loading">
      <el-tree ref="treeRef" :data="treeData" node-key="id" show-checkbox
        :props="{ children: 'children', label: 'name' }" empty-text="暂无目录数据"
        @check="onCheck">
        <div class="custom-tree-node" slot-scope="{ node, data }">
          <span class="node-label">
            <svg-icon class="tree-svg-icon" icon-class="directory" />
            <span>{{ data.name }}</span>
            <el-tag size="small" type="warning" class="type-tag">目录</el-tag>
          </span>
          <span class="meta-text" v-if="data.scope">[{{ data.scope }}]</span>
        </div>
      </el-tree>
    </div>
  </div>
</template>

<script>
import resourceApi from "@/admin/api/resource"

export default {
  data() {
    return {
      allDirectories: [],
      treeData: [],
      scopeFilter: '',
      loading: false,
    }
  },
  methods: {
    initData() {
      this.loadDirectories()
    },
    loadDirectories() {
      this.loading = true
      resourceApi.getAllList({}).then(res => {
        if (res.code === 2000) {
          this.allDirectories = (res.data.list || []).filter(v => v.type === 1)
          this.buildTree()
        }
        this.loading = false
      }).catch(() => { this.loading = false })
    },
    reloadTree() {
      this.buildTree()
    },
    buildTree() {
      const list = this.allDirectories
      const scope = this.scopeFilter
      // 过滤一级目录
      let filtered
      if (scope) {
        const topIds = new Set()
        filtered = list.filter(item => {
          const pid = item.parentId || ''
          if (!pid) {
            const match = item.scope === scope
            if (match) topIds.add(item.id)
            return match
          }
          return topIds.has(pid)
        })
        // 递归保留子节点
        const allIds = new Set()
        let changed = true
        while (changed) {
          changed = false
          filtered.forEach(item => {
            const pid = item.parentId || ''
            if (pid && topIds.has(pid) && !allIds.has(item.id)) { allIds.add(item.id); changed = true }
            if (!pid) topIds.add(item.id)
          })
        }
        filtered = list.filter(item => !(item.parentId || '') || topIds.has(item.parentId) || allIds.has(item.parentId))
      } else {
        filtered = list
      }
      // 建树
      const map = {}
      filtered.forEach(item => {
        const pid = item.parentId || ''
        if (!map[pid]) map[pid] = []
        map[pid].push({ ...item, label: item.name, children: [] })
      })
      const mount = pid => (map[pid] || []).map(n => {
        n.children = mount(n.id)
        return n
      })
      this.treeData = mount('')
    },
    onCheck(currentNode, checkInfo) {
      // 勾选父节点自动勾选子节点
      if (checkInfo.checkedKeys.indexOf(currentNode.id) !== -1 && currentNode.children) {
        this.setChildrenCheck(currentNode.children, true)
      }
    },
    setChildrenCheck(children, checked) {
      children.forEach(child => {
        this.$refs.treeRef.setChecked(child, checked)
        if (child.children) this.setChildrenCheck(child.children, checked)
      })
    },
    checkAll() {
      this.$refs.treeRef.setCheckedNodes(this.getAllNodes(this.treeData))
    },
    uncheckAll() {
      this.$refs.treeRef.setCheckedKeys([])
    },
    getAllNodes(nodes) {
      let result = []
      nodes.forEach(n => { result.push(n); if (n.children) result = result.concat(this.getAllNodes(n.children)) })
      return result
    },
    doImport() {
      const checkedKeys = this.$refs.treeRef.getCheckedKeys()
      if (!checkedKeys || checkedKeys.length === 0) {
        this.$message.warning('请先勾选需要导入的目录')
        return
      }
      const allNodes = this.getAllNodes(this.treeData)
      const checkedSet = new Set(checkedKeys)
      // 从勾选的目录中，为每个目录生成默认子资源
      const toCreate = []
      checkedKeys.forEach(id => {
        const node = allNodes.find(n => n.id === id)
        if (!node) return
        // 为当前目录生成一个默认菜单 + 几个常用按钮
        const menuCode = node.code ? node.code + '_page' : ''
        const menu = {
          parentId: id,
          parentCode: node.code,
          name: node.name + '管理',
          code: menuCode,
          type: 2,
          sort: 10,
          scope: node.scope || 'custom',
          isShow: true,
        }
        toCreate.push(menu)
        // 默认按钮
        const actions = [
          { label: '查询', action: 'query' },
          { label: '新增', action: 'add' },
          { label: '编辑', action: 'edit' },
          { label: '删除', action: 'delete' },
        ]
        actions.forEach(a => {
          toCreate.push({
            parentId: null,
            parentCode: menuCode,
            name: a.label,
            code: menuCode + '_' + a.action,
            type: 3,
            sort: 99,
            scope: node.scope || 'custom',
            isShow: false,
          })
        })
      })
      this.$emit('import', toCreate)
    },
  },
}
</script>

<style lang="scss" scoped>
.import-resource-wrap {
  height: 100%;
  display: flex;
  flex-direction: column;
}
.header-toolbar {
  padding: 8px 12px;
  border-bottom: 1px solid #e8e8e8;
  flex-shrink: 0;
  display: flex;
  gap: 8px;
  align-items: center;
}
.hint-bar {
  padding: 6px 12px;
  font-size: 12px;
  color: #909399;
  background: #fafafa;
  border-bottom: 1px solid #e8e8e8;
  flex-shrink: 0;
}
.tree-wrap {
  flex: 1;
  overflow: auto;
  padding: 8px 0;
}
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 13px;
  padding-right: 12px;
  .node-label {
    display: flex;
    align-items: center;
    gap: 4px;
  }
  .type-tag { transform: scale(0.85); margin-left: 2px; }
  .meta-text { color: #909399; font-size: 12px; }
}
</style>
