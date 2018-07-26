import * as types from './mutation-types';
import { playMode } from './../common/js/config';
import { randomList } from './../common/js/util';
export const selectPlay = function ({ commit, state }, { list, index }) {
  commit(types.SET_SEQUENCE_LIST, list);
  if (state.mode === playMode.random) {
    let randomSongList = randomList(list);
    commit(types.SET_PLAYLIST, randomSongList);
    index = randomSongList.findIndex((item) => {
      return item.id === list[index].id;
    });
  } else {
    commit(types.SET_PLAYLIST, list);
  }
  commit(types.SET_CURRENT_INDEX, index);
  commit(types.SET_FULL_SCREEN, true);
  commit(types.SET_PLAYING_STATE, true);
};

export const randomPlayAll = function ({ commit }, { list }) {
  commit(types.SET_PLAY_MODE, playMode.random);
  commit(types.SET_SEQUENCE_LIST, list);
  let randomSongList = randomList(list);
  commit(types.SET_PLAYLIST, randomSongList);
  commit(types.SET_FULL_SCREEN, true);
  commit(types.SET_PLAYING_STATE, true);
  commit(types.SET_CURRENT_INDEX, 0);
};