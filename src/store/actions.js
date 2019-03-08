
import * as types from './mutation-types'
import * as  settingApi from "api/setting/setting"
import * as $cache from 'common/cache'
import storage from 'common/storage'

//store && cache  userDetail
export const saveUserDtail = ({ commit }, userDetail) => {
  commit(types.SET_USER_DETAIL, userDetail)
}

//SET_COLUMN_LIST
export const saveColumnList = ({ commit }, columnList) => {
  $cache.setCache('columnList', columnList)
  commit(types.SET_COLUMN_LIST, columnList)
}

//SET_CART_COUNT
/**
 * params { count } Number 加或者减的数量 如果有传参 就手动计算并commit 没有就request
 */
export const saveCartCount = ({ commit, state}, count) => {
  if(count){
    state.cartCount = state.cartCount + count > 0 ? state.cartCount + count : 0
    commit(types.SET_CART_COUNT, state.cartCount);
    return false;
  }
  settingApi.GetShopCartCount().then(res => {
    if (res.success) {
      const shopCartCount = res.data.shopCartCount;
      $cache.setCache("CART_COUNT", shopCartCount);
      commit(types.SET_CART_COUNT, shopCartCount);
    }
  })
}
//
export const initUserDefaultAddress = ({ commit }, data) => {
  commit(types.SET_USER_DEFAULT_ADDRESS, data.userDefaultAddress)
  //切换地址需要重新请求专区信息
  if(data.refresh){
    storage.set('refreshHomePage', true)
    settingApi.purchaseColumnList().then(res => {
      if (res.success) {
        const columnList = res.data
        $cache.setCache('purchaseColumnList', columnList)
      }
    }).catch(res => { })
  }
}
