function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export function randomList(arr) {
  let tempArr = [...arr];
  for (let i = 0; i < tempArr.length; i++) {
    let j = randomInt(0, i);
    let temp = tempArr[j];
    tempArr[j] = tempArr[i];
    tempArr[i] = temp;
  }
  return tempArr;
}

// 处理localStroage
export const storage = {
  set: function (key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  },
  get: function (key) {
    let json = localStorage.getItem(key);
    if (!json) {
      return [];
    } else {
      return JSON.parse(json);
    }
  },
  remove: function (key) {
    localStorage.removeItem(key);
  },
  clear: function () {
    localStorage.clear();
  }
};
// 插入
export function insert(arr, value, max, property) {
  let temp = new Set(arr);
  // 删除原有值
  if (!property || (typeof value !== 'object')) {
    // console.log(1);
    temp.delete(value);
  } else {
    temp.forEach(item => {
      if (property && item[property] === value[property]) {
        temp.delete(item);
      }
    });
  }
  temp = Array.from(temp);
  // console.log(temp);
  temp.unshift(value);
  if (max && temp.length > max) {
    temp.pop();
  }
  return temp;
};
// 删除
export function del(arr, value, property) {
  let temp = new Set(arr);
  // 删除原有值
  if (!property || (typeof value !== 'object')) {
    // console.log(1);
    temp.delete(value);
  } else {
    temp.forEach(item => {
      if (property && item[property] === value[property]) {
        temp.delete(item);
      }
    });
  }
  temp = Array.from(temp);
  return temp;
}