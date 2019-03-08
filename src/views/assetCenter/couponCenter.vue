<template>
  <div>
    <AppHeader/>
    <CouponCenterNav/>
    <div class="coupon-nav">
    </div>
    <div class="coupon-list w clearfix">
      <div
        class="co-list-wrap"
        v-for="(item, index) in receiveCouponList"
        :key="item.promotionId"
      >
        <div :class="[item.alreadyReceived?'co-count':'disable-coupon']">
          <p class="co-count-num co-count-gift" v-if="item.couponType==2">赠品券</p>
          <p class="co-count-num" v-else>
            <span>￥</span>{{item.amount}}
          </p>
          <span class="fz14 c-w t-c block-center">{{item.couponUseDesc.replace("订单金额","")}}</span>
        </div>
        <div class="co-content">
          <div class="co-title pre">
            <p>{{item.couponDesc}}</p>
            <div
              class="checkGift cs"
              @mouseenter="getGiftList({couponTemplateId:item.couponTemplateId,index})"
              @mouseleave="giftFlag=false"
              v-if="item.couponType==2"
            >查看赠品>>
              <div class="set-con">
                <div class="drop-down" v-show="giftFlag&&giftIndex==index&&giftList.length">
                  <div class="sanjiao"></div>
                  <div class="gift-info" v-for="(item,index) in giftList" :key="item.productSkuId">
                    <img v-lazy="item.imgUrl" class="gift-img">
                    <div class="gift-product-info" :class="{'last-coupon': index+1==giftList.length}">
                      <p class="gift-name">
                        <span>赠品</span>
                        <span>{{item.productName}}</span>
                      </p>
                      <p class="gift-spec">
                        <span>规格：{{item.specName}}</span>
                        <span>X{{item.buyCount+item.unit}}</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="checkProduct">
              <span></span>
              <span class="cs" @click="goToList(item)">查看可用产品></span>
            </div>
          </div>
          <div class="canvas-coupon">
            <canvas
              :class="'dbc-canvas'+index"
              width="72"
              height="64"
              v-if="item.alreadyReceived&&item.couponTotalCount>item.surplusCount"
            ></canvas>
            <img src="../../assets/images/yilingqu_youhuanquan@2x.png" v-if="!item.alreadyReceived">
            <img
              src="../../assets/images/yiqiangguang_youhuiquan@2x.png"
              v-if="item.alreadyReceived&&item.couponTotalCount==item.surplusCount"
            >
            <div
              class="cs"
              @click="receiveCoupon(item.promotionId)"
              v-if="item.alreadyReceived&&item.couponTotalCount>item.surplusCount"
            >立即领取</div>
            <p class="cs" v-if="!item.alreadyReceived" @click="goToList(item)">立即使用</p>
          </div>
        </div>
      </div>
    </div>
    <div class="coupon-empty" v-if="!receiveCouponList||!receiveCouponList.length">
      <img src="../../assets/images/wuyouhuiquan.png">
      <span>暂无可领取的优惠券~</span>
    </div>
    <!--分页-->
    <!-- <div class="pagination w">
      <el-pagination
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-size="pageSize"
        layout=" prev, pager, next,total, jumper, slot"
        :total="totalCount"
        background
        prev-text="<上一页"
        next-text="下一页>">
      </el-pagination>
    </div>-->
    <AppFooter/>
  </div>
</template>


<script>
import * as FindService from "api/assetsCenter/assetsCenter";
import AppHeader from "./../AppHeader";
import CouponCenterNav from "./couponCenterNav";
import AppFooter from "./../AppFooter";
import { couponSkip } from "common/couponUtil";
import * as $cache from "common/cache";

