import axios from 'axios'

//获取经销商店铺详情
export function queryDealerShop(params) {
  const url = '/Shop/GetShopDetail'
  return axios({
    method: 'post',
    url: url,
    data: params,
  }).then((res) => {
    return Promise.resolve(res.data)
  }).catch(function (error) {

  });
}

//店铺添加关注，取消关注
export function attentionShop(type,params) {
  let url
  if(type==`add`){
    url = '/Shop/Favorite'
  }else{
    url = '/Shop/UnFavorite'
  }
  return axios({
    method: 'post',
    url: url,
    data: params,
  }).then((res) => {
    return Promise.resolve(res.data)
  }).catch(function (error) {

  });
}

//获取店铺内优惠券领取活动
export function queryDealerCoupons(params) {
  let url = '/CouponReceive/ListShopCouponReceive'
  return axios({
    method: 'post',
    url: url,
    data: params,
    loading: true,
  }).then((res) => {
    return Promise.resolve(res.data)
  }).catch(function (error) {

  });
}

//领取店铺优惠券
export function receiveDealerCoupon(params) {
  let url = '/CouponReceive/ReceiveCoupon'
  return axios({
    method: 'post',
    url: url,
    data: params,
  }).then((res) => {
    return Promise.resolve(res.data)
  }).catch(function (error) {

  });
}

//获取店铺产品
export function queryDealerShopProducts(params) {
  let url = '/ShopProduct/ListProduct'
  return axios({
    method: 'post',
    url: url,
    data: params
  }).then((res) => {
    return Promise.resolve(res.data)
  }).catch(function (error) {

  });
}

//经销商申请购买
export function dealerApplyStock(params) {
  let url = '/ShopProduct/ApplyBuyProduct'
  return axios({
    method: 'post',
    url: url,
    data: params
  }).then((res) => {
    return Promise.resolve(res.data)
  }).catch(function (error) {

  });
}
