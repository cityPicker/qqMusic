<template>
  <transition name="slide">
    <music-list :songs="songs" :title="title" :bgImg="bgImg">
    </music-list>
  </transition>
</template>

<script>
import {mapGetters} from 'vuex'
import {getSingerDetail, getSongVkey} from 'api/singer'
import {ERR_OK} from 'api/config'
import {createSong} from 'common/js/song'
import MusicList from 'components/music-list/music-list'

export default {
  data () {
    return {
      songs: []
    }
  },
  components: {
    MusicList
  },
  created () {
    this._getSingerDetail()
  },
  methods: {
    _getSingerDetail () {
      if (!this.singer.id) {
        this.$router.push('/singer')
      }
      getSingerDetail(this.singer.id).then((res) => {
        if (res.code === ERR_OK) {
          this.songs = this._normalizeSongs(res.data.list)
        }
      })
    },
    // 得到对应格式的歌曲列表
    _normalizeSongs (list) {
      let ret = []

      list.forEach(item => {
        let {musicData} = item
        getSongVkey(musicData.songmid).then((res) => {
          if (res.code === ERR_OK) {
            const vkey = res.data.items[0].vkey
            const songmid = res.data.items[0].songmid

            if (musicData.albummid && musicData.songmid) {
              ret.push(createSong(musicData, vkey, songmid))
            }
          }
        })
      })

      return ret
    }
  },
  computed: {
    ...mapGetters([
      'singer'
    ]),
    title () {
      return this.singer.name
    },
    bgImg () {
      return this.singer.avatar
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '~common/stylus/variable.styl'
.slide-enter-active, .slide-leave-active
  transition: all 0.3s

.slide-enter, .slide-leave-to
  transform: translate3d(100%, 0, 0)
</style>