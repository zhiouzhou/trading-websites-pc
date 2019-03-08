import axios from 'axios'

//获取商品详情
export function GetProductDetail(params,type) {
	let url = '/Product/GetProductDetail'
  //限时惠产品调限时惠活动产品详情
  if(type == 4) url = '/Timelimit/GetPromotionProduct'
	return axios({
		method: 'post',
		url: url,
		data: params,
    loading: true
	}).then((res) => {
		return Promise.resolve(res.data)
	}).catch(function (error) {

	});
}

//到货通知
//{params}   string  商品sku
export function getProductNotify(params) {

	const url = '/ProductNotify/SaveArrivalNotice'
	return axios({
		method: 'post',
		url: url,
		data: {
			data: params
		}
	}).then((res) => {
		return Promise.resolve(res.data)
	}).catch(res => {
		return Promise.reject(res.data)
	});
}


//我的货架
//{params}   object  { searchKey, specialAreaId }
export function listMyProductBrief(params) {

	const url = '/Myshelf/listMyProductBrief'
	return axios({
		method: 'post',
		url: url,
		data: {
			data: params
		}
	}).then((res) => {
		return Promise.resolve(res.data)
	}).catch(res => {
		return Promise.reject(res.data)
	});
}

//根据一批产品id查询产品详情
//{params}   array   产品id集合
export function listMyShelfProductByProductIds(params) {

	const url = '/Myshelf/listMyShelfProductByProductIds'
	return axios({
		method: 'post',
		url: url,
		data: {
			datas: params
		},
	}).then((res) => {
		return Promise.resolve(res.data)
	}).catch(res => {
		return Promise.reject(res.data)
	});
}

//获取组合商品详情
export function GetGroupProductDetail(params) {
  const url = '/Activity/GetCompositeProduct'
  return axios({
    method: 'post',
    url: url,
    data: params,
    loading: true
  }).then((res) => {
    return Promise.resolve(res.data)
  }).catch(function (error) {

  });
}

//添加,移除商品收藏
export function operateProductFavorite(params,type) {
  const url =
    type == `add` ? `/UserFavorite/Add` :
      type == `remove` ? `/UserFavorite/Remove` : ``
  return axios({
    method: 'post',
    url: url,
    data: params
  }).then((res) => {
    return Promise.resolve(res.data)
  }).catch(function (error) {

  });
}
