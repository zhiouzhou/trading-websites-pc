/* 帮助中心 */
const Main = (resolve) => {
    import('@/views/Main.vue').then((module) => {
        resolve(module)
    })
  }
const Help = (resolve) => {
    import('@/views/helpcenter/help.vue').then((module) => {
        resolve(module)
    })
}
const About = (resolve) => {
    import('@/views/helpcenter/about.vue').then((module) => {
        resolve(module)
    })
}
const Culture = (resolve) => {
    import('@/views/helpcenter/culture.vue').then((module) => {
        resolve(module)
    })
}
const Contact = (resolve) => {
    import('@/views/helpcenter/contact.vue').then((module) => {
        resolve(module)
    })
}
const Howreg = (resolve) => {
    import('@/views/helpcenter/howreg.vue').then((module) => {
        resolve(module)
    })
}
const Shopprocess = (resolve) => {
    import('@/views/helpcenter/shopprocess.vue').then((module) => {
        resolve(module)
    })
}
const Protocal = (resolve) => {
    import('@/views/helpcenter/protocal.vue').then((module) => {
        resolve(module)
    })
}
const Aftersales = (resolve) => {
    import('@/views/helpcenter/aftersales.vue').then((module) => {
        resolve(module)
    })
}
const Returnprocess = (resolve) => {
    import('@/views/helpcenter/returnprocess.vue').then((module) => {
        resolve(module)
    })
}
const Deliverymethod = (resolve) => {
    import('@/views/helpcenter/deliverymethod.vue').then((module) => {
        resolve(module)
    })
}
const Deliveryrule = (resolve) => {
    import('@/views/helpcenter/deliveryrule.vue').then((module) => {
        resolve(module)
    })
}
const Paymethod = (resolve) => {
    import('@/views/helpcenter/paymethod.vue').then((module) => {
        resolve(module)
    })
}
const Faq = (resolve) => {
    import('@/views/helpcenter/faq.vue').then((module) => {
        resolve(module)
    })
}
const Promotioncode = (resolve) => {
    import('@/views/helpcenter/promotioncode.vue').then((module) => {
        resolve(module)
    })
}
const Forgetpwd = (resolve) => {
    import('@/views/helpcenter/forgetpwd.vue').then((module) => {
        resolve(module)
    })
}
const Balance = (resolve) => {
    import('@/views/helpcenter/balance.vue').then((module) => {
        resolve(module)
    })
}
//手机久批
const DownloadApp = (resolve) => {
    import('@/views/usercenter/downloadApp.vue').then((module) => {
        resolve(module)
    })
}
const helpcenter = [{
    path: '/index',
    name: 'index',
    component: Main,
    children: [
        {
            path: 'help',
            name: 'help',
            component: Help,
            children: [
                {
                    path: 'about',
                    name: 'about',
                    component: About
                },
                {
                    path: 'culture',
                    name: 'culture',
                    component: Culture
                },
                {
                    path: 'contact',
                    name: 'contact',
                    component: Contact
                },
                {
                    path: 'howreg',
                    name: 'howreg',
                    component: Howreg
                },
                {
                    path: 'shopprocess',
                    name: 'shopprocess',
                    component: Shopprocess
                },
                {
                    path: 'protocal',
                    name: 'protocal',
                    component: Protocal
                },
                {
                    path: 'aftersales',
                    name: 'aftersales',
                    component: Aftersales
                },
                {
                    path: 'returnprocess',
                    name: 'returnprocess',
                    component: Returnprocess
                },
                {
                    path: 'deliverymethod',
                    name: 'deliverymethod',
                    component: Deliverymethod
                },
                {
                    path: 'deliveryrule',
                    name: 'deliveryrule',
                    component: Deliveryrule
                },
                {
                    path: 'paymethod',
                    name: 'paymethod',
                    component: Paymethod
                },
                {
                    path: 'faq',
                    name: 'faq',
                    component: Faq
                },
                {
                    path: 'promotioncode',
                    name: 'promotioncode',
                    component: Promotioncode
                },
                {
                    path: 'forgetpwd',
                    name: 'forgetpwd',
                    component: Forgetpwd
                },
                {
                    path: 'balance',
                    name: 'balance',
                    component: Balance
                },
            ]
        },
        {//手机久批
            path: 'downloadApp',
            name: 'downloadApp',
            component: DownloadApp
        }
    ]
}]
export default helpcenter