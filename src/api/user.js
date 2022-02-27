import request from '@/utils/request';

/**
 * 每日签到
 * 说明 : 调用此接口可签到获取积分
 * -  type: 签到类型 , 默认 0, 其中 0 为安卓端签到 ,1 为 web/PC 签到
 * @param {number} type
 */
export function dailySignin(type = 0) {
    return request({
        url: '/daily_signin',
        method: 'post',
        params: {
            type,
            timestamp: new Date().getTime(),
        },
    })
}