<template>
  <scroll class="listview" :data="data" ref="listview" :listenScroll="listenScroll" :probeType="probeType" @scroll="scroll">
    <ul>
      <li v-for="(group,index) in data" class="list-group needsclick" :key="index" ref='listGroup'>
        <h2 class="list-group-tag">{{group.tag}}</h2>
        <ul>
          <li v-for="(singer,index) in group.items" :key="index" class="list-group-singer needsclick" @click="selectSinger(singer)">
            <img v-lazy="singer.avatar" class="avatar needsclick">
            <div class="name">{{singer.name}}</div>
          </li>
        </ul>
      </li>
    </ul>
    <div class="tag-list" @touchstart="onTagStart" @touchmove.stop.prevent="onTagMove">
      <ul>
        <li v-for="(item,index) in tagList" :key="index" class="tag-list-item" :data-index="index" :class="{current:current===index}">
          {{item}}
        </li>
      </ul>
    </div>
    <h2 class="tag-fixed" v-show="fixed" ref="tagFixed">{{fixed}}</h2>
    <div v-show="!data.length" class="loading-container">
      <loading></loading>
    </div>
  </scroll>
</template>

<script>
import Scroll from "@/base/scroll/scroll";
import Loading from "@/base/loading/loading";
import { getData } from "@/common/js/dom";
export default {
  created() {
    this.touch = {};
    this.listenScroll = true;
    this.listHeight = [];
    this.probeType = 3;
  },
  data() {
    return {
      scrollY: -1,
      current: 0,
      diff: -1
    };
  },
  props: {
    data: {
      type: Array,
      default: null
    }
  },
  methods: {
    onTagStart(e) {
      let tagIndex = getData(e.target, "index");
      let firstTouch = e.touches[0];
      // console.log(firstTouch);
      this.touch.y1 = firstTouch.pageY;
      // 记录最开始的tag索引
      this.touch.tagIndex = Number(tagIndex);
      // 将视图滚动到点击的index
      this._scrollTo(tagIndex);
    },
    onTagMove(e) {
      let firstTouch = e.touches[0];
      this.touch.y2 = firstTouch.pageY;
      // console.log(e.touches[0]);
      // console.log(this.touch)
      // 获取滚动了多少，偏移量
      let offsetVal = this.touch.y2 - this.touch.y1;
      // 18为每一个tag的高度，获取偏移的数量
      let offsetCount = ~~(offsetVal / 18);
      // 将最开始的index + 偏移量 = 当前的index
      let tagIndex = Number(this.touch.tagIndex) + offsetCount;
      // console.log(tagIndex);
      this._scrollTo(tagIndex);
    },
    refresh() {
      this.$refs.listview.refresh();
    },
    scroll(pos) {
      this.scrollY = pos.y;
      // console.log(this.scrollY);
      // console.log(pos);
    },
    _scrollTo(index) {
      // console.log(index);
      if (!index && index !== 0) {
        return;
      }
      if (index < 0 || index > this.tagList.length - 1) {
        return;
      }
      // 外层容器调用函数 参数为需要滚动到的内部元素 滚动时间
      this.scrollY = -this.listHeight[index];
      this.$refs.listview.scrollToElement(this.$refs.listGroup[index], 0);
    },
    _getHeight() {
      this.listHeight = [];
      const list = this.$refs.listGroup;
      let height = 0;
      this.listHeight.push(height);
      for (let i = 0; i < list.length; i++) {
        let el = list[i];
        height += el.clientHeight;
        this.listHeight.push(height);
      }
    },
    selectSinger(singer) {
      // console.log(1);
      this.$emit("selected", singer);
    }
  },
  watch: {
    data() {
      setTimeout(() => {
        this._getHeight();
      }, 20);
    },
    scrollY(newY) {
      // console.log(newY);
      const listHeight = this.listHeight;
      // 顶部 newY>0
      if (newY > 0) {
        this.current = 0;
        // this.$refs.listGroup[this.current]
        return;
      }
      // 中间
      for (let i = 0; i < listHeight.length - 1; i++) {
        let height1 = listHeight[i];
        let height2 = listHeight[i + 1];
        if (-newY >= height1 && -newY < height2) {
          this.current = i;
          // console.log(i)
          this.diff = height2 + newY;
          // console.log(this.diff)
          return;
        }
      }
      // 底部
      this.current = listHeight.length - 2;
    },
    diff(newVal) {
      let fixedTop = newVal > 0 && newVal < 30 ? newVal - 30 : 0;
      if (this.fixedTop === fixedTop) {
        return;
      }
      this.fixedTop = fixedTop;
      // console.log(fixedTop);
      this.$refs.tagFixed.style.transform = `translate3d(0,${fixedTop}px,0)`;
    }
  },
  computed: {
    tagList() {
      return this.data.map(group => {
        return group.tag.substr(0, 1);
      });
    },
    fixed() {
      if (this.scrollY > 0) {
        return "";
      }
      return this.data[this.current] ? this.data[this.current].tag : "";
    }
  },
  components: {
    Scroll,
    Loading
  }
};
</script>

<style lang="scss" scoped>
@import "common/scss/variable.scss";

.listview {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background-color: $color-background;
  .list-group {
    padding-bottom: 30px;
    .list-group-tag {
      height: 30px;
      line-height: 30px;
      padding-left: 20px;
      font-size: $font-size-small;
      color: $color-text-l;
      background: $color-highlight-background;
    }
    .list-group-singer {
      display: flex;
      align-items: center;
      padding: 20px 0 0 30px;
      .avatar {
        width: 50px;
        height: 50px;
        border-radius: 50%;
      }
      .name {
        margin-left: 20px;
        color: $color-text-l;
        font-size: $font-size-medium;
      }
    }
  }
  .tag-list {
    position: absolute;
    right: 0;
    z-index: 30;
    top: 50%;
    transform: translateY(-50%);
    width: 20px;
    padding: 20px 0;
    border-radius: 10px;
    text-align: center;
    background-color: $color-background-d;
    font-family: Helvetica;
    .tag-list-item {
      padding: 3px;
      line-height: 1;
      color: $color-text-l;
      font-size: $font-size-small;
      &.current {
        color: $color-theme;
      }
    }
  }
  .tag-fixed {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 30px;
    line-height: 30px;
    padding-left: 20px;
    font-size: $font-size-small;
    color: $color-text-l;
    background: $color-highlight-background;
  }
}
</style>