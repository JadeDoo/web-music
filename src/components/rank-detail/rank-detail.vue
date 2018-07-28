<template>
  <transition name="slide">
    <music-list :isRank="isRank" :songs="songs" :title="title" :bgImage="bgImage"></music-list>
  </transition>
</template>

<script>
import MusicList from "@/components/music-list/music-list";
import { mapGetters } from "vuex";
import { getSongList } from "@/api/rank.js";
import { getSongVkey } from "@/api/song.js";
import { createSong } from "@/common/js/song.js";
export default {
  data() {
    return {
      songs: [],
      isRank: true
    };
  },
  created() {
    this._getSongList();
  },
  computed: {
    title() {
      return this.topList.topTitle;
    },
    bgImage() {
      return this.topList.picUrl;
    },
    ...mapGetters(["topList"])
  },
  methods: {
    _getSongList() {
      if (!this.topList.id) {
        this.$router.back();
        return;
      }
      getSongList().then(res => {
        this.songs = this._mapSong(res.songlist);
        console.log(this.songs);
      });
    },
    _mapSong(list) {
      let temp = [];
      list.forEach(el => {
        let { data: musicData } = el;
        if (musicData.songid && musicData.albummid) {
          // console.log(musicData.songmid);
          // 调用 获取 vkey guid
          getSongVkey(musicData.songmid).then(({ vkey, guid }) => {
            temp.push(createSong(musicData, vkey, guid));
          });
        }
      });
      return temp;
    }
  },
  components: {
    MusicList
  }
};
</script>

<style scoped lang="scss">
@import "common/scss/variable.scss";
.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s;
}
.slide-enter,
.slide-leave-to {
  transform: translate3d(100%, 0, 0);
}
</style>