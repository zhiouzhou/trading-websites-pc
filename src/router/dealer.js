/* dealer */

/* 经销商相关模块 */

const Dealer = (resolve) => {
  import('@/views/dealer/dealer.vue').then((module) => { resolve(module) })
}
//经销商产品详情
const ProductDetail = (resolve) => {
  import('@/views/dealer/productDetail.vue').then((module) => { resolve(module) })
}
//经销商优惠券列表
const CouponList = (resolve) => {
  import('@/views/dealer/couponList.vue').then((module) => { resolve(module) })
}
//经销商产品列表
const DealerProductList = (resolve) => {
  import('@/views/dealer/dealerProductList.vue').then((module) => { resolve(module) })
}

const dealer = [
    {
        path: '/dealer',
        name: 'dealer',
        component: Dealer,
        children: [
            {
                path: 'productDetail',
                name: 'productDetail',
                component: ProductDetail
            },
            {
                path: 'couponList',
                name: 'couponList',
                meta: {
                  keepAlive: false
                },
                component: CouponList
            },
            {
                path: 'dealerProductList',
                name: 'dealerProductList',
                meta: {
                  keepAlive: false
                },
                component: DealerProductList
            }
        ]
    }]
export default dealer
