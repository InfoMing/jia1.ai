// 全局注册组件
import Vue from "vue"
import BaseTable from "@/admin/components/BaseTable" // table组件
import SvgIcon from '@/admin/components/SvgIcon' // svg封装组件
import BaseDescription from '@/admin/components/Opertate/BaseDescription' // 详细信息组件
import LeftRightLayout from '@/admin/components/LeftRightLayout' // 左右布局组件

// 注册到全局的vue中
Vue.component('svg-icon', SvgIcon)
Vue.component('base-table', BaseTable)
Vue.component('base-description', BaseDescription)
Vue.component('left-right-layout', LeftRightLayout)

// svg输出
const req = require.context('@/admin/assets/icons/svg', false, /\.svg$/)
const requireAll = requireContext => requireContext.keys().map(requireContext)
requireAll(req)
