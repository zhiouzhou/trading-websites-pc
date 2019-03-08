/*领券中心*/
const CouponCenter = (resolve) => {
    import('@/views/assetCenter/couponCenter.vue').then((module) => {
        resolve(module)
    })
}

const MyOrderEntry = (resolve) => {
    import('@/views/myOrders/myOrderEntry.vue').then((module) => {
        resolve(module)
    })
}

const GetCouponCenter = (resolve) => {
    import('@/views/assetCenter/getCouponCenter.vue').then((module) => {
        resolve(module)
    })
}
/*我的酒批*/
const MyJiupi = (resolve) => {
    import('@/views/assetCenter/myJiupi.vue').then((module) => {
        resolve(module)
    })
}

/*会员详情*/
const MemberDetail = (resolve) => {
    import('@/views/usercenter/memberDetail.vue').then((module) => {
        resolve(module)
    })
}
/*会员规则*/
const RuleMember = (resolve) => {
    import('@/views/usercenter/ruleMember.vue').then((module) => {
        resolve(module)
    })
}
/*零头结余*/
const OddBalance = (resolve) => {
    import('@/views/assetCenter/oddBalance.vue').then((module) => {
        resolve(module)
    })
}

/*零头结余计算细则*/
const RuleExplain = (resolve) => {
    import('@/views/assetCenter/ruleExplain.vue').then((module) => {
        resolve(module)
    })
}

/*我的红包*/
const MyBonus = (resolve) => {
    import('@/views/assetCenter/myBonus.vue').then((module) => {
        resolve(module)
    })
}

/*红包使用规则*/
const RuleBonus = (resolve) => {
    import('@/views/assetCenter/ruleBonus.vue').then((module) => {
        resolve(module)
    })
}

/*我的银行卡*/
const MyBankCard = (resolve) => {
    import('@/views/assetCenter/myBankCard.vue').then((module) => {
        resolve(module)
    })
}
/*我的酒币*/
const MyCoin = (resolve) => {
    import('@/views/assetCenter/myCoin.vue').then((module) => {
        resolve(module)
    })
}
/*酒币使用规则*/
const RuleCoin = (resolve) => {
    import('@/views/assetCenter/ruleCoin.vue').then((module) => {
        resolve(module)
    })
}
/*我的优惠券*/
const MyCoupon = (resolve) => {
    import('@/views/assetCenter/myCoupon.vue').then((module) => {
        resolve(module)
    })
}
/*优惠券使用规则*/
const RuleCoupon = (resolve) => {
    import('@/views/assetCenter/ruleCoupon.vue').then((module) => {
        resolve(module)
    })
}
/*酒币抽奖*/
const Winescore = (resolve) => {
    import('@/views/assetCenter/winescore.vue').then((module) => {
        resolve(module)
    })
}
/*收货地址*/
const ReceiveAddress = (resolve) => {
    import('@/views/assetCenter/receiveAddress.vue').then((module) => {
        resolve(module)
    })
}
/* 我的订单 */
const MyOrders = (resolve) => {
    import('@/views/myOrders/myOrders.vue').then((module) => {
        resolve(module)
    })
}

/* 我的订单详情 */
const OrderDetail = (resolve) => {
    import('@/views/myOrders/orderDetail.vue').then((module) => {
        resolve(module)
    })
}

/*退货管理 */
const ReturnGoodsManage = (resolve) => {
    import('@/views/returnGoods/returnGoods.vue').then((module) => {
        resolve(module)
    })
}
/*退货管理详情 */
const ReturnGoodsDetail = (resolve) => {
    import('@/views/returnGoods/returnGoodsDetail.vue').then((module) => {
        resolve(module)
    })
}
/*申请退货*/
const RequestReturnGoods = (resolve) => {
    import('@/views/myOrders/requestReturnGoods.vue').then((module) => {
        resolve(module)
    })
}
/*订单追踪 */
const OrderTraceList = (resolve) => {
    import('@/views/myOrders/orderTraceList.vue').then((module) => {
        resolve(module)
    })
}
/* 投诉建议 */
const ComplainSuggestion = (resolve) => {
    import('@/views/complainSuggestion/complainSuggestion.vue').then((module) => {
        resolve(module)
    })
}
/* 新增投诉建议 */
const AddNewComplain = (resolve) => {
    import('@/views/complainSuggestion/addNewComplain.vue').then((module) => {
        resolve(module)
    })
}

/*帮我找货 */
const FindGoods = (resolve) => {
    import('@/views/findGoods/findGoods.vue').then((module) => {
        resolve(module)
    })
}

/*帮我找货详情 */
const GoodsDetail = (resolve) => {
    import('@/views/findGoods/goodsDetail.vue').then((module) => {
        resolve(module)
    })
}

/*帮我找货新增找货 */
const AddFindGoods = (resolve) => {
    import('@/views/findGoods/addFindGoods.vue').then((module) => {
        resolve(module)
    })
}

/*价格举报 */
const PriceReport = (resolve) => {
    import('@/views/priceReport/priceReport.vue').then((module) => {
        resolve(module)
    })
}

