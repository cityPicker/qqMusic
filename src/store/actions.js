import * as types from './mutation-types'
import {playMode} from 'common/js/config'
import {shuffle} from 'common/js/util'
import {savaSearch, deleteSearch, clearSearch, savePlay, deletePlay, clearPlay} from 'common/js/cache'

function findIndex (list, song) {
  return list.findIndex((item) => {
    return item.id === song.id
  })
}

// 选择歌曲
export const selectPlay = function ({commit, state}, {list, index}) {
  commit(types.SET_SEQUENCE_LIST, list)
  if (state.mode === playMode.random) {
    const randomList = shuffle(list)
    commit(types.SET_PLAYLIST, randomList)
    index = findIndex(randomList, list[index])
  } else {
    commit(types.SET_PLAYLIST, list)
  }
  commit(types.SET_CURRENTINDEX, index)
  commit(types.SET_FULL_SCREEN, true)
  commit(types.SET_PLAYING_STATE, true)
}

// 随机播放
export const randomPlay = function ({commit}, {list}) {
  commit(types.SET_PLAY_MODE, playMode.random)
  commit(types.SET_SEQUENCE_LIST, list)
  const randomList = shuffle(list)
  commit(types.SET_PLAYLIST, randomList)
  commit(types.SET_CURRENTINDEX, 0)
  commit(types.SET_FULL_SCREEN, true)
  commit(types.SET_PLAYING_STATE, true)
}

// 插入一首歌
export const insertSong = function ({commit, state}, song) {
  let playlist = state.playlist.slice()
  let sequenceList = state.sequenceList.slice()
  let currentIndex = state.currentIndex
  let currentSong = playlist[currentIndex]

  // 查找playlist中是否有待插入歌曲，有的话返回fPIndex
  let fPIndex = findIndex(playlist, song)
  // 因为是插入歌曲，所以索引+1
  currentIndex++
  // 插入song到playlist
  playlist.splice(currentIndex, 0, song)

  // 如果playlist中有这首歌，删除
  if (fPIndex > -1) {
    if (fPIndex < currentIndex) {
      // 如果原歌曲在插入歌曲之前
      playlist.splice(fPIndex, 1)
      currentIndex--
    } else {
      // 如果原歌曲在插入歌曲之后
      playlist.splice(fPIndex + 1, 1)
    }
  }

  // 查找sequenceList中是否有待插入歌曲，有的话返回fSIndex
  let fSIndex = findIndex(sequenceList, song)
  // 当前歌曲在sequenceList中的currentSindex
  let currentSindex = findIndex(sequenceList, currentSong)
  // 插入song到sequenceList
  sequenceList.splice(currentSindex + 1, 0, song)
  // 如果sequenceList中有这首歌，删除
  if (fSIndex > -1) {
    if (fSIndex < currentSindex) {
      // 如果原歌曲在插入歌曲之前
      sequenceList.splice(fSIndex, 1)
    } else {
      // 如果原歌曲在插入歌曲之后
      sequenceList.splice(fSIndex + 1, 1)
    }
  }

  commit(types.SET_PLAYLIST, playlist)
  commit(types.SET_SEQUENCE_LIST, sequenceList)
  commit(types.SET_CURRENTINDEX, currentIndex)
  commit(types.SET_FULL_SCREEN, true)
  commit(types.SET_PLAYING_STATE, true)
}

export const savaSearchHistory = function ({commit}, query) {
  commit(types.SET_SEARCH_HISTORY, savaSearch(query))
}

export const deleteSearchHistory = function ({commit}, item) {
  commit(types.SET_SEARCH_HISTORY, deleteSearch(item))
}

export const clearSearchHistory = function ({commit}) {
  commit(types.SET_SEARCH_HISTORY, clearSearch())
}

// 删除一首歌
export const deleteSong = function ({commit, state}, song) {
  let playlist = state.playlist.slice()
  let sequenceList = state.sequenceList.slice()
  let currentIndex = state.currentIndex

  const pIndex = findIndex(playlist, song)
  const sIndex = findIndex(sequenceList, song)

  playlist.splice(pIndex, 1)
  sequenceList.splice(sIndex, 1)

  if (pIndex < currentIndex || currentIndex === playlist.length) {
    currentIndex--
  }

  commit(types.SET_PLAYLIST, playlist)
  commit(types.SET_SEQUENCE_LIST, sequenceList)
  commit(types.SET_CURRENTINDEX, currentIndex)

  let playingState = playlist.length > 0
  commit(types.SET_PLAYING_STATE, playingState)
}

// 删除当前列表
export const deleteSonglist = function ({commit}) {
  commit(types.SET_PLAYLIST, [])
  commit(types.SET_SEQUENCE_LIST, [])
  commit(types.SET_CURRENTINDEX, -1)
  commit(types.SET_PLAYING_STATE, false)
}

export const savePlayHistory = function ({commit}, song) {
  commit(types.SET_PLAY_HISTORY, savePlay(song))
}

export const deletePlayHistory = function ({commit}, song) {
  commit(types.SET_PLAY_HISTORY, deletePlay(song))
}

export const clearPlayHistory = function ({commit}) {
  commit(types.SET_PLAY_HISTORY, clearPlay())
}