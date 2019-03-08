import * as $cache  from 'common/cache'
import storage from 'common/storage'
const state = {
    columnList: $cache.getCache('columnList') || [],
    userDetail: storage.get('USER_DETAIL', {}),
    cartCount: $cache.getCache('CART_COUNT') || 0,
    userDefaultAddress: storage.get('USER_DEFAULT_ADDRESS', ''),
}
export default state
