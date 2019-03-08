import axios from 'axios'
import Vue from 'vue'
import * as $cache from "common/cache";
import storage from "common/storage";
import router from '../router/index'
const IS_PROD = ['production', 'prod'].includes(process.env.NODE_ENV);

let loadingInstance = null;
axios.interceptors.request.use(function (config) {

	const userstate = storage.get("USERSTATE", 1);
	let currentSelectCityId = storage.get("CITY_ID", '');
	const nativeCityId = storage.get("NATIVE_CITY_ID", '');

	const token = storage.get('TOKEN', '');
	const addressId = storage.get('defaultAddressId', '');
	if (!currentSelectCityId && !token) {
		currentSelectCityId = '402';
		storage.set("CITY_ID", '402');
		storage.set("CITY_NAME", '南京市');
	}

	if (token) {
		config.headers.token = token
	} else {
		config.data.cityId = currentSelectCityId
		config.data.userClassId = 1
		config.data.userDisplayClass = 0
	}
	//有些接口不需要token,有token会报异常
	if (config.noRequireToken) {
		config.headers.token = ''
	}
	//所有的属性如果不包含地址id，直接设置默认地址
	if (config.data && !config.data.addressId) {
		config.data.addressId = addressId
	}
	//web商城
	if (config.data) {
		config.data.deviceType = 3
	}
	//TODO:加载中的转圈
	if (config.loading) {
		loadingInstance = Vue.prototype.$loading({
			// lock: true,
			text: '加载中',
			spinner: '',//自定义加载图标类名
			background: 'rgba(255, 255, 255, 0)',
			customClass: ''//	Loading 的自定义类名
		});
	}
	//form提交的方式
	if (config.isForm) {
		config.headers['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
		config.transformRequest = [function (obj) {
			var str = [];
			for (var p in obj) {
				if (obj.hasOwnProperty(p)) {
					str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
				}
			}
			return str.join("&");
		}];
	}
	//开发环境还是生产环境，生产环境通过nginx代理
	if (IS_PROD) {
		if (config.url && config.url.startsWith('ua')) {
			config.url = config.url
			config.url = "/" + config.url.replace("ua/", "himalaya-ApiService-UA2/")
		} else {
			config.url = "/v31" + config.url
		}
	}
	return config;
}, function (error) {
	return Promise.reject(error);
});


axios.interceptors.response.use(function (response) {
	if (response.config.loading) {
		loadingInstance && loadingInstance.close()
	}
	if (response.data && (response.data.message === '100102009'
		|| response.data.desc == '登录已过期，请重新登录~')) {
		Vue.prototype.$message('登录已过期，请重新登录')
		storage.remove('TOKEN');
		router.replace({
			path: "/login", query: {
				auto: true
			}
		});
	}
	$cache.setCache("serviceTime", response.data.serviceTime)
	return response;
}, function (error) {
	if (error.config.loading) {
		loadingInstance && loadingInstance.close()
	}
	return Promise.reject(error);
});
