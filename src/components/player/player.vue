<template>
  <div class="player" v-show="playlist.length>0">
    <transition name="normal">
      <!-- 默认播放器 -->
      <div class="normal-player" v-show="fullScreen">
        <div class="background">
          <img :src="currentSong.image" width="100%" height="100%">
        </div>
        <div class="top">
          <div class="back" @click="back">
            <i class="icon-back"></i>
          </div>
          <h1 class="title" v-html="currentSong.name"></h1>
          <h2 class="subtitle" v-html="currentSong.singer"></h2>
        </div>
        <div class="middle" @click="showLyric">
          <transition name="fade">
            <div class="cd-wrapper" :class="!isLyric?'fadein':'fadeout'" v-show="!isLyric">
              <div class="cd" :class="playing?'play':'play pause'">
                <img :src="currentSong.image" class="image">
              </div>
              <div class="small-lyric-wrapper">
                <div class="lyric">{{playingLyric}}</div>
              </div>
            </div>
          </transition>
          <transition name="fade">
            <scroll class="lyric-wrapper" :class="isLyric?'fadein':'fadeout'" v-show="isLyric" :data="currentLyric && currentLyric.lines" ref="lyric-scroll">
              <div>
                <div v-if="!currentLyric" class="no-lyric">正在搜索歌词...</div>
                <div v-else>
                  <p ref="lyric" :class="{'current':currentLine===index}" class="lyric" v-for="(lyric,index) in currentLyric.lines" :key="lyric.time">{{lyric.txt}}</p>
                </div>
              </div>
            </scroll>
          </transition>
        </div>
        <div class="bottom">
          <!-- 进度条 -->
          <div class="progress-wrapper">
            <span class="time time-l">-{{formatTime(currentTime)}}</span>
            <div class="progress-bar-wrapper">
              <progress-bar @progressChange="onProgressChange" :percent="percent"></progress-bar>
            </div>
            <span class="time time-r">{{formatTime((currentSong.duration-currentTime))}}</span>
          </div>
          <div class="operators">
            <div class="icon i-left">
              <i :class="iconMode" @click="changeMode"></i>
            </div>
            <div class="icon i-left">
              <i @click="prev" class="icon-prev"></i>
            </div>
            <div class="icon i-center">
              <i @click="togglePlaying" :class="playing?'icon-pause':'icon-play'"></i>
            </div>
            <div class="icon i-right">
              <i @click="next" class="icon-next"></i>
            </div>
            <div class="icon i-right">
              <i class="icon icon-not-favorite"></i>
            </div>
          </div>
        </div>
      </div>
    </transition>
    <transition name="mini">
      <!-- 最小化迷你播放器 -->
      <div class="mini-player" v-show="!fullScreen" @click="open">
        <div class="icon">
          <img :class="playing?'play':'play pause'" :src="currentSong.image" width="40" height="40">
        </div>
        <div class="text">
          <h2 class="name" v-html="currentSong.name"></h2>
          <p class="desc" v-html="currentSong.singer"></p>
        </div>
        <div class="control">
          <progress-circle :radius="36" :percent="percent">
            <i class="mini-icon" @click.stop="togglePlaying" :class="playing?'icon-pause':'icon-play'"></i>
          </progress-circle>
        </div>
        <div class="control">
          <i class="icon-playlist"></i>
        </div>
      </div>
    </transition>
    <audio @ended="end" @canplay="ready" @error="error" @timeupdate="update" :src="currentSong.url" ref="audio"></audio>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";
