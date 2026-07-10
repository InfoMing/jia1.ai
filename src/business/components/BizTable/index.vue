<template>
  <div class="biz-table" :style="{ height: tableHeight }" @wheel="handleWheel">
    <!-- ===== 1. Tab 导航栏 ===== -->
    <div v-if="$slots.tabs || tabs.length" class="biz-tabs">
      <slot name="tabs">
        <router-link
          v-for="tab in tabs"
          :key="tab.key"
          :to="tab.path"
          class="biz-tab"
          active-class="tab-active"
        >{{ tab.label }}</router-link>
      </slot>
    </div>

    <!-- ===== 2. 搜索 + 按钮组 ===== -->
    <div v-if="showSearch || $slots.buttons" class="biz-toolbar">
      <div v-if="showSearch" class="biz-search">
        <input
          v-model="localSearchText"
          class="biz-search-input"
          :placeholder="searchPlaceholder"
          @keyup.enter="onSearch"
        />
        <button class="biz-search-btn" @click="onSearch">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </button>
      </div>
      <div v-if="$slots.buttons" class="biz-buttons">
        <slot name="buttons" />
      </div>
    </div>

    <!-- ===== 3. 表格（滚动区域） ===== -->
    <div class="biz-table-body">
      <div class="biz-table-header">
        <span
          v-for="col in columns"
          :key="col.prop"
          :class="['biz-th', col.align ? `text-${col.align}` : '']"
          :style="{ width: col.width || 'auto' }"
        >{{ col.label }}</span>
        <span v-if="showAction" class="biz-th text-right" style="flex:1">操作</span>
      </div>
      <div class="biz-table-scroll" ref="scrollRef">
        <div
          v-for="(row, idx) in data"
          :key="row[rowKey] || idx"
          :class="['biz-tr', { 'row-alt': idx % 2 === 1 }]"
        >
          <span
            v-for="col in columns"
            :key="col.prop"
            :class="['biz-td', col.align ? `text-${col.align}` : '']"
            :style="{ width: col.width || 'auto' }"
          >
            <slot :name="'cell-' + col.prop" :row="row" :index="idx">
              <span :class="col.className">{{ row[col.prop] }}</span>
            </slot>
          </span>
          <span v-if="showAction" class="biz-td text-right" style="flex:1">
            <slot name="actions" :row="row" :index="idx" />
          </span>
        </div>
        <div v-if="!data || data.length === 0" class="biz-empty">
          <slot name="empty">
            <span class="biz-empty-text">暂无数据</span>
          </slot>
        </div>
      </div>
    </div>

    <!-- ===== 4. 分页 ===== -->
    <div v-if="showPagination" class="biz-pagination">
      <span class="biz-total">共 {{ total }} 条数据</span>
      <div class="biz-page-controls">
        <select v-model="localPageSize" class="biz-page-size" @change="onPageSizeChange">
          <option v-for="s in pageSizes" :key="s" :value="s">{{ s }}条/页</option>
        </select>
        <button class="biz-page-btn" :disabled="currentPage <= 1" @click="goPage(currentPage - 1)">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6" /></svg>
        </button>
        <template v-for="p in pageNumbers" :key="p">
          <span v-if="p === '...'" class="biz-page-ellipsis">...</span>
          <button
            v-else
            :class="['biz-page-num', { active: p === currentPage }]"
            @click="goPage(p)"
          >{{ p }}</button>
        </template>
        <button class="biz-page-btn" :disabled="currentPage >= pageCount" @click="goPage(currentPage + 1)">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6" /></svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BizTable',
  props: {
    tabs: { type: Array, default: () => [] },
    columns: { type: Array, default: () => [] },
    data: { type: Array, default: () => [] },
    rowKey: { type: String, default: 'id' },
    showSearch: { type: Boolean, default: false },
    searchPlaceholder: { type: String, default: '输入关键词回车搜索' },
    searchText: { type: String, default: '' },
    showAction: { type: Boolean, default: false },
    showPagination: { type: Boolean, default: false },
    total: { type: Number, default: 0 },
    currentPage: { type: Number, default: 1 },
    pageSize: { type: Number, default: 10 },
    pageSizes: { type: Array, default: () => [10, 20, 50, 100] },
  },
  data() {
    return {
      tableHeight: null,
      resizeObserver: null,
      /** 本地搜索文本（v-model 不能直接用于 prop） */
      localSearchText: '',
      /** 本地每页条数（v-model 不能直接用于 prop） */
      localPageSize: 10,
    }
  },
  computed: {
    pageCount() {
      return Math.max(1, Math.ceil(this.total / this.localPageSize))
    },
    pageNumbers() {
      const total = this.pageCount
      const cur = this.currentPage
      const pages = []
      if (total <= 7) {
        for (let i = 1; i <= total; i++) pages.push(i)
      } else {
        pages.push(1)
        if (cur > 3) pages.push('...')
        const start = Math.max(2, cur - 1)
        const end = Math.min(total - 1, cur + 1)
        for (let i = start; i <= end; i++) pages.push(i)
        if (cur < total - 2) pages.push('...')
        pages.push(total)
      }
      return pages
    }
  },
  mounted() {
    // 初始化本地数据（v-model 不能直接用于 prop）
    this.localSearchText = this.searchText
    this.localPageSize = this.pageSize
    const parent = this.$el.parentElement
    if (parent) {
      this.resizeObserver = new ResizeObserver(() => {
        this.calcHeight()
      })
      this.resizeObserver.observe(parent)
    }
  },
  beforeDestroy() {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect()
      this.resizeObserver = null
    }
  },
  methods: {
    calcHeight() {
      const parent = this.$el.parentElement
      if (parent) {
        this.tableHeight = Math.max(400, parent.offsetHeight) + 'px'
      }
    },
    handleWheel(e) {
      e.preventDefault()
      const el = this.$refs.scrollRef
      if (el) el.scrollTop += e.deltaY
    },
    onSearch() {
      this.$emit('update:searchText', this.searchText)
      this.$emit('search', this.searchText)
    },
    goPage(p) {
      if (p < 1 || p > this.pageCount || p === this.currentPage) return
      this.$emit('update:currentPage', p)
      this.$emit('page-change', p)
    },
    onPageSizeChange() {
      this.$emit('update:pageSize', this.pageSize)
      this.$emit('page-size-change', this.pageSize)
    }
  }
}
</script>

