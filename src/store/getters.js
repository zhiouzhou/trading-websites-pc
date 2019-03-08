export const columnList = state => state.columnList //带类目
export const userDetail = state => state.userDetail
export const cartCount = state => {
    if (state.cartCount > 99) {
        return '99+'
    }
    return state.cartCount
}
export const userDefaultAddress = state => state.userDefaultAddress
