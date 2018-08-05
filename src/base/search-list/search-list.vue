<template>
  <div class="search-list">
    <transition-group name="move" tag="ul">
      <li class="search-item" v-for="item in searches" :key="item">
        <span class="text" @click="selectHistoryItem(item)">{{item}}</span>
        <span class="icon" @click="deleteItem(item)">
          <i class="icon-delete"></i>
        </span>
      </li>
    </transition-group>
  </div>
</template>

<script>
export default {
  props: {
    searches: {
      type: Array,
      default: null
    }
  },
  methods: {
    selectHistoryItem(item) {
      this.$emit("selected", item);
    },
    deleteItem(item) {
      this.$emit('deleteItem', item);
    }
  }
};
</script>

<style scoped lang="scss">
@import "@/common/scss/variable.scss";
.search-list {
  .search-item {
    display: flex;
    align-items: center;
    height: 40px;
    &.move-enter-active,&.move-leave-active{
      transition: all .5s cubic-bezier(0.6, -0.28, 0.735, 0.045);
    }
    &.move-enter,&.move-leave-to{
      transform: translateX(-100%);
    }
    .text {
      flex: 1;
      color: $color-text-l;
    }
    .icon {
      padding-left: 10px;
      .icon-delete {
        font-size: $font-size-small;
        color: $color-text-d;
      }
    }
  }
}
</style>