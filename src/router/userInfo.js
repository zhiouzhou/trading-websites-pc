/* 个人中心 */
const MyOrderEntry = (resolve) => {
    import('@/views/myOrders/myOrderEntry.vue').then((module) => {
        resolve(module)
    })
}
const Changepwd = (resolve) => {
    import('@/views/usercenter/changepwd.vue').then((module) => {
        resolve(module)
    })
}
const Userinfo = (resolve) => {
    import('@/views/usercenter/userinfo.vue').then((module) => {
        resolve(module)
    })
}
const EditUserinfo = (resolve) => {
    import('@/views/usercenter/editUserinfo.vue').then((module) => {
        resolve(module)
    })
}
const ChangeMobile = (resolve) => {
    import('@/views/usercenter/changeMobile.vue').then((module) => {
        resolve(module)
    })
}
const ChangeMobileCode = (resolve) => {
    import('@/views/usercenter/changeMobileCode.vue').then((module) => {
        resolve(module)
    })
}
const userinfo = [{
    path: '/myOrderEntry',
    name: 'myOrderEntry',
    component: MyOrderEntry,
    children: [
        {
            path: 'changepwd',
            name: 'changepwd',
            component: Changepwd
        },
        {
            path: 'userinfo',
            name: 'userinfo',
            component: Userinfo
        },
        {
            path: 'editUserinfo',
            name: 'editUserinfo',
            component: EditUserinfo
        },
        {
            path: 'changeMobile',
            name: 'changeMobile',
            component: ChangeMobile
        },
        {
            path: 'changeMobileCode/:newMobileNo/:validateCodeId',
            name: 'changeMobileCode',
            component: ChangeMobileCode
        },
    ]
}]
export default userinfo