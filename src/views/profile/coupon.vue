<template>
  <div class="container myCoupon">
    <div class="coupon-tit">
      我的优惠券
      <router-link to="/index/help/faq" >优惠券使用规则></router-link>
    </div>
    <ul class="coupon-nav">
      <li :class="[typeInfo.couponType==0 && typeInfo.type=='voucher'?'select-nav':'nav-tit']"
          @click="changeType({type:'voucher',couponState:1,couponType:0,shopCoupon:false})">
        <el-dropdown trigger="hover" @command="handleCommand">
        <span class="el-dropdown-link">
          抵用券({{couponNum.cashCount}})<i class="el-icon-arrow-down el-icon--right"></i>
        </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="{type:'voucher',couponState:1,couponType:0,shopCoupon:false}">全部抵用券
            </el-dropdown-item>
            <el-dropdown-item command="{type:'voucher',couponType:0,couponUseType:1,shopCoupon:false,couponState:1}">
              定向品类抵用券
            </el-dropdown-item>
            <el-dropdown-item command="{type:'voucher',couponType:0,couponUseType:0,shopCoupon:false,couponState:1}">
              定向产品抵用券
            </el-dropdown-item>
            <el-dropdown-item command="{type:'voucher',couponType:0,couponUseType:3,shopCoupon:false,couponState:1}">
              定向专区
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </li>
      <li :class="[typeInfo.couponUseType==2 && typeInfo.couponType == 0?'select-nav':'nav-tit']"
          @click="changeType({type:'currencyCoupon',couponType:0,couponUseType:2,shopCoupon:false,couponState:1})">
        通用券({{cashCouponCount.generalCount}})
      </li>
      <li :class="[typeInfo.couponType==2?'select-nav':'nav-tit']"
          @click="changeType({type:'gift',couponState:1,couponType:2,shopCoupon:false})">赠品券({{couponNum.giftCount}})
      </li>
      <li :class="[typeInfo.shopCoupon?'select-nav':'nav-tit']"
          @click="changeType({type:'jingxiao',shopCoupon:true,couponState:1})">经销商券
      </li>
      <li :class="[typeInfo.couponState==0?'select-nav':'nav-tit']" @click="changeType({type:'unesure',couponState:0})">
        不可用券({{disableCouponNum.cashCount+disableCouponNum.discountCount+disableCouponNum.giftCount}})
      </li>
    </ul>
    <div class="coupon-list">
      <div class="coupon-content" v-for="item in couponList" :key="item.couponId">
        <div class="money">
          <img class="bgImg" :src="typeInfo.shopCoupon?blueImg:typeInfo.couponState==0?grayImg:redImg"/>
          <p class="money-tips" v-if="item.couponTemplate.couponType==2">赠品券</p>
          <p class="money-tips" v-else><span>￥</span>{{item.amount}}</p>
          <span class="rule">{{item.useDescription}}</span>
          <p v-show="typeInfo.shopCoupon" class="time">有效期至:{{item.timeExpired}}</p>
        </div>
        <!--经销商券-->
        <div v-if="typeInfo.shopCoupon" class="coupon-info">
          <img :src="item.shopInfo.logoImgUrl" class="logoImg"/>
          <span class="shopName">{{item.shopInfo.shopName}}</span>
        </div>
        <div class="coupon-info" v-else>
          <p>{{item.couponTemplate.name}}</p>
          <p>有效期至:{{item.timeExpired}}</p>
          <p v-if="typeInfo.couponState!==0"><span>立即使用</span></p>
          <div style="display: flex;justify-content: flex-end">
            <img :src="item.couponState==2?alreadyUseImg:expiredImg" class="disableIcon"
                 v-show="typeInfo.couponState==0"/>
          </div>
        </div>
      </div>
    </div>
    <!--分页-->
    <div class="pagination" v-if="couponList&&couponList.length>0">
      <el-pagination
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-size="pageSize"
        layout=" prev, pager, next,total, jumper"
        :total="total"
        background
        prev-text="<上一页"
        next-text="下一页>">
        <span class="esure">确定</span>
      </el-pagination>
    </div>
    <!--空页面-->
    <div class="empty" v-show="!couponList||!couponList.length">
      <img src="../../assets/images/wuyouhuiquan.png"/>
      <span>暂无优惠券～</span>
    </div>
  </div>
</template>

