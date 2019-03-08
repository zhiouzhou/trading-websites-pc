<template>
    <div class="myJiupi">
      <div class="jiupiInfo">
        <div class="userInfo-center">
          <div class="real">
            <!-- <span class="cs" @click="gotoCertification">{{userWalletInfo.authenState==0||userWalletInfo.authenState == 4?'实名未认证':userWalletInfo.authenState == 1 ? '实名审核中' : userWalletInfo.authenState == 2 ? '已实名认证' : '实名未通过'}}</span> -->
            <span>{{userWalletInfo.authenState==0||userWalletInfo.authenState == 4?'实名未认证':userWalletInfo.authenState == 1 ? '实名审核中' : userWalletInfo.authenState == 2 ? '已实名认证' : '实名未通过'}}</span>
          </div>
          <router-link tag='p' class="user cs" to="/myOrderEntry/userinfo">您好，{{userName}}老板></router-link>
          <div class="phoneNum cs" :class="{'hiddenSign':!canSignIn}" @click="goSign">
            <img src="../../assets/images/myqiandao.png" alt="酒批签到">
            <p>{{alreadySignIn?'已签到>':'签到>'}}</p>
          </div>
          <div class="member-grade pre">
            <div class="memberInfo"><p class="grade">{{userLevelName}}会员</p><span class="jiupiTips">{{nextLevel?`距离${nextLevel}会员还需${integral}个酒币`:"您已达到最高等级"}}</span></div>
            <router-link class="detail-btn" to="/myOrderEntry/memberDetail">查看详情></router-link>
          </div>
        </div>
        <div class="assetsCenter">
          <div class="assetsHeader">资产中心</div>
          <div class="assetsCenter-info">
            <div class="assets-entry">
              <span>{{userWalletInfo.bindBankCardCount}}</span>
              <router-link tag="p" to="/myOrderEntry/myBankCard">银行卡></router-link>
            </div>
            <div class="assets-entry">
              <span>{{userWallet.bonusAmount.toFixed(2)}}</span>
              <router-link tag="p" to="/myOrderEntry/myBonus">红包></router-link>
            </div>
            <div class="assets-entry">
              <span>{{userWallet.couponCount?userWallet.couponCount:0}}</span>
              <router-link tag="p" to="/myOrderEntry/myCoupon">优惠券></router-link>
              <router-link tag="p" to="/couponCenter" class="secondStyle">领券中心></router-link>
            </div>
            <div class="assets-entry">
              <span>{{userWallet.wineScoreAmount}}</span>
              <router-link tag="p" to="/myOrderEntry/myCoin">酒币></router-link>
              <router-link tag="p" to="/myOrderEntry/winescore" class="secondStyle">酒币抽奖></router-link>
            </div>
            <div class="assets-entry">
              <span>{{userWallet.oddBalanceAmount.toFixed(2)}}</span>
              <router-link tag="p" to="/myOrderEntry/oddBalance">零头结余></router-link>
            </div>
          </div>
        </div>
      </div>
      <div class="myOrder">
        <div class="order-header">
          <p class="header-title">我的订单</p>
          <router-link to="/myOrderEntry/myOrders" class="allCheck">查看所有订单></router-link>
        </div>
        <ul class="order-entry">
          <li class="entry-info" @click="gotoMyOrders('8')">
            <p class="entry-icon-daifu"><i v-show="orderCount.waitPayCount">{{orderCount.waitPayCount>99?'99+':orderCount.waitPayCount}}</i></p>
            <span class="entry-title">待付款</span>
          </li>
          <li class="entry-info" @click="gotoMyOrders('1')">
            <p class="entry-icon-daifa"><i v-show="orderCount.readlySend">{{orderCount.readlySend>99?'99+':orderCount.readlySend}}</i></p>
            <span class="entry-title">待发货</span>
          </li>
          <li class="entry-info" @click="gotoMyOrders('9')">
            <p class="entry-icon-pingjia"><i v-show="orderCount.waitEvaluateCount">{{orderCount.waitEvaluateCount>99?'99+':orderCount.waitEvaluateCount}}</i>
            </p>
            <span class="entry-title">待评价</span>
          </li>
          <li class="entry-info"  @click="gotoMyOrders('3')">
            <p class="entry-icon-complete"><i v-show="orderCount.hasComplete">{{orderCount.hasComplete>99?'99+':orderCount.hasComplete}}</i></p>
            <span class="entry-title">已完成</span>
          </li>
          <router-link tag="li" to="/myOrderEntry/returnGoodsManage" class="entry-info">
            <p class="entry-icon-return"><i v-show="orderCount.returnIng">{{orderCount.returnIng>99?'99+':orderCount.returnIng}}</i></p>
            <span class="entry-title">退货</span>
          </router-link>
        </ul>
        <Orders></Orders>
      </div>
      <!--点击实名认证的弹框-->
      <el-dialog
        title="提示"
        :visible.sync="realTypeDialog"
        width="30%"
        center>
        <span class="fz16">{{userWalletInfo.authenState==0||userWalletInfo.authenState == 4?'为了您的账户安全，请先进行实名认证！':userWalletInfo.authenState == 1 ? '您的实名认证正在审核中！' : userWalletInfo.authenState == 2 ? '您的实名认证已通过！' : '您的实名认证未通过，为了您的资金安全，请再次进行实名认证，审核通过后即可使用在线支付。'}}</span>
        <span slot="footer" class="dialog-footer">
        <el-button @click="realTypeDialog = false"
                   v-show="userWalletInfo.authenState==0||userWalletInfo.authenState == 4||userWalletInfo.authenState == 3">取 消</el-button>
        <el-button type="primary" @click="realTypeDialog = false"
                   v-show="userWalletInfo.authenState == 1||userWalletInfo.authenState == 2">确 定</el-button>
        <el-button type="primary" @click="goreal"
                   v-show="userWalletInfo.authenState==0||userWalletInfo.authenState == 4||userWalletInfo.authenState == 3">立即实名认证</el-button>
      </span>
      </el-dialog>
    </div>

