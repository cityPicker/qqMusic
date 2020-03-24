import { mapGetters, mapMutations, mapActions } from 'vuex'
import {playMode} from 'common/js/config'
import {shuffle} from 'common/js/util'

export const playlistMixin = {
  computed: {
    ...mapGetters([
      'playlist'
    ])
  },
  mounted () {
    this.handlePlaylist(this.playlist)
  },
  activated () {
    this.handlePlaylist(this.playlist)
  },
  watch: {
    playlist (newVal) {
      this.handlePlaylist(newVal)
    }
  },
  methods: {
    handlePlaylist () {
      throw new Error('component must implement handlePlaylist method')
    }
  }
}

export const playerMixin = {
  computed: {
    ...mapGetters([
      'mode',
      'sequenceList',
      'currentSong',
      'favoriteList'
    ]),

    // 播放模式
    iconMode () {
      return this.mode === playMode.sequence ? 'icon-sequence' : this.mode === playMode.loop ? 'icon-loop' : 'icon-random'
    }
  },
  methods: {
    ...mapMutations({
      setPlayMode: 'SET_PLAY_MODE',
      setPlayList: 'SET_PLAYLIST',
      setCurrentIndex: 'SET_CURRENTINDEX'
    }),
    ...mapActions([
      'saveFavoriteList',
      'deleteFavoriteList'
    ]),
    changeMode () {
      const mode = (this.mode + 1) % 3
      this.setPlayMode(mode)
      let list = null

      if (mode === playMode.random) {
        list = shuffle(this.sequenceList)
      } else {
        list = this.sequenceList
      }

      this.resetCurrentIndex(list)
      this.setPlayList(list)
    },
    resetCurrentIndex (list) {
      let index = list.findIndex((item) => {
        return item.id === this.currentSong.id
      })

      this.setCurrentIndex(index)
    },
    toggleFavorite (song) {
      if (this.isFavorite(song)) {
        this.deleteFavoriteList(song)
      } else {
        this.saveFavoriteList(song)
      }
    },
    isFavorite (song) {
      let index = this.favoriteList.findIndex((item) => {
        return item.id === song.id
      })

      return index > -1
    },
    iconFavorite (song) {
      if (this.isFavorite(song)) {
        return 'icon-favorite'
      } else {
        return 'icon-not-favorite'
      }
    }
  }
}

// 搜索相关
export const searchMixin = {
  data () {
    return {
      query: '',
      refreshDelay: 120
    }
  },
  computed: {
    ...mapGetters([
      'searchHistory',
      'playHistory'
    ])
  },
  methods: {
    onQueryChange (query) {
      this.query = query
    },
    addQuery (query) {
      this.$refs.searchBox.setQuery(query)
    },
    blurQuery () {
      this.$refs.searchBox.blurQuery()
    },
    ...mapActions([
      'savaSearchHistory',
      'deleteSearchHistory'
    ])
  }
}