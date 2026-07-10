<template>
  <div id="box">
    <!-- 左边 -->
    <div id="left">
      <slot name="left"></slot>
    </div>

    <div id="resize" title="收缩侧边栏">
    </div>

    <!-- 右边 -->
    <div id="mid">
      <slot name="right"></slot>
    </div>
  </div>

</template>
 
<script>
export default {
  name: "LeftRightLayout",
  props: {
    // 左边最小宽度
    minWidth: {
      type: String,
      default: "200px",
    },
    // 左边默认宽度
    width: {
      type: String,
      default: "50%",
    },
  },
  data() {
    return {};
  },

  computed: {},
  mounted() {
    // 初始化宽度
    this.initWidth();
    // 当挂载时挂载上
    this.dragControllerDiv();
    window.onresize = () => {
      this.dragControllerDiv();
    };
  },
  methods: {
    dragControllerDiv: function () {
      var resize = document.getElementById("resize");
      var left = document.getElementById("left");
      var mid = document.getElementById("mid");
      var box = document.getElementById("box");
      var that = this;

      // 鼠标按下事件
      resize.onmousedown = function (e) {
        //颜色改变提醒
        var startX = e.clientX;
        resize.left = resize.offsetLeft;
        // 鼠标拖动事件
        document.onmousemove = function (e) {
          var endX = e.clientX;
          var moveLen = resize.left + (endX - startX); // （endx-startx）=移动的距离。resize.left+移动的距离=左边区域最后的宽度
          var maxT = box.clientWidth - resize.offsetWidth; // 容器宽度 - 左边区域的宽度 = 右边区域的宽度

          let minWidth = that.getPixelNum(that.minWidth);
          if (moveLen < minWidth) moveLen = minWidth; // 左边区域的最小宽度
          if (moveLen > maxT - minWidth) moveLen = maxT - minWidth; //右边区域最小宽度

          resize.style.left = moveLen; // 设置左侧区域的宽度

          left.style.width = that.getPercentage(moveLen);
          mid.style.width = that.getPercentage(
            box.clientWidth - moveLen - resize.offsetWidth
          );
        };
        // 鼠标松开事件
        document.onmouseup = function (evt) {
          //颜色恢复
          document.onmousemove = null;
          document.onmouseup = null;
          resize.releaseCapture && resize.releaseCapture(); //当你不在需要继续获得鼠标消息就要应该调用ReleaseCapture()释放掉
        };
        resize.setCapture && resize.setCapture(); //该函数在属于当前线程的指定窗口里设置鼠标捕获
        return false;
      };
    },
    // 将含有"px","%"的像素转换为像素值
    getPixelNum(pxNum) {
      let num = pxNum,
        max = 300;
      if (pxNum.indexOf("px") != -1) num = pxNum.replace(/px/g, "");
      if (pxNum.indexOf("%") != -1)
        num =
          (document.getElementById("box").offsetWidth *
            pxNum.replace(/%/g, "")) /
          100;
      if (num < max) num = max;
      return num;
    },

    // 初始化宽度
    initWidth() {
      var resize = document.getElementById("resize");
      var left = document.getElementById("left");
      var mid = document.getElementById("mid");
      let all = document.getElementById("box").offsetWidth; // 总宽度
      let lWindth = this.getPixelNum(this.width); // 默认宽度
      let rWindow = all - lWindth - resize.clientWidth; // 右边宽度
      left.style.width = (lWindth / all) * 100 + "%"; // 左边百分比
      mid.style.width = (rWindow / all) * 100 + "%"; // 右边百分比
    },

    // 获取百分比，直接使用px的话，当div变化后无法适应
    getPercentage(width) {
      let all = document.getElementById("box").offsetWidth; // 总宽度
      return (width / all) * 100 + "%";
    },
  },
};
</script>
 
<style lang="scss" scoped>
/* 拖拽相关样式 */
/*包围div样式*/
#box {
  width: 100%;
  height: 100%;
  overflow: hidden;
  display: -moz-box; /*firefox*/
  display: -ms-flexbox; /*IE10*/
  display: -webkit-box; /*Safari*/
  display: -webkit-flex; /*Chrome*/
  display: flex;
  display: flexbox;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
/*左侧div样式*/
#left {
  height: 100%;
}
/*拖拽区div样式*/
#resize {
  cursor: col-resize;
  float: left;
  position: relative;
  width: 10px;
  height: 100%;
  background-size: cover;
  background-position: center;
  z-index: 99999;
  font-size: 32px;
  margin: 0 5px;
}
/*右侧div'样式*/
#mid {
  float: left;
  height: 100%;
}
</style>