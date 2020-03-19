import * as types from './mutation-types'
import {playMode} from 'common/js/config'
import {shuffle} from 'common/js/util'

function findIndex (list, song) {
  return list.findIndex((item) => {
    return item.id === song.id
  })
}

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

export const randomPlay = function ({commit}, {list}) {
  commit(types.SET_PLAY_MODE, playMode.random)
  commit(types.SET_SEQUENCE_LIST, list)
  const randomList = shuffle(list)
  commit(types.SET_PLAYLIST, randomList)
  commit(types.SET_CURRENTINDEX, 0)
  commit(types.SET_FULL_SCREEN, true)
  commit(types.SET_PLAYING_STATE, true)
}

export const insertPlay = function ({commit, state}, song) {
  let playlist = state.playlist.slice()
  let sequenceList = state.sequenceList.slice()
  let currentIndex = state.currentIndex
  let currentSong = state.playlist.currentIndex

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