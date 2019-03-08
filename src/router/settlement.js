/* settlement */

/* 订单结算 */
const Settlement = (resolve) => {
  import('@/views/settlement/settlement.vue').then((module) => { resolve(module) })
}

const ConfirmOrder = (resolve) => {
  import('@/views/settlement/confirmOrder.vue').then((module) => { resolve(module) })
}

const settlement = [
    {
        path: '/settlement',
        name: 'settlement',
        component: Settlement,
        children: [
            {
                path: 'confirmOrder',
                name: 'confirmOrder',
                component: ConfirmOrder
            }
        ]
    }]
export default settlement
