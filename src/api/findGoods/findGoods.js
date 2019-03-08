import axios from 'axios'

//获取帮我找货列表
export function FindGoodsList(params) {
  const url = '/FindGoods/List'
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

//获取帮我找货详情
export function FindGoodsListDetail(params) {
  const url = '/FindGoods/Detail'
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
//获取新增找货表单
export function AddFindGoods(params) {
  const url = '/FindGoods/Insert'
  return axios({
    method: 'post',
    url: url,
    data: {data: params}
  }).then((res) => {
    return Promise.resolve(res.data)
  }).catch(function (error) {

  });
}

