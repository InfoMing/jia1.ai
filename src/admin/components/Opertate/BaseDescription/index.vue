// 查询详细信息公共组件
<template>
  <div>
    <el-descriptions v-for="desc in data" :title="desc.title" :column="desc.column" :size="desc.size" border>
      <!-- 每一项小项 -->
      <el-descriptions-item v-for="item in desc.item" :labelStyle="item.labelStyle" :contentStyle="item.valueStyle"
        :span="item.span">
        <!-- 名称项 -->
        <template slot="label">
          <!-- 图标 -->
          <span v-if="item.icontType">
            <!-- element icon -->
            <i v-if="item.icontType == 'el'" :class="item.icont"></i>
            <!-- svg icon -->
            <svg-icon v-if="item.icontType == 'svg'" :icon-class="item.icont" />
          </span>
          {{ item.label }}
        </template>
        {{ item.value }}
      </el-descriptions-item>

    </el-descriptions>

    <!-- 使用示例 -->

    <!-- 查询 -->
    <!-- <el-dialog :visible.sync="dialogVisible" width="80%" :show-close="true" :center="false">
      <span slot="title">这是头部提示</span>
      <span>
        <base-description :data="detailData"></base-description>
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" size="small">操作</el-button>
        <el-button type="primary" size="small">操作</el-button>
        <el-button @click="dialogVisible = false" size="small">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false" size="small">确 定</el-button>
      </span>
    </el-dialog> -->
  </div>
</template>

<script>
export default {
  name: "BaseDescription",
  props: {
    data: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      // 测试数据
      detailData: [
        {
          title: "菜单详细信息",
          column: 3,
          item: [
            {
              icontType: "el",
              icont: "el-icon-office-building",
              label: "联系地址",
              value: "江苏省苏州市吴中区吴中大道 1188 号",
            },
            {
              icontType: "el",
              icont: "el-icon-office-building",
              label: "联系地址",
              value: "江苏省苏州市吴中区吴中大道 1188 号",
            },
            {
              icontType: "el",
              icont: "el-icon-office-building",
              label: "联系地址",
              value: "江苏省苏州市吴中区吴中大道 1188 号",
            },
            {
              icontType: "el",
              icont: "el-icon-office-building",
              label: "联系地址",
              value: "江苏省苏州市吴中区吴中大道 1188 号",
            },
            {
              icontType: "el",
              icont: "el-icon-office-building",
              label: "联系地址",
              value: "江苏省苏州市吴中区吴中大道 1188 号",
            },
            {
              icontType: "el",
              icont: "el-icon-office-building",
              label: "联系地址",
              value: "江苏省苏州市吴中区吴中大道 1188 号",
            },
            {
              icontType: "el",
              icont: "el-icon-office-building",
              label: "联系地址",
              value: "江苏省苏州市吴中区吴中大道 1188 号",
            },
            {
              icontType: "svg",
              icont: "user",
              label: "联系地址",
              value: "江苏省苏州市吴中区吴中大道 1188 号",
            },
            {
              icontType: "el",
              icont: "el-icon-office-building",
              label: "联系地址",
              value: "江苏省苏州市吴中区吴中大道 1188 号",
            },
            {
              icontType: "el",
              icont: "el-icon-office-building",
              label: "联系地址",
              value: "江苏省苏州市吴中区吴中大道 1188 号",
            },
            {
              icontType: "el",
              icont: "el-icon-office-building",
              label: "联系地址",
              value: "江苏省苏州市吴中区吴中大道 1188 号",
            },
            {
              icontType: "el",
              icont: "el-icon-office-building",
              label: "联系地址",
              value: "江苏省苏州市吴中区吴中大道 1188 号",
            },
            {
              icontType: "el",
              icont: "el-icon-office-building",
              label: "联系地址",
              value: "江苏省苏州市吴中区吴中大道 1188 号",
            },
          ],
        },
        {
          title: "这是头部标题",
          size: "medium",
          column: 2,
          item: [
            {
              icontType: "el",
              icont: "el-icon-office-building",
              label: "联系地址",
              value: "江苏省苏州市吴中区吴中大道 1188 号",
            },
            {
              icontType: "el",
              icont: "el-icon-office-building",
              label: "联系地址",
              value: "江苏省苏州市吴中区吴中大道 1188 号",
            },
            {
              icontType: "el",
              icont: "el-icon-office-building",
              label: "联系地址",
              value: "江苏省苏州市吴中区吴中大道 1188 号",
            },
            {
              icontType: "el",
              icont: "el-icon-office-building",
              label: "联系地址",
              value: "江苏省苏州市吴中区吴中大道 1188 号",
            },
            {
              icontType: "el",
              icont: "el-icon-office-building",
              label: "联系地址",
              value: "江苏省苏州市吴中区吴中大道 1188 号",
            },
            {
              icontType: "el",
              icont: "el-icon-office-building",
              label: "联系地址",
              value: "江苏省苏州市吴中区吴中大道 1188 号",
            },
            {
              icontType: "el",
              icont: "el-icon-office-building",
              label: "联系地址",
              value: "江苏省苏州市吴中区吴中大道 1188 号",
            },
            {
              icontType: "svg",
              icont: "user",
              label: "联系地址",
              value: "江苏省苏州市吴中区吴中大道 1188 号",
            },
            {
              icontType: "el",
              icont: "el-icon-office-building",
              label: "联系地址",
              value: "江苏省苏州市吴中区吴中大道 1188 号",
            },
          ],
        },
      ],
    };
  },
  computed: {},
  watch: {},
  mounted() { },
  methods: {},
};
</script>

<style lang="scss">
.el-descriptions__title {
  border-left: solid 3px #1890ff;
  padding-left: 4px;
}

.el-descriptions__header {
  margin-bottom: 10px;
}

.el-dialog__body {
  padding: 0 20px;
}

.el-descriptions {
  margin-bottom: 20px;
}
</style>
