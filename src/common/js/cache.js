import { storage, insert, del } from "./util.js";

const SEARCH_KEY = '__search__';
const SEARCH_MAX_LENGTH = 15;
const PLAY_KEY = '__play__';
const PLAY_MAX_LENGTH = 200;
const FAVORITE_KEY = '__favorite__';
const FAVORITE_MAX_LENGTH = 200;

export function saveSearch(queryString) {
  // localStorage存储的是字符串
  let searches = storage.get(SEARCH_KEY);
  searches = insert(searches, queryString, SEARCH_MAX_LENGTH);
  storage.set(SEARCH_KEY, searches);
  return searches;
};

export function getSearch() {
  let searches = storage.get(SEARCH_KEY);
  return searches;
};

export function deleteSearch(queryString) {
  let searches = storage.get(SEARCH_KEY);
  searches = del(searches, queryString);
  storage.set(SEARCH_KEY, searches);
  return searches;
};

export function clearSearch() {
  storage.remove(SEARCH_KEY);
  return [];
}

export function savePlay(song) {
  // localStorage存储为json 因为song为对象
  // song = JSON.stringify(song);
  let songs = storage.get(PLAY_KEY);
  songs = insert(songs, song, PLAY_MAX_LENGTH, 'id');
  storage.set(PLAY_KEY, songs);
  return songs;
};

export function getPlay() {
  let songs = storage.get(PLAY_KEY);
  return songs;
};

export function saveFavorite(song) {
  let songs = storage.get(FAVORITE_KEY);
  songs = insert(songs, song, FAVORITE_MAX_LENGTH, 'id');
  storage.set(FAVORITE_KEY, songs);
  return songs;
};
export function deleteFavorite(song) {
  let songs = localStorage.getItem(FAVORITE_KEY);
  songs = del(songs, song, 'id');
  storage.set(FAVORITE_KEY, songs);
  return songs;
};

export function getFavorite() {
  let songs = storage.get(FAVORITE_KEY);
  return songs;
}