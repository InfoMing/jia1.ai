<template>
  <div class="errPage-container">
    <el-button icon="el-icon-arrow-left" class="pan-back-btn" @click="back">
      返回
    </el-button>
    <el-row>
      <el-col :span="12">
        <h1 class="text-jumbo text-ginormous">
          Oops!
        </h1>
        <h2>你没有权限去该页面</h2>
        <div class="list-unstyled">
          <el-link type="primary" @click="back">返回上一页</el-link>
          <br>
          <el-link type="primary" @click="home">前往主页</el-link>
        </div>
      </el-col>
      <el-col :span="12">
        <img :src="errGif" width="313" height="428" alt="Girl has dropped her ice cream.">
      </el-col>
    </el-row>
  </div>
</template>

<script>
import errGif from "@/admin/assets/img/error/401.gif";

export default {
  name: "Page401",
  data() {
    return {
      errGif: errGif + "?" + +new Date(),
    };
  },
  methods: {
    back() {
      if (this.$route.query.noGoBack) {
        this.$router.push({ path: "/home" });
      } else {
        this.$router.go(-1);
      }
    },
    home() {
      this.$router.push({ path: "/home" });
    },
  },
};
</script>

<style lang="scss" scoped>
.errPage-container {
  width: 50%;
  max-width: 1000px;
  margin: 0 auto;
  height: 100%;
  padding: 5em 0;
  .pan-back-btn {
    background: #1482f0;
    color: #fff;
    border: none !important;
  }
  .pan-gif {
    margin: 0 auto;
    display: block;
  }
  .pan-img {
    display: block;
    margin: 0 auto;
    width: 100%;
  }
  .text-jumbo {
    font-size: 60px;
    font-weight: 700;
    color: #1482f0;
  }
  .list-unstyled {
    font-size: 14px;
    li {
      padding-bottom: 5px;
    }
    a {
      color: #1482f0;
      text-decoration: none;
      &:hover {
        text-decoration: underline;
      }
    }
  }
}
</style>
