/**
 * 缓存后端码表数据到前端
 * 主要用于翻译前端的码表编号和值得对应关系，比如后端返回性别为"1"，经过码表翻译可显示为“男”
 */
import codeApi from "@/admin/api/code"
import { copyValue } from "@/common/utils/index"


// 导出数据
export default {
  get: getCache, // 取出码表数据
  update: updateCache, // 刷新码表
  delete: deleteCache, // 删除
  time: getTimeStamp, // 获取最近更新时间
  printSize: printCodeSize, // 打印缓存大小
  forEach: translateCache, // 翻译数据
  cacheStatus: getCacheStatus, // 获取缓存状态
}


// 变量==========================================================
const codeIndex = "BASE_LOCAL_CODE_KEY", // 码表key
  timeStampKey = "BASE_UPDATE_TIME_STAMP_KEY", // 最近更新的时间戳key
  cachedAtKey = "BASE_CACHED_AT_KEY", // 缓存记录时刻key
  ttlKey = "BASE_CACHE_TTL_KEY" // 缓存最长有效期key（单位秒）

let pendingPromise = null // 请求去重锁，同一时刻只发起一次 API 请求

/**
 * 从码表数据中提取 TTL 值（缓存最长有效时间）
 */
function extractTtl(data) {
  if (data['BASE_CODE_CACHE_CONFIG'] && data['BASE_CODE_CACHE_CONFIG']['TTL']) {
    let ttl = parseInt(data['BASE_CODE_CACHE_CONFIG']['TTL'])
    if (!isNaN(ttl) && ttl > 0) return ttl
  }
  return 1800 // 默认 30 分钟
}

// 更新码表本地缓存 ================================================
function updateCache() {
  // 已有请求去重锁，复用已有 Promise
  if (pendingPromise) return pendingPromise

  pendingPromise = new Promise((resolve, reject) => {
    codeApi.getCodeAndInfoAll().then(res => {
      if (!res.success) {
        pendingPromise = null
        resolve()
        return
      }
      let d = res.data
      let data = {}
      d.map((v, k) => {
        let newV = { _name: v.name }
        v.codeInfos.map((value, key) => {
          newV[value.code.toUpperCase()] = value.value
        })
        data[v.code.toUpperCase()] = newV
      })
      // 提取 TTL 缓存有效时间
      let ttl = extractTtl(data)
      window.localStorage.setItem(codeIndex, JSON.stringify(data))
      window.localStorage.setItem(timeStampKey, res.codeUpdateTime)
      window.localStorage.setItem(ttlKey, ttl)
      window.localStorage.setItem(cachedAtKey, Date.now())
      pendingPromise = null
      resolve()
    }).catch((e) => {
      pendingPromise = null
      reject(e)
    })
  })

  return pendingPromise
}

/**
 * 取出码表数据值
 * @param  codeKey 主码表编号，不传-获取所有，具体值-获取具体主码表值，
 *                 当传一个值后面用英文逗号拼接’not_name‘时，不返回_name字段，
 *                 如："api_state,not_name"
 * @param infoKey  码表详细信息编号，不传-获取所有，具体值-获取具体主码表值
 */
function getCache(codeKey, infoKey) {
  // 先判断本地缓存是否存在值，不存在就先获取（更新）
  let codeAll = window.localStorage.getItem(codeIndex)
  if (!codeAll) {
    updateCache()
    return null
  }

  // TTL 过期校验：检查缓存是否超过最长有效时间
  let cachedAt = window.localStorage.getItem(cachedAtKey)
  let ttl = parseInt(window.localStorage.getItem(ttlKey)) || 1800
  if (cachedAt && (Date.now() - parseInt(cachedAt)) > ttl * 1000) {
    updateCache()
    return null
  }

  codeAll = JSON.parse(codeAll)
  if (!codeAll) return null // 仍然无值则返回null
  // codeKey无值获取所有
  if (!codeKey) return codeAll

  // infoKey无值获取主码表
  let cKey = codeKey.split(",")
  let code = {};
  copyValue(codeAll[cKey[0].toUpperCase()], code); // 深拷贝
  if (cKey.length > 1 && cKey[1].toUpperCase() == "NOT_NAME") {
    delete code._name;
  }

  if (!code) return null
  if (!infoKey) return code
  // infoKey有值获取值
  let info = code[infoKey.toUpperCase()]
  if (!info) return null
  return info
}

