// 新增、编辑信息公共组件
<template>
  <div>
    <!--
    <div class="my-edit-wrap">
      <div class="my-edit-header-wrap flex flex-item-center">
        <div class="title">新增、编辑信息公共组件</div>
        <div class="line flex1"></div>
      </div>
      <div class="my-edit-body-wrap">
        <div class="my-edit-itew-wrap" style="width: 500px;">
          <div class="label" style="width:100px;">
            <i class="el-icon-office-building"></i>
            姓名
          </div>
          <div class="value" style="width: calc(100% - 100px)">
            <el-input v-model="input1" placeholder="请输入内容"></el-input>
          </div>
        </div>
        <div class="my-edit-itew-wrap">
          <div class="label">
            <i class="el-icon-office-building"></i>
            ÒÒÒÒÒ
          </div>
          <div class="value">
            <el-input v-model="input1" placeholder="请输入内容"></el-input>
          </div>
        </div>
        <div class="my-edit-itew-wrap">
          <div class="label">
            <i class="el-icon-office-building"></i>
            姓名
          </div>
          <div class="value">
            <el-input v-model="input1" placeholder="请输入内容"></el-input>
          </div>
        </div>
      </div>
    </div>
    -->

    <div class="my-edit-wrap">
      <div class="my-edit-header-wrap flex flex-item-center">
        <div class="title">新增、编辑信息公共组件</div>
        <div class="line flex1"></div>
      </div>
      <div class="my-edit-body-wrap">
        <div class="my-edit-itew-wrap" style="width: 500px;">
          <div class="label" style="width:100px;">
            <i class="el-icon-office-building"></i>
            姓名
          </div>
          <div class="value" style="width: calc(100% - 100px)">
            <el-input v-model="input1" placeholder="请输入内容"></el-input>
          </div>
        </div>
        <div class="my-edit-itew-wrap">
          <div class="label">
            <i class="el-icon-office-building"></i>
            姓名
          </div>
          <div class="value">
            <el-input v-model="input1" placeholder="请输入内容"></el-input>
          </div>
        </div>
        <div class="my-edit-itew-wrap">
          <div class="label">
            <i class="el-icon-office-building"></i>
            姓名
          </div>
          <div class="value">
            <el-input v-model="input1" placeholder="请输入内容"></el-input>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
export default {
  name: "BaseEdit",
  props: {},
  data() {
    return {
      input1: "",
    };
  },
  computed: {},
  watch: {},
  mounted() {},
  methods: {},
};
</script>

<style lang="scss">
.my-edit-wrap {
  margin-bottom: 20px;
  .my-edit-header-wrap {
    margin-bottom: 10px;
    .title {
      display: inline-block;
      border-left: solid 3px #1890ff;
      padding-left: 4px;
      font-size: 16px;
      font-weight: bold;
      color: #303133;
      padding-right: 5px;
    }
    .line {
      display: inline-block;
      height: 1px;
      background: #dcdfe6;
    }
  }

  .my-edit-itew-wrap {
    display: inline-block;
    .label {
      display: inline-block;
      border: 1px solid #ebeef5;
      padding: 12px 10px;
      color: #909399;
      background: #fafafa;
    }
    .value {
      display: inline-block;
      color: #606266;
      background-color: #fff;
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
      text-align: left;
      border: 1px solid #ebeef5;
      line-height: 42px;

      input {
        border: none !important;
      }
    }
  }
}
</style>
