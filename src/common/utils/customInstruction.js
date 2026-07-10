/**
 * 自定义vue指令
 * 自定义组件统一以：v-my*开头
 * 例如：v-show、v-myfocus
 * @author my
 * @date 2021-12-17
 *
 * Vue 3 指令生命周期钩子：
 *   created   — 元素初始化时
 *   mounted   — 元素挂载到 DOM 时（对应原来的 inserted）
 *   updated   — 元素更新时
 *   unmounted — 元素卸载时（对应原来的 unbind）
 */

import { btnShow } from "@/common/utils/user"


// 导出注册函数，由 main.js 传入 app 后调用
export default function (app) {
  myshow(app)
  myfocus(app)
}



/**权限指令 ========================================================================**/
// 用法：<el-button v-myshow="'btn_code'">
// 根据资源权限编号判断是否显示元素，无权限则从 DOM 中移除
function myshow(app) {
  app.directive('myshow', {
    mounted(el, binding) {
      const value = binding.value // 指令绑定的资源编号
      const isShow = btnShow(value); // 判断是否有权限
      if (isShow) return; // 有权限直接通过
      el.parentNode && el.parentNode.removeChild(el); // 无权限则删除元素
    }
  });
}


/**自动获取焦点 ========================================================================**/
// 用法：<el-input v-myfocus>
// 元素挂载后自动聚焦到输入框
function myfocus(app) {
  app.directive('myfocus', {
    mounted(el) {
      // 查找元素内部的 input 或 textarea（Element 的 input 外面包了一层 div）
      const dom = el.querySelector("input") || el.querySelector("textarea") || el
      dom && dom.focus();
    },
  });
}
