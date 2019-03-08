<template>
  <div id="realName">
    <div class="realNameHeader">
      <a>
        <img src="../../assets/images/logo.png" class="logo">
      </a>
      <span>实名认证</span>
    </div>
    <div class="phoneCertification">
      <div class="main" v-if="realInfo.authenSuccess==false">
        <img src="../../assets/images/shimingrz_weitg.png" >

        <p class="fz24 c-0">审核未通过</p>

        <span class="fz16 c-6">您的实名认证审核未通过。</span>

        <span class="fz16 c-red">未通过理由：{{realInfo.failReason}}</span>
        <router-link class="again-button" to="/certificationEntry/phoneCertification">再次认证</router-link>
        <p class="activityTitle fz12">{@活动描述@：可以获得<span class="c-yellow">40酒币</span>可用于抽奖和抵扣}</p>
      </div>
      <div class="success-main" v-else>
        <!--成功时的图片-->
        <img src="../../assets/images/shimingrz-04.png">
        <!--成功时的内容-->
        <p class="fz24 c-0">提交成功</p>
        <!--成功时的副内容-->
        <span>运营人员正在审核中，请耐心等待！实名认证后可以畅享在线支付带来的快捷和便利。</span>
        <router-link class="again-button" style="background:#4CAF50" to="/myOrderEntry/myJiupi">完成</router-link>
        <p class="activityTitle fz12">{@活动描述@：可以获得<span class="c-yellow">40酒币</span>可用于抽奖和抵扣}</p>
      </div>
    </div>
  </div>
</template>

<script>
import * as assetsCenter from "api/assetsCenter/assetsCenter";
  export default {
    name: "realNameCertification",
    data() {
      return {
        realInfo: {
          
        }
      }
    },
    mounted(){},
    created(){
      this.realInfo = this.$route.query.realInfo
      // assetsCenter.getUserAuthenDetail().then(res => {
      //   realInfo.authenState = res.data.authenState;
      // })
    },
    methods:{

    }
  }
</script>

<style scoped lang="stylus">
  #realName {
    width: 100%
  }

  .realNameHeader {
    border-bottom: 1px solid #e0e0e0;
    flex();
    padding 26px 18%;
    align-items center;
    .logo {
      width: 141px;
      height: 55px;
      mr(22);
    }
    span {
      ft(18);
      c(#212121);
    }
  }

  .phoneCertification {
    mt(134)
    width: 100%;
    flex-center()
    .main,.success-main {
      display: flex;
      flex-direction:column;
      align-items center;
      text-align center
      img{
        squ(120);
        mb(31);
      }
      p{
        pb(24)
      }
      span{
        ft(16)
        lh(28)
      }
    }
    .again-button {
      height: 48px;
      bg(#E53935);
      c(#fff);
      ft(18);
      lh(48);
      text-c();
      radius(4);
      mt(32);
      width: 376px;
    }
    .activityTitle {
      c(#bdbdbd);
      mt(16);
      text-c();
    }
  }
</style>
