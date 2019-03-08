/* main */
const Main = (resolve) => {
    import('views/Main.vue').then((module) => { resolve(module) })
}
const Home = (resolve) => {
    import('views/Home.vue').then((module) => { resolve(module) })
}
const List = (resolve) => {
    import('views/List.vue').then((module) => { resolve(module) })
}
const Profit = (resolve) => {
    import('views/Profit.vue').then((module) => { resolve(module) })
}
const quicklyPurchase = (resolve) => {
    import('views/quicklyPurchase.vue').then((module) => { resolve(module) })
}
const Notice = (resolve) => {
    import('views/other/Notice.vue').then((module) => { resolve(module) })
}
/* 活动详情 */
const ActivityDetail = (resolve) => {
    import('@/views/activity/activityDetail.vue').then((module) => { resolve(module) })
}

/* 优惠特价 */
const ActivityList = (resolve) => {
    import('@/views/activity/activityList.vue').then((module) => { resolve(module) })
}


/* 商品详情 */
const ProductDetail = (resolve) => {
    import('@/views/productDetail/productDetail.vue').then((module) => { resolve(module) })
}

/* 组合商品详情 */
const GroupProductDetail = (resolve) => {
  import('@/views/groupProductDetail/groupProductDetail.vue').then((module) => { resolve(module) })
}

/* 购物车 */
const ShopCart = (resolve) => {
    import('@/views/shopcart/shopCart.vue').then((module) => { resolve(module) })
}

const Sign = (resolve) => {
    import('views/other/Sign.vue').then((module) => { resolve(module) })
}

//常购清单
const AlwaysBuyList = (resolve) => {
    import('@/views/alwaysBuyList.vue').then((module) => { resolve(module) })
}

/*新增价格举报*/
const AddPriceReport = (resolve) => {
    import('@/views/priceReport/addPriceReport.vue').then((module) => {
        resolve(module)
    })
}

const main = [
    {
        path: '*',
        redirect: '/index/home'
    }, {
        path: '/index',
        name: 'index',
        component: Main,
        children: [
            {
                path: 'home',
                name: 'home',
                component: Home,
                meta: {
                    keepAlive: true
                }
            },
            {
                path: 'list',
                name: 'list',
                component: List
            }, {
                path: 'activityList',
                name: 'activityList',
                component: ActivityList,
                meta: {
                    keepAlive: true
                }
            },
            {
                path: 'activityDetail',
                name: 'activityDetail',
                component: ActivityDetail
            },
            {
                path: 'productDetail',
                name: 'productDetail',
                component: ProductDetail
            },
            {
                path: 'groupProductDetail',
                name: 'groupProductDetail',
                component: GroupProductDetail
            }, {
                path: 'profit',
                name: 'profit',
                component: Profit,
                meta: {
                    keepAlive: true
                }
            }, {
                path: 'quicklyPurchase',
                name: 'quicklyPurchase',
                component: quicklyPurchase,
                meta: {
                    keepAlive: true
                }
            },
            {
                path: 'notice',
                name: 'notice',
                component: Notice
            },
            {
                path: 'sign',
                name: 'sign',
                component: Sign
            },
            {
                path: 'alwaysBuyList',
                name: 'alwaysBuyList',
                component: AlwaysBuyList
            },
            {
                path: 'addPriceReport',
                name: 'addPriceReport',
                component: AddPriceReport,
            },
        ]
    }]
export default main
