<template>
  <div class="container">
    <div class="dealer-coupons-wrapper dealer-coupon-flex" v-show="requestDone">
      <div class="dealer-wrapper dealer-coupon-flex-item">
        <!--经销商领券列表-->
        <div class="dealer-box-content" v-if="couponList.length">
          <ul class="dbc-list clearfix">
            <li :class="[i%2 == 0 ? 'pad-r10' : 'pad-l10']" v-for="(item,i) in couponList">
              <div class="dbc-left">
                <h5>&yen<span>{{item.amount}}</span></h5>
                <p>限领1次</p>
              </div>
              <div class="dbc-middle">
                <h5>{{item.couponDesc}}</h5>
                <p>使用期限：<span>{{item.effectDate}}</span>&minus;<span>{{item.expireDate}}</span></p>
              </div>
              <div class="dbc-right" v-if="item.surplusCount > 0">
                <canvas v-show="!item.alreadyReceived" :class="'dbc-canvas'+i" class="dbc-canvas" width="80" height="60"></canvas>
                <div v-show="item.alreadyReceived" class="dbc-received"></div>
                <div class="only" v-if="item.surplusCount<=item.warningNum&&item.surplusCount>0">仅剩{{item.surplusCount}}张</div>
                <div class="dbc-btn" :class="[item.alreadyReceived ? 'lingquan-btn-finish' : 'lingquan-btn']" @click="getCoupon(item,i)">{{item.alreadyReceived?'已领取':'立即领取'}}</div>
              </div>
              <div class="dbc-right" v-if="item.surplusCount == 0">
                <div class="dbc-gone"></div>
                <div class="dbc-btn lingquan-btn-finish">已领完</div>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div class="no-coupon" v-if="!couponList.length&&requestDone">
        <div class="icon"></div>
        <p>该经销商暂时没有优惠券~</p>
      </div>
    </div>
  </div>
</template>
<script>
  import { queryDealerCoupons,receiveDealerCoupon } from "api/dealer/dealer"
  export default {
    data(){
      return {
        currentPage: 1,
        pageSize: 60,
        couponList: [],//优惠券列表
        requestDone: false,
      }
    },
    components: {

    },
    beforeRouteLeave(to, from, next) {
      if(to.name == `dealerProductList`&&!to.query.searchKey){
        to.meta.keepAlive = true;
      }
      next();
    },
    beforeCreate(){

    },
    created(){
      let query = this.decodeUrlQuery(this.$route.query,'shopId')
      this.shopId = query.shopId || ``
      this.getDealerCoupons()
    },
    methods: {
      //获取经销商店铺信息
      getDealerCoupons(){
        let param = {
          data: this.shopId,
          currentPage: this.currentPage,
          pageSize: this.pageSize
        }
        queryDealerCoupons(param)
          .then(res => {
            if (res.success) {
              this.couponList = res.data
              this.requestDone = true
              this.$nextTick(()=>{
                for(let idx in this.couponList){
                  this.drawInit(this.couponList[idx],idx)
                }
              })
            }
          })
          .catch(res => {});
      },
      //绘制圆环
      drawInit(item,i){
        var canvas = document.querySelectorAll(".dbc-canvas"+i);
        var ctx = canvas[0].getContext('2d');
        //优惠券已抢购的数量，优惠券总数，已抢购比例
        var  doneCount = item.couponTotalCount - item.surplusCount,
          total = item.couponTotalCount,
          proportion = Math.ceil(doneCount/total * 100),
        deg = Math.PI;
        //提示文字
        ctx.translate(0, 0);
        ctx.font = '13px serif';
        ctx.textAlign = 'center';
        ctx.fillStyle = '#5E91E2';
        ctx.fillText('已抢', 40, 28);
        //显示比例
        ctx.translate(0, 0);
        ctx.font = '12px Microsoft YaHei';
        ctx.textAlign = 'center';
        ctx.fillStyle = '#5E91E2';
        ctx.fillText(proportion+'%', 40, 42);
        //绘制背景圆环
        ctx.strokeStyle = '#C0D9FF';
        ctx.lineWidth = 6;
        ctx.beginPath();
        ctx.arc(40, 32, 28, deg*2.5/9, deg*6.5/9, true);
        ctx.stroke();
        //绘制环形
        ctx.strokeStyle = '#5E91E2';
        ctx.lineWidth = 6;
        ctx.beginPath();
        ctx.arc(40, 32, 28, deg*6.5/9, deg*7/9+deg*doneCount*13/total/9,  false);
        ctx.stroke();
      },
      //领取优惠券
      getCoupon(e,i){
        if(e.alreadyReceived) return
        let param = {
          data: e.promotionId
        }
        receiveDealerCoupon(param)
          .then(res => {
            if (res.success) {
              this.couponList[i].surplusCount -= 1
              this.couponList[i].alreadyReceived = true
              this.$message(`领取成功`)
            }
          })
          .catch(res => {});
      },
    },
  }
</script>
<style lang="stylus" scoped>
  @import "./stylus/coupon.styl"
</style>

