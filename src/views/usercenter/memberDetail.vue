<template>
  <div class="bg-w member">
    <div class="member-title">
      <router-link to="/myOrderEntry/myJiupi" class="c-3 fz14">我的久批</router-link>&nbsp;>&nbsp;
      <span class="c-9 fz14">会员俱乐部</span>
    </div>
    <div class="member-head">
      <p class="fz40 c-w">{{userClub.currentIntegral}}</p>
      <p class="fz18 c-w member-coin">
        近12个月有效增加酒币数
        <img class="cs" src="../../assets/images/shengjiguize-icon.png" @click="checkWarning = true">
      </p>
      <router-link class="fz16 c-w" to="/myOrderEntry/ruleMember" v-if="userClub.nextLevel">还差{{userClub.integral}}个有效增加酒币数升级为{{userClub.nextLevel}}会员,查看升级规则>></router-link>
      <router-link class="fz16 c-w" to="/myOrderEntry/ruleMember" v-else>您当前已是{{userClub.userLevelName}}会员,查看升级规则&gt;&gt;</router-link>
      <div class="member-level">
        <div class="member-level-line">
          <div>
            <p class="member-level-select" :class="{'member-level-baiyin': userClub.currentUserLevelId==1}">
              <span></span>
            </p>
            <p class="member-level-select" :class="{'member-level-huangjin': userClub.currentUserLevelId==2}">
              <span></span>
            </p>
            <p class="member-level-select" :class="{'member-level-zuanshi': userClub.currentUserLevelId==3}">
              <span></span>
            </p>
            <p class="member-level-select" :class="{'member-level-end': userClub.currentUserLevelId==4}">
              <span></span>
            </p>
          </div>
        </div>
        <div class="member-putong">
          <div></div>
          <p class="fz14 c-w">普通会员</p>
        </div>
        <div class="member-vip">
          <div>
            <dl>
              <dt>
                <s class="icon-yinpai"></s>
              </dt>
              <dd>银牌会员</dd>
            </dl>
          </div>
          <div>
            <dl>
              <dt>
                <s class="icon-jinpai"></s>
              </dt>
              <dd>金牌会员</dd>
            </dl>
          </div>
          <div>
            <dl>
              <dt>
                <s class="icon-zuanshi"></s>
              </dt>
              <dd>钻石会员</dd>
            </dl>
          </div>
        </div>
      </div>
    </div>
    <div class="member-level-detail">
        <div class="level-detail-head">
            <p style="margin-top: 27px;">会员权益</p>
            <p>普通会员<span>有效增加酒币数≤100</span></p>
            <p>银牌会员<span>有效增加酒币数≥101</span></p>
            <p>金牌会员<span>有效增加酒币数≥1001</span></p>
            <p>钻石会员<span>有效增加酒币数≥5001</span></p>
        </div>
        <div class="level-detail-content">
            <div class="level-content1">
                <p><img src="../../assets/images/icon_huiyuanzhuanxiang.png">专享活动参与特权</p>
                <p><img src="../../assets/images/icon_huiyuanyouhui.png">指定商品优惠特权</p>
                <p><img src="../../assets/images/icon_zhida.png">经理服务直达</p>
                <p><img src="../../assets/images/icon_youxianfuwu.png">优先服务</p>
            </div>
            <div class="level-content2" :class="{'level-select-bg': userClub.currentUserLevelId==1}">
                <p v-for="item in list"></p>
            </div>
            <div class="level-content2" :class="{'level-select-bg': userClub.currentUserLevelId==2}">
                <p v-for="(item,index) in list" :class="{'level-content-select': index<2}"></p>
            </div>
            <div class="level-content2" :class="{'level-select-bg': userClub.currentUserLevelId==3}">
                <p v-for="item in list" class="level-content-select"></p>
            </div>
            <div class="level-content2" :class="{'level-select-bg': userClub.currentUserLevelId==4}">
                <p v-for="item in list" class="level-content-select"></p>
            </div>
        </div>
    </div>
    <div class="level-introduce">
        <div class="level-introduce-head">权益介绍</div>
        <div class="level-introduce-content">
            <p>
                <span class="zhuanxiang-img">专享活动参与特权</span>
                <i></i>
            </p>
            <div>
                参与易久批线上线下各种专享会员活动的资格。例如：参与特别优惠活动的权限、超限制数量购买、紧缺产品的优先下单权、新品/品鉴产品 /赠品免费领取…等等。
            </div>
        </div>
        <div class="level-introduce-content">
            <p>
                <span class="youhui-img">指定商品优惠特权</span>
                <i></i>
            </p>
            <div>
                购买指定产品，可在现有批价基础上，额外再享受会员折扣或其它优惠。
            </div>
        </div>
        <div class="level-introduce-content">
            <p>
                <span class="zhida-img">经理服务直达</span>
                <i></i>
            </p>
            <div>
               可直接联系公司经理服务，或由公司高级别人员直接接待，获得VIP级的服务。优先处理找货与投诉问题，快速响应需求。
            </div>
        </div>
        <div class="level-introduce-content">
            <p>
                <span class="fuwu-img">优先服务</span>
                <i></i>
            </p>
            <div>
                钻石会员，优先处理找货与投诉问题。
            </div>
        </div>
    </div>
    <el-dialog title="温馨提示" width="576px" center :visible.sync="checkWarning">
        <div class="member-warning">
        <p class="c-3 fz14">会员等级：以会员近12个月有效增加酒币的数量为划分依据，每月计算一次会员等级。</p>
        <p class="c-3 fz14">无效酒币：用户退货时，订单金额赠送酒币、单品酒币全部退回，这部分不算有效酒币。</p>
        <p class="c-3 fz14">计算时，会减掉无效酒币。</p>
        <div @click="checkWarning = false">我知道了</div>
        </div>
    </el-dialog>
  </div>
