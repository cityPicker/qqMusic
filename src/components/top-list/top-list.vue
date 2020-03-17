<template>
  <transition name="slide">
    <music-list :rank="rank" :title="title" :bgImg="bgImg" :songs="songs"></music-list>
  </transition>
</template>

<script>
import MusicList from 'components/music-list/music-list'
import {mapGetters} from 'vuex'
import {getMusicList} from 'api/rank'
import {ERR_OK} from 'api/config'
import {createSong} from 'common/js/song'

export default {
  data () {
    return {
      songs: [],
      rank: true
    }
  },
  components: {
    MusicList
  },
  created () {
    this._getMusicList()
  },
  computed: {
    ...mapGetters([
      'topList'
    ]),
    title () {
      return this.topList.topTitle
    },
    bgImg () {
      if (this.songs.length) {
        return this.songs[0].image
      } else {
        return ''
      }
    }
  },
  methods: {
    _getMusicList () {
      if (!this.topList.id) {
        this.$router.push('/rank')
      }
      getMusicList(this.topList.id).then((res) => {
        if (res.code === ERR_OK) {
          this.songs = this._normalizeSong(res.songlist)
        }
      })
    },
    _normalizeSong (list) {
      let ret = []

      list.forEach(element => {
        let musicData = element.data
        if (musicData.songid && musicData.albumid) {
          ret.push(createSong(musicData))
        }
      })

      return ret
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
.slide-enter-active, .slide-leave-active
  transition: all 0.3s

.slide-enter, .slide-leave-to
  transform: translate3d(100%, 0, 0)
</style>