//经销商收藏
const FavoriteShop = (resolve) => {
    import('@/views/usercenter/favoriteShop.vue').then((module) => {
        resolve(module)
    })
}
//商品收藏
const FavoriteProduct = (resolve) => {
    import('@/views/usercenter/favoriteProduct.vue').then((module) => {
        resolve(module)
    })
}
//我的足迹
const History = (resolve) => {
    import('@/views/usercenter/history.vue').then((module) => {
        resolve(module)
    })
}
//联系业务员
const Salesman = (resolve) => {
    import('@/views/usercenter/salesman.vue').then((module) => {
        resolve(module)
    })
}

//订单提交成功
const SubmitOrderHeader = (resolve) => {
    import('@/views/submitOrder/submitOrderHeader.vue').then((module) => { resolve(module) })
}
const SubmitOrderSuccess = (resolve) => {
    import('@/views/submitOrder/submitOrderSuccess.vue').then((module) => { resolve(module) })
}
//订单提交失败
const SubmitOrderFail = (resolve) => {
    import('@/views/submitOrder/submitOrderFail.vue').then((module) => { resolve(module) })
}

//兑奖申请
const PrizeApply = (resolve) => {
    import('@/views/prizeApply/prizeApply.vue').then((module) => { resolve(module) })
}

const ApplyDetail = (resolve) => {
    import('@/views/prizeApply/applyDetail.vue').then((module) => { resolve(module) })
}

const profile = [
    {
        path: '/myOrderEntry',
        name: 'myOrderEntry',
        component: MyOrderEntry,
        children: [
            {
                path: 'myJiupi',
                name: 'myJiupi',
                component: MyJiupi,
            },
            {
                path: 'myOrders',
                name: 'myOrders',
                component: MyOrders,
            },
            {
                path: 'orderDetail',
                name: 'orderDetail',
                component: OrderDetail,
            },
            {
                path: 'orderTraceList',
                name: 'orderTraceList',
                component: OrderTraceList,
            },
            {
                path: 'complainSuggestion',
                name: 'complainSuggestion',
                component: ComplainSuggestion,
            },
            {
                path: 'findGoods',
                name: 'findGoods',
                component: FindGoods,
            },
            {
                path: 'goodsDetail',
                name: 'goodsDetail',
                component: GoodsDetail,
            },
            {
                path: 'addFindGoods',
                name: 'addFindGoods',
                component: AddFindGoods,
            },
            {
                path: 'addNewComplain',
                name: 'addNewComplain',
                component: AddNewComplain,
            },
            {
                path: 'priceReport',
                name: 'priceReport',
                component: PriceReport,
            },
            {
                path: 'returnGoodsManage',
                name: 'returnGoodsManage',
                component: ReturnGoodsManage,
            },
            {
                path: 'returnGoodsDetail',
                name: 'returnGoodsDetail',
                component: ReturnGoodsDetail,
            },
            {
                path: 'ruleExplain',
                name: 'ruleExplain',
                component: RuleExplain
            },
            {
                path: 'myBonus',
                name: 'myBonus',
                component: MyBonus
            },
            {
                path: 'ruleBonus',
                name: 'ruleBonus',
                component: RuleBonus
            },
            {
                path: 'myBankCard',
                name: 'myBankCard',
                component: MyBankCard
            },
            {
                path: 'oddBalance',
                name: 'oddBalance',
                component: OddBalance
            },
            {
                path: 'myCoin',
                name: 'myCoin',
                component: MyCoin
            },
            {
                path: 'ruleCoin',
                name: 'ruleCoin',
                component: RuleCoin
            },
            {
                path: 'myCoupon',
                name: 'myCoupon',
                component: MyCoupon
            },
            {
                path: 'winescore',
                name: 'winescore',
                component: Winescore
            },
            {
                path: 'receiveAddress',
                name: 'receiveAddress',
                component: ReceiveAddress
            },
            {
                path: 'favoriteShop',
                name: 'favoriteShop',
                component: FavoriteShop
            },
            {
                path: 'favoriteProduct',
                name: 'favoriteProduct',
                component: FavoriteProduct
            },
            {
                path: 'history',
                name: 'history',
                component: History
            },
            {
                path: 'salesman',
                name: 'salesman',
                component: Salesman
            },
            {
                path: 'memberDetail',
                name: 'memberDetail',
                component: MemberDetail
            },
            {
                path: 'ruleCoupon',
                name: 'ruleCoupon',
                component: RuleCoupon
            },
            {
                path: 'ruleMember',
                name: 'ruleMember',
                component: RuleMember
            },
            {
                path: 'getCouponCenter',
                name: 'getCouponCenter',
                component: GetCouponCenter
            },
            {
                path: 'requestReturnGoods',
                name: 'requestReturnGoods',
                component: RequestReturnGoods
            },
            {
                path: 'prizeApply',
                name: 'prizeApply',
                component: PrizeApply
            },
            {
                path: 'applyDetail',
                name: 'applyDetail',
                component: ApplyDetail
            }
        ]
    },
    {
        path: '/couponCenter',
        name: 'couponCenter',
        component: CouponCenter,
    },
    {   //订单提交成功
        path: '/submitOrderHeader',
        name: 'submitOrderHeader',
        component: SubmitOrderHeader,
        children: [
            {
                path: 'submitOrderSuccess',
                name: 'submitOrderSuccess',
                component: SubmitOrderSuccess
            },
            {
                path: 'submitOrderFail',
                name: 'submitOrderFail',
                component: SubmitOrderFail
            }
        ]
    }
]
export default profile