</template>

<script>
  import Orders from './../myOrders/myOrders.vue';
  import * as assetsCenter from "api/assetsCenter/assetsCenter";
  import { getSignSetting } from "api/author/author";
  import * as $cache from "common/cache";
  export default {
    name: "myJiupi",
    data() {
      return {
        userWalletInfo: {
          bindBankCardCount: 0
        },    //用户信息统计
        userDetail: {},
        userName: '',
        mobileNo: '',
        userLevelName:'',
        nextLevel: '',
        integral: 0,
        orderCount: {},    //订单数量信息
        userWallet: {
          bonusAmount:0,
          oddBalanceAmount: 0,
          couponCount: 0,
          wineScoreAmount: 0
        },    //用户钱包信息
        realTypeDialog: false,
        bonusAmount:'',
        alreadySignIn: false,
        canSignIn: false
      }
    },
    created() {
      this.getUserDetail();
      this.userDetail = JSON.parse(localStorage.getItem('USER_DETAIL'))
      this.userName = this.userDetail.userName.substring(0, 1)
      this.mobileNo = this.userDetail.mobileNo.substr(0, 3) + '******' + this.userDetail.mobileNo.substr(this.userDetail.mobileNo.length - 2);
      this.getSignSetting()
     assetsCenter.getUserClub().then(res => {
          if(res.success){
              res.data.userLevels.forEach((item,index) => {
                  if(item.userLevelId==res.data.currentUserLevelId){
                      this.userLevelName=item.userLevelName;
                      if(res.data.currentUserLevelId == res.data.userLevels.length){
                        
                      }else {
                        this.nextLevel = res.data.userLevels[index+1].userLevelName;
                        this.integral = item.maxGrownIntegralNum - res.data.currentIntegral+1;
                      }
                  }
              })
          }
      })
    },
    methods: {
      getSignSetting(){
        getSignSetting()
        .then(res => {
          if (res.data) {
            this.canSignIn = true;
            const alreadySignIn = res.data.alreadySignIn; //已签到
            $cache.setCache("alreadySignIn", alreadySignIn);
            this.alreadySignIn = alreadySignIn;
            console.log(this.alreadySignIn)
          }
        })
        .catch(res => {});
      },
      //获取用户信息
      getUserDetail() {
        assetsCenter.GetUserInfo().then(data => {
          if (data.success) {
            this.userWalletInfo = data.data
            this.userWallet = data.data.userWallet
            this.orderCount = data.data.orderCount
          }
        })
      },
      //实名认证
      gotoCertification() {
        this.realTypeDialog = true;
      },
      goreal() {
        this.$router.push({name: 'phoneCertification'})
      },
      //去签到
      goSign(){
        this.$router.push('/index/sign');
      },
      //去我的订单
      gotoMyOrders(activeName){
        this.$router.push({name:'myOrders',query:{activeName}})
      },
    },
    components: {
      Orders
    },
    filters: {
      bonusAmount(value) {
        value = Number(value)
        return value.toFixed(2)
      }
    }
  }
</script>

