<template>
  <div class="search">
    <div class="seaer-input-wrapper">
      <search-input @inputed="onQueryStringChange" ref="search-input"></search-input>
    </div>
    <div class="shortcut-wrapper" v-show="!queryString">
      <div class="shortcut">
        <div class="hotkey-wrapper">
          <h1 class="title">热门搜索</h1>
          <ul>
            <li @click="addQueryString(hotkey.k)" class="hotkey" v-for="(hotkey,index) in hotKeys" :key="index">
              {{hotkey.k}}
            </li>
          </ul>
        </div>
        <div class="search-history" v-show="searchHistory.length">
          <h1 class="title">
            <span class="text">搜索历史</span>
            <span class="clear" @click="clearHistory">
              <i class="icon-clear"></i>
            </span>
          </h1>
          <search-list @selected="addQueryString" @deleteItem="deleteItem" :searches="searchHistory"></search-list>
        </div>
      </div>
    </div>
    <div class="search-result" v-show="queryString" ref="search-result">
      <suggest @selected="saveQueryString" @scrollStart="scrollStart" ref="suggest" :queryString="queryString"></suggest>
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
import SearchInput from "@/base/search-input/search-input";
import { getHotKey } from "@/api/search.js";
import { ERR_OK } from "@/api/config.js";
import Suggest from "@/components/suggest/suggest";
import { playlistMixin } from "@/common/js/mixins.js";
import { mapActions, mapGetters, mapMutations } from "vuex";
import SearchList from "@/base/search-list/search-list";
export default {
  mixins: [playlistMixin],
  data() {
    return {
      hotKeys: [],
      queryString: ""
    };
  },
  created() {
    this._getHotKey();
  },
  computed: {
    ...mapGetters(["searchHistory"])
  },
  methods: {
    handlePlaylist(playlist) {
      const bottom = playlist.length > 0 ? "60px" : "";

      this.$refs["search-result"].style.bottom = bottom;
      this.$refs.suggest.refresh();
    },
    scrollStart() {
      this.$refs["search-input"].inputBlur();
    },
    addQueryString(item) {
      // console.log(hotkey.k);
      this.$refs["search-input"].setQueryString(item);
    },
    onQueryStringChange(queryString) {
      this.queryString = queryString;
    },
    saveQueryString() {
      this.saveSearchHistory(this.queryString);
    },
    deleteItem(item) {
      this.deleteSearchHistory(item);
    },
    clearHistory() {
      this.clearSearchHistory();
    },
    _getHotKey() {
      getHotKey().then(res => {
        if (res.code === ERR_OK) {
          this.hotKeys = res.data.hotkey.slice(0, 10);
        }
        // console.log(this.hotKeys);
      });
    },
    ...mapMutations({
      setSearchHistory: "SET_SEARCH_HISTORY"
    }),
    ...mapActions([
      "saveSearchHistory",
      "deleteSearchHistory",
      "clearSearchHistory"
    ])
  },
  components: {
    SearchInput,
    Suggest,
    SearchList
  }
};
</script>

<style scoped lang="scss">
@import "@/common/scss/variable.scss";
@import "@/common/scss/mixin.scss";

.search {
  .search-box-wrapper {
    margin: 20px;
  }
  .shortcut-wrapper {
    position: fixed;
    top: 178px;
    bottom: 0;
    width: 100%;
    .shortcut {
      height: 100%;
      overflow: hidden;
      .hotkey-wrapper {
        margin: 0 20px 20px 20px;
        .title {
          margin-bottom: 20px;
          font-size: $font-size-medium;
          color: $color-text-d;
        }
        .hotkey {
          display: inline-block;
          // margin-bottom: 20px;
          margin: 0 20px 10px 0;
          padding: 5px 10px;
          border-radius: 6px;
          background: $color-highlight-background;
          font-size: $font-size-medium;
          color: $color-text-d;
          &:first-child {
            color: red;
          }
        }
      }
      .search-history {
        position: relative;
        margin: 0 20px;
        .title {
          display: flex;
          align-items: center;
          height: 40px;
          font-size: $font-size-medium;
          color: $color-text-l;
          .text {
            flex: 1;
          }
          .clear {
            .icon-clear {
              font-size: $font-size-medium;
              color: $color-text-d;
            }
          }
        }
      }
    }
  }
  .search-result {
    position: fixed;
    width: 100%;
    top: 178px;
    bottom: 0;
  }
}
</style>