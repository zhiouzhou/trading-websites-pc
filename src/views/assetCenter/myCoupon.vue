<template>
  <div class="container myCoupon pre jiupi-center">
    <div class="coupon-tit">我的优惠券
      <router-link to="/myOrderEntry/ruleCoupon">优惠券使用规则></router-link>
    </div>
    <ul class="coupon-nav">
      <li
        class="cs"
        :class="[typeInfo.couponState == 1?'select-nav':'nav-tit']"
        @click="changeType({shopCoupon:false,couponState:1})"
      >未使用({{couponNum.allCount}})</li>
      <li
        class="cs"
        :class="[typeInfo.couponState == 2?'select-nav':'nav-tit']"
        @click="changeType({couponState:2,shopCoupon:false})"
      >已使用{{firstUsed?"":`(${couponNum.usedCount})`}}</li>
      <li
        class="cs"
        :class="[typeInfo.couponState == 3?'select-nav':'nav-tit']"
        @click="changeType({couponState:3,shopCoupon:false})"
      >已过期{{firstOverdue?"":`(${couponNum.overdueCount})`}}</li>
    </ul>
    <ul class="coupon-nav2">
      <li
        :class="!typeInfo.couponType&&typeInfo.couponType!==0?'select-nav2':''"
        @click="changeType({shopCoupon:false,couponState:typeInfo.couponState})"
      >全部</li>
      <li
        :class="typeInfo.couponType==0?'select-nav2':''"
        @click="changeType({couponType:0,shopCoupon:false,couponState:typeInfo.couponState})"
      >易酒批抵用券</li>
      <li
        :class="typeInfo.couponType==2?'select-nav2':''"
        @click="changeType({couponType:2,shopCoupon:false,couponState:typeInfo.couponState})"
      >易酒批赠品券</li>
    </ul>
    <div class="coupon-list clearfix" v-if="couponList.length">
      <div class="coupon-content pre" v-for="(item,index) in couponList" :key="item.couponId">
        <div class="money">
          <img
            class="bgImg"
            :src="typeInfo.shopCoupon?blueImg:typeInfo.couponState!=1?grayImg:redImg"
          >
          <p class="money-tips" v-if="item.couponTemplate.couponType==2">赠品券</p>
          <p class="money-tips" v-else>
            <span>￥</span>{{item.amount}}
          </p>
          <span class="rule">{{item.useDescription.replace("订单金额","")}}</span>
          <p
            class="time"
          >{{item.timeEffective.replace(/-/g,".")}}-{{item.timeExpired.replace(/-/g,".")}}</p>
        </div>
        <!--经销商券-->
        <!-- <div v-if="typeInfo.shopCoupon" class="coupon-info">
          <img :src="item.shopInfo.logoImgUrl" class="logoImg">
          <span class="shopName">{{item.shopInfo.shopName}}</span>
        </div>-->
        <div class="coupon-info">
          <p v-if="typeInfo.shopCoupon">{{item.shopInfo.shopName}}</p>
          <p v-else>{{item.couponTemplate.name}}</p>
          <div
            class="checkGift cs"
            @mouseenter="watchGift(index)"
            @mouseleave="giftFlag = false"
            v-if="item.couponTemplate.couponType==2"
          >查看赠品>>
            <div class="set-con">
              <div class="drop-down" v-show="giftFlag&&giftIndex==index&&giftProduct.length">
                <div class="sanjiao"></div>
                <div class="gift-info" v-for="(giftItem,giftIndex) in giftProduct" :key="giftItem.productSkuId">
                  <img v-lazy="giftItem.imgUrl" class="gift-img">
                  <div class="gift-product-info" :class="{'last-coupon': giftIndex+1==giftProduct.length}">
                    <p class="gift-name">
                      <span>赠品</span>
                      <span>{{giftItem.productName}}</span>
                    </p>
                    <p class="gift-spec">
                      <span>规格：{{giftItem.specName}}</span>
                      <span>X{{giftItem.buyCount+giftItem.unit}}</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <p class="c-9 fz14 coupon-desc">{{item.couponTemplate.desc}}</p>
          <p class="use-coupon" v-if="typeInfo.couponState==1">
            <span class="cs" :class="{'use-shop-coupon': typeInfo.shopCoupon}" @click="goToList(item)">立即使用</span>
          </p>
          <img
            :src="item.couponState==2?alreadyUseImg:expiredImg"
            class="disableIcon"
            v-show="typeInfo.couponState!=1"
          >
        </div>
      </div>
    </div>
    <!--分页-->
    <div class="pagination" v-if="couponList&&couponList.length>0">
      <el-pagination
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-size="pageSize"
        layout="prev, pager, next,total, jumper"
        :total="total"
        background
        prev-text="<上一页"
        next-text="下一页>"
      ></el-pagination>
    </div>
    <!--空页面-->
    <div class="empty" v-show="!couponList||!couponList.length">
      <img src="../../assets/images/wuyouhuiquan.png">
      <span>暂无可使用优惠券哦~</span>
    </div>
  </div>
