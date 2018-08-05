const SEARCH_KEY = '__search__';
const SEARCH_MAX_LENGTH = 15;
const PLAY_KEY = '__play__';
const PLAY_MAX_LENGTH = 200;
const FAVORITE_KEY = '__favorite__';
const FAVORITE_MAX_LENGTH = 200;
export function saveSearch(queryString) {
  // localStorage
  // 存储的是字符串
  let searches = localStorage.getItem(SEARCH_KEY);
  if (!searches) {
    searches = [];
  } else {
    searches = searches.indexOf(',') > -1 ? searches.split(',') : [searches];
  }
  let tempSet = new Set(searches);
  tempSet.delete(queryString);

  searches = Array.from(tempSet);
  searches.unshift(queryString);
  if (searches.length > SEARCH_MAX_LENGTH) {
    searches.pop();
  }
  // console.log(searches);
  localStorage.setItem(SEARCH_KEY, searches);
  // console.log(searches);
  return searches;
};

export function getSearch() {
  let searches = localStorage.getItem(SEARCH_KEY);
  if (!searches) {
    searches = [];
  } else {
    searches = searches.indexOf(',') ? searches.split(',') : [searches];
  }
  return searches;
};

export function deleteSearch(queryString) {
  let searches = localStorage.getItem(SEARCH_KEY);
  if (!searches) {
    searches = [];
  } else {
    searches = searches.indexOf(',') ? searches.split(',') : [searches];
  }
  let tempSet = new Set(searches);
  tempSet.delete(queryString);
  // tempSet.add(queryString);
  searches = Array.from(tempSet);
  // console.log(searches);
  localStorage.setItem(SEARCH_KEY, searches);
  return searches;
};

export function clearSearch() {
  localStorage.removeItem(SEARCH_KEY);
  return [];
}

export function savePlay(song) {
  // localStorage存储为json 因为song为对象
  // song = JSON.stringify(song);

  let songs = localStorage.getItem(PLAY_KEY);
  if (!songs) {
    songs = [];
  } else {
    songs = JSON.parse(songs);
  }
  let tempSet = new Set(songs);
  tempSet.forEach(item => {
    if (item.id === song.id) {
      tempSet.delete(item);
    }
  });
  // tempSet.add(queryString);
  songs = Array.from(tempSet);
  songs.unshift(song);
  if (songs.length > FAVORITE_MAX_LENGTH) {
    songs.pop();
  }
  if (songs.length > PLAY_MAX_LENGTH) {
    songs.pop();
  }
  localStorage.setItem(PLAY_KEY, JSON.stringify(songs));
  return songs;
};

export function getPlay() {
  let songs = localStorage.getItem(PLAY_KEY);
  if (!songs) {
    songs = [];
  } else {
    songs = JSON.parse(songs);
  }
  return songs;
};

export function saveFavorite(song) {
  let songs = localStorage.getItem(FAVORITE_KEY);
  if (!songs) {
    songs = [];
  } else {
    songs = JSON.parse(songs);
  };
  let tempSet = new Set(songs);
  tempSet.forEach(item => {
    if (item.id === song.id) {
      tempSet.delete(item);
    }
  });
  songs = Array.from(tempSet);
  songs.unshift(song);
  localStorage.setItem(FAVORITE_KEY, JSON.stringify(songs));
  return songs;
};
export function deleteFavorite(song) {
  let songs = localStorage.getItem(FAVORITE_KEY);
  if (!songs) {
    songs = [];
  } else {
    songs = JSON.parse(songs);
  };
  let tempSet = new Set(songs);
  tempSet.forEach(item => {
    if (item.id === song.id) {
      tempSet.delete(item);
    }
  });
  songs = Array.from(tempSet);
  localStorage.setItem(FAVORITE_KEY, JSON.stringify(songs));
  return songs;
};

export function getFavorite() {
  let songs = localStorage.getItem(FAVORITE_KEY);
  if (!songs) {
    songs = [];
  } else {
    songs = JSON.parse(songs);
  };
  return songs;
}