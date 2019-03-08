<template>
  <div class="order-success">
    <div class="order-success-content">
      <div class="order-success-title">
        <img src="../../assets/images/success.png">
        <span>恭喜您，订单提交成功！</span>
      </div>
      <div class="order-success-line"></div>
      <div>
        <span class="c-6 fz16 fw-500">支付方式：{{payType==0&&deliveryModeValue==4?'现款现结':payType==0?'货到付款':payType==1?'微信支付':payType==2?'支付宝支付':payType==3?'银联支付':payType==5?'连连支付':payType==6?'易酒贷':payType==10?'已在线支付':payType==11?'线下转账':payType==12?'经销商收款':payType==13?'余额支付':''}}</span>
        <span class="c-6 m-48 fz16 fw-500">下单时间：{{placeOrderTime}}</span>
        <span class="c-E43A35 fz16 fw-500">实付金额 : ¥{{totalPayableAmount}}</span>
      </div>
      <div>
        <router-link class="order-success-check fw-500" to="/myOrderEntry/myOrders">查看订单</router-link>
        <router-link class="order-success-finish fw-500" to="/cartIndex/shopCart">返回购物车</router-link>
      </div>
    </div>

    <div class="order-success-warning c-6">
      <p>温馨提示：</p>
      <p>1. 您的订单为货到付款，请耐心等我们配货</p>
      <p>2. 收到货后请您付款给配送员</p>
      <p>3. 易久批支持14天无条件退换货</p>
      <p>
        4. 如果您在采购过程中遇到什么问题，可以拨打服务热线
        <span class="c-E43A35 fz14">4000199197</span>
      </p>
    </div>
    <div v-if="list.length">
      <div class="order-coupon-title clearfix">
        <img src="../../assets/images/xian.png" class="flt">
        <p>领取优惠券</p>
        <img src="../../assets/images/xian.png" class="frt">
      </div>
      <div class="flex flex-wrap">
        <div class="inline mb-24" v-for="(item,index) in list">
          <div class="order-coupon-img">
            <p>
              <span class="fz28">¥</span>{{item.amount}}
            </p>
            <p class="fz14">{{item.couponUseDesc}}</p>
          </div>
          <div class="order-coupon-content pre">
            <img src="../../assets/images/yilingqu_youhuanquan@2x.png" v-if="item.canUseCoupon">
            <p class="c-3 fz16">{{item.couponName}}</p>
            <p class="c-3 fz16">{{item.couponDesc}}</p>
            <p class="clearfix">
              <span class="c-6"></span>

              <span class="frt get-coupon" v-show="!item.canUseCoupon" @click="receiveCoupon({promotionId:item.promotionId,index})">立即领取</span>
              <span class="frt get-coupon order-use-coupon" v-show="item.canUseCoupon" @click="goToList(item)">立即使用</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import * as assetsCenter from "@/api/assetsCenter/assetsCenter.js";
import { couponSkip } from "common/couponUtil";
import * as $cache from "common/cache";
export default {
  name: "submitOrderSuccess",
  data() {
    return {
      totalPayableAmount: "",
      placeOrderTime: "",
      orderNOs: [],
      payType: "",
      deliveryModeValue: "",
      list: []
    };
  },
  created() {
    let queryParams = this.$route.query;
    this.orderNOs = JSON.parse(queryParams.orderNOs);
    console.log(this.orderNOs)
    this.totalPayableAmount = queryParams.totalPayableAmount;
    this.placeOrderTime = queryParams.placeOrderTime;
    this.payType = queryParams.currentPayType;
    this.deliveryModeValue = queryParams.currentDeliveryMode;
    assetsCenter.ListOrderCouponReceive({ datas: this.orderNOs }).then(res => {
      if (res.data) {
        this.list = res.data;
        this.list.forEach(item => {
          item.canUseCoupon = false;
        })
      }
    });
  		this.$createTalkingData("OrderComplete", "OrderComplete_OrderSubmitResult", {IsSuccess:true,OrderNos:this.orderNOs}, 3)
  		let that = this
  		 setTimeout(() => {
     		 that.$submitTalkingData()
    }, 1000)
		},
		beforeRouteEnter(to, from, next) {
			next(vm => {
				vm.$createTalkingData("OrderComplete", "", {}, 1)
			})
		},
		beforeRouteLeave(to, from, next) {
			this.$createTalkingData("OrderComplete", "", {}, 2)
			next()
		},
  methods: {
    //  领取优惠券
    receiveCoupon(item) {
      let couponInfo = {
        data: item.promotionId
      };
      assetsCenter.ReceiveOrderCoupon(couponInfo).then(data => {
        if (data.success) {
          this.$message("领取成功");
          let list = this.list;
          list[item.index].canUseCoupon = true;
          this.$set(this.list,item.index,list[item.index])
        } else {
          this.$message(data.desc);
        }
      });
    },
    //优惠券跳转
    goToList(e){
      $cache.setCache('couponList',e)
      couponSkip.call(this,e,`couponCenter`)
    },
  }
};
</script>
<style lang="stylus">
.order-success {
  pb(30)
}
.order-success-content {
  padding: 88px 0;
  mb(32);
  // flex();
  // align-items: center;
  // flex-direction: column;
  border: 1px solid #DFDFDF;
  text-c()
}