<style lang="scss" scoped>
.biz-table {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.08);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  .biz-tabs { flex-shrink: 0; }
  .biz-toolbar { flex-shrink: 0; }
  .biz-table-body {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    min-height: 0;
  }
  .biz-table-scroll {
    flex: 1;
    overflow-y: auto;
    min-height: 0;
    &::-webkit-scrollbar { width: 6px; }
    &::-webkit-scrollbar-track { background: transparent; }
    &::-webkit-scrollbar-thumb { background: #d0d0d0; border-radius: 3px; &:hover { background: #b0b0b0; } }
    scrollbar-width: thin;
    scrollbar-color: #d0d0d0 transparent;
  }
  .biz-pagination { flex-shrink: 0; }
}

/* ===== Tabs ===== */
.biz-tabs {
  display: flex;
  gap: 8px;
  padding: 16px 24px 0;
}
.biz-tab {
  padding: 6px 18px;
  font-size: 13px;
  color: #666;
  text-decoration: none;
  background: #f5f5f5;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  &:hover { background: #e8e8e8; }
  &.tab-active {
    background: rgba(255,107,107,0.15);
    color: #ff6b6b;
    &:hover { background: rgba(255,107,107,0.2); }
  }
}

/* ===== Toolbar ===== */
.biz-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 24px;
}
.biz-search {
  display: flex;
  align-items: center;
  width: 280px;
  height: 38px;
  border: 1px solid #e4e6eb;
  border-radius: 4px;
  padding: 0 0 0 12px;
  transition: border-color 0.2s;
  overflow: hidden;
  &:focus-within { border-color: #c62f2e; }
}
.biz-search-input {
  flex: 1;
  border: none;
  outline: none;
  font-size: 13px;
  color: #333;
  &::placeholder { color: #bbb; }
}
.biz-search-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 100%;
  background: #f0f0f0;
  border: none;
  border-left: 1px solid #e4e6eb;
  cursor: pointer;
  color: #999;
  flex-shrink: 0;
  transition: background 0.2s, color 0.2s;
  &:hover { background: #ff6b6b; color: #fff; }
}
.biz-buttons { display: flex; gap: 8px; }

/* ===== Table ===== */
.biz-table-header, .biz-tr {
  display: flex;
  align-items: center;
  padding: 0 24px;
  font-size: 13px;
}
.biz-table-header {
  height: 48px;
  background: #f9fafb;
  color: #666;
  font-weight: 500;
  border-bottom: 1px solid #f3f4f6;
  flex-shrink: 0;
}
.biz-th { white-space: nowrap; }
.biz-tr {
  min-height: 56px;
  border-bottom: 1px solid #f3f4f6;
  transition: background 0.15s;
  &:hover { background: rgba(255, 107, 107, 0.15); color: #ff6b6b; font-weight: 700; :deep(.biz-td), :deep(.biz-td *)* { color: #ff6b6b; font-weight: 700; } }
  &:last-child { border-bottom: none; }
  &.row-alt { background: #fafbfc; &:hover { background: rgba(255, 107, 107, 0.15); color: #ff6b6b; font-weight: 700; :deep(.biz-td), :deep(.biz-td *)* { color: #ff6b6b; font-weight: 700; } } }
}
.biz-td {
  font-size: 13px;
  color: #333;
}
.text-left { text-align: left; }
.text-right { text-align: right; }
.text-center { text-align: center; }

.biz-empty {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}
.biz-empty-text { color: #bbb; font-size: 14px; }

/* ===== Pagination ===== */
.biz-pagination {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 64px;
  padding: 0 24px;
  border-top: 1px solid #f3f4f6;
  flex-shrink: 0;
}
.biz-total { font-size: 13px; color: #999; }
.biz-page-controls { display: flex; align-items: center; gap: 4px; }
.biz-page-size {
  height: 32px;
  padding: 0 8px;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  font-size: 13px;
  color: #444;
  background: #fff;
  outline: none;
  margin-right: 8px;
  cursor: pointer;
}
.biz-page-btn {
  width: 36px; height: 36px;
  display: flex; align-items: center; justify-content: center;
  border: 1px solid #e5e7eb; border-radius: 4px;
  background: #fff; cursor: pointer;
  color: #666; font-size: 14px;
  transition: all 0.15s;
  &:disabled { opacity: 0.4; cursor: default; }
  &:hover:not(:disabled) { background: #f5f5f5; }
}
.biz-page-num {
  width: 36px; height: 36px;
  display: flex; align-items: center; justify-content: center;
  border: 1px solid #e5e7eb; border-radius: 4px;
  font-size: 14px; color: #444; cursor: pointer;
  transition: all 0.15s;
  &.active { background: #ff6b6b; color: #fff; border-color: #ff6b6b; }
  &:hover:not(.active) { background: #f5f5f5; }
}
.biz-page-ellipsis {
  width: 36px; height: 36px;
  display: flex; align-items: center; justify-content: center;
  font-size: 14px; color: #999;
}
</style>
