import axios from 'axios'

//获取购物车列表【新】
export function getShopCartList(params) {
  const url = '/ShopCart/List'
  return axios({
    method: 'post',
    url: url,
    data: params,
  }).then((res) => {
    return Promise.resolve(res.data)
  }).catch(function (error) {

  });
}

//批量删除购物车
export function removeShopCart(params) {
  const url = '/ShopCar/RemoveShopCart'
  return axios({
    method: 'post',
    url: url,
    data: params
  }).then((res) => {
    return Promise.resolve(res.data)
  }).catch(function (error) {

  });
}

//更新购物车数量
export function updateShopCartCount(params) {
  const url = '/ShopCar/UpdateShopCart'
  return axios({
    method: 'post',
    url: url,
    data: params
  }).then((res) => {
    return Promise.resolve(res.data)
  }).catch(function (error) {

  });
}

//添加产品收藏
export function addFavorite(params) {
  const url = '/UserFavorite/Add'
  return axios({
    method: 'post',
    url: url,
    data: params
  }).then((res) => {
    return Promise.resolve(res.data)
  }).catch(function (error) {

  });
}
