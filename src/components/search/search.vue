<template>
    <div class="search" ref="search">
        <div class="search-box-wrapper">
          <search-box ref="searchBox" @query="onQueryChange"></search-box>
        </div>
        <div class="shortcut-wrapper" v-show="!query">
          <div class="shortcut">
            <div class="hot-key">
              <h1 class="title">热门歌曲</h1>
              <ul>
                <li class="item" @click="addQuery(item.k)" v-for="item in hotkey" :key="item.n">
                  <span>{{item.k}}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div class="search-result" v-show="query">
          <suggest :query="query" @listScroll="blurQuery"></suggest>
        </div>
        <router-view></router-view>
    </div>
</template>

<script>
import SearchBox from 'base/search-box/search-box'
import {getHotKey} from 'api/search'
import {ERR_OK} from 'api/config'
import Suggest from 'components/suggest/suggest'
import {playlistMixin} from 'common/js/mixin'

export default {
  data () {
    return {
      hotkey: [],
      query: ''
    }
  },
  mixins: [playlistMixin],
  components: {
    SearchBox,
    Suggest
  },
  created () {
    this._getHotKey()
  },
  methods: {
    _getHotKey () {
      getHotKey().then((res) => {
        if (res.code === ERR_OK) {
          this.hotkey = res.data.hotkey.slice(0, 10)
        }
      })
    },
    addQuery (query) {
      this.$refs.searchBox.setQuery(query)
    },
    onQueryChange (query) {
      this.query = query
    },
    handlePlaylist (playlist) {
      let bottom = playlist.length > 0 ? '60px' : 0
      this.$refs.search.style.bottom = bottom
    },
    blurQuery () {
      this.$refs.searchBox.blurQuery()
    }
  }
}
</script>

<style scoped lang="stylus" type="stylesheet/stylus">
@import '~common/stylus/variable'
@import '~common/stylus/mixin'

.search
  .search-box-wrapper
    margin 20px
  .shortcut-wrapper
    position fixed
    top 178px
    bottom 0
    width 100%
    .shortcut
      height 100%
      overflow hidden
      .hot-key
        margin 0 20px 20px 20px
        .title
          margin-bottom 20px
          font-size $font-size-medium
          color $color-text-l
        .item
          display inline-block
          padding 5px 10px
          margin 0 20px 10px 0
          border-radius 6px
          background $color-highlight-background
          font-size $font-size-medium
          color $color-text-d
  .search-result
    position fixed
    width 100%
    top 178px
    bottom 0
</style>