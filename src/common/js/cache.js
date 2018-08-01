const SEARCH_KEY = '__search__';
const SEARCH_MAX_LENGTH = 15;

// function insertArray(arr, val, maxLen) {
//   // console.log(1);
//   const index = arr.findIndex(item => {
//     return item === val;
//   });

//   if (index === 0) {
//     return;
//   }
//   if (index > 0) {
//     arr.splice(index, 1);
//     arr.unshift(val);
//   }
//   if (maxLen && arr.length > maxLen) {
//     arr.pop();
//   }
//   console.log(arr);
// };
export function saveSearch(queryString) {
  // localStorage
  // 存储的是字符串
  let searches = localStorage.getItem(SEARCH_KEY);
  if (!searches) {
    searches = [];
  } else {
    searches = searches.indexOf(',') ? searches.split(',') : [searches];
  }
  let tempSet = new Set(searches);
  tempSet.delete(queryString);
  tempSet.delete(',');
  // tempSet.add(queryString);
  searches = Array.from(tempSet);
  searches.unshift(queryString);
  if (searches.length > SEARCH_MAX_LENGTH) {
    searches.pop();
  }
  // console.log(searches);
  localStorage.setItem(SEARCH_KEY, searches);
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