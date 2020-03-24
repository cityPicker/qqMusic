import storage from 'good-storage'

const SEARCH_KEY = '__SEARCH__'
const SEARCH_MAX_LEN = 15

const PLAY_KEY = '__PLAY__'
const PLAY_MAX_LEN = 200

const FAVORITE_KEY = '__FAVORITE__'
const FAVORITE_MAX_LEN = 200

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
function deleteFromArr (arr, compare) {
  let index = arr.findIndex(compare)
  if (index > -1) {
    arr.splice(index, 1)
  }
}

// 搜索历史相关
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
  deleteFromArr(searches, (item) => {
    return item === query
  })
  storage.set(SEARCH_KEY, searches)

  return searches
}

export function clearSearch () {
  storage.remove(SEARCH_KEY)
  return []
}

// 播放历史相关
export function savePlay (song) {
  let songs = storage.get(PLAY_KEY, [])

  insertArr(songs, song, (item) => {
    return item.id === song.id
  }, PLAY_MAX_LEN)
  storage.set(PLAY_KEY, songs)

  return songs
}

export function loadPlay () {
  return storage.get(PLAY_KEY, [])
}

export function deletePlay (song) {
  let songs = storage.get(PLAY_KEY, [])

  deleteFromArr(songs, (item) => {
    return item.id === song.id
  })

  storage.set(PLAY_KEY, songs)

  return songs
}

export function clearPlay () {
  storage.remove(PLAY_KEY)
  return []
}

// 收藏相关
export function saveFavorite (song) {
  let favorites = storage.get(FAVORITE_KEY, [])

  insertArr(favorites, song, (item) => {
    return item.id === song.id
  }, FAVORITE_MAX_LEN)

  storage.set(FAVORITE_KEY, favorites)

  return favorites
}

export function deleteFavorite (song) {
  let favorites = storage.get(FAVORITE_KEY, [])

  deleteFromArr(favorites, (item) => {
    return item.id === song.id
  })

  storage.set(FAVORITE_KEY, favorites)

  return favorites
}

export function loadFavorite () {
  return storage.get(FAVORITE_KEY, [])
}