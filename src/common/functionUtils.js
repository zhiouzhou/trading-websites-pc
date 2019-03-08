import storage from "common/storage";
import axios from 'axios'
const IS_PROD = ['production', 'prod'].includes(process.env.NODE_ENV);

//构造埋点请求头信息
var HeadRuntimeMoudle = (function () {
	let instance = null;
	let userInfo = null;
	function init() {
		//设备id
		let deviceID = localStorage.getItem("deviceId")
		//操作系统版本
		let osVer = getClientOs();
		//浏览器类型
		let browserType = getBrowse();
		instance = {
			"meta": {
				"applicationId": "YJP-TR-PC001" //运行酒批应用的一个应用ID
			},
			"runtime": {
				"appType": "web", //iOS,android,web
				"appVer": "4.0.0", //客户端版本号
				"os": osVer, //操作系统
				"osVer": osVer, //操作系统版本
				"deviceID": deviceID, //设备唯一ID
				"browserType": browserType //浏览器类型
			}
		}
		return instance;

	}
	function initUserInfoPrivate() {
		const sessionID = localStorage.getItem("sessionID") || (new Date()).getTime();
		localStorage.setItem("sessionID", sessionID);
		let cityID = localStorage.getItem("CITY_ID") || 0;
		cityID = parseInt(cityID)
		const userDetail = storage.get('USER_DETAIL', {});
		const userId = userDetail.userId || (new Date()).getTime();
		userInfo = {
			sessionID, cityID, userId
		}
		return userInfo;
	}
	return {
		initInstance: function () {
			if (!instance) {
				init()
			}
			return instance;
		},
		initUserInfo: function () {
			if (!userInfo) {
				initUserInfoPrivate()
			}
			return userInfo;
		}
	}
})();

//获取上传文件密钥，上传文件
function getAuthorizationThenUpload(md5File, file) {
	let name = md5File + ".json"
	let params = {
		contentMd5: md5File,
		contentType: file.type,
		key: name,
		date: '',
		putPolicy: '',
		method: 'PUT',
		fileType: 1
	}

	const url = '/authTalkingData/getAuth'
	return axios({
		method: 'post',
		url: url,
		data: params
	}).then((res) => {
		if (res.data.success) {
			res.data.data.contentMd5 = md5File
			res.data.data.file = file
			//上传文件
			upLoadImg(res.data.data)
		}
	}).catch(function(error) {

	});
}

