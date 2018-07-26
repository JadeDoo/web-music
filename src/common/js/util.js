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