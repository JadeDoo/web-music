<template>
  <transition name="list-fade">
    <div class="play-list" v-show="showPlayList" @click="hide">
      <div class="list-wrapper" @click.stop>
        <div class="list-header">
          <h1 class="title">
            <i class="icon" :class="iconMode" @click="changeMode"></i>
            <span class="text">{{modeDesc}}</span>
            <span class="clear" @click="confirm"><i class="icon-clear"></i></span>
          </h1>
        </div>
        <scroll class="list-content" :data="sequencelist" ref="list-content">
          <transition-group name="move" tag="ul">
            <li ref="item" @click="selected(item)" class="item" v-for="item in sequencelist" :key="item.id">
              <i class="current" :class="{'icon-play':item.id===currentSong.id}"></i>
              <span class="text">{{item.name}}</span>
              <span class="like">
                <i class="icon-not-favorite"></i>
              </span>
              <span class="delete" @click.stop="deleteItem(item)">
                <i class="icon-delete"></i>
              </span>
            </li>
          </transition-group>
        </scroll>
        <div class="list-operate">
          <div class="add" @click="showAdd">
            <i class="icon-add"></i>
            <span class="text">添加歌曲到播放队列</span>
          </div>
        </div>
        <div class="list-close" @click="hide">
          <span>关闭</span>
        </div>
      </div>
      <confirm ref="confirm" text="是否删除播放歌单" @confirm="deleteAll"></confirm>
      <add-song ref="add-song"></add-song>
    </div>
  </transition>
</template>

<script>
import { mapActions } from "vuex";
import Scroll from "@/base/scroll/scroll";
import Confirm from "@/base/confirm/confirm";
import { playMode } from "@/common/js/config.js";
import { playerMixin } from "@/common/js/mixins.js";
import AddSong from "@/components/add-song/add-song";
export default {
  mixins: [playerMixin],
  data() {
    return {
      showPlayList: false
    };
  },
  methods: {
    show() {
      this.showPlayList = true;
      setTimeout(() => {
        this.$refs["list-content"].refresh();
        this.scrollToCurrent(this.currentSong);
      }, 20);
    },
    hide() {
      this.showPlayList = false;
    },
    selected(item) {
      const index = this.playlist.findIndex(song => {
        return song.id === item.id;
      });
      this.setCurrentIndex(index);
      this.setPlayingState(true);
    },
    scrollToCurrent(current) {
      const index = this.sequencelist.findIndex(song => {
        return song.id === current.id;
      });
      if (this.$refs.item) {
        this.$refs["list-content"].scrollToElement(this.$refs.item[index], 300);
      }
    },
    deleteItem(item) {
      this.deleteSong(item);

      if (this.playlist.length === 0) {
        this.hide();
      }
    },
    confirm() {
      this.$refs.confirm.toggleShow();
    },
    deleteAll(bool) {
      if (!bool) {
        return;
      }
      this.deleteSongList();
      this.hide();
    },
    showAdd() {
      this.$refs["add-song"].toggleShow();
    },
    ...mapActions(["deleteSong", "deleteSongList"])
  },
  computed: {
    modeDesc() {
      return this.mode === playMode.sequence
        ? "顺序播放"
        : this.mode === playMode.loop ? "单曲循环" : "随机播放";
    }
  },
  watch: {
    currentSong(newSong) {
      this.scrollToCurrent(newSong);
    }
  },
  components: {
    Scroll,
    Confirm,
    AddSong
  }
};
</script>

<style scoped lang="scss">
@import "@/common/scss/variable.scss";
@import "common/scss/mixin.scss";

.play-list {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  z-index: 200;
  background: $color-background-d;
  &.list-fade-enter-active,
  &.list-fade-leave-active {
    transition: opacity 0.3s;
    .list-wrapper {
      transition: all 0.3s;
    }
  }
  &.list-fade-enter,
  &.list-fade-leave-to {
    opacity: 0;
    .list-wrapper {
      transform: translate3d(0, 100%, 0);
    }
  }
  .list-wrapper {
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    background-color: $color-highlight-background;
    .list-header {
      position: relative;
      padding: 20px 30px 10px 20px;
      .title {
        display: flex;
        align-items: center;
        .icon {
          margin-right: 10px;
          color: $color-theme-d;
          font-size: 30px;
        }
        .text {
          flex: 1;
          font-size: $font-size-medium;
          color: $color-text-l;
        }
        .clear {
          .icon-clear {
            font-size: $font-size-medium;
            color: $color-text-d;
          }
        }
      }
    }
    .list-content {
      max-height: 240px;
      overflow: hidden;
      .item {
        display: flex;
        align-items: center;
        height: 40px;
        padding: 0 30px 0 20px;
        overflow: hidden;
        &.move-enter-active,
        &.move-leave-active {
          transition: all 0.5s cubic-bezier(0.6, -0.28, 0.735, 0.045);
        }
        &.move-enter,
        &.move-leave-to {
          transform: translateX(-100%);
        }
        .current {
          flex: 0 0 20px;
          width: 20px;
          font-size: $font-size-small;
          color: $color-theme-d;
        }
        .text {
          flex: 1;
          @include no-wrap();
          font-size: $font-size-medium;
          color: $color-text-d;
        }
        .like {
          margin-right: 15px;
          font-size: $font-size-small;
          color: $color-theme;
          .icon-favorite {
            color: $color-sub-theme;
          }
        }
        .delete {
          font-size: $font-size-small;
          color: $color-theme;
        }
      }
    }
    .list-operate {
      width: 160px;
      margin: 20px auto 30px auto;
      .add {
        display: flex;
        align-items: center;
        padding: 8px 16px;
        border: 1px solid $color-text-l;
        border-radius: 100px;
        color: $color-text-l;
        .icon-add {
          margin-right: 5px;
          font-size: $font-size-small-s;
        }
        .text {
          font-size: $font-size-small;
        }
      }
    }
    .list-close {
      text-align: center;
      line-height: 50px;
      background: $color-background;
      font-size: $font-size-medium-x;
      color: $color-text-l;
      width: 100%;
    }
  }
}
</style>