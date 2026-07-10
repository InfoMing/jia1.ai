<template>
  <div class="cron" :val="value_">
    <!-- 头部点击tab -->
    <el-tabs v-model="activeName">
      <el-tab-pane label="秒" name="s">
        <second-and-minute v-model="sVal" lable="秒"></second-and-minute>
      </el-tab-pane>
      <el-tab-pane label="分" name="m">
        <second-and-minute v-model="mVal" lable="分"></second-and-minute>
      </el-tab-pane>
      <el-tab-pane label="时" name="h">
        <hour v-model="hVal" lable="时"></hour>
      </el-tab-pane>
      <el-tab-pane label="日" name="d">
        <day v-model="dVal" lable="日"></day>
      </el-tab-pane>
      <el-tab-pane label="月" name="month">
        <month v-model="monthVal" lable="月"></month>
      </el-tab-pane>
      <el-tab-pane label="星期" name="week">
        <week v-model="weekVal" lable="星期"></week>
      </el-tab-pane>
      <!-- <el-tab-pane label="年" name="year">
        <year v-model="yearVal" lable="年"></year>
      </el-tab-pane> -->
    </el-tabs>

    <!-- 提示框 -->
    <div class="tip-wrap">
      <router-link tag="a" target="_blank" :to="{path:'/cron/cronDetail'}">什么是Cron？
      </router-link>
    </div>

    <!-- table表格提示 -->
    <div style="width: 100%;">
      <el-table :data="tableData" size="small" border style="width: 100%;">
        <el-table-column prop="sVal" label="秒" />
        <el-table-column prop="mVal" label="分" />
        <el-table-column prop="hVal" label="时" />
        <el-table-column prop="dVal" label="日" />
        <el-table-column prop="monthVal" label="月" />
        <el-table-column prop="weekVal" label="星期" />
        <!-- <el-table-column prop="yearVal" label="年" /> -->
      </el-table>
    </div>
  </div>
</template>

<script>
import SecondAndMinute from "./secondAndMinute.vue";
import hour from "./hour.vue";
import day from "./day.vue";
import month from "./month.vue";
import week from "./week.vue";
import year from "./year.vue";
export default {
  name: "Core",
  props: {
    value: {
      type: String,
    },
  },
  data() {
    return {
      activeName: "s",
      sVal: "",
      mVal: "",
      hVal: "",
      dVal: "",
      monthVal: "",
      weekVal: "",
      yearVal: "",
    };
  },
  watch: {
    value(a, b) {
      this.updateVal();
    },
  },
  computed: {
    tableData() {
      return [
        {
          sVal: this.sVal,
          mVal: this.mVal,
          hVal: this.hVal,
          dVal: this.dVal,
          monthVal: this.monthVal,
          weekVal: this.weekVal,
          yearVal: this.yearVal,
        },
      ];
    },
    value_() {
      let v = `${this.sVal} ${this.mVal} ${this.hVal} ${this.dVal} ${this.monthVal} ${this.weekVal} ${this.yearVal}`;
      if (v !== this.value) {
        this.$emit("input", v);
      }
      return v;
    },
  },
  methods: {
    updateVal() {
      if (!this.value) {
        return;
      }
      let arrays = this.value.split(" ");
      this.sVal = arrays[0];
      this.mVal = arrays[1];
      this.hVal = arrays[2];
      this.dVal = arrays[3];
      this.monthVal = arrays[4];
      this.weekVal = arrays[5];
      this.yearVal = arrays[6];
    },

    // 获取值
    getValue() {
      let error = this.checkValue();
      if (error) {
        this.$message.error(error);
        return "";
      }
      let v = `${this.sVal} ${this.mVal} ${this.hVal} ${this.dVal} ${this.monthVal} ${this.weekVal}`;
      return v;
    },

    // 校验参数
    checkValue() {
      if (!this.sVal) {
        return "秒不能为空";
      }
      if (!this.mVal) {
        return "分不能为空";
      }
      if (!this.hVal) {
        return "时不能为空";
      }
      if (!this.dVal) {
        return "天不能为空";
      }
      if (!this.monthVal) {
        return "月不能为空";
      }
      if (!this.weekVal) {
        return "周不能为空";
      }

      // dVal=?表示不指定“日”域的值。规则是指定“周”域，则“日”域必须为“?”。反之，指定“日”域，则“周”域必须为“?”。
      // 若指定日期（dVal != '?')，则星期必须为?
      if (this.dVal != "?" && this.weekVal != "?") {
        return "日期和星期必须有一个为“不指定”";
      }

      if (this.dVal === "?" && this.weekVal === "?") {
        return "日期与星期不可以同时为“不指定”";
      }
      if (this.dVal === "?" && this.weekVal === "?") {
        return "日期与星期不可以同时为“不指定”";
      }
    },
  },
  created() {
    this.updateVal();
  },

  components: {
    SecondAndMinute,
    hour,
    day,
    month,
    week,
    year,
  },
};
</script>

<style lang="scss">
.cron {
  background: #fff;
  margin: 0 auto;
  overflow: hidden;
  position: relative;

  .tip-wrap {
    position: absolute;
    right: 0;
    line-height: 40px;
    font-size: 10px;
    color: #a0cfff;
    cursor: pointer;
  }

  .item {
    margin-top: 2px;
  }

  .el-checkbox {
    margin-right: 15px;
  }
  .el-checkbox__label {
    padding-left: 5px;
  }

  .el-table th.el-table__cell > .cell {
    text-align: center;
  }
  .el-table .cell {
    text-align: center;
  }
  .el-table--border {
    margin-top: 10px;
  }
  .el-table--mini .el-table__cell {
    padding: 2px 0;
  }

  .el-input-number--mini {
    margin: 0 2px;
  }
  .el-radio.is-bordered + .el-radio.is-bordered {
    margin-left: 0;
  }
}
</style>
