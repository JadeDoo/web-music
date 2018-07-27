<template>
  <div class="recommend" ref="recommend">
    <scroll ref="scroll" class="recommend-content" :data="discList">
      <div>
        <div class="slider-wrapper" v-if="recommends.length">
          <slider>
            <div v-for="item in recommends" :key="item.id">
              <a :href="item.linkUrl">
                <img :src="item.picUrl" @load="imgLoad" class="needsclick">
              </a>
            </div>
          </slider>
        </div>
        <div class="recommend-list">
          <h1 class="list-title">热门歌单推荐</h1>
          <ul>
            <li class="item" @click="selected(item)" v-for="(item, index) in discList" :key="index">
              <div class="icon">
                <img v-lazy="item.imgurl" alt="" width="60" height="60">
              </div>
              <div class="desc">
                <h2>{{item.dissname}}</h2>
                <p>播放量：<span>{{item.listennum}}</span></p>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div class="loading-container" v-show="!discList.length">
        <loading></loading>
      </div>
    </scroll>
    <router-view></router-view>
  </div>
</template>

<script>
import { ERR_OK } from "@/api/config.js";
import { getRecommend, getDiscList } from "@/api/recommend.js";
import Slider from "@/base/slider/slider";
import Scroll from "@/base/scroll/scroll";
import Loading from "@/base/loading/loading";
import { playlistMixin } from "@/common/js/mixins.js";
import {mapMutations} from 'vuex';
export default {
  mixins: [playlistMixin],
  data() {
    return {
      recommends: [],
      discList: []
    };
  },
  created() {
    this._getRecommend();
    this._getDiscList();
  },
  destroyed() {
    clearTimeout(this.timer);
  },
  methods: {
    handlePlaylist(playlist) {
      const bottom = playlist.length > 0 ? "60px" : "";
      this.$refs.recommend.style.bottom = bottom;
      this.$refs.scroll.refresh();
    },
    selected(item) {
      this.$router.push({
        path: `recommend/${item.dissid}`
      });

      this.setDisc(item);
    },
    _getRecommend() {
      getRecommend().then(res => {
        if (res.code === ERR_OK) {
          this.recommends = res.data.slider;
          // console.log(this.recommends)
        }
      });
    },
    _getDiscList() {
      getDiscList().then(res => {
        if (res.code === ERR_OK) {
          this.discList = res.data.list;
          // console.log(this.discList)
        }
      });
    },
    imgLoad() {
      if (!this.checkLoad) {
        this.$refs.scroll.refresh();
        this.checkLoad = true;
      }
    },
    ...mapMutations({
      setDisc: 'SET_DISC'
    })
  },
  components: {
    Slider,
    Scroll,
    Loading
  }
};
</script>

<style lang="scss" scoped>
@import "common/scss/variable.scss";
.recommend {
  position: fixed;
  width: 100%;
  top: 88px;
  bottom: 0;
  .recommend-content {
    height: 100%;
    overflow: hidden;
    .slider-wrapper {
      position: relative;
      width: 100%;
      overflow: hidden;
    }
    .recommend-list {
      .list-title {
        height: 65px;
        line-height: 65px;
        text-align: center;
        font-size: $font-size-medium;
        color: $color-theme;
      }
      .item {
        display: flex;
        box-sizing: border-box;
        align-items: center;
        padding: 0 20px 20px 20px;
        .icon {
          flex: 0 0 60px;
          width: 60px;
          padding-left: 20px;
          padding-right: 20px;
        }
        .desc {
          display: flex;
          flex-direction: column;
          justify-content: center;
          flex: 1;
          line-height: 20px;
          overflow: hidden;
          font-size: $font-size-medium;
          h2 {
            margin-bottom: 10px;
            color: $color-text;
          }
          p {
            color: $color-text-d;
          }
        }
      }
    }
    .loading {
      position: absolute;
      width: 100%;
      top: 50%;
      transform: translateY(-50%);
    }
  }
}
</style>