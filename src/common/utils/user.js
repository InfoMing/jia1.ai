/**
 * 用户相关的js工具类
 * @author my
 * @date 2021-12-17
 *
 * 纯 JS 工具文件中使用 Pinia store 的方式：
 *   直接调用 useXxxStore() 获取 store 实例（不需要 setup）
 *   前提是 Pinia 已经通过 app.use(pinia) 注册（在 main.js 中完成）
 */
import $userApi from "@/admin/api/user"
import { useUserStore } from "@/admin/store/user"
import $router from "@/router/index"
import $code from "@/common/utils/code"

const loginUserKey = "LOCAL_CACHE_USER_INFO_KEY" // 本地用户信息存在key
;

/**
 * 登录方法
 * @param data 登录参数
 */
export function login(data, success, error) {
  return $userApi.login(data).then(res => {
    if (!res.success) {
      success(res)
      return;
    }
    // 将登录返回的用户数据存入 Pinia store 和 sessionStorage
    const userStore = useUserStore()
    userStore.setUser(res.data);
    sessionStorage.setItem(loginUserKey, JSON.stringify(res.data));
    success(res)
  }).catch(e => {
    error(e)
  })
}

/**
 * 退出登录
 */
export function logout() {
  // 清空 Pinia store
  const userStore = useUserStore()
  if (userStore.user) {
    userStore.setUser(null)
  }
  $code.delete();
  sessionStorage.clear();
  window.localStorage.clear();
  location.reload();
}

/**
 * 获取 token
 */
export function getToken() {
  const user = getLocalUser();
  let token = user.token;
  return token;
}

/**
 * 获取用户资源权限
 */
export function getUserAuth() {
  const user = getLocalUser();
  let resource = user.resource;
  return resource;
}

/**
 * 获取用户详细信息
 */
export function getUserInfo() {
  return getLocalUser().user;
}

/**
 * 获取登录用户的资源权限数组
 * @param type 资源类型：2-菜单路由资源，3-按钮操作资源，不传查所有
 */
export function getResource(type) {
  const user = getLocalUser();
  let resources = user.resources;
  if (!resources || !Array.isArray(resources) || resources.length == 0) return [];
  if (type) {
    resources = resources.filter(v => v.type == type);
  }
  return resources ? resources : [];
}


/**
 * 获取本地存储的用户信息
 * 优先从 Pinia store 取，没有则从 sessionStorage 读取并同步到 store
 */
function getLocalUser() {
  let user = null;
  const userStore = useUserStore()
  if (userStore.user)
    user = userStore.user;

  if (!user) {
    user = sessionStorage.getItem(loginUserKey);
    if (user) {
      user = JSON.parse(user);
      userStore.setUser(user)
    }
  }
  if (!user) {
    return "";
  }

  return user;
}


/**
 * 判断请求是否有权限
 * @param url 请求路径
 * @param method 请求类型
 */
export function reqIsPermission(url, method) {
  if (!url || !method) return false;
  let res = getResource(1);
  if (!res || !Array.isArray(res) || res.length == 0) return false;
  res.some(v => {
    if (!v.url || v.requestType) return false;
    if (v.url.toLocaleLowerCase() != url.toLocaleLowerCase()) return false;
    if (v.requestType.toLocaleLowerCase() != method.toLocaleLowerCase()) return false;
    return true;
  })
}

/**
 * 判断按钮是否能够显示
 * @param btnCode 按钮编号
 */
export function btnShow(btnCode) {
  if (!btnCode) return false;
  let res = getResource(3);
  if (!res || !Array.isArray(res) || res.length == 0) return false;
  return res.some(v => v.code && v.code.toLocaleLowerCase() == btnCode.toLocaleLowerCase())
}
