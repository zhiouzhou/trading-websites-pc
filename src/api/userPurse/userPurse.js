import axios from 'axios'

//获取用户优惠券列表
export function getCouponList(params) {
  const url = '/Coupon/ListUserCoupon'
  return axios({
    method: 'post',
    url: url,
    data: params
  }).then((res) => {
    return Promise.resolve(res.data)
  }).catch(function (error) {

  });
}

