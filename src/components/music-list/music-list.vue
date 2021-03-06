<template>
  <div class="music-list">
    <div class="back" @click="back">
      <i class="icon-back"></i>
    </div>
    <h1 class="title" v-html="title"></h1>
    <div class="bg-image" :style="bgStyle" ref="bgImage">
      <div class="filter" ref="filter"></div>
      <div class="play-wrapper">
        <div @click="playRandom" class="play" v-show="songs.length>0" ref="play-btn">
          <i class="icon-play"></i>
          <span class="text">全部播放</span>
        </div>
      </div>
    </div>
    <div class="bg-layer" ref="layer"></div>
    <scroll @scroll="scroll" :data="songs" :probe-type="probeType" :listen-scroll="listenScroll" class="list" ref="list">
      <div class="song-list-wrapper">
        <song-list :isRank="isRank" @selected="selected" :songs="songs"></song-list>
      </div>
      <div class="loading-container" v-show="!songs.length">
        <loading></loading>
      </div>
    </scroll>
  </div>
</template>

<script>
import Scroll from "@/base/scroll/scroll";
import SongList from "@/base/song-list/song-list";
import Loading from "@/base/loading/loading";
import { mapActions } from "vuex";
import { playlistMixin } from "@/common/js/mixins.js";
// import { getSongVkey } from "@/api/singer.js";
export default {
  mixins: [playlistMixin],
  props: {
    bgImage: {
      type: String,
      default: ""
    },
    songs: {
      type: Array,
      default: null
    },
    title: {
      type: String,
      default: ""
    },
    isRank: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      scrollY: 0
    };
  },
  created() {
    this.probeType = 3;
    this.listenScroll = true;
  },
  mounted() {
    this.imageHeight = this.$refs.bgImage.clientHeight;
    this.maxTranslate = -this.imageHeight + 40;
    this.$refs.list.$el.style.top = `${this.imageHeight}px`;
  },
  methods: {
    handlePlaylist(playlist) {
      const bottom = playlist.length > 0 ? "60px" : "";
      this.$refs.list.$el.style.bottom = bottom;
      this.$refs.list.refresh();
    },
    scroll(pos) {
      this.scrollY = pos.y;
    },
    back() {
      this.$router.back();
    },
    selected(song, index) {
      let list = [...this.songs];
      this.selectPlay({
        list,
        index
      });
    },
    playRandom() {
      let list = [...this.songs];
      this.randomPlayAll({
        list
      });
    },
    ...mapActions(["selectPlay", "randomPlayAll"])
  },
  computed: {
    bgStyle() {
      return `background-image:url(${this.bgImage})`;
    }
  },
  watch: {
    scrollY(newY) {
      // console.log(newY);
      let maxTranslate = Math.max(this.maxTranslate, newY);
      let zIndex = 0;
      let scale = 1;
      let blur = 0;
      const percent = Math.abs(newY / this.imageHeight);
      this.$refs.layer.style["transform"] = `translate3d(0,${maxTranslate}px,0)`;
      if (newY > 0) {
        scale = 1 + percent;
        zIndex = 10;
      } else {
        blur = Math.min(20 * percent, 20);
      }
      if (newY < maxTranslate) {
        zIndex = 10;
        this.$refs.bgImage.style.paddingTop = 0;
        this.$refs.bgImage.style.height = 40 + "px";
        // console.log(this.$refs['play-btn']);
        this.$refs["play-btn"].style.display = "none";
      } else {
        this.$refs.bgImage.style.paddingTop = "70%";
        this.$refs.bgImage.style.height = 0;
        this.$refs["play-btn"].style.display = "";
      }
      this.$refs.bgImage.style.zIndex = zIndex;
      this.$refs.bgImage.style["transform"] = `scale(${scale})`;
      this.$refs.filter.style["backdrop-filter"] = `${blur}px`;
    }
  },
  components: {
    SongList,
    Scroll,
    Loading
  }
};
</script>

<style scoped lang="scss">
@import "common/scss/variable.scss";
@import "common/scss/mixin.scss";

.music-list {
  position: fixed;
  width: 100%;
  z-index: 100;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: $color-background;
  .back {
    position: absolute;
    top: 0;
    left: 6px;
    z-index: 50;
    .icon-back {
      display: block;
      padding: 10px;
      font-size: $font-size-large-x;
      color: $color-theme;
    }
  }
  .title {
    position: absolute;
    top: 0;
    left: 10%;
    z-index: 40;
    width: 80%;
    @include no-wrap();
    text-align: center;
    line-height: 40px;
    font-size: $font-size-large;
    color: $color-text;
  }
  .bg-image {
    position: relative;
    width: 100%;
    height: 0;
    padding-top: 70%;
    transform-origin: top;
    background-size: cover;
    .filter {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(7, 17, 27, 0.4);
    }
    .play-wrapper {
      position: absolute;
      bottom: 20px;
      z-index: 50;
      width: 100%;
      .play {
        box-sizing: border-box;
        width: 135px;
        padding: 7px 0;
        margin: 0 auto;
        text-align: center;
        border: 1px solid $color-theme;
        color: $color-theme;
        border-radius: 100px;
        font-size: 0;
        .icon-play {
          display: inline-block;
          vertical-align: middle;
          margin-right: 6px;
          font-size: $font-size-medium-x;
        }
        .text {
          display: inline-block;
          vertical-align: middle;
          font-size: $font-size-small;
        }
      }
    }
  }
  .bg-layer {
    position: relative;
    height: 100%;
    background: $color-background;
  }
  .list {
    position: fixed;
    top: 0;
    bottom: 0;
    width: 100%;
    background: $color-background;
    z-index: 5;
    .song-list-wrapper {
      padding: 20px 30px;
    }
    .loading-container {
      position: absolute;
      width: 100%;
      top: 50%;
      transform: translateY(-50%);
    }
  }
}
</style>