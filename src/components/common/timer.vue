<template>
  <span v-html="vNode" class="time"></span>
</template>

<script>
function parseData(dataStr) {
  if (!dataStr) {
    return new Date();
  }
  var tempStrs = dataStr.split(" ");
  var dateStrs = tempStrs[0].split("-");
  var year = parseInt(dateStrs[0], 10);
  var month = parseInt(dateStrs[1], 10) - 1;
  var day = parseInt(dateStrs[2], 10);
  var timeStrs = tempStrs[1].split(":");
  var hour = parseInt(timeStrs[0], 10);
  var minute = parseInt(timeStrs[1], 10);
  var second = parseInt(timeStrs[2], 10);
  return new Date(year, month, day, hour, minute, second);
  //Tue Jan 08 2019 19:52:49 GMT+0800 (中国标准时间)
}
function formatTimestamp(dataStr) {
  return parseData(dataStr).getTime();
}
import * as $cache from "common/cache";
export default {
  data() {
    return {
      vNode: "",
      currentTimestamp: "" //时间戳
    };
  },
  props: {
    endTime: [String, Number],
    startTime: [String, Number]
  },
  mounted() {
    const serviceTime = $cache.getCache('serviceTime')
    this.currentTimestamp = formatTimestamp(serviceTime);
    this.timer = setInterval(() => {
      this.setServerTime();
      this.refresh();
    }, 1000);
  },
  beforeDestory() {
    clearInterval(this.timer);
  },
  methods: {
    //服务器时间加一秒
    setServerTime() {
      this.currentTimestamp += 1000;
    },
    //生成倒计时剩余时间 , state 活动状态
    caculateTime(time, nowTime, state) {
      //时间戳
      var leftTime = time - nowTime,
        seconds = Math.floor(leftTime / 1000),
        minutes = Math.floor(seconds / 60),
        hours = Math.floor(minutes / 60),
        day = Math.floor(hours / 24);
      var cDay = day,
        cHour = hours % 24,
        cMinute = minutes % 60,
        cSecond = seconds % 60;

      cDay = cDay > 9 ? cDay : "0" + cDay;
      cHour = cHour > 9 ? cHour : "0" + cHour;
      cMinute = cMinute > 9 ? cMinute : "0" + cMinute;
      cSecond = cSecond > 9 ? cSecond : "0" + cSecond;

      var cDayText = day > 0 ? (cDayText = cDay + " 天 ") : "";
      var text = cDayText + cHour + " : " + cMinute + " : " + cSecond;
      var prefix = "";
      state ? (prefix = "距活动结束") : (prefix = "距活动开始");
      this.vNode = "<div class=' '>" + prefix + " " + text + "</div>";
    },
    refresh() {
      var startTime = formatTimestamp(this.startTime);
      var endTime = formatTimestamp(this.endTime);
      var nowTime = this.currentTimestamp;
      if (startTime > nowTime) {
        this.caculateTime(startTime, nowTime, false);
      } else if (endTime <= nowTime) {
        this.vNode = "活动已经结束";
        clearInterval(this.timer);
      } else {
        this.caculateTime(endTime, nowTime, true);
      }
    }
  }
};
</script>

<style lang="stylus" scoped>
</style>
