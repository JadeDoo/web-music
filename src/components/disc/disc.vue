<template>
  <transition name="slide">
    <music-list :songs="songs" :title="title" :bgImage="imgUrl"></music-list>
  </transition>
</template>

<script>
import MusicList from "@/components/music-list/music-list";
import { mapGetters } from "vuex";
import { getSongList } from "@/api/recommend.js";
import { ERR_OK } from "@/api/config.js";
import { createSong } from "@/common/js/song.js";
import { getSongVkey } from "@/api/song.js";

export default {
  data() {
    return {
      songs: []
    };
  },
  created() {
    this._getSongList();
  },
  methods: {
    _getSongList() {
      if (!this.disc.dissid) {
        this.$router.back();
      }
      let disstid = this.disc.dissid;
      getSongList(disstid).then(res => {
        if (res.code === ERR_OK) {
          this.songs = this._mapSong(res.cdlist[0].songlist);
        }
      });
    },
    _mapSong(list) {
      let temp = [];
      list.forEach(musicData => {
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
  computed: {
    title() {
      return this.disc.dissname;
    },
    imgUrl() {
      return this.disc.imgurl;
    },
    ...mapGetters(["disc"])
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