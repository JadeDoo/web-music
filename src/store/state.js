import {playMode as mode} from "@/common/js/config.js";
const state = {
  singer: {},
  playing: false,
  fullScreen: false,
  playlist: [],
  sequencelist: [],
  mode: mode.sequence,
  currentIndex: -1 // 当前播放
};

export default state;