/**
 * 删除缓存中的码表值
 */
function deleteCache() {
  window.localStorage.removeItem(codeIndex)
  window.localStorage.removeItem(cachedAtKey)
  window.localStorage.removeItem(ttlKey)
}

/**
 * 获取最近更新的时间戳值
 */
function getTimeStamp() {
  let d = window.localStorage.getItem(timeStampKey)
  if (d) return d
  else return ""
}

/**
 * 获取本地码表缓存状态
 * 返回缓存记录时刻、TTL 值、更新时间和默认 TTL
 */
function getCacheStatus() {
  let cachedAt = window.localStorage.getItem(cachedAtKey)
  let ttl = parseInt(window.localStorage.getItem(ttlKey)) || 1800
  let updateTime = window.localStorage.getItem(timeStampKey)
  return {
    cachedAt: cachedAt ? parseInt(cachedAt) : null,
    ttl: ttl,
    updateTime: updateTime || null,
    defaultTtl: 1800
  }
}

/**
 * 打印缓存大小
 */
function printCodeSize() {
  let size = window.localStorage.getItem(codeIndex).length * 2;
  const arr = ['Byte', 'KB', 'MB', 'GB', 'TB'];
  let sizeUnit = 0;
  while (size > 1024) {
    size /= 1024;
    ++sizeUnit;
  }
  console.log(`本地码表缓存大小为：${size.toFixed(2)}${arr[sizeUnit]}`)
  return `${size.toFixed(2)}${arr[sizeUnit]}`;
}

/**
 * 翻译，将数据库返回的码表编号翻译成对应的中文
 * 如：{sex:1} 翻译为 {sex:1,sexName:'男'}
 * @param objs 需要翻译的对象，可以是数组，可以是对象
 * @param translateArr 需要翻译的对象字段以及对应的码表主表编号，
 *                形如：{sex:'cd_sex',state: 'cd_sex'}
 * 
 */
function translateCache(objs, translateArr) {
  if (!objs || !translateArr) return;

  // 当为对象时
  if (!Array.isArray(objs)) {
    // 遍历对象属性，判断哪些字段需要翻译
    for (let field in objs) {

      // 当字段未在翻译字段中时，说明不是需要翻译的字段则不处理
      if (!translateArr[field]) continue;
      // 翻译字段field，判断其值是否存在，若不存在则直接赋空值
      let value = objs[field];
      if (!value) {
        objs[field + "_name"] = "";
        continue;
      }
      // 需要翻译field字段值及翻译的codeIndex
      value = String(value).toUpperCase(); // 次码表code
      let codeIndex = translateArr[field].toUpperCase(); // 主码表code
      // 获取翻译后的数据
      let v = getCache(codeIndex, value);
      if (!v) {
        objs[field + "_name"] = objs[field];
        continue;
      }
      objs[field + "_name"] = v;
    }
    return;
  }
  // 当为数组时
  if (Array.isArray(objs)) {
    // 遍历一级数组
    objs.forEach((obj, k) => {
      // 遍历对象属性，判断哪些字段需要翻译
      for (let field in obj) {

        // 当字段未在翻译字段中时，说明不是需要翻译的字段则不处理
        if (!translateArr[field]) continue;
        // 翻译字段field，判断其值是否存在，若不存在则直接赋空值
        let value = obj[field];
        if (value === null || value === undefined || value === '') {
          obj[field + "_name"] = "";
          continue;
        }
        // 需要翻译field字段值及翻译的codeIndex
        value = String(value).toUpperCase(); // 次码表code
        let codeIndex = translateArr[field].toUpperCase(); // 主码表code
        // 获取翻译后的数据
        let v = getCache(codeIndex, value);
        if (!v) {
          obj[field + "_name"] = obj[field];
          continue;
        }
        obj[field + "_name"] = v;
      }
    })
    return;
  }
}