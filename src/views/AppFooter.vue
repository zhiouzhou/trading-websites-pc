<template>
  <div id="footer">
    <div class="w">
      <div class="f_service">
        <dl>
          <dt></dt>
          <dd>
            <p>易久批配送 品质放心</p>
            <span>全程抄码跟踪</span>
          </dd>
        </dl>
        <dl>
          <dt></dt>
          <dd>
            <p>闪电配送 安全到达</p>
            <span>自建物流同城配送</span>
          </dd>
        </dl>
        <dl>
          <dt></dt>
          <dd>
            <p>部分商品 无忧退换</p>
            <span>售后更放心</span>
          </dd>
        </dl>
        <dl>
          <dt></dt>
          <dd>
            <p>品类齐全 一站式进货</p>
            <span>酒水饮料 应有尽有</span>
          </dd>
        </dl>
      </div>
      <div class="f_about clearfix">
        <ul>
          <li>关于我们</li>
          <li>
            <router-link to="/index/help/about">关于酒批</router-link>
          </li>
          <li>
            <router-link to="/index/help/contact">联系酒批</router-link>
          </li>
          <li>
            <router-link to="/index/help/culture">酒批文化</router-link>
          </li>
          <!-- <li>
            <span to="/index/help/contact" >营业执照</span>
          </li> -->
        </ul>

        <ul>
          <li>新手入门</li>
          <li>
            <router-link to="/index/help/howreg">如何注册</router-link>
          </li>
          <li>
            <router-link to="/index/help/shopprocess">购物流程</router-link>
          </li>
          <li>
            <router-link to="/index/help/protocal">服务协议</router-link>
          </li>
        </ul>
        <ul>
          <li>批发服务</li>
          <li>
            <router-link to="/index/help/aftersales">售后服务</router-link>
          </li>
          <li>
            <router-link to="/index/help/returnprocess">退换流程</router-link>
          </li>
        </ul>
        <ul>
          <li>支付/配送</li>
          <li>
            <router-link to="/index/help/deliverymethod">配送方式</router-link>
          </li>
          <li>
            <router-link to="/index/help/deliveryrule">配送细则</router-link>
          </li>
          <li>
            <router-link to="/index/help/paymethod">付款方式</router-link>
          </li>
        </ul>
        <ul>
          <li>帮助中心</li>
          <li>
            <router-link to="/index/help/faq">常见问题</router-link>
          </li>
          <li>
            <router-link to="/index/help/forgetpwd">忘记密码</router-link>
          </li>
          <li>
            <a href="javascript:;">订单处理</a>
          </li>
        </ul>
      </div>
    </div>
    <div class="copy-right">
      <div class="w">
        <div
          class="footer-text"
        >易酒批电子商务有限公司 © 2016-2019 yijiupi.com All Rights Reserved 京ICP备14053473号-1 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        <div class="footer-text2">
          全国客服电话：400-0199-197
        <span class="footer-text-line">|</span>
        <a class="footer-text-license" href="https://images.yijiupi.com/assets/img/yyzz.jpg" target="_blank">经营证照</a>
        </div>
          <div class="footer-text-img frt">
            <img src="../assets/images/gongshang-icon.jpg" alt>
            <img src="../assets/images/zilvgongyue.png" alt="">
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "app-footer",
  data(){
    return {}
  },
  methods: {
  
  }
};
</script>

<style lang="stylus">
#footer {
  width: 100%;
  bg(#fff);
  pt(30);
  border-top: 1px solid #ededed;
}

.footer-icon {
}

.copy-right {
  mt(20);
  height: 86px;
  background: rgba(63, 60, 60, 1);
}

.footer-text-img {
  inline()
  mt(-8)
  // pt(10)
  box()
  >img {
    inline();

    &:nth-of-type(1) {
      squ(34);
    }

    &:nth-of-type(2) {
      ml(12)
      w(94);
      h(34);
    }
  }
}

.footer-text {
  box();
  lh(14);
  c(#fff);
  ft(12);
  height: 86px;
  pt(22)
}

.footer-text-line {
  margin 0 24px
  ft(14)
}

.footer-text-license {
  mr(180)
  c(#fff)
}

.footer-text2 {
  inline()
  mt(17)
}

.f_about {
  mt(20);

  >ul {
    float: left;
    width: 20%;
    box();
    pl(50);

    >li {
      ft(14);
      c(#757575);
      lh(28);

      &:nth-of-type(1) {
        ft(16);
        lh(32);
        c(#212121);
      }

      span {
        cursor pointer
      }
    }
  }
}

.f_service {
  >dl {
    mauto(20);
    inline();

    &:nth-of-type(2) {
      >dt {
        // background-position: -50px 0;
         background-image: url('../assets/images/youshiic_2.png');
      }
    }

    &:nth-of-type(3) {
      >dt {
        // background-position: -100px 0;
         background-image: url('../assets/images/youshiic_3.png');
      }
    }

    &:nth-of-type(4) {
      >dt {
        // background-position: -150px 0;
         background-image: url('../assets/images/youshiic_4.png');
      }
    }

    dt {
      float: left;
      squ(40);
      mr(12);
      background-image: url('../assets/images/youshiic_1.png');
      background-repeat: no-repeat;
      background-position: 0 0;
    }

    dd {
      float: left;

      >p {
        ft(16);
        c(#333);
      }

      >span {
        inline();
        mt(8);
        ft(14);
        c(#999);
      }
    }
  }
}

@media screen and (min-width: 1230px) {
  .f_service>dl {
    mauto(46);
  }
}
@media screen and (min-width: 1230px) {
  .footer-text2 {
    inline()
  }

  .footer-text-img {
    lh(86)
  }
}
</style>


