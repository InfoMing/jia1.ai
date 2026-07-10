/** Base相关配置 */
// 放全局参数
import { defineStore } from 'pinia'

export const useBaseStore = defineStore('base', {
  state: () => ({
    tablePageSizeList: [1, 5, 10, 50, 100, 200, 300, 500], /*** 分页查询可选大小 */
    tablePageDefaultSize: 10 /***分页默认大小 */
  })
})
