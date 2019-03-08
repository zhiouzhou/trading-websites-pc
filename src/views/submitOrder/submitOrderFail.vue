<template>
    <div class="order-fail">
    <div class="order-success-content">
      <div class="order-success-title">
        <img src="../../assets/images/fail.png">
        <p>订单提交失败<br>
        <span class="order-fail-warning">{{desc}}</span>
        </p>
      </div>
      <div class="order-success-line"></div>
      <div>
        <span class="c-6 fz16 fw-500">支付方式：货到付款</span>
        <span class="c-6 m-48 fz16 fw-500">下单时间：{{placeOrderTime}}</span>
        <span class="c-E43A35 fz16 fw-500">实付金额 : ¥{{totalPayableAmount}}</span>
      </div>
      <div>
           <router-link class="order-fail-finish fw-500" to="/index/home">返回首页</router-link>
      </div>
    </div>

    <div class="order-success-warning c-6">
      <p>温馨提示：</p>
      <p>1. 您的订单为货到付款，请耐心等我们配货</p>
      <p>2. 收到货后请您付款给配送员</p>
      <p>3. 易久批支持14天无条件退换货</p>
      <p>4. 如果您在采购过程中遇到什么问题，可以拨打服务热线<span class="c-E43A35 fz14"> 4000199197</span></p>
    </div>
    </div>
</template>
<script>
export default {
    name: "submitOrderFail",
    data() {
    return {
      totalPayableAmount:"",
      placeOrderTime:"",
      orderNOs:[],
      desc:''
    };
  },
  created() {
    let queryParams = this.$route.query
    this.orderNOs = queryParams.orderNOs
    this.totalPayableAmount = queryParams.totalPayableAmount
    this.placeOrderTime = queryParams.placeOrderTime
    this.desc = queryParams.data

    this.$createTalkingData("OrderComplete_OrderSubmitResult", "", {IsSuccess:false,OrderNos:this.orderNOs}, 3)
},
		beforeRouteEnter(to, from, next) {
			next(vm => {
				vm.$createTalkingData("OrderComplete", "", {}, 1)
			})
		},
		beforeRouteLeave(to, from, next) {
			this.$createTalkingData("OrderComplete", "", {}, 2)
			next()
		}
}
</script>
<style lang="stylus">
.order-fail {
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
  width auto

  img {
    inline();
    width: 96px;
    height: 96px;
    margin: 0;
  }

  p {
    inline();
    ft(24);
    c(#e43a35);
    ml(20);
  }

  .order-fail-warning {
      ft(16)
      c(#333)
      margin: 0;
  }
}

.order-success-line {
  inline();
  width: 615px;
  height: 1px;
  bg(#DFDFDF);
  margin: 32px 0 24px;
}

.order-fail-finish {
  inline();
  width: 162px;
  height: 36px;
  border: 1px solid #DFDFDF;
  radius(2);
  c(#333);
  ft(16);
  text-c();
  lh(36);
  mt(32);
  cursor: pointer;
}

.order-success-warning {
    mb(30)

  p {
    line-height: 1.7em;
    ft(14);
    font-weight: 500;
  }
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
    mb(24)
    width: 49%;
}

.flex-wrap {
    flex-wrap: wrap;
    justify-content space-between
}
</style>
