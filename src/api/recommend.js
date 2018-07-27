import jsonp from 'common/js/jsonp.js';
import { commonParams, options } from './config.js';
import Axios from '../../node_modules/axios';
export function getRecommend() {
  const url = 'https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg';

  const data = Object.assign({}, commonParams, {
    platform: 'h5',
    uin: 0,
    needNewCode: 1
  });

  return jsonp(url, data, options);
};

export function getDiscList() {
  /* URL: https://c.y.qq.com/splcloud/fcgi-bin/fcg_get_diss_by_tag.fcg
   * picmid=1`
   * rnd=0.19578892264753578`
   * g_tk=5381`
   * jsonpCallback=getPlaylist
   * loginUin=0
   * hostUin=0
   * format=jsonp
   * inCharset=utf8
   * outCharset=utf-8
   * notice=0
   * platform=yqq
   * needNewCode=0
   * categoryId=10000000
   * sortId=5
   * sin=0
   * ein=29 */
  // http://localhost:8080/discList?g_tk=5831&inCharset=utf-8&outCharset=utf-8&notice=0&format=json&platform=yqq&hostUin=0&sin=0&ein=29&sortId=5&needNewCode=0&category=10000000&rnd=0.25170599719792497
  const url = '/discList';
  const data = Object.assign({}, commonParams, {
    picmid: 1,
    platform: 'yqq',
    hostUin: 0,
    sin: 0,
    ein: 29,
    sortId: 5,
    needNewCode: 0,
    categoryId: 10000000,
    rnd: Math.random(),
    format: 'json'
  });
  // console.log(data);
  return Axios.get(url, {
    params: data
  }).then(res => {
    return Promise.resolve(res.data);
  });
};

export function getSongList(disstid) {
  const url = "/disc";
  const data = Object.assign({}, commonParams, {
    type: 1,
    json: 1,
    utf8: 1,
    onlysong: 0,
    disstid: disstid,
    format: 'json',
    g_tk: 5381,
    // jsonpCallback: 'playlistinfoCallback',
    loginUin: 0,
    hostUin: 0,
    inCharset: 'utf-8',
    outCharset: 'utf-8',
    notice: 0,
    platform: 'yqq',
    needNewCode: 0
  });
  // console.log(data);
  return Axios.get(url, {
    params: data
  }).then((res) => {
    let temp = res.data;
    return Promise.resolve(temp);
  });
}