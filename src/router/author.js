/* Login */
const Login = (resolve) => {
    import('@/views/author/Login.vue').then((module) => {
        resolve(module)
    })
}
/* 注册 */
const Reg = (resolve) => {
    import('@/views/author/reg.vue').then((module) => {
        resolve(module)
    })
}
const RegStep1 = (resolve) => {
    import('@/views/author/regStep1.vue').then((module) => {
        resolve(module)
    })
}
const RegStep2 = (resolve) => {
    import('@/views/author/regStep2.vue').then((module) => {
        resolve(module)
    })
}
const RegStep3 = (resolve) => {
    import('@/views/author/regStep3.vue').then((module) => {
        resolve(module)
    })
}
/* 找回密码 */
const Findpwd = (resolve) => {
    import('@/views/author/findpwd.vue').then((module) => {
        resolve(module)
    })
}
const FindpwdStep1 = (resolve) => {
    import('@/views/author/findpwdStep1.vue').then((module) => {
        resolve(module)
    })
}
const FindpwdStep2 = (resolve) => {
    import('@/views/author/findpwdStep2.vue').then((module) => {
        resolve(module)
    })
}
const FindpwdStep3 = (resolve) => {
    import('@/views/author/findpwdStep3.vue').then((module) => {
        resolve(module)
    })
}
const author = [{
    path: '/login',
    name: 'login',
    component: Login,
}, {
    path: '/reg',
    name: 'reg',
    component: Reg,
    children: [
        {
            path: 'step1',
            name: 'regStep1',
            component: RegStep1
        },
        {
            path: 'step2',
            name: 'regStep2',
            component: RegStep2
        },
        {
            path: 'step3',
            name: 'regStep3',
            component: RegStep3
        }
    ]
},
{
    path: '/findpwd',
    name: 'findpwd',
    component: Findpwd,
    children: [
        {
            path: 'step1',
            name: 'findpwdStep1',
            component: FindpwdStep1
        },
        {
            path: 'step2',
            name: 'findpwdStep2',
            component: FindpwdStep2
        },
        {
            path: 'step3',
            name: 'findpwdStep3',
            component: FindpwdStep3
        }
    ]
},]
export default author