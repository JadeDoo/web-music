<template>
  <div class="progress-bar" ref="progress-bar" @click="progressClick">
    <div class="bar-inner">
      <div class="progress" ref="progress"></div>
      <div class="progress-btn-wrapper" ref="progress-btn"
        @touchstart.prevent="progressTouchStart"
        @touchmove.prevent="progressTouchMove"
        @touchend.prevent="progressTouchEnd"
      >
        <div class="progress-btn"></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    percent: {
      type: Number,
      default: 0
    }
  },
  created() {
    this.touch = {};
  },
  methods: {
    progressClick(e) {
      this._offset(e.offsetX);
      this._progressChange();
    },
    progressTouchStart(e) {
      // console.log(e);
      this.touch.initiated = true;
      this.touch.startX = e.touches[0].pageX;
      this.touch.left = this.$refs["progress"].clientWidth;
    },
    progressTouchMove(e) {
      if (!this.touch.initiated) {
        return;
      }
      // 移动距离
      const deltaX = e.touches[0].pageX - this.touch.startX;
      // 计算得出进度条的长度 和 btn的偏移量
      const offsetWidth = Math.min(Math.max(0, this.touch.left + deltaX), this.$refs["progress-bar"].clientWidth - 16);
      this._offset(offsetWidth);
    },
    progressTouchEnd(e) {
      this.touch.initiated = false;
      this._progressChange();
    },
    _progressChange() {
      const barWidth = this.$refs["progress-bar"].clientWidth - 16;
      const percent = this.$refs["progress"].clientWidth / barWidth;
      this.$emit("progressChange", percent);
    },
    _offset(offsetWidth) {
      this.$refs["progress"].style.width = `${offsetWidth}px`;
      this.$refs["progress-btn"].style["transform"] = `translate3d(${offsetWidth}px,0,0)`;
    }
  },
  watch: {
    percent(newPercent) {
      // console.log(newPercent);
      if (newPercent >= 0 && !this.touch.initiated) {
        const barWidth = this.$refs["progress-bar"].clientWidth - 16;
        const offsetWidth = newPercent * barWidth;
        this._offset(offsetWidth);
      }
    }
  }
};
</script>

<style scoped lang="scss">
@import "common/scss/variable.scss";
.progress-bar {
  height: 30px;
  .bar-inner {
    position: relative;
    top: 13px;
    height: 4px;
    background: rgba(0, 0, 0, 0.3);
    .progress {
      position: absolute;
      height: 100%;
      background: $color-theme;
    }
    .progress-btn-wrapper {
      position: absolute;
      left: -8px;
      top: -13px;
      width: 30px;
      height: 30px;
      .progress-btn {
        position: relative;
        top: 7px;
        left: 7px;
        box-sizing: border-box;
        width: 16px;
        height: 16px;
        border: 3px solid $color-text;
        border-radius: 50%;
        background: $color-theme;
      }
    }
  }
}
</style>