<style scoped lang="stylus">

  #myJiupi{
    height: auto;
    min-height: 800px;
    padding-bottom: 60px;
    background: $color-base-bg;
    pt(20)
    mb(39)
  }
  .jiupiInfo {
    // flex()
    // align-items: center
  }

  .myJiupi {
    mb(39)
    ml(220)
  }

  .userInfo-center {
    flt()
    inline()
    box()
    pt(38)
    mt(-10)
    background: url(../../assets/images/beijing_wode.png) no-repeat
    width: 25%;
    height: 246px;
    box-shadow: 0px 4px 6px 0px rgba(0, 0, 0, 0.1), 4px 0px 6px 0px rgba(0, 0, 0, 0.1);
    .real {
      squ(70)
      background: url(../../assets/images/dianpu.png) no-repeat
      background-size: 100%
      margin: 0 auto
      position: relative

      > span {
        position: absolute;
        bottom: -6px
        left: -9px
        min-width: 88px
        padding: 5px 0;
        text-c()
        block()
        bg(#FFBE00)
        c(#fff)
        ft(12)
        radius(24)
      }
    }
    .user {
      c(#fff)
      ft(16)
      margin: 22px 0 8px 0
      text-c()
    }
    .phoneNum {
      width 87px
      height 26px
      margin 0 auto 12px
      text-c()
      lh(26)
      bg(#fff)
      radius(13)

      img {
        inline()
        squ(14)
        mr(4)
        vertical-align text-top
      }

      p {
        inline()
        ft(12)
        c(#E53935)
      }
    }

    .hiddenSign {
      visibility hidden
    }
  }

  .member-grade {
    // flex()
    // align-items: center
    // justify-content space-between
    padding: 11px 8px;
    bg(#232331)
    .memberInfo {
      inline()
      width 70%
      .grade {
        c(#FFBE00)
        ft(16)
        padding-bottom: 8px
      }
      .jiupiTips {
        c(#fff)
        ft(12)
      }
    }
    .detail-btn {
      position absolute 
      top 50%
      transform translateY(-50%)
      inline()
      width 30%
      padding: 7px 0;
      text-c()
      c(#fff)

    }
  }

  .assetsCenter {
    inline()
    width: 75%;
    bg(#fff)
    vertical-align top
    .assetsHeader {
      padding: 20px 12px
      border-bottom: 1px solid #ededed
      ft(16)
      c(#333)
      fb()
    }
    .assetsCenter-info {
      height: 170px;
      // width: 100%;
      // flex()
      .assets-entry {
        inline()
        width: 20%
        text-c()
        padding: 32px 0
        vertical-align top
        > span {
          ft(20)
          c(#333)
          font-weight: 600
          padding-bottom: 20px
          block()
        }
        > p {
          ft(14)
          c(#333)
          cursor pointer
        }
        .secondStyle {
          c(#4A90E2)
          mt(38)
        }
      }
    }
  }

  .myOrder {
    mt(20px)
    bg(#fff)
    min-height 425px
    .order-header {
      box()
      padding: 20px 32px 0 12px
      height 57px
      // flex()
      // justify-content: space-between
      // align-items center
      border-bottom: 1px solid #ededed
      .header-title {
        flt()
        ft(16)
        c(#333)
        fb()
      }
      .allCheck {
        frt()
        ft(14)
        c(#999999)
      }
    }
  }

  .order-entry {
    // flex()
    padding: 32px 0 48px
    .entry-info {
      inline()
      width: 20%;
      text-c()
      cursor pointer
      // flex()
      // flex-direction: column
      // align-items center
      .entry-title {
        position relative
        top 16px
        ft(14)
        c(#333)
      }
      p {
        margin 0 auto
        position: relative;
        squ(44)
        i {
          position: absolute;
          right: -6px;
          top: -9px;
          block()
          bg(#E53935)
          width 25px
          height 20px
          text-c()
          lh(20)
          c(#fff)
          radius(50)
        }
      }
      .entry-icon-daifu {
        background: url(../../assets/images/ic_daifukuan.png)
      }
      .entry-icon-daifu:hover {
        background: url(../../assets/images/ic_daifukuan_hong.png)
      }
      .entry-icon-daifa {
        background: url(../../assets/images/ic_daoshouhuo.png)
      }
      .entry-icon-daifa:hover {
        background: url(../../assets/images/ic_daoshouhuo_hong.png)
      }
      .entry-icon-pingjia {
        background: url(../../assets/images/ic_daipinjia.png)
      }
      .entry-icon-pingjia:hover {
        background: url(../../assets/images/ic_daipinjia_hong.png)
      }
      .entry-icon-complete {
        background: url(../../assets/images/ic_yiwancheng.png)
      }
      .entry-icon-complete:hover {
        background: url(../../assets/images/ic_yiwancheng_hong.png)
      }
      .entry-icon-return {
        background: url(../../assets/images/ic-tuihuohuanhuo.png)
      }
      .entry-icon-return:hover {
        background: url(../../assets/images/ic-tuihuohuanhuo_hong.png)
      }
    }
  }

  .myOrders-main{
    width:auto
    ml(0)
  }
</style>
