<template>
  <div class="search">
    <div class="seaer-input-wrapper">
      <search-input @inputed="onQueryStringChange" ref="search-input"></search-input>
    </div>
    <div class="shortcut-wrapper" v-show="!queryString" ref="shortcut-wrapper">
      <scroll class="shortcut" :data="shortcut" ref="shortcut">
        <div>
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
            <span class="clear" @click="showConfirm">
              <i class="icon-clear"></i>
            </span>
          </h1>
          <search-list @selected="addQueryString" @deleteItem="deleteItem" :searches="searchHistory"></search-list>
        </div>
        </div>
      </scroll>
    </div>
    <div class="search-result" v-show="queryString" ref="search-result">
      <suggest @selected="saveQueryString" @scrollStart="scrollStart" ref="suggest" :queryString="queryString"></suggest>
    </div>
    <confirm @confirm="clearHistory" ref="confirm" text="是否清空所有历史纪录"></confirm>
    <!-- <top-tip ref="top-tip"></top-tip> -->
    <router-view></router-view>
  </div>
</template>

<script>
import SearchInput from "@/base/search-input/search-input";
import { getHotKey } from "@/api/search.js";
import { ERR_OK } from "@/api/config.js";
import Suggest from "@/components/suggest/suggest";
import { playlistMixin, searchMixin } from "@/common/js/mixins.js";
import { mapActions, mapMutations } from "vuex";
import SearchList from "@/base/search-list/search-list";
import Confirm from "@/base/confirm/confirm";
// import TopTip from "@/base/top-tip/top-tip";
import Scroll from "@/base/scroll/scroll";
export default {
  mixins: [playlistMixin, searchMixin],
  data() {
    return {
      hotKeys: [],
      confirm: false
    };
  },
  created() {
    this._getHotKey();
  },
  computed: {
    shortcut() {
      return this.hotKeys.concat(this.searchHistory);
    }
  },
  methods: {
    handlePlaylist(playlist) {
      const bottom = playlist.length > 0 ? "60px" : "";

      this.$refs["search-result"].style.bottom = bottom;
      this.$refs["shortcut-wrapper"].style.bottom = bottom;
      this.$refs["suggest"].refresh();
      this.$refs["shortcut"].refresh();
    },
    showConfirm() {
      this.$refs.confirm.toggleShow();
    },
    clearHistory(bool) {
      if (!bool) {
        return;
      }
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
    ...mapActions(["clearSearchHistory"])
  },
  watch: {
    queryString(newVal) {
      if (!newVal) {
        setTimeout(() => {
          this.$refs.shortcut.refresh();
        }, 20);
      }
    }
  },
  components: {
    SearchInput,
    Suggest,
    SearchList,
    Confirm,
    Scroll
    // TopTip
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