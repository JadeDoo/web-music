<template>
  <transition name="slide">
    <div class="add-song" v-show="isShow" @click.stop>
      <div class="header">
        <h1 class="title">添加歌曲列表</h1>
        <div class="close" @click="toggleShow">
          <i class="icon-close"></i>
        </div>
      </div>
      <div class="search-box-wrapper">
        <search-input @inputed="onQueryStringChange" placeholder="搜索歌曲" ref="search-input"></search-input>
      </div>
      <div class="shortcut" v-show="!queryString">
        <switches @switched="switchTag" :tagIndex="tagIndex" :switches="switches"></switches>
        <div class="list-wrapper">
          <scroll ref="list-scroll" class="list-scroll" :data="playHistory" v-if="tagIndex===0">
            <div class="list-inner">
              <song-list @selected="selectSong" :songs="playHistory"></song-list>
            </div>
          </scroll>
          <scroll ref="search-scroll" class="list-scroll" :data="searchHistory" v-else>
            <div class="list-inner">
              <search-list @deleteItem="deleteItem" @selected="addQueryString" :searches="searchHistory"></search-list>
            </div>
          </scroll>
        </div>
      </div>
      <div class="search-result" v-show="queryString">
        <suggest @scrollStart="scrollStart" @selected="selectSuggest" :queryString="queryString" :showSinger="showSinger"></suggest>
      </div>
      <top-tip ref="top-tip">
        <div class="tip-title">
          <i class="icon-ok"></i>
          <span class="text">1首歌曲已经添加到播放列表</span>
        </div>
      </top-tip>
    </div>
  </transition>
</template>

<script>
import SearchInput from "@/base/search-input/search-input";
import Suggest from "@/components/suggest/suggest";
import { searchMixin } from "@/common/js/mixins.js";
import Switches from "@/base/switches/switches";
import Scroll from "@/base/scroll/scroll";
import { mapGetters, mapActions } from "vuex";
import SongList from "@/base/song-list/song-list";
import Song from "@/common/js/song";
import SearchList from "@/base/search-list/search-list";
import TopTip from "@/base/top-tip/top-tip";
export default {
  mixins: [searchMixin],
  data() {
    return {
      isShow: false,
      showSinger: false,
      tagIndex: 0,
      switches: [{ name: "最近播放" }, { name: "搜索历史" }]
    };
  },
  methods: {
    toggleShow() {
      this.isShow = !this.isShow;
      console.log(this.$refs["list-scroll"]);
      if (this.isShow) {
        setTimeout(() => {
          if (this.tagIndex === 0) {
            this.$refs["list-scroll"].refresh();
          } else {
            this.$refs["search-scroll"].refresh();
          }
        }, 20);
      }
    },
    selectSuggest() {
      this.saveQueryString();
      this.$refs["top-tip"].toggleShow();
    },
    switchTag(index) {
      this.tagIndex = index;
    },
    selectSong(song, index) {
      if (index !== 0) {
        this.insertSong(new Song(song));

        this.$refs["top-tip"].toggleShow();
      }
    },
    ...mapActions(["insertSong"])
  },
  computed: {
    ...mapGetters(["playHistory", "searchHistory", "currentSong"])
  },
  components: {
    SearchInput,
    Suggest,
    Switches,
    Scroll,
    SongList,
    SearchList,
    TopTip
  }
};
</script>

<style scoped lang="scss">
@import "common/scss/mixin.scss";
@import "@/common/scss/variable.scss";
.add-song {
  position: fixed;
  top: 0;
  bottom: 0;
  width: 100%;
  z-index: 200;
  background: $color-background;
  &.slide-enter-active,
  &.slide-leave-active {
    transition: all 0.3s;
  }
  &.slide-enter,
  &.slide-leave-to {
    transform: translate3d(100%, 0, 0);
  }
  .header {
    position: relative;
    height: 44px;
    text-align: center;
    .title {
      line-height: 44px;
      font-size: $font-size-large;
      color: $color-text;
    }
    .close {
      position: absolute;
      top: 0;
      right: 8px;
      .icon-close {
        display: block;
        padding: 12px;
        font-size: 20px;
        color: $color-theme;
      }
    }
  }
  .search-box-wrapper {
    margin: 20px;
  }
  .shortcut {
    .list-wrapper {
      position: absolute;
      top: 165px;
      bottom: 0;
      width: 100%;
      .list-scroll {
        height: 100%;
        overflow: hidden;
        .list-inner {
          padding: 20px 30px;
        }
      }
    }
  }
  .search-result {
    position: fixed;
    top: 124px;
    bottom: 0;
    width: 100%;
  }
  .tip-title {
    text-align: center;
    padding: 18px 0;
    font-size: 0;
    .icon-ok {
      font-size: $font-size-medium;
      color: $color-theme;
      margin-right: 4px;
    }
    .text {
      font-size: $font-size-medium;
      color: $color-text;
    }
  }
}
</style>