</template>
<script>
import * as assetsCenter from "@/api/assetsCenter/assetsCenter";
export default {
  name: "memberDetail",
  data(){
      return {
          userClub: {},
          list: [1,2,3,4],
          checkWarning: false
      }
  },
  created(){
      assetsCenter.getUserClub().then(res => {
          if(res.success){
              this.userClub = res.data;
              res.data.userLevels.forEach((item,index) => {
                  if(item.userLevelId==res.data.currentUserLevelId){
                      this.userClub.userLevelName=item.userLevelName;
                      if(res.data.currentUserLevelId == res.data.userLevels.length){
                        
                      }else {
                        this.userClub.nextLevel = res.data.userLevels[index+1].userLevelName;
                        this.userClub.integral = item.maxGrownIntegralNum - res.data.currentIntegral+1;
                      }
                  }
              })
          }
      })
  }
};
</script>
<style lang="stylus">
.member {
  width: 100%;
  pl(20)
  pr(20)
  pb(38)
}

.member-title {
  height: 50px;
  lh(50);
  c(#333);
  ml(10);
}

.member-head {
  box();
  width: 100%;
  height: 320px;
  pt(48);
  text-c();
  background: url('../../assets/images/profile-customer-img.png') no-repeat;
  background-size: cover;
}

.member-coin {
  margin: 32px 0 23px;

  img {
    inline();
    position: relative;
    top: 3px;
  }
}

.member-level {
  position: relative;
  margin: 30px auto 0;
  width: 90%;
  height: 98px;
}

.member-level-line {
  width: 100%;
  position: absolute;
  top: 32px;
  left: 0;
  padding: 0 32px;
  box();

  >div {
    width: 100%;
    height: 6px;
    bg(#ffd8ce);
  }
}

.member-level-select {
  height: 6px;
  bg(#ffca3a);
  position: relative;
  display: none;

  span {
    box();
    block();
    width: 32px;
    height: 32px;
    border-radius: 50%;
    position: absolute;
    top: -14px;
    right: 0;
    bg(#fff);
    border: 8px solid #ffca3a;
  }
}

.member-level-baiyin {
  width: 16.6%;
  block();
}

.member-level-huangjin {
  width: 50%;
  block();
}

.member-level-zuanshi {
  width: 80.4%;
  block();
}

.member-level-end {
  width: 100%;
  block();
}

.member-putong {
  width: 68px;
  float: left;
  text-c();

  div {
    position: relative;
    z-index: 20;
    width: 68px;
    height: 66px;
    background: url('../../assets/images/icon_putonghiyuan.png') no-repeat;
    background-size: cover;
  }

  p {
    lh(28);
  }
}

.member-vip {
  ml(-68);
  width: 100%;
  pl(68);
  float: left;
//   display: flex;
//   justify-content: center;
  box();

  >div {
    // flex();
    // justify-content: flex-end;
    // flex: 1;
    flt()
    width: 33.33%;
    position: relative;

    >dl {
      float: right;
      width: 68px;

      >dt {
        width: 68px;
        height: 66px;
        position: relative;
        z-index: 20;

        >s {
          block();
          width: 38px;
          height: 36px;
          position: absolute;
          left: 0;
          right: 0;
          margin: 14px auto 0;
        }

        .icon-yinpai {
            background: url('../../assets/images/icon-yinpaihuiyuan.png');
            background-size: cover;
        }
        .icon-jinpai {
            background: url('../../assets/images/icon-huangjinyuiyuan.png');
            background-size: cover;
        }
        .icon-zuanshi {
            background: url('../../assets/images/icon-zuanshihuiyuan.png');
            background-size: cover;
        }
      }

      >dd {
        ft(14);
        c(#fff);
        lh(28);
      }
    }
  }
}

.member-level-detail {
    width: 100%;
    mt(40)
}

.level-detail-head {
    height 72px
    width 100%
    bg(#ffc3c3)

    p {
        inline()
        box()
        width 20%
        text-c()
        ft(18)
        mt(20)
        vertical-align text-top

        span {
            block()
            ft(13)
            mt(10)
        }
    }
}

.level-detail-content {
    width 100%
}

.level-content1 {
    width 20%
    inline()
    position relative
    top -20px

    p {
        bg(#fdecea)
        ft(13)
        height 50px
        lh(50)
        box()
        padding-left 23%
        border-left 1px solid #ffc3c3;
        border-right 1px solid #ffc3c3;
        border-bottom 1px solid #ffc3c3;

        img {
            inline()
            position relative
            top 5px
            right 10px
        }
    }
}

.level-content2 {
    width 20%
    inline()

    p {
        height 50px
        box()
        border-right 1px solid #ffc3c3;
        border-bottom 1px solid #ffc3c3;
    }
}

.level-select-bg {
    bg(#eaf4fe)
}

.level-content-select {
    background url('../../assets/images/icon-dui.png') no-repeat center
}

.level-introduce {
    width 100%
    mt(20)
    border: 1px solid #ffc3c3;
}

.level-introduce-head {
    width 200px
    height 44px
    background url('../../assets/images/icon-cut.jpg') no-repeat top right #ffc3c3
    ft(18)
    text-c()
    lh(44)
    mb(27)
}

.level-introduce-content {
    padding 0 35px
    lh(28)
    mb(35)

    p {
        position relative
        padding 0 10px

        span {
            position absolute 
            z-index 20
            padding 0 10px 0 36px
            lh(28)
            ft(16)
            background-color #fff
        }

        i {
            inline()
            width 100%
            height 2px
            bg(#ffc3c3)
            position relative
            top -3px
            z-index 10
        }
    }

    div {
        ft(14)
        lh(22)
        pt(14)
        pl(45)
    }
}

.zhuanxiang-img {
    background: url('../../assets/images/icon_huiyuanzhuanxiang.png') no-repeat 0 center #fff;
}
.youhui-img {
    background: url('../../assets/images/icon_huiyuanyouhui.png') no-repeat 0 center #fff;
}
.zhida-img {
    background: url('../../assets/images/icon_zhida.png') no-repeat 0 center #fff;
}
.fuwu-img {
    background: url('../../assets/images/icon_youxianfuwu.png') no-repeat 0 center #fff;
}

.member-warning {
    lh(25)

    div {
        width 150px
        height 34px
        bg(#e43834)
        ft(14)
        c(#fff)
        lh(34)
        text-c()
        margin: 30px auto 0
        cursor pointer
    }
}

.el-dialog__header {
  border-bottom: 1px solid #ededed;
}
</style>
