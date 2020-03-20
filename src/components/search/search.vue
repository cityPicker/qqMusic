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
            <div class="search-history" v-show="searchHistory.length">
              <h1 class="title">
                <span class="text">搜索历史</span>
                <span class="clear" @click="showConfirm">
                  <i class="icon-clear"></i>
                </span>
              </h1>
              <search-list :searches="searchHistory" @select="addQuery" @deleteOne="deleteSearchHistory"></search-list>
            </div>
          </div>
        </div>
        <div class="search-result" v-show="query">
          <suggest :query="query" @listScroll="blurQuery" @select="savaSearchHistory"></suggest>
        </div>
        <confirm ref="confirm" text="是否清空所有历史" confirm="清空" @confirm="clearSearchHistory"></confirm>
        <router-view></router-view>
    </div>
</template>

<script>
import SearchBox from 'base/search-box/search-box'
import {getHotKey} from 'api/search'
import {ERR_OK} from 'api/config'
import Suggest from 'components/suggest/suggest'
import {playlistMixin} from 'common/js/mixin'
import {mapActions, mapGetters} from 'vuex'
import SearchList from 'base/search-list/search-list'
import Confirm from 'base/confirm/confirm'

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
    Suggest,
    SearchList,
    Confirm
  },
  created () {
    this._getHotKey()
  },
  computed: {
    ...mapGetters([
      'searchHistory'
    ])
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
    },
    showConfirm () {
      this.$refs.confirm.show()
    },
    ...mapActions([
      'savaSearchHistory',
      'deleteSearchHistory',
      'clearSearchHistory'
    ])
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
      .search-history
        position: relative
        margin: 0 20px
        .title
          display: flex
          align-items: center
          height: 40px
          font-size: $font-size-medium
          color: $color-text-l
          .text
            flex: 1
          .clear
            extend-click()
            .icon-clear
              font-size: $font-size-medium
              color: $color-text-d
  .search-result
    position fixed
    width 100%
    top 178px
    bottom 0
</style>