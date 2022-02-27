import request from '@/utils/request';


/**
 * 歌手榜
 * 说明 : 调用此接口 , 可获取排行榜中的歌手榜
 * - type : 地区
 * 1: 华语
 * 2: 欧美
 * 3: 韩国
 * 4: 日本
 * @param {number=} type
 */
 export function toplistOfArtists(type = null) {
    let params = {};
    if (type) {
      params.type = type;
    }
    return request({
      url: '/toplist/artist',
      method: 'get',
      params,
    });
  }