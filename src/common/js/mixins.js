import { mapGetters, mapMutations, mapActions } from 'vuex';
import { playMode } from "@/common/js/config.js";
import { randomList } from "@/common/js/util.js";

export const playlistMixin = {
  computed: {
    ...mapGetters([
      'playlist'
    ])
  },
  mounted() {
    this.handlePlaylist(this.playlist);
  },
  activated() {
    this.handlePlaylist(this.playlist);
  },
  watch: {
    playlist(newVal) {
      this.handlePlaylist(newVal);
    }
  },
  methods: {
    handlePlaylist() {
      throw new Error('component must implement handlePlaylist method');
    }
  }
};

export const playerMixin = {
  methods: {
    changeMode() {
      const mode = (this.mode + 1) % 3;
      this.setPlayMode(mode);
      // 改变列表
      let list = [];
      if (mode === playMode.random) {
        list = randomList(this.sequencelist);
      } else {
        list = this.sequencelist;
      }
      // 重新计算当前歌曲的index
      let index = list.findIndex(item => {
        return item.id === this.currentSong.id;
      });
      this.setCurrentIndex(index);
      this.setPlayList(list);
    },

    ...mapMutations({
      setPlayingState: "SET_PLAYING_STATE",
      setCurrentIndex: "SET_CURRENT_INDEX",
      setPlayMode: "SET_PLAY_MODE",
      setPlayList: "SET_PLAYLIST"
    })

  },
  computed: {
    iconMode() {
      return this.mode === playMode.sequence
        ? "icon-sequence"
        : this.mode === playMode.loop ? "icon-loop" : "icon-random";
    },
    ...mapGetters([
      "mode",
      "playlist",
      "currentSong",
      "sequencelist"
    ])
  }
};

export const searchMixin = {
  data() {
    return {
      queryString: ''
    };
  },
  computed: {
    shortcut() {
      return this.hotKeys.concat(this.searchHistory);
    },
    ...mapGetters(["searchHistory"])
  },
  methods: {
    scrollStart() {
      this.$refs["search-input"].inputBlur();
    },
    saveQueryString() {
      this.saveSearchHistory(this.queryString);

      // this.$refs['top-tip'].toggleShow();
    },
    onQueryStringChange(queryString) {
      this.queryString = queryString;
    },
    addQueryString(item) {
      // console.log(hotkey.k);
      this.$refs["search-input"].setQueryString(item);
    },
    deleteItem(item) {
      this.deleteSearchHistory(item);
    },
    ...mapActions([
      "deleteSearchHistory",
      "saveSearchHistory"
    ])
  }
};