</template>

<script>
import * as assetsCenter from "@/api/assetsCenter/assetsCenter";
import { couponSkip } from "common/couponUtil";
import * as $cache from "common/cache";

export default {
  name: "myCoupon",
  data() {
    return {
      blueImg: require("../../assets/images/youhuiquan_lanse.png"),
      grayImg: require("../../assets/images/youhuiquan_huise.png"),
      redImg: require("../../assets/images/youhuiquan_hongdi.png"),
      alreadyUseImg: require("../../assets/images/yishiyong_youhuiquan.png"), //已使用图标
      expiredImg: require("../../assets/images/yiguoqi_youhuiquan.png"), //已过期图标
      typeInfo: {
        couponState: 1, //0--不可用 1-可用
        shopCoupon: false //true 为经销商券
      },
      currentPage: 1,
      pageSize: 6,
      total: 0,
      giftIndex: "",
      giftFlag: false,
      couponList: [],
      giftProduct: [],
      couponNum: {
        allCount: 0,
        usedCount: 0,
        overdueCount: 0
      },
      firstUsed: true,
      firstOverdue: true,
      cashCouponCount: {
        generalCount: 0
      } //现金数据统计
    };
  },
  created() {
    this.getCouponNum();
    this.getCouponList();
  },
  methods: {
    //切换优惠券类型
    changeType(obj) {
      if(obj.couponState === this.typeInfo.couponState&&obj.shopCoupon === this.typeInfo.shopCoupon&&obj.couponType===this.typeInfo.couponType){
        return;
      }
      this.typeInfo = obj;
      this.currentPage = 1;
      this.couponList = [];
      this.getCouponList();
    },
    //获取优惠券列表
    getCouponList() {
      let { currentPage, pageSize, typeInfo } = this;
      assetsCenter
        .GetCouponList({ currentPage, pageSize, data: typeInfo })
        .then(data => {
          if (data.success) {
            this.couponList = data.data;
            this.total = data.totalCount;
            if(this.typeInfo.couponState == 2){
              if(this.firstUsed){
                this.couponNum.usedCount = data.totalCount;
                this.firstUsed = false;
              }
            }else if(this.typeInfo.couponState == 3){
              if(this.firstOverdue){
                this.couponNum.overdueCount = data.totalCount;
                this.firstOverdue = false;
              }
            }
          }
        });
    },
    //获取优惠券数量
    getCouponNum() {
      assetsCenter.GetCouponNum({ data: true }).then(data => {
        if (data.success) {
          this.couponNum.allCount =
            data.data.cashCount + data.data.discountCount + data.data.giftCount;
        }
      });
    },
    // getDisableCoupon() {
    //   assetsCenter.GetCouponNum({ data: false }).then(data => {
    //     if (data.success) {
    //       this.couponNum.noAllCount =
    //         data.data.cashCount + data.data.discountCount + data.data.giftCount;
    //     }
    //   });
    // },
    //改变分页
    handleCurrentChange(val) {
      this.currentPage = val;
      this.couponList = [];
      this.getCouponList();
    },
    //查看赠品
    watchGift(index) {
      this.giftProduct = [];
      this.giftFlag = true;
      assetsCenter
        .getGiftList({
          templateId: this.couponList[index].couponTemplate.templateId
        })
        .then(res => {
          if (res.success) {
            this.giftProduct = res.data;
            this.giftIndex = index;
          }
        });
    },
    //优惠券跳转
    goToList(e){
      e.couponType = e.couponTemplate.couponType
      $cache.setCache('couponList',e)
      couponSkip.call(this,e)
    },
  }
};
</script>

