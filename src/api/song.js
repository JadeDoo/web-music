import Axios from '../../node_modules/axios';
import { commonParams } from './config.js';
export function getLyric(mid) {
  const url = '/lyric';
  const data = Object.assign({}, commonParams, {
    songmid: mid,
    pcachetime: +new Date(),
    platform: 'yqq',
    hostUin: 0,
    format: 'json'
  });

  return Axios.get(url, {
    params: data
  }).then((res) => {
    let temp = res.data;
    if (typeof temp === 'string') {
      var reg = /^\w+\(({[^()]+})\)$/;
      var matches = temp.match(reg);
      // console.log(matches);
      if (matches) {
        temp = JSON.parse(matches[1]);
      }
    }
    return Promise.resolve(temp);
  });
}

function getGuid() {
  let t = (new Date()).getUTCMilliseconds();
  return Math.round(2147483647 * Math.random() * t % 1e10);
};
export function getSongVkey(songmid) {
  let guid = getGuid();
  const url = '/songVkey';
  const data = Object.assign({}, commonParams, {
    hostUin: 0,
    cid: 205361747,
    notice: 0,
    platform: 'yqq',
    needNewCode: 0,
    format: 'json',
    uin: 0,
    songmid: songmid,
    filename: `C400${songmid}.m4a`,
    guid: guid
  });

  return Axios.get(url, {
    params: data
  }).then(res => {
    // console.log(res);
    // guid和创建时间有关，所以每当请求一个数据，将当前的guid也要传入 vkey 和 guid 是对应的
    let vkey = res.data.data.items[0].vkey;
    return Promise.resolve({vkey, guid});
  });
};