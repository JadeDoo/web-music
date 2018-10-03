<template>
<div class="rank" ref="rank">
  <scroll :data="topList" class="toplist" ref="toplist">
    <ul>
      <li @click="selected(item)" class="item" v-for="item in topList" :key="item.id">
        <div class="img">
          <img v-lazy="item.picUrl" width="100%" />
          <span class="listen-count">播放量:{{listenCount(item.listenCount)}}万</span>
        </div>
        <div class="topsong-wrapper">
          <h2 class="title">{{item.topTitle}}</h2>
          <ol class="songlist">
            <li v-for="(song,index) in item.songList" :key="index">
              <span class="index">{{index+1}} </span>
              <span class="songname"> {{song.songname}}</span>
              <span class="singername">- {{song.singername}}</span>
            </li>
          </ol>
        </div>
      </li>
    </ul>
  </scroll>
  <div class="loading-container" v-show="!topList.length">
    <loading></loading>
  </div>
  <router-view></router-view>
</div>
</template>

<script>
import { getRank } from "@/api/rank.js";
import { ERR_OK } from "@/api/config.js";
import Scroll from "@/base/scroll/scroll";
import Loading from "@/base/loading/loading";
import { playlistMixin } from "@/common/js/mixins.js";
import { mapMutations } from "vuex";

export default {
  mixins: [playlistMixin],
  data() {
    return {
      topList: []
    };
  },
  created() {
    this._getTopList();
  },
  methods: {
    handlePlaylist(playlist) {
      const bottom = playlist.length > 0 ? "60px" : "";
      this.$refs.rank.style.bottom = bottom;
      this.$refs.toplist.refresh();
    },
    selected(item) {
      this.$router.push({
        path: `/rank/${item.id}`
      });
      this.setTopList(item);
    },
    _getTopList() {
      getRank().then(res => {
        if (res.code === ERR_OK) {
          this.topList = res.data.topList;
          // console.log(this.topList);
        }
      });
    },
    listenCount(num) {
      return (num / 10000).toFixed(1);
    },
    ...mapMutations({
      setTopList: "SET_TOP_LIST"
    })
  },
  components: {
    Scroll,
    Loading
  }
};
</script>

<style scoped lang="scss">
@import "common/scss/variable.scss";
@import "common/scss/mixin.scss";

.rank {
  position: fixed;
  width: 100%;
  top: 88px;
  bottom: 0;
  overflow: hidden;
  .toplist {
    height: 100%;
    overflow: hidden;
    .item {
      display: flex;
      height: 100px;
      margin: 0 5%;
      width: 90%;
      text-overflow: ellipsis;
          // white-space: nowrap;
      // max-width: 335px;
      overflow: hidden;
      padding-top: 20px;
      &:last-child {
        padding-bottom: 20px;
      }
      .img {
        flex: 0 0 100px;
        position: relative;
        width: 100px;
        height: 100px;
        .listen-count {
          position: absolute;
          bottom: 0;
          font-size: $font-size-small-s;
          color: $color-text-ll;
        }
      }
      .topsong-wrapper {
        flex: 1;
        flex-direction: column;
        justify-content: center;
        background: $color-highlight-background;
        padding-left: 20px;
        .title {
          font-size: $font-size-medium-x;
          margin: 10px 0;
          color: $color-text-d;
        }
        .songlist {
          line-height: 20px;
          @include no-wrap();
          font-size: $font-size-small;
          // max-width: 200px;
          // overflow: hidden;
          .singername {
            color: $color-text-d;
          }
        }
      }
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