<style lang="stylus">
.myCoupon {
  bg(#fff);
  mb(39);
  pb(60);
}

.coupon-tit {
  // flex();
  // align-items: center;
  // justify-content: space-between;
  padding: 28px 20px;
  ft(28);
  c(#333);

  a {
    frt()
    ft(16);
    c(#4A90E2);
    lh(28)
  }
}

.coupon-nav {
  // flex();
  // align-items: center;
  border-bottom: 1px solid #ededed;
  margin: 0 20px;

  >li {
    inline()
  }

  .nav-tit {
    padding: 16px 0 15px 0;
    ft(16);
    c(#666);
    mr(64);
    border-bottom: 3px solid #ffffff;
  }

  .select-nav {
    border-bottom: 3px solid #E53935;
    padding: 16px 0 15px 0;
    c(#e53935);
    mr(64);
    ft(16);

    .el-dropdown {
      > span {
        font-size: 16px !important;
        c(#e53935);
      }
    }
  }

  .el-dropdown {
    > span {
      font-size: 16px !important;
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

.coupon-nav2 {
  margin: 20px 20px 0;
  pl(12);
  height: 32px;
  bg(#F6F6F6);
  lh(32);

  li {
    inline();
    c(#666);
    ft(14);
    mr(48);
    cursor: pointer;
  }

  .select-nav2 {
    c(#E53935);
  }
}

.coupon-list {
  // flex();
  // flex-wrap: wrap;
  // align-items: center;
  margin: 20px 20px 0;
  // justify-content space-between
}

.coupon-content {
  inline()
  width: 32%;
  position: relative;
  mb(20);
  flt()

  &:nth-of-type(3n-1) {
    margin: 0 2% 20px;
  }

  .money {
    /* background: url(../../assets/images/youhuiquan_hongdi.png) */
    position: relative;
    background-position: top;
    // flex();
    // flex-direction: column;
    // align-items: center;
    c(#fff);
    text-c()

    .bgImg {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
    }

    .money-tips {
      pos(relative)
      padding: 40px 0 20px 0;
      ft(48);
      z-index: 99;
      text-c()

      span {
        ft(24);
        z-index: 99;
      }
    }

    .rule {
      inline()
      pos(relative)
      z-index: 99;
      ft(16);
      pb(28);
    }

    .time {
      pos(relative)
      pb(18);
      z-index: 99;
    }
  }

  .notUser {
    background: url('../../assets/images/youhuiquan_huise.png');
    background-position: top;
    flex();
    flex-direction: column;
    align-items: center;
    c(#fff);
  }

  .coupon-info {
    box();
    height: 240px;
    border: 1px solid #ededed;
    padding: 20px 20px 24px;
    position: relative;
    z-index: 10;

    .disableIcon {
      position: absolute;
      bottom: 12px;
      right: 12px;
      pt(40);
      squ(72);
      margin: 0;
    }

    .use-coupon {
      position: absolute;
      left: 50%;
      bottom: 24px;
      transform: translateX(-50%);

      span {
        block();
        width: 120px;
        height: 38px;
        lh(38);
        text-align: center;
        radius(25);
        c(#E53935);
        ft(14);
        border: 1px solid rgba(229, 57, 53, 1);

        &:hover {
          bg(#e53935);
          c(#fff);
        }
      }

      .use-shop-coupon {
        c(#627DE5);
        border-color: #627DE5;

        &:hover {
          bg(#627DE5);
        }
      }
    }

    >p {
      &:nth-child(1) {
        ft(14);
        c(#333);
        mb(16);
      }
    }

    .logoImg {
      width: 240px;
      height: 120px;
      mb(16);
    }

    .shopName {
      ft(14);
      c(#333);
      mb(50);
      block();
    }
  }
}

.checkGift {
  inline()
  ft(12);
  c(#333);
  position: relative;

  > .set-con {
    position: absolute;
    /* top:36px */
    left: -18px;
    pt(20);
    w(290)
    z-index: 99;

    > .drop-down {
      /* position: absolute */
      top: 36px;
      left: -18px;
      background: #fff;
      /* width 104px */
      box-shadow: 0px 6px 8px 0px rgba(0, 0, 0, 0.1), 0px -2px 8px 0px rgba(0, 0, 0, 0.1);

      .sanjiao {
        width: 20px;
        height: 20px;
        box-shadow: -4px -4px 4px -3px rgba(0, 0, 0, 0.1), 0px 0px 0px 0px rgba(0, 0, 0, 0.1);
        background: #fff;
        transform: translateX(42px) translateY(-9px) rotate(45deg);
      }

      .gift-info {
        pb(12);
        overflow: hidden;

        .gift-img {
          squ(60);
          flt();
          margin: 0;
          mr(14);
          pl(12);
        }

        .gift-product-info {
          width: 174px;
          frt();
          border-bottom: 1px solid #ededed;
          pr(20);

          > .gift-name {
            pb(36);
            flex();
            c(#666);

            > span {
              &:nth-of-type(1) {
                inline();
                padding: 1px;
                height 12px
                b1(#E53935);
                c(#E53935);
                ft(10);
                radius(2);
                mr(4);
              }
              &:nth-of-type(2) {
                inline()
                width 140px
                ft(12)
              }
            }
          }

          > .gift-spec {
            pb(12);
            flex();
            align-items: center;
            justify-content: space-between;

            > span {
              &:nth-child(1) {
                c(#666);
              }

              &:nth-child(2) {
                c(#333);
                fb();
              }
            }
          }
        }
      }

      .last-coupon {
          border-bottom: 0!important;
      }
    }
  }
}

.pagination {
  width: 100%;
  position: absolute;
  right: 14px;
  bottom: 0;
  // display: flex;
  // justify-content: flex-end;
  pt(24);
  pb(24);

  >div {
    frt()
  }
}

.esure {
  width: 72px;
  height: 30px;
  display: inline-block;
  border: 1px solid #e5e5e5;
  text-align: center;
  lh: 30;
  radius(4);
  ml(12);
}

.el-pager {
  li {
    border: 1px solid #ededed !important;
    background: #fff !important;
  }

  .active {
    background: #E53935 !important;
  }
}

.empty {
  text-align: center;

  > img {
    squ(80);
    mt(120);
    mb(12px);
  }

  > span {
    ft(16);
    c(#666);
  }
}

.coupon-desc {
  mt(16);
  lh(16);
}
</style>
