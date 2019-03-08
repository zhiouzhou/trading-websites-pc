import axios from 'axios'
const IS_PROD = ['production', 'prod'].includes(process.env.NODE_ENV);

//获取投诉建议列表
export function getComplainList(params) {
	const url = '/Complaint/ListWebComplaint'
	return axios({
		method: 'post',
		url: url,
		data: params,
		loading: true
	}).then((res) => {
		return Promise.resolve(res.data)
	}).catch(function(error) {

	});
}

//评价投诉建议
export function evaluateComplain(params) {
	const url = '/Complaint/Evaluate'
	return axios({
		method: 'post',
		url: url,
		data: {
			data: params
		}
	}).then((res) => {
		return Promise.resolve(res.data)
	}).catch(function(error) {

	});
}

//新增投诉建议
export function addEvaluateComplain(params) {
	const url = '/Complaint/Insert'
	return axios({
		method: 'post',
		url: url,
		data: params
	}).then((res) => {
		return Promise.resolve(res.data)
	}).catch(function(error) {

	});
}
//获取可投诉订单列表
export function getComplainOrders(params) {
	const url = '/Order/ListComplaintOrder'
	return axios({
		method: 'post',
		url: url,
		data: params,
		loading: true
	}).then((res) => {
		return Promise.resolve(res.data)
	}).catch(function(error) {

	});
}
//获取投诉建议详情
export function getComplainOrdersDetail(params) {
	const url = '/Complaint/Detail'
	return axios({
		method: 'post',
		url: url,
		data: params
	}).then((res) => {
		return Promise.resolve(res.data)
	}).catch(function(error) {

	});
}
//获取文件上传权限
export function getAuthorization(params) {
	const url = '/File/Authorization'
	return axios({
		method: 'post',
		url: url,
		data: params
	}).then((res) => {
		return Promise.resolve(res.data)
	}).catch(function(error) {

	});
}
//上传文件
export function upLoadImg(options) {
	let file = options.file
	this.createAjax = function(argument) {
		var xmlhttp = {};
		if(window.XMLHttpRequest) {
			xmlhttp = new XMLHttpRequest();
		} else {
			xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
		}

		// 发送二进制数据
		if(!XMLHttpRequest.prototype.sendAsBinary) {
			XMLHttpRequest.prototype.sendAsBinary = function(datastr) {
				function byteValue(x) {
					return x.charCodeAt(0) & 0xff;
				}
				var ords = Array.prototype.map.call(datastr, byteValue);
				var ui8a = new Uint8Array(ords);
				this.send(ui8a.buffer);
			}
		}

		return xmlhttp;
	};
	var ajax = this.createAjax();
    var url = "ufileUpload/"+options.folderName + '/' + options.fileName;
	if(!IS_PROD){
		url = options.folderName + '/' + options.fileName;
	}

	ajax.open('PUT', url, true);
	ajax.setRequestHeader("Content-MD5", options.contentMd5);
	ajax.setRequestHeader("Authorization", options.authorization);
	ajax.setRequestHeader("Content-Type", file.type);
	ajax.send(file);

}

//获取客户投诉类型
export function getListComplaintType() {
	const url = '/Complaint/ListComplaintType'
	return axios({
		method: 'post',
		url: url
	}).then((res) => {
		return Promise.resolve(res.data)
	}).catch(function(error) {

	});
}