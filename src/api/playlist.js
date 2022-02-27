import request from "@/utils/request";
import { mapTrackPlayableStatus } from '@/utils/common';

/**
 * 获取每日推荐歌单
 * 说明 : 调用此接口 , 可获得每日推荐歌单 ( 需要登录 )
 * @param {Object} params
 * @param {number=} params.limit
 */
export function dailyRecommendPlaylist(params) {
  return request({
    url: "/recommend/resource",
    method: "get",
    params,
  });
}

/**
 * 每日推荐歌曲
 * 说明 : 调用此接口 , 可获得每日推荐歌曲 ( 需要登录 )
 * @param {Object} params
 * @param {string} params.op
 * @param {string} params.pid
 */
 export function dailyRecommendTracks() {
  return request({
    url: '/recommend/songs',
    method: 'get',
    params: { timestamp: new Date().getTime() },
  }).then(result => {
    result.data.dailySongs = mapTrackPlayableStatus(
      result.data.dailySongs,
      result.data.privileges
    );
    return result;
  });
}

/**
 * 推荐歌单
 * 说明 : 调用此接口 , 可获取推荐歌单
 * - limit: 取出数量 , 默认为 30 (不支持 offset)
 * - 调用例子 : /personalized?limit=1
 * @param {Object} params
 * @param {number=} params.limit
 */
export function recommendPlaylist(params) {
  return request({
    url: "/personalized",
    method: "get",
    params,
  });
}

/**
 * 所有榜单
 * 说明 : 调用此接口,可获取所有榜单 接口地址 : /toplist
 */
export function toplists() {
  return request({
    url: "/toplist",
    method: "get",
  });
}
