import * as $cache  from "./cache"

/**
 * 比较两个日期的大小，前者大于则返回true，否则为false
 */
function compareDate(d1, d2) {
  if(String(d1).indexOf(`-`)>=0){
    d1 = (new Date(d1.replace(/-/g, "\/"))).getTime()
  }
  if(String(d2).indexOf(`-`)>=0){
    d2 = (new Date(d2.replace(/-/g, "\/"))).getTime()
  }
  return d1 > d2
}

/**
 * 比较两个时间的年月日大小，前者大于等于则返回true，否则为false
 */
function compareDayDate(d1, d2) {
  return d1 && d2 && (new Date(d1.replace(/-/g, "\/"))).getTime() >= (new Date(d2.replace(/-/g, "\/"))).getTime();
}

/**
 * 活动倒计时显示(3天内才显示)
 */
function showTimeCount(endTime,currentTime) {
  return endTime-currentTime <= 86400000*3 && endTime>currentTime
}

/**
 * 获取活动的时间提示
 */
function getActivityTimeNotice(beginDate, endDate, timeNoticeNone, state = 2) {
  if (!beginDate || !endDate || timeNoticeNone) {
    return ``
  }
  //活动状态
  const timeNow = $cache.getCache("serviceTime")
  const hasBegan = compareDate(timeNow, beginDate)
  const hasEnd = compareDate(timeNow, endDate)
  return state == 0 ? `活动待发布` : state == 1 ? `活动待审核` : state == 3 ? `活动已下架` : state == 4 ? `活动审核不通过` : hasEnd ? `活动已结束` : hasBegan ? `活动将于${endDate}结束` : `活动未开始`
}
/**
 * 时间戳转日期
 */
function getDateStr(timestamp, precision = `day`) {
  if (!timestamp) {
    return ``
  }
  //如果已经是日期格式了不需要转换
  if (timestamp && timestamp.toString().indexOf('-') > -1) {
    return timestamp
  }
  const date = new Date(timestamp)
  const Y = date.getFullYear() + '-';
  const M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
  const D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ' ';
  const h = date.getHours() + ':';
  const m = date.getMinutes() + ':';
  const s = date.getSeconds();
  return Y + M + D
}
//获取时间戳倒计时
function getTimestampCountDownArr(timestamp) {
  if (!timestamp) {
    return ``
  }
  let nowTime = new Date().getTime()
  let endTime = timestamp
  //当前时间超过起始时间
  if (nowTime > endTime) {
    return ``
  } else {
    let diffTimeSec = (endTime - nowTime) / 1000
    let day = parseInt(diffTimeSec / (60 * 60 * 24))
    let hour = parseInt((diffTimeSec - day * 24 * 60 * 60) / (60 * 60))
    let min = parseInt((diffTimeSec - day * 24 * 60 * 60 - hour * 60 * 60) / 60)
    let sec = parseInt(diffTimeSec % 60)
    if (day<10) {
      day = `0` + day
    }
    if (hour < 10) {
      hour = `0` + hour
    }
    if (min < 10) {
      min = `0` + min
    }
    if (sec < 10) {
      sec = `0` + sec
    }
    return [day, hour, min, sec]
  }
}
//获取在线支付倒计时字符串
function getOnlinePayCountDownStr(createTime) {
  let nowTime = new Date().getTime()
  let startTime = new Date(createTime.replace(/-/g, "\/")).getTime()
  //当前时间小于起始时间或者超过起始时间45分钟
  if (nowTime < startTime || (nowTime - startTime) > (45 * 60 * 1000)) {
    return ``
  } else {
    let diffTimeSec = (startTime + 45 * 60 * 1000 - nowTime) / 1000
    let min = parseInt(diffTimeSec / 60)
    let sec = parseInt(diffTimeSec % 60)
    return `${min}分${sec}秒`
  }
}
//获取在线支付倒计时字符串
function getOnlinePayCountDownMinuteStr(createTime) {
  let nowTime = new Date().getTime()
  let startTime = new Date(createTime.replace(/-/g, "\/")).getTime()
  //当前时间小于起始时间或者超过起始时间45分钟
  if (nowTime < startTime || (nowTime - startTime) > (45 * 60 * 1000)) {
    return ``
  } else {
    let diffTimeSec = (startTime + 45 * 60 * 1000 - nowTime) / 1000
    let min = parseInt(diffTimeSec / 60)
    return `${min}分钟`
  }
}

export {
  compareDate,
  compareDayDate,
  getActivityTimeNotice,
  getDateStr,
  getTimestampCountDownArr,
  getOnlinePayCountDownStr,
  getOnlinePayCountDownMinuteStr,
  showTimeCount
}

