import axios from 'axios'

// 添加购物车 
//@ {param}  object {count, productSkuId, productType, saleSpecId, sellingPrice, sellingPriceUnit, sourceId} 
// productType :普通商品(1),组合商品(2),大宗商品(3),限时惠商品(4),临期商品(5);
//sourceId:	来源ID,组合,限时惠为活动ID,  其他为SKUID
export function AddShopCart(param) {
	const url = '/ShopCar/AddShopCart'
	return axios({
		method: 'post',
		url: url,
		data: {
            data: param
        }
	}).then((res) => {
		return Promise.resolve(res.data)
	}).catch(res => {
        return Promise.reject(res.data)
    })
}

//批量新增购物车 
//@ {param}  array<object>	 object同上
export function AddShopCartList(param) {
	const url = '/ShopCar/AddShopCartList'
	return axios({
		method: 'post',
		url: url,
		data: {
            datas: param
        }
	}).then((res) => {
		return Promise.resolve(res.data)
	}).catch(res => {
        return Promise.reject(res.data)
    })
}


