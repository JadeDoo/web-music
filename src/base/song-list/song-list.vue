<template>
  <div class="song-list">
    <ul>
      <li @click="selected(song,index)" v-for="(song,index) in songs" :key="index" class="song">
        <div class="rank" v-show="isRank">
          <span class="text" :class="index<3?'top':''">{{index+1}}</span>
        </div>
        <div class="content">
          <h2 class="name">{{song.name}}</h2>
          <p class="desc">{{getDesc(song)}}</p>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
// import Scroll from "@/base/scroll/scroll";
export default {
  props: {
    songs: {
      type: Array,
      default: null
    },
    isRank: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    getDesc(song) {
      return `${song.singer}·${song.album}`;
    },
    selected(song, index) {
      this.$emit("selected", song, index);
    }
  }
};
</script>

<style lang="scss" scoped>
@import "common/scss/variable.scss";
@import "common/scss/mixin.scss";

.song-list {
  .song {
    display: flex;
    align-items: center;
    box-sizing: border-box;
    height: 64px;
    font-size: $font-size-medium;
    .rank {
      flex: 0 0 25px;
      // padding-right: 20px;
      width: 25px;
      margin-right: 20px;
      text-align: center;
      font-size: $font-size-large;
      .top {
        font-size: $font-size-large-x;
        color: $color-theme;
      }
    }
    .content {
      flex: 1;
      line-height: 20px;
      overflow: hidden;
      .name {
        @include no-wrap();
        color: $color-text;
      }
      .desc {
        @extend .name;
        margin-top: 4px;
        color: $color-text-d;
      }
    }
  }
}
</style>