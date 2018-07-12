<template>
  <div class="slider" ref="slider">
    <div class="slider-group" ref="sliderGroup">
      <slot></slot>
    </div>
    <div class="dots" v-if="showDot">
      <span class="dot" v-for="(item, index) in dots" :class="{active: currentPageIndex == index}" :key="index"></span>
    </div>
  </div>
</template>

<script>
import BScroll from "better-scroll";
import { addClass } from "@/common/js/dom.js";
export default {
  data() {
    return {
      dots: [],
      currentPageIndex: 0
    };
  },
  props: {
    loop: {
      // 是否可以轮播
      type: Boolean,
      default: true
    },
    autoPlay: {
      // 自动轮播
      type: Boolean,
      default: true
    },
    interval: {
      // 轮播时间
      type: Number,
      default: 4000
    },
    speed: {
      // 轮播速度
      type: Number,
      default: 400
    },
    showDot: {
      type: Boolean,
      default: true
    },
    threshold: {
      type: Number,
      default: 0.3
    }
  },
  mounted() {
    setTimeout(() => {
      this._setSliderWidth(false);
      this._initDots();
      this._initSlider();
      if (this.autoPlay) {
        this._play();
      }
      window.addEventListener("resize", () => {
        if (!this.slider) {
          return;
        }
        this._setSliderWidth(true);
        this.slider.refresh();
      });
    }, 20);
  },
  methods: {
    _setSliderWidth(isResize) {
      this.children = this.$refs.sliderGroup.children;
      // console.log(this.children);
      let width = 0;
      let sliderWidth = this.$refs.slider.clientWidth;
      for (let i = 0; i < this.children.length; i++) {
        let child = this.children[i];
        addClass(child, "slider-item");
        child.style.width = sliderWidth + "px";
        width += sliderWidth;
      }

      if (this.loop && !isResize) {
        width += 2 * sliderWidth;
      }
      this.$refs.sliderGroup.style.width = width + "px";
    },
    _initSlider() {
      this.slider = new BScroll(this.$refs.slider, {
        scrollX: true,
        scrollY: false,
        momentum: false,
        snap: {
          loop: this.loop,
          threshold: this.threshold,
          speed: this.speed
        },
        bounce: false
      });

      // bs 派发一个事件 scrollEnd 利用getCurrentPage方法获取当前页的index
      this.slider.on("scrollEnd", () => {
        let currentPageIndex = this.slider.getCurrentPage().pageX;

        // console.log(current);
        this.currentPageIndex = currentPageIndex;
        if (currentPageIndex > 4) {
          this.currentPageIndex = 0;
          // this.slider.getCurrentPage().pageX = 0;
        }
        if (this.autoPlay) {
          clearTimeout(this.timer);
          this._play();
        }
      });
    },
    _initDots() {
      this.dots = new Array(this.children.length);
    },
    _play() {
      this.timer = setTimeout(() => {
        this.slider.next();
      }, this.interval);
    }
  }
};
</script>

<style scoped lang="scss">
@import "common/scss/variable.scss";

.slider {
  min-height: 1px;
  .slider-group {
    position: relative;
    overflow: hidden;
    white-space: nowrap;
    .slider-item {
      float: left;
      box-sizing: border-box;
      overflow: hidden;
      text-align: center;
      a {
        display: block;
        width: 100%;
        overflow: hidden;
        text-decoration: none;
      }
      img {
        display: block;
        width: 100%;
      }
    }
  }
  .dots {
    position: absolute;
    right: 0;
    left: 0;
    bottom: 12px;
    text-align: center;
    font-size: 0;
    .dot {
      display: inline-block;
      margin: 0 4px;
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background-color: $color-text-l;
      &.active {
        width: 20px;
        border-radius: 5px;
        background: $color-text-ll;
      }
    }
  }
}
</style>