<script>
  import * as assetsCenter from "@/api/assetsCenter/assetsCenter";

  export default {
    name: "myCoupon",
    data() {
      return {
        blueImg: require('../../assets/images/youhuiquan_lanse.png'),
        grayImg: require('../../assets/images/youhuiquan_huise.png'),
        redImg: require('../../assets/images/youhuiquan_hongdi.png'),
        alreadyUseImg: require('../../assets/images/yishiyong_youhuiquan.png'),    //已使用图标
        expiredImg: require('../../assets/images/yiguoqi_youhuiquan.png'),     //已过期图标
        typeInfo: {
          couponState: 1,    //0--不可用 1-可用
          couponType: 0,     //抵用券(0),赠品券(2)
          // couponUseType: 0,  //定向产品券(0),定向品类券(1),通用券(2),定向专区(3)
          shopCoupon: false,   //true 为经销商券
          type: 'voucher'
        },
        currentPage: 1,
        pageSize: 6,
        total: 0,
        couponList: [],
        couponNum: {},
        cashCouponCount: {},     //现金数据统计
        disableCouponNum: {}
      }
    },
    created() {
      this.getCouponList()
      this.getCouponNum()
      this.getDisableCoupon()
    },
    methods: {
      changeType(obj) {
        console.log(obj)
        // if (obj.type == 'voucher') {
        this.typeInfo = obj
        // }
        this.currentPage = 1
        this.couponList = []
        this.getCouponList()
      },
      getCouponList() {
        let {currentPage, pageSize, typeInfo} = this
        assetsCenter.GetCouponList({currentPage, pageSize, data: typeInfo}).then(data => {
          if(data.success){
            this.couponList = data.data
            this.total = data.totalCount
          }
        })
      },
      //下拉菜单触发事件
      handleCommand(command) {
        this.currentPage = 1
        let obj = eval("(" + command + ")")
        this.typeInfo = obj
        this.currentPage = 1
        this.getCouponList()
      },
      //获取优惠券数量
      getCouponNum() {
        assetsCenter.GetCouponNum({data: true}).then(data => {
          if (data.success) {
            this.couponNum = data.data
            this.cashCouponCount = data.data.cashCouponCount
          }
        })
      },
      getDisableCoupon() {
        assetsCenter.GetCouponNum({data: false}).then(data => {
          if (data.success) {
            this.disableCouponNum = data.data
          }
        })
      },
      handleCurrentChange(val) {
        this.currentPage = val;
        this.couponList = [];
        this.getCouponList();
      },
    }
  }
</script>

<style lang="stylus">
  .myCoupon {
    bg(#fff)
    mb(39)

  }

  .coupon-tit {
    flex()
    align-items center
    justify-content space-between
    padding: 28px 20px
    ft(28)
    c(#333)
    a {
      ft(16)
      c(#4A90E2)
    }
  }

  .coupon-nav {
    flex()
    align-items: center
    border-bottom: 1px solid #ededed
    margin 0 20px
    .nav-tit {
      padding: 16px 0 15px 0
      ft(16)
      c(#666)
      mr(64)
    }
    .select-nav {
      border-bottom: 3px solid #E53935
      padding: 16px 0 13px 0
      c(#e53935)
      mr(64)
      ft(16)
      .el-dropdown {
        > span {
          font-size: 16px !important
          c(#e53935)
        }
      }
    }

    .el-dropdown {
      > span {
        font-size: 16px !important
      }
    }
    .el-dropdown-menu el-popper {
      transform-origin: center top 0px;
      z-index: 2003;
      position: absolute;
      top: 125px !important;
      left: 364px !important;
    }
  }

  .coupon-list {
    flex()
    flex-wrap: wrap
    align-items center
    margin: 20px 20px 0
    justify-content space-between
  }

  .coupon-content {
    width: 32%
    position: relative
    mb(20)
    .money {
      /*background: url(../../assets/images/youhuiquan_hongdi.png)*/
      position: relative;
      background-position top
      flex()
      flex-direction: column;
      align-items center
      c(#fff)
      .bgImg {
        position: absolute
        top: 0
        left: 0
        width: 100%;
        height: 100%
      }
      .money-tips {
        padding: 40px 0 20px 0
        ft(48)
        z-index: 99
        span {
          ft(24)
          z-index: 99
        }
      }
      .rule {
        z-index: 99
        ft(16)
        mb(40)
      }
      .time {
        mb(18)
        z-index: 99
      }
    }
    .notUser {
      background: url(../../assets/images/youhuiquan_huise.png)
      background-position top
      flex()
      flex-direction: column;
      align-items center
      c(#fff)
    }
    .coupon-info {
      border: 1px solid #ededed
      padding: 20px 20px 24px
      .disableIcon {
        /*position: absolute*/
        /*bottom:12px*/
        /*right:12px*/
        pt(40)
        squ(72)
        margin: 0
      }
      p {
        &:nth-child(1) {
          ft(14)
          c(#333)
          padding-bottom: 14px
        }
        &:nth-child(2) {
          ft(14)
          c(#999)
        }
        &:nth-child(3) {
          mt(110)
          flex()
          justify-content center
          span {
            block()
            width: 120px;
            height: 38px;
            lh(38)
            text-align center;
            radius(25)
            c(#E53935)
            ft(14)
            border: 1px solid rgba(229, 57, 53, 1);
          }
        }
        &:nth-child(3):hover {
          span {
            bg(#e53935)
            c(#fff)
          }
        }
      }
      .logoImg {
        width: 240px;
        height: 120px;
        mb(16)
      }
      .shopName {
        ft(14)
        c(#333)
        mb(50)
        block()
      }
    }
  }

  .pagination {
    display: flex;
    justify-content flex-end;
    mt(24)
    mb(24)
  }

  .esure {
    width: 72px;
    height: 30px;
    display: inline-block;
    border: 1px solid #e5e5e5;
    text-align: center;
    lh: (30);
    radius(4);
    ml(12);
  }

  .el-pager {
    li {
      border: 1px solid #ededed !important;
      background: #fff !important
    }
    .active {
      background: #E53935 !important
    }
  }

  .empty {
    text-align: center
    > img {
      squ(80)
      mt(120)
      mb(12px)
    }
    > span{
      ft(16)
      c(#666)
    }
  }
</style>
