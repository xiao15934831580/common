import http from './request'
/**
 * 重置密码
 */
 export const resetPasswords = (data) => {
    return http({
        url: '/admin/resetPasswords',
        method: 'POST',
        data
    })
}
/**
 * 获取用户信息
 */
 export const getAdminUser = (data) => {
    return http({
        url: '/admin/getAdminUser',
        method: 'POST',
        data
    })
}
/**
 * 删除用户信息
 */
 export const deleteUser = (id) => {
    return http({
        url: `/admin/deleteUser/${id}`,
        method: 'DELETE',
    })
}
/**
 * 新建或者编辑用户
 */
 export const operateAdminUser = (data) => {
    return http({
        url: '/admin/operateAdminUser',
        method: 'POST',
        data
    })
}
/**
 * 查看个人信息
 */
 export const findMyInformation = (userName) => {
    return http({
        url: '/admin/findMyInformation?userName='+userName,
        method: 'GET',
    })
}
/**
 * 获取角色
 */
 export const getRoleList = () => {
    return http({
        url: '/role/getRoleList',
        method: 'GET',
    })
}
/**
 * 获取所有菜单列表
 */
 export const getMenuList = () => {
    return http({
        url: '/role/getMenuList',
        method: 'GET',
    })
}
/**
 * 获取角色列表
 */
 export const getRoleAuthorityList = (data) => {
    return http({
        url: '/role/getRoleAuthorityList',
        method: 'POST',
        data
    })
}
/**
 * 保存角色信息
 */
 export const operateRole = (data) => {
    return http({
        url: '/role/operateRole',
        method: 'POST',
        data
    })
}
/**
 * 删除角色信息
 */
 export const deleteRole = (id) => {
    return http({
        url: `/role/deleteRole/${id}`,
        method: 'DELETE',
    })
}