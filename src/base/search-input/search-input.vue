<template>
  <div class="search-input">
    <i class="icon-search"></i>
    <input v-model="queryString" type="text" class="input" :placeholder="placeholder" ref="input">
    <i @click="clearInput" v-show="!!queryString" class="icon-dismiss"></i>
  </div>
</template>

<script>
export default {
  props: {
    placeholder: {
      type: String,
      default: "搜索歌手、歌名"
    }
  },
  data() {
    return {
      queryString: ""
    };
  },
  created() {
    this.$watch("queryString", newValue => {
      if (this.timer) {
        clearTimeout(this.timer);
      }
      this.timer = setTimeout(() => {
        // console.log(this);
        this.$emit("inputed", newValue);
      }, 200);
    });
  },
  methods: {
    clearInput() {
      this.queryString = "";
    },
    inputBlur() {
      this.$refs.input.blur();
    },
    setQueryString(queryString) {
      this.queryString = queryString;
    }
  }
};
</script>

<style scoped lang="scss">
@import "common/scss/variable.scss";

.search-input {
  display: flex;
  align-items: center;
  box-sizing: border-box;
  width: 100%;
  padding: 0 6px;
  height: 40px;
  background: $color-highlight-background;
  border-radius: 10px;
  .icon-search {
    font-size: 24px;
    color: $color-background;
  }
  .input {
    flex: 1;
    margin: 0 5px;
    line-height: 18px;
    height: 100%;
    background: $color-highlight-background;
    color: $color-text;
    font {
      size: $font-size-medium;
    }
    border: none;
    outline: none;
    &::placeholder {
      color: $color-text-d;
    }
  }
  .icon-dismiss {
    font-size: 16px;
    color: $color-background;
  }
}
</style>