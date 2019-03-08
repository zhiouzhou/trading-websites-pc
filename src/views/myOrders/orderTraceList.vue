<template>
  <div class="container order-tracelist jiupi-center">
    <div class="traceHeader">
      <div>订单追踪</div>
      <span class="frt fz16 cs" @click="cancel">返回<<</span>
    </div>
    <!-- <div class="traceList-info">
      <div>支付方式:<span>{{orderTraceList.payType==0&&orderTraceList.deliveryModeValue==4?'现款现结':orderTraceList.payType==1?'微信支付':orderTraceList.payType==2?'支付宝支付':orderTraceList.payType==3?'银联支付':orderTraceList.payType==5?'连连支付':orderTraceList.payType==6?'易酒贷':orderTraceList.payType==10?'已在线支付':orderTraceList.payType==11?'线下转账':orderTraceList.payType==12?'经销商收款':'货到付款'}}</span></div>
      <div v-if="orderTraceList.logisticsCompany">&nbsp;&nbsp;&nbsp;承运人:<span>{{orderTraceList.logisticsCompany}}</span></div>
      <div>订单编号:<span>{{orderTraceList.orderNO}}</span></div>
    </div> -->
    <div class="orderTrack">
      <div class='message' v-for="(item,index) in traceItems" :key="item.traceId">
        <div class='message-left'>
          <div :class='[index==0?"stub":"stub1"]'></div>
          <img src='./../../assets/images/icon-point-red.png' class='image1' style="padding:4px 0;" v-if="index==0"/>
          <div class='icon' v-else></div>
          <div :class='[index==traceItems.length-1?"line1":"line"]'></div>
        </div>
        <div class='message-right'>
          <div :style="[index==0?'color:#e53935;font-size:28rpx;':'color:#999;font-size:28rpx;']">
            {{item.orderDescription}}
          </div>
          <div :style='[index==0?"color:#e53935;font-size:24rpx;":"color:#999;font-size:24rpx;"]'>{{item.createTime}}
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
 import * as FindService from "api/myOrders/myOrders";
 import * as returnGoodsManage from "api/returnGoodsManage/returnGoodsManage";

 export default {
   data () {
     return {
         orderTraceList:'',
         orderNO:'',
         traceItems:[],
         type: ""
     }
   },
   mounted(){
      this.orderNO=this.$route.query.No;
      this.type = this.$route.query.type;
      this.getOrderTraceList();
    },
    components: {},
    methods: {
      getOrderTraceList() {
        if(this.type == "returnGoods"){
          returnGoodsManage.ReturnGeOrderTraceList({orderNO: this.orderNO}).then(res => {
          if (res.success) {
            this.orderTraceList = res.data;
            this.traceItems = res.data.traceItems
          }
        })
        }else {
          FindService.GeOrderTraceList({orderNO: this.orderNO}).then(res => {
          if (res.success) {
            this.orderTraceList = res.data;
            this.traceItems = res.data.traceItems
          }
        })
        }
      },
      cancel(){
        this.$router.go(-1);
      }
    }
  }
</script>

<style lang='stylus' scoped>
@import "./orderTraceList.styl"
</style>
