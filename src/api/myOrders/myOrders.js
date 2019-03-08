import axios from 'axios'
//获取我的订单列表
export function getOrderList(params) {
    const url = '/Order/QueryOrders'
    return axios({
      method: 'post',
      url: url,
      data: params,
      loading:true
    }).then((res) => {
      return Promise.resolve(res.data)
    }).catch(function (error) {
  
    });
  }
//获取我的订单详情
export function getOrderDetail(params) {
    const url = '/Order/GetOrderDetail'
    return axios({
      method: 'post',
      url: url,
      data: params,
      loading:true
    }).then((res) => {
      return Promise.resolve(res.data)
    }).catch(function (error) {
  
    });
  }
//订单评价
export function orderEvaluate(params) {
    const url = '/Evaluation/Add'
    return axios({
      method: 'post',
      url: url,
      data: params,
      transformRequest: [function (params) {
        // Do whatever you want to transform the data
        let ret = ''
        for (let it in params) {
          ret += encodeURIComponent(it) + '=' + encodeURIComponent(params[it]) + '&'
        }
        return ret
      }],
      headers:{
        'Content-Type':'application/x-www-form-urlencoded'
      }
    }).then((res) => {
      return Promise.resolve(res.data)
    }).catch(function (error) {
  
    });
  }
//删除订单
export function DeleteOrder(params) {
    const url = '/Order/DeleteOrder'
    return axios({
      method: 'post',
      url: url,
      data: params
    }).then((res) => {
      return Promise.resolve(res.data)
    }).catch(function (error) {
  
    });
  }
//取消订单
export function CancelOrder(params) {
    const url = '/Order/CancelOrder'
    return axios({
      method: 'post',
      url: url,
      data: params
    }).then((res) => {
      return Promise.resolve(res.data)
    }).catch(function (error) {
  
    });
  }
//追踪订单
export function GeOrderTraceList(params) {
    const url = '/Order/GeOrderTraceList'
    return axios({
      method: 'post',
      url: url,
      data: params
    }).then((res) => {
      return Promise.resolve(res.data)
    }).catch(function (error) {
  
    });
  }
//订单确认收货
export function ConfirmDelivery(params) {
    const url = '/OrderHandler/ConfirmDelivery'
    return axios({
      method: 'post',
      url: url,
      data: params
    }).then((res) => {
      return Promise.resolve(res.data)
    }).catch(function (error) {
  
    });
  }
//再次购买
export function BugAgainGoods(params) {
    const url = '/Order/ListOrderProduct'
    return axios({
      method: 'post',
      url: url,
      data: params,
      loading:true
    }).then((res) => {
      return Promise.resolve(res.data)
    }).catch(function (error) {
  
    });
  }