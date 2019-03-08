const Profile = (resolve) => {
    import('views/profile/profile.vue').then((module) => { resolve(module) })
}
const Bouns = (resolve) => {
    import('views/profile/bouns.vue').then((module) => { resolve(module) })
}
const Coupon = (resolve) => {
    import('views/profile/coupon.vue').then((module) => { resolve(module) })
}
const Coins = (resolve) => {
    import('views/profile/coins.vue').then((module) => { resolve(module) })
}
const Bankcard = (resolve) => {
    import('views/profile/bankcard.vue').then((module) => { resolve(module) })
}
const Smallchange = (resolve) => {
    import('views/profile/smallChange.vue').then((module) => { resolve(module) })
}

const profile = [{
    path: '/profile',
    name: 'profile',
    component: Profile,
    children: [
        {
            path: 'bouns',
            name: 'bouns',
            component: Bouns
        },
        {
            path: 'coupon',
            name: 'coupon',
            component: Coupon
        },
        {
            path: 'coins',
            name: 'coins',
            component: Coins
        },
        {
            path: 'bankcard',
            name: 'bankcard',
            component: Bankcard
        },
        {
            path: 'smallchange',
            name: 'smallchange',
            component: Smallchange
        },
    ]
}]