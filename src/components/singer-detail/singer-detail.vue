<template>
  <transition name="slide">
    <music-list :songs="songs" :title="title" :bgImage="bgImage"></music-list>
  </transition>
</template>

<script>
import { mapGetters } from "vuex";
import { getSingerDetail } from "@/api/singer.js";
import { getSongVkey } from "@/api/song.js";
import { ERR_OK } from "@/api/config.js";
import { createSong } from "@/common/js/song.js";
import MusicList from "@/components/music-list/music-list";
export default {
  data() {
    return {
      songs: []
    };
  },
  computed: {
    title() {
      return this.singer.name;
    },
    bgImage() {
      return this.singer.avatar;
    },
    ...mapGetters(["singer"])
  },
  created() {
    this._getSingerDetail();
  },
  methods: {
    _getSingerDetail() {
      if (!this.singer.id) {
        this.$router.push({
          path: "/singer"
        });
      }
      getSingerDetail(this.singer.id).then(res => {
        if (res.code === ERR_OK) {
          // console.log(res.data.list);
          this.songs = this._mapSong(res.data.list);
          // console.log(this.songs);
        }
      });
    },
    _mapSong(list) {
      let temp = [];
      list.forEach(el => {
        // 将el中的musicData赋值给musicData
        let { musicData } = el;
        if (musicData.songid && musicData.albummid) {
          // console.log(musicData.songmid);
          // 调用 获取 vkey guid
          getSongVkey(musicData.songmid).then(({vkey, guid}) => {
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