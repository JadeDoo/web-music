import jsonp from 'common/js/jsonp.js';
import Axios from '../../node_modules/axios';
import { commonParams, options } from './config.js';

export function getSingerList() {
  const url = 'https://c.y.qq.com/v8/fcg-bin/v8.fcg';
  const data = Object.assign({}, commonParams, {
    channel: 'singer',
    page: 'list',
    key: 'all_all_all',
    pagesize: 100,
    pagenum: 1,
    hostUin: 0,
    needNewCode: 0,
    platform: 'yqq'
  });
  return jsonp(url, data, options);
}

export function getSingerDetail(singId) {
  const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_singer_track_cp.fcg';

  const data = Object.assign({}, commonParams, {
    hostUin: 0,
    singermid: singId,
    order: 'listen',
    begin: 0,
    num: 30,
    songstatus: 1
  });

  return jsonp(url, data, options);
}
// MusicJsonCallback27894295949550574&loginUin=0&&callback=MusicJsonCallback27894295949550574songmid=000YU69H3N55rZ

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