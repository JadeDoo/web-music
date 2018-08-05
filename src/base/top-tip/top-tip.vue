<template>
  <transition name="drop">
    <div class="top-tip" v-show="showTip" @click.stop="toggleShow($event)">
      <slot></slot>
    </div>
  </transition>
</template>

<script>
export default {
  data() {
    return {
      showTip: false
    };
  },
  methods: {
    toggleShow(event) {
      if (event && event.type === "click") {
        this.showTip = false;
        return;
      }
      this.showTip = !this.showTip;
      if (this.showTip) {
        setTimeout(() => {
          this.toggleShow();
        }, 2000);
      }
    }
  }
};
</script>

<style scoped lang="scss">
@import "@/common/scss/variable.scss";
.top-tip {
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 500;
  background: $color-dialog-background;
  &.drop-enter-actve,
  &.drop-leave-active {
    transition: all 0.3s;
  }
  &.drop-enter-to,
  &.drop-leave-to {
    transform: translate3d(0, -100%, 0);
  }
}
</style>