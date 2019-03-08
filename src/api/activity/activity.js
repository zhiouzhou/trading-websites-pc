import axios from 'axios'

//赚钱精选(1),利润产品(2),批发促销(3),限时惠(4),组合产品(5),凑单活动(6),团购活动(7), 产品精选(8);
//获取活动列表【新】
// {params}  object {promotionType, shopId , specialAreaId}
export function getPromotionList(params) {
  const url = '/Promotion/ListPromotion'
  return axios({
    method: 'post',
    url: url,
    data: {
      data: params.data,
      currentPage: params.currentPage,
      pageSize: params.pageSize
    }
  }).then((res) => {
    return Promise.resolve(res.data)
  }).catch(res => {
    return Promise.reject(res.data)
  })
}

//获取活动详情
export function getActivityDetail(params, type) {
  const url =
    type == 3 ? `/Discount/GetPromotion` ://打折促销
      type == 4 ? `/Timelimit/GetPromotion` ://限时惠
        type == 6 ? `/GatherOrder/GetPromotion` ://凑单活动
          type == 8 ? `/ProductChoice/GetPromotion` ://产品精选
            ``
  return axios({
    method: 'post',
    url: url,
    data: params,
    loading: true
  }).then((res) => {
    return Promise.resolve(res.data)
  }).catch(res => {
    return Promise.reject(res.data)
  })
}

//活动产品列表
export function getActivityProducts(params, type) {
  const url =
    type == 3 ? `/Discount/ListPromotionProduct` ://打折促销
      type == 4 ? `/Timelimit/ListPromotionProduct` ://限时惠
        type == 6 ? `/GatherOrder/ListPromotionProduct` ://凑单活动
          type == 8 ? `/ProductChoice/ListPromotionProduct` ://产品精选
            ``
  return axios({
    method: 'post',
    url: url,
    data: params
  }).then((res) => {
    return Promise.resolve(res.data)
  }).catch(res => {
    return Promise.reject(res.data)
  })
}

//获取组合商品列表
export function getCompositeActivity(params, type) {
  const url = '/CompositeProduct/QueryProductList'
  return axios({
    method: 'post',
    url: url,
    data: params
  }).then((res) => {
    return Promise.resolve(res.data)
  }).catch(res => {
    return Promise.reject(res.data)
  })
}

//获取进行中的活动
export function getOnlinePromotion() {
  const url = '/Promotion/ListOnline'
  let params = {
    currentPage: 1,
    data: 3,
    pageSize: 20
  }
  return axios({
    method: 'post',
    url: url,
    data: params
  }).then((res) => {
    return Promise.resolve(res.data)
  }).catch(res => {
    return Promise.reject(res.data)
  })
}
