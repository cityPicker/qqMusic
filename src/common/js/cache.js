import storage from 'good-storage'

const SEARCH_KEY = '__SEARCH__'
const SEARCH_MAX_LEN = 15

// 数组插入方法
function insertArr (arr, val, compare, maxLen) {
  let index = arr.findIndex(compare)

  if (index === 0) {
    return
  }
  if (index > 0) {
    arr.splice(index, 1)
  }
  arr.unshift(val)

  if (maxLen && arr.length > maxLen) {
    arr.pop()
  }
}

// 从数组删除
function deleteFromArr (arr, val, compare) {
  let index = arr.findIndex(compare)
  if (index > -1) {
    arr.splice(index, 1)
  }
}

export function savaSearch (query) {
  let searches = storage.get(SEARCH_KEY, [])

  insertArr(searches, query, (item) => {
    return item === query
  }, SEARCH_MAX_LEN)

  storage.set(SEARCH_KEY, searches)

  return searches
}

export function loadSearch () {
  return storage.get(SEARCH_KEY, [])
}

export function deleteSearch (query) {
  let searches = storage.get(SEARCH_KEY, [])
  deleteFromArr(searches, query, (item) => {
    return item === query
  })
  storage.set(SEARCH_KEY, searches)

  return searches
}

export function clearSearch () {
  storage.remove(SEARCH_KEY)
  return []
}