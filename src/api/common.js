import http from './request'

/**
 * 获取到山东省的所有市
 * @param {*} data 
 * @returns 
 */
export const getCitys = (data) => {
    return http({
        url: '/common/getCitys',
        method: 'GET',
        data
    })
}
/**
 * 获取市下边的区
 * @param {*} data 
 * @returns 
 */
 export const getCountys = (data) => {
    return http({
        url: '/common/getCountys?code='+data,
        method: 'GET',
    })
}
/**
 * 获取镇
 * @param {*} data 
 * @returns 
 */
 export const getTowns = (data) => {
    return http({
        url: '/common/getTowns?code='+data,
        method: 'GET',
    })
}
/**
 * 短信相关（发送短信）
 * @param phone
 */
 export const smsGetTowns = (data) => {
    return http({
        url: '/sms/sendSms?phone='+data,
        method: 'GET',
    })
}
/**
 * 批量发送短信
 * @returns 
 */
 export const sendSmsList = (data) => {
    return http({
        url: '/sms/sendSmsList?phoneList='+data,
        method: 'POST',
    })
}
/**
 * 客户等级
 * 
 */
 export const getCustomerLevel = () => {
    return http({
        url: '/User/getCustomerLevel',
        method: 'GET',
    })
}
/**
 * 投资方式
 */
 export const getInvestmentTemplate = () => {
    return http({
        url: '/User/getInvestmentTemplate',
        method: 'GET',
    })
}
/**
 * 产权方
 */
 export const getUnit = () => {
    return http({
        url: '/User/getUnit',
        method: 'GET',
    })
}
/**
 * 获取年份
 */
 export const getYearList = () => {
    return http({
        url: '/common/getYearList',
        method: 'GET',
    })
}