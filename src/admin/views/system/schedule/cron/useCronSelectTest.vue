/**
  使用cron表达式示例
 */

<template>
  <div class="container">
    <el-button type="primary" @click="dialogVisible = true">定时任务配置</el-button>
    <span>{{value}}</span>
    <el-dialog title="Cron表达式选择器" :visible.sync="dialogVisible" width="800px"
      :close-on-click-modal="false">
      <cron ref="cronRef" :value="value"></cron>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" type="primary" @click="getCronFormula">确 定</el-button>
        <el-button size="small" @click="dialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Cron from "./index.vue";
export default {
  name: "UseCronSelectTest",
  components: {
    Cron,
  },

  data() {
    return {
      dialogVisible: false,
      value: "",
    };
  },
  computed: {},
  created() {},
  methods: {
    // 获取表达式
    getCronFormula() {
      // 若是表达式返回值空，则不允许关闭
      let d = this.$refs.cronRef.getValue();
      if (!d) return;

      this.value = d;
      this.dialogVisible = false;
    },
  },
};
</script>
