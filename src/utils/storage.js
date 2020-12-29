// 关于本地存储的操作

// 存
export const setItem = (key, val) => {
  // console.log(key, val)
  // 判断是否为引用数据类型(数组,对象)
  if (typeof val === 'object') {
    localStorage.setItem(key, JSON.stringify(val))
  } else {
    localStorage.setItem(key, val)
  }
}

// 取
export const getItem = key => {
  const data = localStorage.getItem(key)
  try {
    return JSON.parse(data)
  } catch (error) {
    return data
  }
}

// 删除
export const removeItem = key => {
  localStorage.removeItem(key)
}
