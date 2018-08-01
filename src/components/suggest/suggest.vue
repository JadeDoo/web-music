<template>
  <scroll @beforeScroll="scrollStart" :beforeScroll="beforeScroll" :pullup="pullup" @scrollToEnd="scrollToEnd" class="suggest" :data="result" ref="scroll">
    <ul class="suggest-list">
      <li @click="selected(item)" class="suggest-item" :class="{'singer-item':isSinger(item)}" v-for="(item,index) in result" :key="index">
        <div class="icon">
          <img v-if="isSinger(item)" :src="item.singerPic" />
          <i class="icon-music" v-else></i>
        </div>
        <div class="name" :class="{singername:isSinger(item)}">
          <p class="text" v-html="songSinger(item)"></p>
        </div>
      </li>
    </ul>
    <div v-show="result.length==0 && queryString" class="no-result-wrapper">
      <no-result title="未搜索到结果"></no-result>
    </div>
  </scroll>
</template>

<script>
import { search } from "@/api/search.js";
import { ERR_OK } from "@/api/config.js";
import { createSong } from "@/common/js/song.js";
import { getSongVkey } from "@/api/song.js";
import Scroll from "@/base/scroll/scroll";
import Loading from "@/base/loading/loading";
import Singer from "@/common/js/singer.js";
import { mapMutations, mapActions } from "vuex";
import NoResult from "@/base/no-result/no-result";

export default {
  props: {
    queryString: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      page: 1,
      searchid: -1,
      result: [],
      pullup: true,
      hasMore: true,
      beforeScroll: true
    };
  },
  methods: {
    _search() {
      search(this.queryString, this.page, this.searchid).then(res => {
        if (res.code === ERR_OK) {
          if (this.result.length > 0 && this.page !== 1) {
            this._mapSong(res.data.song.list);
          } else {
            this._mapSong(res.data.song.list);
            if (res.data.zhida && res.data.zhida.zhida_singer) {
              this.result.unshift({
                ...res.data.zhida.zhida_singer,
                ...{ type: "singer" }
              });
            }
          }
          // console.log(res.data);
          this._checkMore(res.data);
        }
      });
      // }, 500);
    },
    isSinger(item) {
      // 判断是否为歌手
      return !!item.type && item.type === "singer";
    },
    songSinger(item) {
      if (this.isSinger(item)) {
        return item.singerName;
      } else {
        // console.log(singer);
        return `${item.name} - ${item.singer}`;
      }
    },
    scrollToEnd() {
      this.page += 1;
    },
    selected(item) {
      // console.log(item);
      if (item.type === "singer") {
        const singer = new Singer({
          id: item.singerMID,
          name: item.singerName
        });
        this.$router.push({
          path: `/search/${singer.id}`
        });
        this.setSinger(singer);
      } else {
        this.insertSong(item);
      }
      this.$emit('selected');
    },
    refresh() {
      this.$refs.scroll.refresh();
    },
    scrollStart() {
      this.$emit("scrollStart");
    },
    _mapSong(list) {
      let ret = [];
      list.forEach(item => {
        let musicData = {
          songid: item.id,
          songmid: item.mid,
          singer: item.singer,
          songname: item.name,
          albumname: item.album.name,
          interval: item.interval,
          albummid: item.album.mid
        };
        // console.log(musicData);
        if (musicData.songid && musicData.albummid) {
          getSongVkey(musicData.songmid).then(({ vkey, guid }) => {
            const song = createSong(musicData, vkey, guid);
            this.result.push(song);
          });
        }
      });
      // console.log(ret);
      return ret;
    },
    _checkMore(data) {
      const song = data.song;
      if (
        !song.list.length ||
        song.curnum + song.curpage * 20 >= song.totalnum
      ) {
        this.hasMore = false;
      }
    },
    ...mapMutations({
      setSinger: "SET_SINGER"
    }),
    ...mapActions(["insertSong"])
  },
  watch: {
    queryString() {
      this.result = [];
      this.page = 1;
      this.searchid = Math.floor((6e16 - 1e16) * Math.random() + 1e16);
      if (this.queryString) {
        this._search();
      }
    },
    page() {
      this.isPageChange = true;
      if (this.page === 1) {
        this.isPageChange = false;
      }
      if (!this.hasMore) {
        return;
      }
      this._search();
    }
  },
  components: {
    Scroll,
    Loading,
    NoResult
  }
};
</script>

<style scoped lang="scss">
@import "@/common/scss/variable.scss";
@import "@/common/scss/mixin.scss";
.suggest {
  // margin-top: 20px;
  height: 100%;
  overflow: hidden;
  .suggest-list {
    padding: 0 30px;
    .suggest-item {
      display: flex;
      align-items: center;
      padding-bottom: 20px;
      .icon {
        flex: 0 0 30px;
        // width: 30px;
        font-size: 14px;
        color: $color-text-d;
      }
      .name {
        flex: 1;
        font-size: $font-size-medium;
        color: $color-text-d;
        overflow: hidden;
        .text {
          @include no-wrap();
        }
      }
      &.singer-item {
        position: relative;
        top: 2px;
        bottom: 10px;
        margin-bottom: 20px;
        padding-bottom: 0;
        box-shadow: 0 0 4px #ffcd32;
        display: flex;
        align-items: center;
        justify-content: space-around;
        height: 120px;
        .icon {
          width: 100px;
          height: 100px;
          margin-left: 20px;
          img {
            width: 100px;
            border-radius: 50%;
          }
        }
        .name {
          text-align: center;
          font-size: $font-size-large;
          .text {
            height: 100%;
            color: $color-text;
          }
        }
      }
    }
  }
  .no-result-wrapper {
    position: absolute;
    width: 100%;
    top: 50%;
    transform: translateY(-50%);
  }
}
</style>