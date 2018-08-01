<template>
  <div class="no-result">
    <div class="no-result-wrapper">
      <p class="no-result-text">{{title}}</p>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: ""
  }
};
</script>

<style scoped lang="scss">
@import "@/common/scss/variable.scss";
@import "@/common/scss/mixin.scss";

.no-result {
  text-align: center;
  .no-result-wrapper {
    width: 86px;
    height: 90px;
    margin: 0 auto;
    background: bg-image("no-result");
    background-size: 86px 90px;
    .no-result-text {
      padding-top: 100px;
      font-size: $font-size-medium;
      color: $color-text-d;
    }
  }
}
</style>