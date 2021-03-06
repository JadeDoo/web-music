import jsonp from 'common/js/jsonp.js';
import { commonParams, options } from './config.js';

export function getRank() {
  const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_myqq_toplist.fcg';
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

export function getSongList() {
  const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_toplist_cp.fcg';
  const data = Object.assign({}, commonParams, {
    g_tk: 5381,
    uin: 0,
    format: 'jsonp',
    notice: 0,
    platform: 'h5',
    needNewCode: 1,
    tpl: 3,
    page: 'detail',
    type: top,
    topid: 4,
    _: +new Date()
  });
  return jsonp(url, data, options);
}