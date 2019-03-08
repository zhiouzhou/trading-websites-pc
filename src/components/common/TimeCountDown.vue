<template>
  <span v-html="time" class="time"></span>
</template>

<script>
  import * as $cache  from "common/cache";
  export default{
    data () {
      return {
        time : '',
        flag : false,
        currentTime: ''
      }

    },
    mounted () {
      this.currentTime = $cache.getCache("serviceTime") ? new Date().getTime($cache.getCache("serviceTime")) : new Date().getTime()
      this.timer = setInterval(()=>{
        if(this.flag == true){
          clearInterval(this.timer)
        }
        this.setServerTime()
        this.timeDown()
      },1000)
    },
    beforeDestory(){
      clearInterval(this.timer)
    },
    props : {
      endTime : [String, Number],
      startTime : [String, Number],
      timeTitle : {
        type: String,
        default: `距结束`
      },
      timeStyle : {
        type: String,
        default: ''
      },
    },
    methods : {
      //服务器时间加一秒
      setServerTime() {
        let serverTime = this.currentTime
        this.currentTime = serverTime+1000 || new Date().getTime()
      },
      timeDown () {
        let startTime = new Date(this.startTime)
        let endTime = new Date(this.endTime)
        let nowTime = new Date(this.currentTime)
        let timeClass = ``
        if(this.timeStyle){
          switch (this.timeStyle){
            case "0":
              timeClass = `time-count-style0`
              break;
            case "1":
              timeClass = `time-count-style1`
              break;
            case "2":
              timeClass = `time-count-style2`
              break;
            default:
          }
        }
        let leftTime = this.startTime > nowTime.getTime() ? parseInt((startTime.getTime()-nowTime.getTime())/1000) : parseInt((endTime.getTime()-nowTime.getTime())/1000)
        let d = this.formate(parseInt(leftTime/(24*60*60)))
        let h = this.formate(parseInt(leftTime/(60*60)%24))
        let m = this.formate(parseInt(leftTime/60%60))
        let s = this.formate(parseInt(leftTime%60))
        if(leftTime <= 0){
          this.flag = true
          this.time = `<span class="${timeClass}">00</span>天
                      <span class="${timeClass}">00</span>:
                      <span class="${timeClass}">00</span>:
                      <span class="${timeClass}">00</span>`
          this.$emit('time-end','已结束')
        }else{
          if(d&&d !== "00"){
            this.time = `<span class="${timeClass}">${d}</span> 天
                      <span class="${timeClass}">${h}</span> :
                      <span class="${timeClass}">${m}</span> :
                      <span class="${timeClass}">${s}</span>`
          }else{
            this.time = `<span class="${timeClass}">${h}</span> :
                      <span class="${timeClass}">${m}</span> :
                      <span class="${timeClass}">${s}</span>`
          }

        }
      },
      formate (time) {
        if(time>=10){
          return time
        }else{
          return `0${time}`
        }
      }
    }
  }
</script>

<style lang="stylus" scoped>



</style>
