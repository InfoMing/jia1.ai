// 选择展示的table列
<template>
  <div class="show-table-column-container">
    <div class="tip">
      <span>列表展示</span>
    </div>
    <el-checkbox v-for="cloumn in columns" :label="cloumn.label" true-label="true"
      false-label="false" @change="(v) => change(cloumn.prop,v)" :checked="cloumn.show">
    </el-checkbox>

  </div>
</template>
<script>
export default {
  name: "ShowTableColumn",
  props: {
    columns: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {};
  },
  methods: {
    change(prop, v) {
      this.columns.map((item, i) => {
        if (item.prop == prop) item.show = JSON.parse(v);
      });
    },
  },
};
</script>

<style lang="scss">
.show-table-column-container {
  max-height: 500px;
  overflow-y: auto;
  .tip {
    margin-bottom: 5px;
    padding-bottom: 2px;
    border-bottom: 1px solid #dfe6ec;
  }
}
</style>