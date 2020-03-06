import {playMode} from 'common/js/config'

const state = {
  singer: {},
  // 播放状态
  playing: false,
  fullScreen: false,
  // 当前播放列表
  playlist: [],
  // 歌曲列表/顺序播放
  sequenceList: [],
  // 播放模式
  mode: playMode.sequence,
  currentIndex: -1
}

export default state