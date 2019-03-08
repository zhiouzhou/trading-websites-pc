import Vue from 'vue'

import {Base64} from 'common/base64'
import { createTalkingData,submitTalkingData } from 'common/functionUtils'

Vue.filter('price', function (val, unit) {
	const userState = localStorage.getItem('userState') || 1
	const token = localStorage.getItem('TOKEN')
	if (!val && !token) {
		//return `<span class="fz14">登录后可查看价格</span>`
		return `<span class="fz18"> <em class="fz14">&yen;</em>? <span class="fz12">/${unit}</span> </span>`
	}
	if (!val && userState == 0) {
		// return `<span class="fz14">审核通过后可查看价格</span>`
		return `<span class="fz18"> <em class="fz14">&yen;</em>? <span class="fz12">/${unit}</span> </span>`
	}
	let value = '0.00';
	if (val) {
		value = val.toFixed(2);
	}
	let nums = value.split('.');
	return `<span class="fz18"><em class="fz14">&yen;</em>${nums[0]}<span><i class="fz14">.${nums[1]}<span class="fz12">/${unit}</span></i></span></span>`
})

Vue.filter('dealerPrice', function (product) {
  let val = product.price
  let unit = product.priceunit
  let intervalPrice = product.intervalPrice //经销商区间价格
  const userState = localStorage.getItem('userState') || 1
  const token = localStorage.getItem('TOKEN')
  if (!val && !token) {
    //return `<span class="fz14">登录后可查看价格</span>`
    return `<span class="fz18"> <em class="fz14">&yen;</em>? <span class="fz12">/${unit}</span> </span>`
  }
  if (!val && userState == 0) {
    // return `<span class="fz14">审核通过后可查看价格</span>`
    return `<span class="fz18"> <em class="fz14">&yen;</em>? <span class="fz12">/${unit}</span> </span>`
  }
  if(val){
    let value = '0.00';
    if (val) {
      value = val.toFixed(2);
    }
    let nums = value.split('.');
    return `<span class="fz18"><em class="fz14">&yen;</em>${nums[0]}<span><i class="fz14">.${nums[1]}<span class="fz12">/${unit}</span></i></span></span>`
  }else if(!val&&intervalPrice){
    let intervals = intervalPrice.split('~')
    let htmlView = ``
    let reg = /(\d{1,3})+(?:\.\d+)?/g
    for(let i in intervals){
      let arr = intervals[i].match(reg);
      intervals[i] = Number(arr[0])
      let value = '0.00'
      if (intervals[i]) {
        value = intervals[i].toFixed(2)
      }
      let nums = value.split('.')
      htmlView += `<span class="fz18"><em class="fz14">&yen;</em>${nums[0]}<span><i class="fz14">.${nums[1]}</i></span>${i==0?`~`:``}</span>`
    }
    htmlView += `<span class="fz12">/${unit}</span>`
    return htmlView
  }
})

Vue.filter('kucun', function (product) {

	if (product.saleMode === 2) {
		return ''
	}
	if (isNaN(product.stockState)) {
		return product.stockState;
	}
	var count = product.storeCount;
	var dw = product.storeUnit;
	var preparecount = product.presaleStoreCount;
	if (product.stockState === 2) {
		if (count <= 0) {
			return "已抢光";
		} else {
			return "仅剩" + count + dw;
		}
	} else if (product.stockState === 3) {
		return "已抢光";
	} else if (product.stockState === 4) {
		return "预售" + preparecount + dw;
	}

});

/**
 * 在String类型原型中添加日期转换方法
*/
String.prototype.toDate = function () {
	if (!this) {
		return new Date();
	}
	var tempStrs = this.split(" ");
	var dateStrs = tempStrs[0].split("-");
	var year = parseInt(dateStrs[0], 10);
	var month = parseInt(dateStrs[1], 10) - 1;
	var day = parseInt(dateStrs[2], 10);
	var timeStrs = tempStrs[1].split(":");
	var hour = parseInt(timeStrs[0], 10);
	var minute = parseInt(timeStrs[1], 10) - 1;
	var second = parseInt(timeStrs[2], 10);
	return new Date(year, month, day, hour, minute, second);
};
/*
 * 将日期格式化
 * format：'yyyy-MM-dd h:m:s'
 */
Date.prototype.format = function (format) {
	var date = {
		"M+": this.getMonth() + 1,
		"d+": this.getDate(),
		"h+": this.getHours(),
		"m+": this.getMinutes(),
		"s+": this.getSeconds(),
		"q+": Math.floor((this.getMonth() + 3) / 3),
		"S+": this.getMilliseconds()
	};
	if (/(y+)/i.test(format)) {
		format = format.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length));
	}
	for (var k in date) {
		if (new RegExp("(" + k + ")").test(format)) {
			format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? date[k] : ("00" + date[k]).substr(("" + date[k]).length));
		}
	}
	return format;
}

Vue.filter('priceToFixed', function (val) {
	let value = '0.00';
	if (val && !isNaN(val)) {
		value = val.toFixed(2);
	} else {
		value = val
	}
	return value
})

Vue.filter('reduceTags', function (val) {
	//红包
	let bouns = val.isUseBonus ? `<span class="fz10">可用红包</span>` : `<span class="fz10">不可用红包</span>`
	let coupon = val.isUseCoupon ? `<span class="fz10">可用优惠券</span>` : `<span class="fz10">不可用优惠券</span>`
	return bouns + coupon
})

/*
  @ param {params} object  {path: '/login'}
*/
Vue.prototype.openNewWindow = function (params) {
	const { href } = this.$router.resolve(params)
	window.open(href, '_blank')
}

Vue.prototype.$createTalkingData = function(){
	if(!this.isVisitor){
		try {
		   createTalkingData.call(null, ...arguments);
		} catch (error) {
		   console.log(error)
		}
	}
};
Vue.prototype.$submitTalkingData = function(){
	if(!this.isVisitor){
		submitTalkingData.call(null, ...arguments);
	}
}

Vue.prototype.encodeUrlQuery = function(Q){
	for(let property in Q){
		Q[property] = Base64.encode(Q[property]) // 编码
	}
	return Q;
};

Vue.prototype.decodeUrlQuery = function(Q,key){
  //判断url 是否需要 decodeUrlQuery
  const reg = new RegExp(/^[0-9]*$/);
  if(reg.test(Q.activityId)||reg.test(Q.skuId) || reg.test(Q[key])){
    return Q;
  }
	for(let property in Q){
		Q[property] = Base64.decode(Q[property]) //解码
	}
	return Q;
};


//跳转到产品详情
Vue.prototype.skipToProductDetail = function(){

};
