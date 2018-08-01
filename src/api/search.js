import jsonp from 'common/js/jsonp.js';
import { commonParams, options } from './config.js';

export function getHotKey() {
  const url = 'https://c.y.qq.com/splcloud/fcgi-bin/gethotkey.fcg';
  const data = Object.assign({}, commonParams, {
    g_tk: 5381,
    uin: 0,
    format: 'jsonp',
    notice: 0,
    platform: 'h5',
    needNewCode: 1,
    _: +new Date()
  });

  return jsonp(url, data, options);
};

export function search(queryString, page, searchid) {
  // 50476130713660528
  // const url = 'https://c.y.qq.com/soso/fcgi-bin/search_for_qq_cp';
  // queryString = encodeURIComponent(queryString);
  const url = 'https://c.y.qq.com/soso/fcgi-bin/client_search_cp';
  const data = Object.assign({}, commonParams, {
    // uin: 0,
    // format: 'jsonp',
    // notice: 0,
    // platform: 'h5',
    // needNewCode: 1,
    // w: queryString,
    // zhidaqu: 1,
    // catZhida: 1,
    // t: 0,
    // flag: 1,
    // ie: 'utf-8',
    // sem: 1,
    // aggr: 0,
    // perpage: 20,
    // n: 20,
    // p: page,
    // remoteplace: 'txt.mqq.all',
    // _: +new Date()
    ct: 24,
    qqmusic_ver: 1298,
    new_json: 1,
    remoteplace: page === 1 ? 'txt.yqq.center' : 'sizer.yqq.song_next',
    searchid: searchid,
    t: 0,
    aggr: 1,
    cr: 1,
    catZhida: 1,
    lossless: 0,
    flag_qc: 0,
    p: page,
    n: 20,
    w: queryString,
    g_tk: 5381,
    loginUin: 0,
    hostUin: 0,
    format: 'jsonp',
    inCharset: 'utf8',
    notice: 0,
    platform: 'yqq',
    needNewCode: 0
  });
  return jsonp(url, data, options);
}