import ProgressBar from "@/base/progress-bar/progress-bar";
import ProgressCircle from "@/base/progress-circle/progress-circle";
import { playMode } from "@/common/js/config.js";
import { randomList } from "@/common/js/util.js";
import Lyric from "@/common/js/lyric-parser.js";
import Scroll from "@/base/scroll/scroll";
export default {
  data() {
    return {
      songReady: false,
      currentTime: 0,
      currentLyric: null,
      isLyric: false,
      currentLine: 0,
      playingLyric: "正在搜索歌词..."
    };
  },
  computed: {
    percent() {
      return this.currentTime / this.currentSong.duration;
    },
    iconMode() {
      return this.mode === playMode.sequence
        ? "icon-sequence"
        : this.mode === playMode.loop ? "icon-loop" : "icon-random";
    },
    ...mapGetters([
      "fullScreen",
      "playlist",
      "currentSong",
      "playing",
      "currentIndex",
      "mode",
      "sequencelist"
    ])
  },
  methods: {
    back() {
      this.setFullScreen(false);
    },
    open() {
      this.setFullScreen(true);
    },
    togglePlaying() {
      if (!this.songReady) {
        return;
      }
      this.setPlayingState(!this.playing);
      if (this.currentLyric) {
        this.currentLyric.togglePlay();
      }
    },
    prev() {
      if (!this.songReady) {
        return;
      }
      if (this.playlist.length === 1) {
        this.$refs["audio"].currentTime = 0;
        this.$refs["audio"].play();
      } else {
        let index = this.currentIndex - 1;
        if (index === -1) {
          index = this.playlist.length - 1;
        }
        this.setCurrentIndex(index);
        if (!this.playing) {
          this.togglePlaying();
        }
        this.songReady = false;
      }
    },
    next() {
      if (!this.songReady) {
        return;
      }
      // 之哟哟一首歌
      if (this.playlist.length === 1) {
        this.$refs["audio"].currentTime = 0;
        this.$refs["audio"].play();
      } else {
        let index = this.currentIndex + 1;
        if (index === this.playlist.length) {
          index = 0;
        }
        this.setCurrentIndex(index);
        if (!this.playing) {
          this.togglePlaying();
        }
        this.songReady = false;
      }
    },
    ready() {
      this.songReady = true;
    },
    error() {
      this.songReady = true;
    },
    update(e) {
      this.currentTime = e.target.currentTime;
    },
    end() {
      if (this.mode === playMode.loop) {
        this.$refs["audio"].currentTime = 0;
        this.$refs["audio"].play();

        if (this.currentLyric) {
          this.currentLyric.seek(0);
        }
      } else {
        this.next();
      }
    },
    onProgressChange(percent) {
      // console.log(percent);
      let currentTime = this.currentSong.duration * percent;
      this.$refs["audio"].currentTime = currentTime;
      if (!this.playing) {
        this.togglePlaying();
      }
      if (this.currentLyric) {
        this.currentLyric.seek(currentTime * 1000);
      }
    },
    changeMode() {
      const mode = (this.mode + 1) % 3;
      this.setPlayMode(mode);
      // 改变列表
      let list = [];
      if (mode === playMode.random) {
        list = randomList(this.sequencelist);
      } else {
        list = this.sequencelist;
      }
      // 重新计算当前歌曲的index
      let index = list.findIndex(item => {
        return item.id === this.currentSong.id;
      });
      this.setCurrentIndex(index);
      this.setPlayList(list);
    },
    formatTime(interval) {
      interval = ~~interval;
      let minute = ((interval / 60) | 0).toString().padStart(2, "0");
      let second = (interval % 60).toString().padStart(2, "0");
      return `${minute}:${second}`;
    },
    handlerLyric({ lineNum, txt }) {
      this.currentLine = lineNum;
      if (lineNum > 5) {
        let lineEl = this.$refs["lyric"][lineNum - 5];
        this.$refs["lyric-scroll"].scrollToElement(lineEl, 100);
      } else {
        this.$refs["lyric-scroll"].scrollToElement(this.$refs["lyric"][0], 100);
      }
      this.playingLyric = txt;
    },
    showLyric() {
      this.isLyric = !this.isLyric;
    },
    ...mapMutations({
      setFullScreen: "SET_FULL_SCREEN",
      setPlayingState: "SET_PLAYING_STATE",
      setCurrentIndex: "SET_CURRENT_INDEX",
      setPlayMode: "SET_PLAY_MODE",
      setSequenceList: "SET_SEQUENCE_LIST",
      setPlayList: "SET_PLAYLIST"
    })
  },
  watch: {
    currentSong(newSong, oldSong) {
      if (newSong.id === oldSong.id) {
        return;
      }
      if (this.currentLyric) {
        this.currentLyric.stop();
      }
      this.$nextTick(() => {
        this.$refs.audio.play();
        // 获取当前歌曲歌词
        this.currentSong
          .getLyric()
          .then(lyric => {
            this.currentLyric = new Lyric(lyric, this.handlerLyric);
            if (this.playing) {
              this.currentLyric.play();
            }
            // console.log(this.currentLyric);
          })
          .catch(() => {
            this.currentLyric = null;
            this.currentLine = 0;
          });
      });
    },
    playing(newPlaying) {
      const audio = this.$refs.audio;
      this.$nextTick(() => {
        newPlaying ? audio.play() : audio.pause();
      });
    }
  },
  components: {
    ProgressBar,
    ProgressCircle,
    Scroll
  }
};
</script>

<style scoped lang="scss">
@import "common/scss/variable.scss";
@import "common/scss/mixin.scss";