export default {
  name: "",
  props: [],
  data() {
    return {
      currentPage: 1,
      pageSize: 8,
      totalCount: 0,
      title: "",
      currentIndex: 0,
      giftIndex: 0,
      couponInfo: {
        promotionId: "", //活动Id
        receiveSource: 1 //领取来源   0 -- 店铺 1--领券中心
      },
      giftFlag: false,
      giftList: [],
      receiveCouponList: []
    };
  },
  components: {
    AppHeader,
    CouponCenterNav,
    AppFooter
  },
  mounted() {
    this.getCouponCenter();
  },
  methods: {
    //获取优惠券列表
    getCouponCenter() {
      FindService.GetCouponCenter({
        currentPage: this.currentPage,
        pageSize: 1
      }).then(res => {
        if (res.success) {
          let params = {
            currentPage: this.currentPage,
            pageSize: res.totalCount
          };
          this.pageSize = res.totalCount
          FindService.GetCouponCenter(params).then(res => {
            if (res.success) {
              this.totalCount = res.totalCount;
              this.receiveCouponList = res.data;
              this.$nextTick(function() {
                this.receiveCouponList.forEach((e,index) => {
                  this.drawInit(e.couponTotalCount, e.surplusCount, index);
                });
              });
            }
          });
        }
      });
    },
    //canvas圆环
    drawInit: function(couponTotalCount, surplusCount, index) {
      let canvas = document.querySelectorAll(".dbc-canvas"+index);

      let ctx;

      for (let i = 0; i < canvas.length; i++) {
        ctx = canvas[i].getContext("2d");
        ctx.clearRect(0, 0, canvas[i].width, canvas[i].height);
        //优惠券已抢购的数量，优惠券总数，已抢购比例+
        // let doneCount, total, proportion, deg, surplusCount;
        // for (let i = 0; i < data.length; i++) {
        //     surplusCount = data[i].surplusCount
        //     doneCount = data[i].couponTotalCount - data[i].surplusCount;
        //     total = data[i].couponTotalCount;
        //     proportion = Math.ceil(doneCount / total * 100);
        //     deg = Math.PI;
        // }
        // console.log(surplusCount)
        let doneCount = couponTotalCount - surplusCount,
          total = couponTotalCount,
          proportion = ((surplusCount / total) * 100).toFixed(3),
          deg = Math.PI;
        //提示文字
        ctx.translate(0, 0);
        ctx.font = "13px serif";
        ctx.textAlign = "center";
        ctx.fillStyle = "#ef5350";
        ctx.fillText("已抢", 40, 28);
        //显示比例
        ctx.translate(0, 0);
        ctx.font = "12px serif";
        ctx.textAlign = "center";
        ctx.fillStyle = "#ef5350";
        ctx.fillText(proportion + "%", 40, 42);
        //绘制背景圆环
        ctx.strokeStyle = "#ffb1b0";
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(40, 30, 25, (deg * 2.5) / 9, (deg * 6.5) / 9, true);
        ctx.stroke();
        //绘制环形
        ctx.strokeStyle = "#ef5350";
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(
          40,
          30,
          25,
          (deg * 6.5) / 9,
          (deg * 7) / 9 + (deg * surplusCount * 13) / total / 9,
          false
        );
        ctx.stroke();
      }
    },
    handleCurrentChange() {},
    //  领取优惠券
    receiveCoupon(promotionId) {
      let { couponInfo } = this;
      couponInfo.promotionId = promotionId;
      FindService.UserReceive(couponInfo).then(data => {
        if (data.success) {
          this.$message("领取成功");
          let params = {
            currentPage: this.currentPage,
            pageSize: this.pageSize
          };
          FindService.GetCouponCenter(params).then(res => {
            if (res.success) {
              this.totalCount = res.totalCount;
              this.receiveCouponList = res.data;
              this.$nextTick(function() {
                this.receiveCouponList.forEach((e,index) => {
                  this.drawInit(e.couponTotalCount, e.surplusCount, index);
                });
              });
            }
          });
        } else {
          this.$message(data.desc);
        }
      });
    },

    //获取赠品券赠品列表
    getGiftList(obj) {
      this.giftFlag = true;
      this.giftList = [];
      FindService.getGiftList({ templateId: obj.couponTemplateId }).then(
        data => {
          if (data.success) {
            this.giftList = data.data;
            this.giftIndex = obj.index;
          }
        }
      );
    },
    //优惠券跳转
    goToList(e){
      $cache.setCache('couponList',e)
      couponSkip.call(this,e,`couponCenter`)
    },
  },
  computed: {}
};
</script>


<style lang="stylus" scoped>
.coupon-nav {
  background: url('../../assets/images/lingquanzhongxin_bg.jpg');
  h(300);
  position: relative;
}

.coupon-list {
  margin: 48px auto 0;
}

.co-list-wrap:nth-child(2n+1) {
  margin-right: 24px;
}

.co-list-wrap {
  // flex-1()
  h(182);
  // flex();
  float: left;
  width: 593px;
  margin-bottom: 24px;

  /* align-items center */
  .co-count {
    inline()
    flt()
    width: 130px;
    height 182px
    box()
    background: url('../../assets/images/youhuiquanzuo_hongse.png') no-repeat;
    padding: 47px 0;
    background-size: cover;
  }

  .disable-coupon {
    flt()
    box()
    width: 130px;
    h(182)
    background: url('../../assets/images/youhuiquan_huise.png') no-repeat;
    padding: 47px 0;
    background-size: cover;
  }

  .co-count-num {
    mb(12);
    c(#fff);
    ft(48);
    text-c();

    span {
      ft(28);
    }
  }

  .co-count-gift {
    ft(28);
    mb(20);
  }
}

.co-content {
  background: url('../../assets/images/youhuiquanyou.png') no-repeat;
  flex-1();
  padding: 24px 0;
  ml(130)
  // flex();
  // justify-content: space-between;
  background-size: contain;

  >div {
    inline()
  }

  .co-title {
    // flex();
    // flex-direction: column;
    // justify-content: space-between;
    width: 66%;
    height 138px
    padding: 0 16px;
    vertical-align top

    > p:first-child {
      ft(16);
      color: #333;
      mb(16);
    }

    > .checkGift {
      ft(12);
      c(#333);
      position: relative;

      > .set-con {
        position: absolute;
        left: -18px;
        pt(20);
        z-index: 99;

        > .drop-down {
          top: 36px;
          left: -18px;
          background: #fff;
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

    > .checkProduct {
      pos(absolute)
      bottom 0
      right 16px
      color: #666666;
    }
  }

  .canvas-coupon {
    box()
    margin-top: -8px;
    border-left: 2px dashed #EDEDED;
    height: 150px;
    width: 26%;
    text-c()
    // justify-content: center;
    // align-items: center;
    // flex-direction: column;
    // display: flex;

    > div {
      box()
      margin 0 auto
      width 80px
      padding: 5px 16px 7px;
      color: #fff;
      background-color: #E53935;
      border-radius: 24px;
    }

    > canvas {
      block()
      margin 30px auto 0
    }

    p {
      box();
      inline()
      padding: 5px 16px 7px;
      color: #E53935;
      bg(#fff);
      border: 1px solid #E53935;
      border-radius: 24px;

      &:hover {
        bg(#e53935);
        c(#fff);
      }
    }

    img {
      width: 64px;
      height: 64px;
      box();
      padding: 5px;
      mt(30)
    }
  }
}

.pagination {
  clear: both;
  display: flex;
  justify-content: flex-end;
  mt(24);
  mb(24);
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

.coupon-empty {
  padding: 120px 0;

  > img {
    squ(120);
    mb(32);
  }

  > span {
    ft(16);
    c(#666);
    block();
    text-c();
  }
}
</style>
