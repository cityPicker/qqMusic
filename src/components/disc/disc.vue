<template>
  <div class="disc-detail">
    <music-list :title="title" :bgImg="bgImg" :songs="songs"></music-list>
  </div>
</template>

<script>
import MusicList from 'components/music-list/music-list'
import {mapGetters} from 'vuex'
import {getSongList} from 'api/recommend'
import {ERR_OK} from 'api/config'
import {createSong} from 'common/js/song'

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
    this._getSongList()
  },
  computed: {
    ...mapGetters([
      'disc'
    ]),
    title () {
      return this.disc.dissname
    },
    bgImg () {
      return this.disc.imgurl
    }
  },
  methods: {
    _getSongList () {
      if (!this.disc.dissid) {
        this.$router.push('/recommend')
      }
      getSongList(this.disc.dissid).then((res) => {
        if (res.code === ERR_OK) {
          this.songs = this._normalizeSongs(res.cdlist[0].songlist)
        }
      })
    },
    _normalizeSongs (list) {
      let ret = []
      list.forEach(element => {
        if (element.songmid && element.songid) {
          ret.push(createSong(element))
        }
      })

      return ret
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">

</style>