
/* 购物车 */
const CartIndex = (resolve) => {
  import('@/views/shopcart/cartIndex.vue').then((module) => { resolve(module) })
}

const ShopCart = (resolve) => {
  import('@/views/shopcart/shopCart.vue').then((module) => { resolve(module) })
}

const shopCart = [
    {
        path: '/cartIndex',
        name: 'cartIndex',
        component: CartIndex,
        children: [
            {
                path: 'shopCart',
                name: 'shopCart',
                component: ShopCart
            }
        ]
    }]
export default shopCart
