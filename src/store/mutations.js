import * as types from './mutation-types'
const mutations = {

    [types.SET_COLUMN_LIST](state, list) {
        state.columnList = list
    },
    [types.SET_SECOND_CATEGORY](state, SecondPageCategory) {
        state.SecondPageCategory = SecondPageCategory
    },
    [types.SET_USER_DETAIL](state, userDetail) {
        state.userDetail = userDetail
    },
    [types.SET_CART_COUNT](state, cartCount) {
        state.cartCount = cartCount
    },
    [types.SET_USER_DEFAULT_ADDRESS](state, userDefaultAddress) {
        state.userDefaultAddress = userDefaultAddress
    },
}

export default mutations
