<template>
    <div class="singer" ref="singer">
        <listview ref="listview" :data="singers" @select="selectSinger"></listview>
        <router-view></router-view>
    </div>
</template>

<script>
import {getSingerList} from 'api/singer'
import {ERR_OK} from 'api/config'
import Singer from 'common/js/singer'
import Listview from 'base/listview/listview'
import {mapMutations} from 'vuex'
import {playlistMixin} from 'common/js/mixin'

const HOT_SINGER_LEN = 10
const HOT_NAME = '热门'

export default {
  data () {
    return {
      singers: []
    }
  },
  created () {
    this._getSinger()
  },
  mixins: [playlistMixin],
  methods: {
    _getSinger () {
      getSingerList().then((res) => {
        if (res.code === ERR_OK) {
          this.singers = this._normalizeSinger(res.data.list)
        }
      }).catch((e) => {
        console.log(e)
      })
    },
    _normalizeSinger (list) {
      let map = {
        hot: {
          title: HOT_NAME,
          items: []
        }
      }

      list.forEach((element, index) => {
        // 热门
        if (index < HOT_SINGER_LEN) {
          map.hot.items.push(new Singer({
            id: element.Fsinger_mid,
            name: element.Fsinger_name
          }))
        }
        // 歌手
        let key = element.Findex
        if (!map[key]) {
          map[key] = {
            title: key,
            items: []
          }
        }
        map[key].items.push(new Singer({
          id: element.Fsinger_mid,
          name: element.Fsinger_name
        }))
      })

      // 排序
      let hot = []
      let ret = []

      for (const key in map) {
        if (map.hasOwnProperty(key)) {
          const element = map[key]
          if (element.title.match(/[a-zA-Z]/)) {
            ret.push(element)
          } else if (element.title === HOT_NAME) {
            hot.push(element)
          }
        }
      }

      ret.sort((a, b) => {
        return a.title.charCodeAt(0) - b.title.charCodeAt(0)
      })

      return hot.concat(ret)
    },
    // 子组件抛出的选中歌手方法
    selectSinger (singer) {
      this.$router.push({
        path: `/singer/${singer.id}`
      })
      // 添加state状态
      this.setSinger(singer)
    },
    // 组件中调用mutation
    ...mapMutations({
      setSinger: 'SET_SINGER'
    }),
    handlePlaylist (playlist) {
      const bottom = playlist.length > 0 ? '60px' : ''
      this.$refs.singer.style.bottom = bottom
      this.$refs.listview.refresh()
    }
  },
  components: {
    Listview
  }
}
</script>

<style scoped lang="stylus" type="stylesheet/stylue">
.singer
  position: fixed
  top: 88px
  bottom: 0
  width: 100%
</style>