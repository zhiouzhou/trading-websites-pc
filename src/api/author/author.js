import axios from 'axios'

//正则检验手机号
export function checkMobile(phoneNumber) {
    const regExp = new RegExp(/^0?1[3|4|5|6|8|7|9][0-9]\d{8}$/);
    let msg = "",
        result = true;
    if (!phoneNumber) {
        msg = "手机号不能为空！";
        result = false;
    } else if (!regExp.test(phoneNumber)) {
        msg = "手机号格式不正确！";
        result = false;
    }
    return { msg, result }
}

//账号是否已存在 mall
//@params {params} string  手机号码
export function isUserExist(params) {

    const url = '/User/AccountIsExist'
    return axios({
        url,
        method: 'post',
        data: {
            data: params,
        },
        noRequireToken: true
    }).then(res => {
        return Promise.resolve(res.data)
    }).catch(res => {
        return Promise.reject(res.data)
    })
}
//发送短信 ua
//@params {params} string  手机号码
export function SendMessage(params) {

    const url = 'ua/code/identifyingCode'
    return axios({
        url,
        method: 'post',
        data: {
            mobileNo: params,
        }
    }).then(res => {
        return Promise.resolve(res.data)
    }).catch(res => {
        return Promise.reject(res.data)
    })
}
//登录 ua
export function Login(params, type) {
    // type : true 密码登录  false ：验证码登录
    let url = '';
    let deviceId = localStorage.getItem("deviceId")
    if (!deviceId||deviceId=='undefined'||deviceId=='null') {
        deviceId = (new Date()).getTime()
        localStorage.setItem("deviceId", deviceId)
    }
    //安全验证
    let paramsData = {
        appCode: 'ShoppingMallPC',
        appVersion: '4',
        deviceId: deviceId,
        deviceType: 3,
        mobileNo: params.username,
        password: params.password,
    }
    if (type && !params.defaultWithCodeLogin) {
        url = 'ua/user/login'
    } else {
        paramsData.code = params.code
        paramsData.identifyingCodeId = params.identifyingCodeId
        url = 'ua/user/loginByCode'
    }
    return axios({
        url,
        method: 'post',
        data: paramsData,
        noRequireToken: true,
        headers: {
            "Security-Token": localStorage.getItem("securityToken") || '',
            "Device-Series": deviceId
        }
    }).then(res => {
        return Promise.resolve(res.data)
    }).catch(res => {
        return Promise.reject(res.data)
    })
}

//退出登录 ua/user/logout
export function loginOut() {
    return axios({
        url: 'ua/user/logout',
        method: 'post',
        data: {

        }
    }).then(res => {
        return Promise.resolve(res.data)
    }).catch(res => {
        return Promise.reject(res.data)
    })
}


//个人信息
//@params {params} object  设备信息  {deviceId :''}
export function GetUserDetail() {

    return axios({
        url: '/UserInfo/GetUserDetail',
        method: 'post',
        data: {
            data: {
                deviceId: localStorage.getItem('deviceId') || ''
            },
        }
    }).then(res => {
        return Promise.resolve(res.data)
    }).catch(res => {
        return Promise.reject(res.data)
    })
}

//APP配置信息
//@params {}
export function GetAppSetting() {

  return axios({
    url: '/Setting/GetAppSetting',
    method: 'post',
    data: {}
  }).then(res => {
    return Promise.resolve(res.data)
  }).catch(res => {
    return Promise.reject(res.data)
  })
}

//注册
export function Register(params) {
    const url = '/User/Register'
    return axios({
        method: 'post',
        url: url,
        data: {
            data: params
        },
        noRequireToken: true
    }).then((res) => {
        return Promise.resolve(res.data)
    }).catch(res => {
        return Promise.reject(res.data)
    })
}
//校验验证码
export function checkValidate(params) {
    const url = '/Validatecode/Validate'
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
    })
}

//忘记密码
export function resetPassword(params) {
    const url = '/User/ForgetPassword'
    return axios({
        method: 'post',
        url: url,
        data: {
            data: params
        },
        noRequireToken: true
    }).then((res) => {
        return Promise.resolve(res.data)
    }).catch(res => {
        return Promise.reject(res.data)
    })
}

//获取验证码
export function getCode(mobileNo) {
    const url = 'ua/code/identifyingCode'
    return axios({
        method: 'post',
        url: url,
        data: {
            mobileNo
        }
    }).then((res) => {
        return Promise.resolve(res.data)
    }).catch(res => {
        return Promise.reject(res.data)
    })
}


//获取城市列表
export function getCityList(params) {
    const url = '/City/ListCity'
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
    })
}

//获取街道列表
export function getStreetList(params) {
    const url = '/City/ListStreet'
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
    })
}

//实名认证信息
export function userAuthen(params) {
  const url = '/UserAuthen/AddUserAuthen'
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
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  }).then((res) => {
    return Promise.resolve(res.data)
  }).catch(function (error) {

  });
}

//获取可选店铺类型列表
export function getShopType() {
    const url = '/UserInfo/ListUserPriceClass'
    return axios({
        method: 'post',
        url: url,
        data: {
        },
        noRequireToken: true
    }).then((res) => {
        return Promise.resolve(res.data)
    }).catch(res => {
        return Promise.reject(res.data)
    })
}

//获取收货地址列表
export function getAddressList(params) {
  const url = '/Address/List'
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
//签到动作  {params}  string 	活动 Id 
export function SignIn(params) {
    const url = '/SignIn/SignIn'
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
    })
  }
//获取用户签到详情   
export function UserSignInDetail() {
    const url = '/SignIn/UserSignInDetail'
    return axios({
      method: 'post',
      url: url,
      data: {},
      loading: true,
    }).then((res) => {
      return Promise.resolve(res.data)
    }).catch(res => {
      return Promise.reject(res.data)
    })
  }
//签到
export function getSignSetting() {
    const url = '/SignIn/GetSignInDetail'
    return axios({
      method: 'post',
      url: url,
      data: {}
    }).then((res) => {
      return Promise.resolve(res.data)
    }).catch(res => {
      return Promise.reject(res.data)
    })
  }