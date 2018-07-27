<template>
  <div class="rank">
    <ul>
      <li v-for="item in topList" :key="item.id">
        <div class="img">
          <img v-lazy="item.picUrl" />
          <span class="listen-count">播放量:{{listenCount(item.listenCount)}}万</span>
        </div>
        <div class="to-song-wrapper">
          <h2 class="title">{{item.topTitle}}</h2>
          <ol class="songlist">
            <li v-for="(song,index) in item.songList" :key="index">
              <span class="songname">{{song.songname}}</span>
              <span class="singername">-{{song.singername}}</span>
            </li>
          </ol>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import { getRank } from "@/api/rank.js";
import { ERR_OK } from "@/api/config.js";

export default {
  data() {
    return {
      topList: []
    };
  },
  created() {
    getRank().then(res => {
      if (res.code === ERR_OK) {
        this.topList = res.data.topList;
        console.log(this.topList);
      }
    });
  },
  methods: {
    listenCount(num) {
      return (num / 10000).toFixed(1);
    }
  }
};
</script>

<style scoped lang="scss">
.rank{
  position: fixed;
  width: 100%;
  top: 88px;
  bottom: 0;
}
</style>