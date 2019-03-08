import axios from 'axios'
import storage from 'common/storage'

const formatCityData = function (cityList) {
  let cityGroups = {};
  cityList = cityList.filter(city => city.cityId < 890 || city.cityId > 899).sort();
  for (let city of cityList) {
    let cityGroup = cityGroups[city.initials];
    if (!cityGroup) {
      cityGroup = {
        groupName: city.initials,
        citys: []
      };
      cityGroups[city.initials] = cityGroup;
    }
    cityGroup.citys.push({
      cityId: city.cityId,
      cityName: city.cityName
    });
  }
  return cityGroups;
}

//获取红包列表
export function GetBonusList(params) {
  const url = '/Bonus/QueryUserBonus'
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

//获取我的银行卡列表
export function GetCardList() {
  const url = '/BankCard/QueryBankCards'
  return axios({
    method: 'post',
    url: url,
    data: {},
    loading:true,
  }).then((res) => {
    return Promise.resolve(res.data)
  }).catch(function (error) {

  });
}

//解锁银行卡
export function Unlock(params) {
  const url = '/BankCard/BankCardUnBind'
  return axios({
    method: 'post',
    url: url,
    data: params
  }).then((res) => {
    return Promise.resolve(res.data)
  }).catch(function (error) {

  });
}

//零头结余列表
export function GetOddBalance(params) {
  const url = '/User/QueryOddBalanceList'
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

//获取用户信息
export function GetUserInfo(params) {
  const url = '/User/GetUserInfoCount'
  return axios({
    method: 'post',
    url: url,
    data: {}
  }).then((res) => {
    return Promise.resolve(res.data)
  }).catch(function (error) {

  });
}

//获取用户酒币明细列表
export function GetCoinList(params) {
  const url = '/User/QueryWineScoreDetails'
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

//获取收货地址列表
export function QueryWarehouseList() {
  const url = '/Warehouse/QueryWarehouseList'
  return axios({
    method: 'post',
    url: url,
    data: {}
  }).then((res) => {
    return Promise.resolve(res.data)
  }).catch(function (error) {

  });
}

//获取收货地址列表
export function GetAddressList(params) {
  const url = '/Address/List'
  return axios({
    method: 'post',
    url: url,
    data: params
  }).then((res) => {
    return Promise.resolve(res.data)
  }).catch(function (error) {

  });
}

//删除收货地址
export function DeleteAddress(params) {
  const url = '/Address/Delete'
  return axios({
    method: 'post',
    url: url,
    data: params
  }).then((res) => {
    return Promise.resolve(res.data)
  }).catch(function (error) {

  });
}

//设置默认地址
export function SetDefaultAddress(params) {
  const url = '/Address/SetDefault'
  return axios({
    method: 'post',
    url: url,
    data: params
  }).then((res) => {
    return Promise.resolve(res.data)
  }).catch(function (error) {

  });
}


//新增收货地址
export function AddAddress(params) {
  const url = '/Address/Add'
  return axios({
    method: 'post',
    url: url,
    data: params
  }).then((res) => {
    return Promise.resolve(res.data)
  }).catch(function (error) {

  });
}

//修改收货地址
export function EditAddress(params) {
  const url = '/Address/Edit'
  return axios({
    method: 'post',
    url: url,
    data: params
  }).then((res) => {
    return Promise.resolve(res.data)
  }).catch(function (error) {

  });
}

//获取热门城市
export function GetHotCity(params) {
  const url = '/City/ListHotCity'
  return axios({
    method: 'post',
    url: url,
    data: {}
  }).then((res) => {
    return Promise.resolve(res.data)
  }).catch(function (error) {

  });
}

//获取酒批城市列表
export function GetJiupiCity() {
  const cacheCityList = storage.get('City_List', null)
  if (cacheCityList) {
    return Promise.resolve(cacheCityList)
  }
  const url = '/City/ListJiupiCity'
  return axios({
    method: 'post',
    url: url,
    data: {}
  }).then((res) => {
    const response = res.data;
    if (response.data && response.data.length) {
      const cityGroups = formatCityData(response.data)
      storage.set('City_List', cityGroups)
      return Promise.resolve(cityGroups)
    }
    return Promise.resolve(response)
  }).catch(res => {
    return Promise.reject(res.data)
  });
}
//获取酒批行政城市列表
export function GetCityList() {

  const url = '/City/ListCity'
  return axios({
    method: 'post',
    url: url,
    data: {}
  }).then((res) => {
    return Promise.resolve(res.data)
  }).catch(res => {
    return Promise.reject(res)
  });
}
//获取优惠券列表
export function GetCouponList(params) {
  const url = '/Coupon/ListUserCoupon'
  return axios({
    method: 'post',
    url: url,
    data: params,
    loading: true
  }).then((res) => {
    return Promise.resolve(res.data)
  }).catch((res) => {
    return Promise.reject(res.data)
  });
}
//获取订单优惠券领取活动列表
export function ListOrderCouponReceive(params) {
  const url = '/CouponReceive/ListOrderCouponReceive'
  return axios({
    method: 'post',
    url: url,
    data: params,
    loading: true
  }).then((res) => {
    return Promise.resolve(res.data)
  }).catch((res) => {
    return Promise.reject(res.data)
  });
}

//获取优惠券数量
export function GetCouponNum(params) {
  const url = '/Coupon/GetCouponCount'
  return axios({
    method: 'post',
    url: url,
    data: params,
    loading: true
  }).then((res) => {
    return Promise.resolve(res.data)
  }).catch((res) => {
    return Promise.reject(res.data)
  });
}

//获取用户可领取优惠劵列表
export function GetCouponCenter(params) {
  const url = '/CouponReceive/ListReceiveCoupon'
  return axios({
    method: 'post',
    url: url,
    data: params
  }).then((res) => {
    return Promise.resolve(res.data)
  }).catch((res) => {
    return Promise.reject(res.data)
  });
}

//领取优惠券 {promotionId, receiveSource}
export function UserReceive(params) {
  const url = '/CouponReceive/UserReceive'
  return axios({
    method: 'post',
    url: url,
    data: {
      data: params
    }
  }).then((res) => {
    return Promise.resolve(res.data)
  }).catch((res) => {
    return Promise.reject(res.data)
  });
}

//获取赠品券赠品列表
export function getGiftList(params) {
  const url = '/Coupon/QueryGiftProducts'
  return axios({
    method: 'post',
    url: url,
    data: params
  }).then((res) => {
    return Promise.resolve(res.data)
  }).catch((res) => {
    return Promise.reject(res.data)
  });
}

//获取会员信息
export function getUserClub(params) {
  const url = '/UserLevel/GetUserClub'
  return axios({
    method: 'post',
    url: url,
    data: params,
    loading: true
  }).then((res) => {
    return Promise.resolve(res.data)
  }).catch((res) => {
    return Promise.reject(res.data)
  });
}

//获取订单退货原因
export function getReturnOrderReasons() {
  const url = '/Setting/GetReturnOrderReasons'
  return axios({
    method: 'post',
    url: url,
    loading: true
  }).then((res) => {
    return Promise.resolve(res.data)
  }).catch((res) => {
    return Promise.reject(res.data)
  });
}

//提交退货单
export function AddReturnOrder(params) {
  const url = '/ReturnOrder/AddReturnOrder'
  return axios({
    method: 'post',
    url: url,
    data: params,
    loading: true
  }).then((res) => {
    return Promise.resolve(res.data)
  }).catch((res) => {
    return Promise.reject(res.data)
  });
}

//获取常购清单
export function getAlwaysBuyList() {
  const url = '/UserProduct/ListAlwaysBuyProduct'
  return axios({
    method: 'post',
    url: url,
    data: {},
    loading: true
  }).then((res) => {
    return Promise.resolve(res.data)
  }).catch((res) => {
    return Promise.reject(res.data)
  });
}

//获取实名认证信息
export function getUserAuthenDetail() {
  const url = '/UserAuthen/GetUserAuthenDetail'
  return axios({
    method: 'post',
    url: url,
    data: {},
    loading: true
  }).then((res) => {
    return Promise.resolve(res.data)
  }).catch((res) => {
    return Promise.reject(res.data)
  });
}

//领取订单优惠券
export function ReceiveOrderCoupon(params) {
  const url = '/CouponReceive/ReceiveOrderCoupon'
  return axios({
    method: 'post',
    url: url,
    data: params,
    loading: true
  }).then((res) => {
    return Promise.resolve(res.data)
  }).catch((res) => {
    return Promise.reject(res.data)
  });
}