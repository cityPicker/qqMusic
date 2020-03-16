<template>
  <scroll class="listview"
    :data="data"
    :probe-type="probeType"
    ref="listview"
    :listenScroll = "listenScroll"
    @scroll="scroll"
  >
    <ul>
      <li class="list-group" v-for="group in data" :key="group.title" ref="listGroup">
        <h2 class="list-group-title">{{group.title}}</h2>
        <ul>
          <li class="list-group-item" @click="selectItem(item)" v-for="item in group.items" :key="item.id">
            <img class="avatar" v-lazy="item.avatar">
            <span class="name">{{ item.name }}</span>
          </li>
        </ul>
      </li>
    </ul>
    <div class="list-shortcut">
      <ul>
        <li class="item"
         v-for="(item, index) in shortcutList"
         :key="item"
         @touchstart.stop.prevent="onShortcutTouchStart"
         @touchmove = "onShortcutTouchMove"
         :data-index="index"
         :class="{'current':currentIndex===index}"
        >
          {{ item }}
        </li>
      </ul>
    </div>
    <div class="list-fixed" ref="fixed" v-show="fixedTitle">
      <h2 class="fixed-title">{{fixedTitle}}</h2>
    </div>
    <div class="loading-container" v-show="!data.length">
      <loading></loading>
    </div>
  </scroll>
</template>

<script>
import Scroll from 'base/scroll/scroll'
import {getData} from 'common/js/dom'
import Loading from 'base/loading/loading'

const ANCHOR_HEIGHT = 18
const TITLE_HEIGHT = 30

export default {
  props: {
    data: {
      type: Array,
      default: () => {}
    }
  },
  data () {
    return {
      currentIndex: 0,
      // scroll位置，默认负值表示初始位置
      scrollY: -1,
      diff: -1
    }
  },
  created () {
    // 设置BS不截流
    this.probeType = 3
    this.touch = {}
    // 设置BS监听滚动
    this.listenScroll = true
  },
  components: {
    Scroll,
    Loading
  },
  computed: {
    // 得到索引数组
    shortcutList () {
      return this.data.map((group) => {
        return group.title.substr(0, 1)
      })
    },
    fixedTitle () {
      if (this.scrollY > 0) {
        return ''
      }
      return this.data[this.currentIndex] ? this.data[this.currentIndex].title : ''
    }
  },
  methods: {
    onShortcutTouchStart (e) {
      const auchorIndex = getData(e.target, 'index')
      const firstTouch = e.touches[0]
      this.touch.y1 = firstTouch.pageY
      this.touch.auchorIndex = auchorIndex

      this._scrollTo(auchorIndex)
    },
    onShortcutTouchMove (e) {
      let firstTouch = e.touches[0]
      this.touch.y2 = firstTouch.pageY
      let delta = (this.touch.y2 - this.touch.y1) / ANCHOR_HEIGHT | 0
      let auchorIndex = parseInt(this.touch.auchorIndex) + delta

      this._scrollTo(auchorIndex)
    },

    // scroll组件抛出的事件，抛出position数据
    scroll (pos) {
      this.scrollY = pos.y
    },

    // 跳转到对应元素位置
    _scrollTo (index) {
      let listHeight = this.listHeight
      this.scrollY = -listHeight[index]

      if (index < 0 || index > listHeight.length) {
        return
      }

      this.$refs.listview.scrollToElement(this.$refs.listGroup[index], 0)
    },

    // 计算左侧数组高度数组,循环列表item的高度累加得到每个item高度数组
    _calculateHeight () {
      this.listHeight = []
      let list = this.$refs.listGroup
      let height = 0
      this.listHeight.push(height)

      for (let ele = 0; ele < list.length; ele++) {
        const element = list[ele]
        height += element.clientHeight
        this.listHeight.push(height)
      }
    },
    // 抛出到外层组件选择歌手
    selectItem (item) {
      this.$emit('select', item)
    },
    refresh () {
      this.$refs.listview.refresh()
    }
  },
  watch: {
    // 监听data计算scroll的高度
    data () {
      this.$nextTick(() => {
        this._calculateHeight()
      })
    },

    // 监听scrollY计算index
    scrollY (newY) {
      newY = -newY
      for (let i = 0; i < this.listHeight.length; i++) {
        const height1 = this.listHeight[i]
        const height2 = this.listHeight[i + 1]

        if (newY >= height1 && newY < height2) {
          this.currentIndex = i
          this.diff = height2 - newY
        }
      }
    },
    diff (newVal) {
      let fixedTop = (newVal > 0 && newVal < TITLE_HEIGHT) ? (newVal - TITLE_HEIGHT) : 0
      if (this.fixedTop === fixedTop) {
        return false
      }

      this.fixedTop = fixedTop
      this.$refs.fixed.style.transform = `translate3d(0,${fixedTop}px,0)`
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .listview
    position: relative
    width: 100%
    height: 100%
    overflow: hidden
    background: $color-background
    .list-group
      padding-bottom: 30px
      .list-group-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
      .list-group-item
        display: flex
        align-items: center
        padding: 20px 0 0 30px
        .avatar
          width: 50px
          height: 50px
          border-radius: 50%
        .name
          margin-left: 20px
          color: $color-text-l
          font-size: $font-size-medium
    .list-shortcut
      position: absolute
      z-index: 30
      right: 14px
      top: 50%
      transform: translateY(-50%)
      width: 20px
      padding: 20px 0
      border-radius: 10px
      text-align: center
      background: $color-background-d
      font-family: Helvetica
      .item
        padding: 3px
        line-height: 1
        color: $color-text-l
        font-size: $font-size-small
        &.current
          color: $color-theme
    .list-fixed
      position: absolute
      top: 0
      left: 0
      width: 100%
      .fixed-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
    .loading-container
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>