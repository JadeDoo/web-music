<template>
  <div class="singer">
    <list-view :data="singers"></list-view>
  </div>
</template>

<script>
import { getSingerList } from "@/api/singer.js";
import { ERR_OK } from "@/api/config.js";
import ListView from "@/base/listview/listview";

const HOT_NAME = "热门";
const HOT_SINGER_LEN = 10;

export default {
  data() {
    return {
      singers: []
    };
  },
  created() {
    this._getSingerList();
  },
  methods: {
    _getSingerList() {
      getSingerList().then(res => {
        if (res.code === ERR_OK) {
          this.singers = this._mapSinger(res.data.list);
        }
      });
    },
    _mapSinger(singers) {
      let map = {
        hot: {
          tag: HOT_NAME,
          items: []
        }
      };
      singers.forEach((singer, index) => {
        // 获取singer 的信息
        var oTemp = {
          id: singer.Fsinger_mid,
          name: singer.Fsinger_name,
          avatar: `http://y.gtimg.cn/music/photo_new/T001R150x150M000${
            singer.Fsinger_mid
          }.jpg?max_age=2592000`
        };
        // 取得前十个 作为hot
        if (index < HOT_SINGER_LEN) {
          map.hot.items.push(oTemp);
        }

        var key = singer.Findex;
        // 不要数字！！！
        if (isNaN(parseInt(key))) {
          if (!map[key]) {
            map[key] = {
              tag: key,
              items: []
            };
          }
          map[key].items.push(oTemp);
        }
      });

      // 处理map
      let mapArr = [];
      for (let key in map) {
        if (key === "hot") {
          continue;
        }
        mapArr.push(map[key]);
      }
      mapArr.sort((a, b) => {
        return a.tag.charCodeAt(0) - b.tag.charCodeAt(0);
      });
      mapArr.unshift(map.hot);
      // console.log(mapArr);
      return mapArr;
    }
  },
  components: {
    ListView
  }
};
</script>

<style scoped lang="scss">
@import "common/scss/variable.scss";

.singer {
  position: fixed;
  top: 88px;
  bottom: 0;
  width: 100%;
}
</style>