import * as types from './mutation-types';
import { playMode } from './../common/js/config';
import { randomList } from './../common/js/util';
import { saveSearch, deleteSearch, clearSearch } from './../common/js/cache';
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
export const insertSong = function ({ commit, state }, song) {
  // 获取当前的的播放列表
  let playlist = [...state.playlist];
  // 获取当前的歌曲原始数据
  let sequencelist = [...state.sequencelist];
  // 获取当前歌曲索引
  let currentIndex = state.currentIndex;
  // 获取当前的歌曲
  let currentSong = playlist[currentIndex];
  // 判断传入歌曲是否在播放列表中，返回索引
  let songInPlaylist = playlist.findIndex((item) => {
    return item.id === song.id;
  });
  // 让当前索引加1
  currentIndex++;
  // 将歌曲插入到播放列表
  playlist.splice(currentIndex, 0, song);

  // 如果有这首歌曲，处理之前的歌曲
  if (songInPlaylist > -1) {
    if (currentIndex > songInPlaylist) {
      playlist.slice(songInPlaylist, 1);
      currentIndex--;
    } else {
      playlist.slice(songInPlaylist + 1, 1);
    }
  }

  // 处理原始列表
  let currentInSequencelist = sequencelist.findIndex(item => {
    return item.id === currentSong.id;
  });
  let songInSequencelist = sequencelist.findIndex(item => {
    return item.id === song.id;
  });

  sequencelist.slice(currentInSequencelist + 1, 0, song);
  // 如果有这首歌曲，处理之前的歌曲
  if (songInSequencelist > -1) {
    if (currentInSequencelist + 1 > songInSequencelist) {
      sequencelist.slice(songInSequencelist, 1);
    } else {
      sequencelist.slice(songInSequencelist + 1, 1);
    }
  }

  commit(types.SET_SEQUENCE_LIST, sequencelist);
  commit(types.SET_PLAYLIST, playlist);
  commit(types.SET_CURRENT_INDEX, currentIndex);
  commit(types.SET_FULL_SCREEN, true);
  commit(types.SET_PLAYING_STATE, true);
};

export const saveSearchHistory = function ({ commit }, queryString) {
  // console.log(queryString);
  commit(types.SET_SEARCH_HISTORY, saveSearch(queryString));
};

export const deleteSearchHistory = function ({ commit }, queryString) {
  commit(types.SET_SEARCH_HISTORY, deleteSearch(queryString));
};

export const clearSearchHistory = function ({ commit }) {
  commit(types.SET_SEARCH_HISTORY, clearSearch());
};