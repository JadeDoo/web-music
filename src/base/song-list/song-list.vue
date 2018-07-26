<template>
  <div class="song-list">
    <ul>
      <li @click="selected(song,index)" v-for="(song,index) in songs" :key="index" class="song">
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