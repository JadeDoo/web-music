<template>
  <div class="search-list">
    <ul>
      <li class="search-item" v-for="(item,index) in searches" :key="index">
        <span class="text" @click="selectHistoryItem(item)">{{item}}</span>
        <span class="icon" @click="deleteItem(item)">
          <i class="icon-delete"></i>
        </span>
      </li>
    </ul>
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