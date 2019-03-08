import axios from 'axios'
//获取退货管理列表
export function GetGoodsManageList(params) {
    const url = '/ReturnOrder/QueryReturnOrders'
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
//获取退货详情
export function GetReturnGoodsDetail(params) {
    const url = '/ReturnOrder/GetReturnOrderDetail'
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
//删除退货订单
export function DeleteReturnOrder(params) {
    const url = '/ReturnOrder/DeleteOrder'
    return axios({
      method: 'post',
      url: url,
      data: params
    }).then((res) => {
      return Promise.resolve(res.data)
    }).catch(function (error) {
  
    });
  }
//取消退货订单
export function CancelReturnOrder(params) {
    const url = '/ReturnOrder/CancelReturnOrder'
    return axios({
      method: 'post',
      url: url,
      data: params
    }).then((res) => {
      return Promise.resolve(res.data)
    }).catch(function (error) {
  
    });
  }

//获取退货单流转信息
export function ReturnGeOrderTraceList(params) {
  const url = '/ReturnOrder/GeOrderTraceList'
  return axios({
    method: 'post',
    url: url,
    data: params
  }).then((res) => {
    return Promise.resolve(res.data)
  }).catch(function (error) {

  });
}