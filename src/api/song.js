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
      if (matches) {
        temp = JSON.parse(matches[1]);
      }
    }
    return Promise.resolve(temp);
  });
}