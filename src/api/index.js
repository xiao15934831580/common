import http from './request'

export const login = (data) => {
    return http({
        url: '/admin/login',
        method: 'POST',
        data
    })
}
export const loginOut = (userName) => {
    return http({
        url: '/admin/exitUser?userName='+userName,
        method: 'GET',
    })
}
// 客户基本信息
/**
 * 用户详情
 * @param {*} params 
 * @returns 
 */
export const getAllUserInfo = (id) => {
    return http({
        url: '/User/getUserInfo?userId='+id,
        method: 'GET',
    })
}

/**
 * 获取用户基础信息
 * @param {*} params 
 * @returns 
 */
 export const getAllUserList = (data) => {
    return http({
        url: '/User/getUserList',
        method: 'POST',
        data
    })
}

/**
 * 客户维护与关怀
 * @param {*} data 
 * @returns 
 */
 export const userCare = (data) => {
    return http({
        url: '/User/userCare',
        method: 'POST',
        data
    })
}
//客户电站信息
/**
 * 获取电站列表信息
 * @param {*} data 
 * @returns 
 */
export const getUserPowers = (data) => {
    return http({
        url: '/User/getUserPowers',
        method: 'POST',
        data
    })
}
/**
 * 
 * 获取电站详情
 */
 export const getUserPowerInfo = (id) => {
    return http({
        url: '/User/getUserPowerInfo?powerId='+id,
        method: 'GET',
    })
}

/**
 * 电站保单列表
 * 获取数据
 * 
 */
 export const getPolicy = (data) => {
    return http({
        url: '/policy/getPolicy',
        method: 'POST',
        data
    })
}
/**
 * 新增修改保单
 * 
 */
 export const operatePolicy = (data) => {
    return http({
        url: '/policy/operatePolicy',
        method: 'POST',
        data
    })
}
/**
 * 删除保单
 * 
 */
 export const deletePolicy = (id) => {
    return http({
        url: `/policy/deletePolicy/${id}`,
        method: 'DELETE',
    })
}
/**
 * 获取工单列表
 */
 export const getOrders = (data) => {
    return http({
        url: '/workOrder/getOrders',
        method: 'POST',
        data
    })
}
/**
 * 获取工单详情数据
 */
 export const getOrderInfo = (id) => {
    return http({
        url: '/workOrder/getOrderInfo?orderId='+id,
        method: 'GET',
    })
}
/**
 * 获取保单提醒列表
 */
 export const getPolicyWarn = (data) => {
    return http({
        url: '/policy/getPolicyWarn',
        method: 'POST',
        data
    })
}
/**
 * 获取保单提醒详情
 */
 export const getPolicyWarnInfo = (id) => {
    return http({
        url: '/policy/getPolicyWarnInfo?policyNo='+id,
        method: 'GET',
    })
}
/**
 * 获取日志信息
 */
 export const getLogs = (data) => {
    return http({
        url: '/systemlog/getLogs',
        method: 'POST',
        data
    })
}
/**
 * 获取服务评价
 */
 export const getServiceEvaluation = () => {
    return http({
        url: '/systemset/getServiceEvaluation',
        method: 'GET',
    })
}
/**
 * 新增/编辑服务评价保存
 */
 export const operateServiceEvaluation = (data) => {
    return http({
        url: '/systemset/operateServiceEvaluation',
        method: 'POST',
        data
    })
}
/**
 * 获取电站保质期列表
 */
 export const getWarrantyList = (data) => {
    return http({
        url: '/systemset/getWarrantyList',
        method: 'POST',
        data
    })
}
/**
 * 设置电站保质期
 */
 export const setWarranty = (powerId,powerWarranty) => {
    return http({
        url: `/systemset/setWarranty/${powerId}?powerWarranty=`+powerWarranty,
        method: 'PUT',
    })
}
/**
 * 删除服务评价
 */
 export const deleteServiceEvaluation = (id) => {
    return http({
        url: `/systemset/deleteServiceEvaluation/${id}`,
        method: 'DELETE',
    })
}
/**
 * 返还金管理列表
 */
 export const getEquityList = (data) => {
    return http({
        url: '/equity/getEquityList',
        method: 'POST',
        data
    })
}
/**
 * 返还金删除
 */
 export const deleteEquity = (id) => {
    return http({
        url: `/equity/deleteEquity/${id}`,
        method: 'DELETE',
    })
}
/**
 * 返还金新建
 */
 export const addEquity = (data) => {
    return http({
        url: '/equity/addEquity',
        method: 'POST',
        data
    })
}
/**
 * 返还金导入
 */
 export const equityAllInto = (data) => {
    return http({
        url: '/equity/equityAllInto',
        method: 'POST',
        headers: {'Content-Type': 'multipart/form-data;charset=UTF-8'},
        data:data
    })
}
/**
 * 获取所有返还金导出数据
 */
 export const exportRefund = (data) => {
    return http({
        url: '/equity/exportRefund',
        method: 'POST',
        data
    })
}
/**
 * 返还金统计列表
 */
 export const refundStatistics = (data) => {
    return http({
        url: '/equity/refundStatistics',
        method: 'POST',
        data
    })
}
/**
 * 返还金明细
 */
 export const refundStatisticsInfo = (obj) => {
    return http({
        url: '/equity/refundStatisticsInfo?powerStationName='+obj.powerStationName+'&year='+obj.year,
        method: 'GET',
    })
}
/**
 * 返还金发放统计导出
 */
 export const exportStatistics = (obj) => {
    return http({
        url: '/equity/exportStatistics?customerName='+obj.customerName+'&year='+obj.year,
        method: 'GET',
    })
}