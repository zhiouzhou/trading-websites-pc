import axios from 'axios'
//获取价格举报列表
export function getPriceComplaintList(params) {
  const url = '/PriceComplaint/QueryList'
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

//新增价格举报
export function addPriceReport(params) {
  const url = '/PriceComplaint/AddComplaint'
  return axios({
    method: 'post',
    url: url,
    data: {data: params},
    loading:true
  }).then((res) => {
    return Promise.resolve(res.data)
  }).catch(function (error) {

  });
}