function upLoadImg(options) {
	let file = options.file
	let createAjax = function(argument) {
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
	let ajax = createAjax();
	//回调推送数据到BI
	let callBackFile = function(){
		if (ajax.readyState==4){
		  if (ajax.status==200){
			localStorage.setItem("sessionID", (new Date()).getTime());
		  	let url = options.fileUrl
		  	let geturl = options.callback+'/uploaded?filename=' + url + '&appcode=ShoppingMallWeChat&apptype=mall&appversion=4.0.0'
		  	let xmlhttp = createAjax();
		  	xmlhttp.open('GET', geturl, true);
		  	xmlhttp.send();
		  }
		}
	}
	
    var url = "/ufileUploadTalkingData/"+options.folderName + '/' + options.fileName;
	if(!IS_PROD){
		url = options.folderName + '/' + options.fileName;
	}
	ajax.open('PUT', url, true);
	ajax.setRequestHeader("Content-MD5", options.contentMd5);
	ajax.setRequestHeader("Authorization", options.authorization);
	ajax.setRequestHeader("Content-Type", file.type);
	ajax.onreadystatechange = callBackFile;
	ajax.send(file);
	
	
}
//构建要上传的文件（大小小于1M，如果大于1M要做分片上传，这里先不处理）
function submitTalkingData() {
	//构建要上传的文件
	let content = localStorage.getItem('TalkingData');
	let file = new Blob([content], {
		type: "application/json"
	});

	let sliceSize = 1024 * 1024
	let slice = File.prototype.slice
	let fileReader = new FileReader();
	let spark = new SparkMD5.ArrayBuffer();
	let chunks = Math.ceil(file.size / sliceSize);
	let currentChunk = 0;
	// 每块文件读取完毕之后的处理
	fileReader.onload = function (e) {
		// 每块交由sparkMD5进行计算
		spark.append(e.target.result);
		let contentMd5 = spark.end();
		getAuthorizationThenUpload(contentMd5, file)
	};
	let start = currentChunk * sliceSize;
	let end = start + sliceSize >= file.size ? file.size : start + sliceSize;
	fileReader.readAsArrayBuffer(slice.call(file, start, end));
}
//构建单条talkingData数据
function createTalkingData(pageID, eventID, businessData, logType = 3, firstRequestFlag = false, lastRequestFlag = false) {
	let header = HeadRuntimeMoudle.initInstance();
	//所有业务string类型
	for (let key in businessData) {
		businessData[key] = businessData[key] + ''
	}
	let body = getBodyData(pageID, eventID, businessData, logType, firstRequestFlag, lastRequestFlag)
	let params = {
		header,
		body
	}
	let currentTalkingDatas = storage.get('TalkingData', []);
	if(currentTalkingDatas==null||currentTalkingDatas=='undefined'||currentTalkingDatas=='n'){
		currentTalkingDatas = []
	}
	currentTalkingDatas.push(params);
	storage.set('TalkingData', currentTalkingDatas);
}

//通过pageID和eventID判断是页面还是事件
function getBodyData(pageID, eventID, businessData, logType, firstRequestFlag, lastRequestFlag) {
	//会话Id
	const {sessionID, cityID, userId} = HeadRuntimeMoudle.initUserInfo();
	let bodyData = {
		"business": businessData,
		"meta": {
			"pageID": pageID, //页面ID
			"eventID": eventID //事件id
		},
		"runtime": {
			"cityID": cityID, //城市id
			"firstRequestFlag": firstRequestFlag, //该页面是否是本次会话的首次请求页面（是否着陆页）
			"lastRequestFlag": lastRequestFlag, //该页面是否是本次会话的最后请求页面（是否退出页）
			"eventTime": eventID ? new Date().getTime() + '' : '', //客户端事件发生时间
			"sessionID": sessionID+'',
			"logType": logType, //TODO:1:进入页面 2：离开页面 3: 点击事件
			"refPageID": "1000", //来源页页面ID
			"requestTime": new Date().getTime() + '', //请求时间
			"uid": userId, //酒批注册用户id
			"uuid": userId //全局唯一用户id
		}
	}
	return bodyData
}
/**获得操作系统***/
function getClientOs() {
	var sUserAgent = navigator.userAgent;
	var isWin = (navigator.platform == "Win32") || (navigator.platform == "Windows");
	var isMac = (navigator.platform == "Mac68K") || (navigator.platform == "MacPPC") || (navigator.platform == "Macintosh") || (navigator.platform == "MacIntel");
	if (isMac)
		return "Mac";
	var isUnix = (navigator.platform == "X11") && !isWin && !isMac;
	if (isUnix)
		return "Unix";
	var isLinux = (String(navigator.platform).indexOf("Linux") > -1);
	if (isLinux)
		return "Linux";
	if (isWin) {
		var isWin2K = sUserAgent.indexOf("Windows NT 5.0") > -1 || sUserAgent.indexOf("Windows 2000") > -1;
		if (isWin2K)
			return "Win2000";
		var isWinXP = sUserAgent.indexOf("Windows NT 5.1") > -1 || sUserAgent.indexOf("Windows XP") > -1;
		if (isWinXP)
			return "WinXP";
		var isWin2003 = sUserAgent.indexOf("Windows NT 5.2") > -1 || sUserAgent.indexOf("Windows 2003") > -1;
		if (isWin2003)
			return "Win2003";
		var isWinVista = sUserAgent.indexOf("Windows NT 6.0") > -1 || sUserAgent.indexOf("Windows Vista") > -1;
		if (isWinVista)
			return "WinVista";
		var isWin7 = sUserAgent.indexOf("Windows NT 6.1") > -1 || sUserAgent.indexOf("Windows 7") > -1;
		if (isWin7)
			return "Win7";
	}
	return "other";
}
/**获得浏览器***/
function getBrowse() {
	var browser = {};
	var userAgent = navigator.userAgent.toLowerCase();
	var s;
	(s = userAgent.match(/msie ([\d.]+)/)) ? browser.ie = s[1] : (s = userAgent.match(/firefox\/([\d.]+)/)) ? browser.firefox = s[1] : (s = userAgent.match(/chrome\/([\d.]+)/)) ? browser.chrome = s[1] : (s = userAgent.match(/opera.([\d.]+)/)) ? browser.opera = s[1] : (s = userAgent.match(/version\/([\d.]+).*safari/)) ? browser.safari = s[1] : 0;
	var version = "";
	if (browser.ie) {
		version = 'IE ' + browser.ie;
	} else {
		if (browser.firefox) {
			version = 'firefox ' + browser.firefox;
		} else {
			if (browser.chrome) {
				version = 'chrome ' + browser.chrome;
			} else {
				if (browser.opera) {
					version = 'opera ' + browser.opera;
				} else {
					if (browser.safari) {
						version = 'safari ' + browser.safari;
					} else {
						version = '未知浏览器';
					}
				}
			}
		}
	}
	return version;
}

export {
	submitTalkingData,
	createTalkingData
}