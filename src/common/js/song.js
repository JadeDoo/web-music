export default class Song {
  constructor({ id, mid, singer, name, album, duration, image, url }) {
    this.id = id;
    this.mid = mid;
    this.singer = singer;
    this.name = name;
    this.album = album;
    this.duration = duration;
    this.image = image;
    this.url = url;
  }
}

export function createSong(musicData) {
  return new Song({
    id: musicData.songid,
    mid: musicData.mid,
    singer: filterSinger(musicData.singer),
    name: musicData.songname,
    album: musicData.albumname,
    duration: musicData.interval,
    image: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${musicData.albummid}.jpg?max_age=2592000`,
    url: `http://ws.stream.qqmusic.com/${musicData.songid}.m4a?fromtag=46`
  });
}

function filterSinger(singer) {
  let temp = [];
  if (!singer) {
    return '';
  }
  singer.forEach(el => {
    temp.push(el.name);
  });
  return temp.join('/');
}