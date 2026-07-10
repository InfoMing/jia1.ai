/**
 * 系统设置
 * node版本：v22.23.1 (LTS)
 * npm版本：10.9.8
 * 
 * 使用淘宝npm库安装命令：npm install --registry=https://registry.npmmirror.com
 */

export default {
  title: '合适价投',

  /**
   * @type {boolean} true | false
   * @description 是否显示旁边栏设置
   */
  showSettings: false,

  /**
   * @type {boolean} true | false
   * @description 是否显示标签栏
   */
  tagsView: true,

  /**
   * @type {boolean} true | false
   * @description 是否固定头部
   */
  fixedHeader: false,

  /**
   * @type {boolean} true | false
   * @description 是否展示侧边栏logo
   */
  sidebarLogo: false,

  /**
   * @type {string | array} 'production' | ['production', 'development']
   * @description 需要显示错误日志组件
   *默认值仅在生产环境中使用
   *如果您还想在dev中使用它，可以通过['production'，'development']
   */
  errorLog: 'production'
}