.order-success-title {
  // flex();
  // align-items: center;
  // inline()
  width auto

  img {
    inline();
    width: 96px;
    height: 96px;
    margin: 0;
    vertical-align middle
  }

  span {
    inline();
    ft(24);
    c(#4CAF50);
    ml(20);
  }
}

.order-success-line {
  inline()
  width: 615px;
  height: 1px;
  bg(#DFDFDF);
  margin: 32px 0 24px;
}

.order-success-check {
  inline();
  box();
  width: 162px;
  height: 36px;
  border: 1px solid #DFDFDF;
  radius(2);
  c(#333333);
  ft(16);
  text-c();
  lh(36);
  mr(24);
  mt(32);
  cursor: pointer;
}

.order-success-finish {
  inline();
  width: 162px;
  height: 36px;
  bg(#4CAF50);
  radius(2);
  c(#FFFFFF);
  ft(16);
  text-c();
  lh(36);
  cursor: pointer;
}

.order-success-warning {
  p {
    line-height: 1.7em;
    ft(14);
    font-weight: 500;
  }
}

.order-coupon-title {
  padding: 64px 0 48px;
  text-c();

  p {
    inline();
    c(#333);
    ft(26);
  }

  img {
    pt(9);
    width: 43%;
    height: 8px;
    inline();
  }
}

.order-coupon-img {
  inline();
  width: 130px;
  height: 168px;
  background: url('../../assets/images/youhuiquanzuo_hongse.png') no-repeat;
  text-c();
  vertical-align top

  p {
    c(#fff);

    &:nth-of-type(1) {
      pt(47);
      mb(12);
      ft(48);
    }

    &:nth-of-type(2) {
      margin: 0 15px;
    }
  }
}

.order-coupon-content {
  inline();
  box();
  padding: 24px 24px 24px 16px;
  width: 76%;
  height: 168px;
  border: 1px solid #EDEDED;
  border-radius: 0 20px 20px 0;
  box-shadow: 0px 4px 8px 0px rgba(0, 0, 0, 0.1);
  position: relative;

  >img {
    width: 86px;
    height: 86px;
    position: absolute;
    top: 0;
    right: 0;
  }

  >p {
    mb(5)

    &:nth-of-type(3) {
      position absolute
      right 24px
      bottom 20px

      span:nth-of-type(1) {
        inline();
        pt(12);
      }
    }
  }

  &:nth-of-type(2n-1) {
    mr(24);
  }
}

.get-coupon {
  box();
  inline();
  width: 80px;
  height: 24px;
  bg(#E53935);
  radius(24);
  c(#fff);
  text-c();
  lh(24);
  cursor: pointer;
}

.order-use-coupon {
  bg(#fff);
  c(#E53935);
  border: 1px solid #E53935;
}

.c-E43A35 {
  c(#E43A35);
}

.m-48 {
  margin: 0 48px;
}

.fw-500 {
  font-weight: 500;
}

.mb-24 {
  mb(24);
  width: 49%;
}

.flex-wrap {
  flex-wrap: wrap;
  justify-content: space-between;
}
</style>

