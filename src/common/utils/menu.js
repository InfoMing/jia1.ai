/**
 * 工具
 * 根据后端传入值动态生成菜单
 */
import Layout from '@/admin/layout/index.vue'
import $resourceApi from "@/admin/api/resource"
import { treeDataTranslate } from '@/common/utils'

const menu_key = "Base_MENU_KEY";

/**
 * 用户登录后获取用户允许操作的菜单路由
 * 从 Resource API 查询 type=directory/menu 的数据构建菜单树
 * 
 * 注意：接口可能超时或不可用，调用方应做好异常处理
 */
export async function getMenu() {
  let menuArr = null;
  let menuStr = window.localStorage.getItem(menu_key);
  if (menuStr) {
    try {
      menuArr = JSON.parse(menuStr)
    } catch (e) {
      menuArr = null
    }
  }

  if (!menuArr) {
    // 添加 5 秒超时，避免 API 未响应导致页面卡死
    try {
      await Promise.race([
        $resourceApi.list({
          pageParameter: { pageNum: 1, pageSize: 999 },
          match: [
            { key: "type", value: 2 },
            { key: "type", value: 1 }
          ],
          conditionalRelation: "or"
        }).then(res => {
          if (res.code != 2000) return;
          menuArr = res.data.list || []
          window.localStorage.setItem(menu_key, JSON.stringify(menuArr))
        }),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error('菜单加载超时')), 5000)
        )
      ])
    } catch (e) {
      // 超时或接口异常 → 返回空菜单，页面仍可访问常量路由
      window.localStorage.removeItem(menu_key)
      return []
    }
  }

  if (!menuArr) return []

  let treeData = treeDataTranslate(menuArr, 'id', 'parentId', 'children')
  let routes = new Array();
  filterAsyncRoutes(routes, treeData)
  return routes;
}

function filterAsyncRoutes(routes, data) {
  if (!data) return
  data.forEach(item => {
    if (item.type === 3) return
    const menu = {
      path: item.requestPath,
      component: item.componentPath == 'Layout' ? Layout : loadView(item.componentPath),
      hidden: !item.isShow,
      children: [],
      name: item.componentName,
      meta: { title: item.pageTitle, icon: item.pageIcon }
    }
    if (item.children && item.children.length > 0) {
      filterAsyncRoutes(menu.children, item.children)
    }
    routes.push(menu)
  })
}

// 构建一次所有 .vue 文件的路径映射表
const viewModules = import.meta.glob('/src/**/*.vue')
const viewModuleMap = {}
for (const filePath of Object.keys(viewModules)) {
  // 去掉 /src/ 前缀作为 key，形如 "admin/views/xxx/index.vue"
  const key = filePath.replace(/^\/src\//, '')
  viewModuleMap[key] = viewModules[filePath]
}

/**
 * 动态加载视图组件
 * 后端配置的 componentPath 形如 "admin/views/xxx/index"
 * 在前端映射为 /src/admin/views/xxx/index.vue
 * 未找到时返回 404 页面
 */
export const loadView = (view) => {
  return () => {
    // 补全 .vue 扩展名，去掉开头的 /
    const normalizedView = (view.endsWith('.vue') ? view : `${view}.vue`).replace(/^\//, '')
    // 尝试在已收集的 .vue 文件路径中匹配（精确匹配，去掉 /src/ 前缀后比较）
    const loader = viewModuleMap[normalizedView]
    if (loader) return loader()
    // 未匹配到 → 返回 404 页面
    return import('@/admin/views/common/error-page/404.vue')
  }
}