.player {
  .normal-player {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 150;
    background: $color-background;
    .background {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      z-index: -1;
      opacity: 0.6;
      filter: blur(20px);
    }
    .top {
      position: relative;
      margin-bottom: 25px;
      .back {
        position: absolute;
        top: 0;
        left: 6px;
        z-index: 50;
        .icon-back {
          display: block;
          padding: 9px;
          font-size: $font-size-large-x;
          color: $color-theme;
          transform: rotate(-90deg);
        }
      }
      .title {
        width: 70%;
        margin: 0 auto;
        line-height: 40px;
        text-align: center;
        @include no-wrap();
        font-size: $font-size-large;
        color: $color-text;
      }
      .subtitle {
        line-height: 20px;
        text-align: center;
        font-size: $font-size-medium;
        color: $color-text;
      }
    }
    .middle {
      position: fixed;
      display: flex;
      justify-content: center;
      width: 100%;
      top: 80px;
      bottom: 170px;
      white-space: nowrap;
      font-size: 0;
      .cd-wrapper {
        position: absolute;
        width: 80%;
        // padding 是根据父元素width来定
        box-sizing: border-box;
        padding-top: 80%;
        max-width: 500px;
        max-height: 500px;
        &.fadein {
          &.fade-enter-active,
          &.fade-leave-active {
            animation: fade 0.5s reverse;
          }
        }
        &.fadeout {
          &.fade-enter-active,
          &.fade-leave-active {
            animation: fade 0.5s;
          }
        }
        .cd {
          position: absolute;
          top: 0;
          width: 100%;
          height: 100%;
          max-height: 500px;
          box-sizing: border-box;
          border: 10px solid rgba(255, 255, 255, 0.1);
          border-radius: 50%;
          &.play {
            animation: rotate 20s linear infinite;
          }
          &.pause {
            animation-play-state: paused;
          }
          .image {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            border-radius: 50%;
          }
        }
        .small-lyric-wrapper {
          position: fixed;
          width: 80%;
          right: 10%;
          bottom: 30%;
          // height: 100%;
          .lyric {
            width: 100%;
            font-size: $font-size-medium;
            color: $color-text;
            text-align: center;
          }
        }
      }
      .lyric-wrapper {
        // position: absolute;
        text-align: center;
        left: 10%;
        top: 0;
        width: 100%;
        // height: 100%;
        overflow: hidden;
        &.fadein {
          &.fade-enter-active,
          &.fade-leave-active {
            animation: fade 0.5s reverse;
          }
        }
        &.fadeout {
          &.fade-enter-active,
          &.fade-leave-active {
            animation: fade 0.5s;
          }
        }
        .no-lyric {
          position: fixed;
          width: 100px;
          height: 20px;
          text-align: center;
          line-height: 20px;
          top: 50%;
          transform: translateY(-50%);
          font-size: $font-size-medium;
          color: $color-text;
        }
        .lyric {
          line-height: 32px;
          color: $color-text-l;
          font-size: $font-size-medium;
          &.current {
            color: $color-text;
          }
        }
      }
    }
    .bottom {
      position: absolute;
      bottom: 50px;
      width: 100%;
      .operators {
        display: flex;
        justify-content: center;
        align-items: center;
        .icon {
          // flex: 1;
          padding: 0 20px;
          color: $color-theme;
          i {
            font-size: 30px;
          }
          .icon-favorite {
            color: $color-sub-theme;
          }
        }
      }
      .progress-wrapper {
        display: flex;
        align-items: center;
        width: 80%;
        margin: 0 auto;
        padding: 10px 0;
        .time {
          color: $color-text;
          font-size: $font-size-small;
          flex: 0 0 30px;
          line-height: 30px;
          width: 30px;
          &.time-l {
            text-align: left;
          }
          &.time-r {
            text-align: right;
          }
        }
        .progress-bar-wrapper {
          flex: 1;
          margin: 0 10px;
        }
      }
    }
    &.normal-enter-active,
    &.normal-leave-active {
      transition: all 0.4s;
      .top,
      .bottom {
        transition: all 0.4s cubic-bezier(0.86, 0.18, 0.82, 1.32);
      }
    }
    &.normal-enter,
    &.normal-leave-to {
      opacity: 0;
      .top {
        transform: translate3d(0, -100px, 0);
      }
      .bottom {
        transform: translate3d(0, 100px, 0);
      }
    }
  }
  .mini-player {
    display: flex;
    position: fixed;
    align-items: center;
    left: 0;
    bottom: 0;
    z-index: 100;
    width: 100%;
    height: 60px;
    background: $color-highlight-background;
    .icon {
      flex: 0 0 40px;
      width: 40px;
      padding: 0 10px 0 20px;
      img {
        border-radius: 50%;
        &.play {
          animation: rotate 20s linear infinite;
        }
        &.pause {
          animation-play-state: paused;
        }
      }
    }
    .text {
      display: flex;
      flex-direction: column;
      justify-content: center;
      flex: 1;
      line-height: 20px;
      overflow: hidden;
      .name {
        margin-bottom: 2px;
        @include no-wrap();
      }
      .desc {
        @include no-wrap();
        font-size: $font-size-medium;
        color: $color-text;
      }
    }
    .control {
      flex: 0 0 30px;
      width: 30px;
      padding: 0 10px;
      font-size: 30px;
      color: $color-theme-d;
      .mini-icon {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      }
    }
  }
}

@keyframes rotate {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
@keyframes fade {
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}
</style>