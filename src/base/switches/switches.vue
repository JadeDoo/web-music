<template>
  <ul class="switches">
    <li @click="switchItem(index)" class="switch-item" :class="{'active':tagIndex === index}" v-for="(item,index) in switches" :key="index">
      <span>{{item.name}}</span>
    </li>
  </ul>
</template>

<script>
export default {
  props: {
    switches: {
      type: Array,
      default: null
    },
    tagIndex: {
      type: Number,
      default: 0
    }
  },
  methods: {
    switchItem(index) {
      this.$emit("switched", index);
    }
  }
};
</script>

<style scoped lang="scss">
@import "common/scss/variable.scss";

.switches {
  display: flex;
  align-items: center;
  width: 240px;
  margin: 0 auto;
  border: 1px solid $color-highlight-background;
  border-radius: 5px;
  .switch-item {
    flex: 1;
    padding: 0;
    text-align: center;
    font-size: $font-size-medium;
    &.active {
      background: $color-highlight-background;
      color: $color-text;
    }
  }
}
</style>