<template>
  <div class="side-bar-container" :class="{'side-bar-fixed':!showCartCount}">
    <ul class="side-bar-top">
      <li>
        <a
          href="javascript:;"
          @click="_enterSomeWhere('/myOrderEntry/myJiupi',1)"
          class="sidebar-icon-item sidebar-jiupi"
        >
          <span class="side-bar-font side-bar-opacity">我的久批</span>
          <i class="side-bar-icon"></i>
        </a>
      </li>
      <li>
        <a
          href="javascript:;"
          class="sidebar-cart cart-lump"
          @click.stop="tapMiniCart"
          v-if="showCartCount"
        >
          <i class="side-bar-icon"></i>
          <span class="title">购物车</span>
          <span class="count">
            <i class="fz10">{{cartCount}}</i>
          </span>
        </a>
        <a
          v-else
          href="javascript:;"
          class="sidebar-icon-item sidebar-cart"
          @click="_enterSomeWhere('/cartIndex/shopCart', 2)"
        >
          <span class="side-bar-font side-bar-opacity">购物车</span>
          <i class="side-bar-icon"></i>
        </a>
      </li>
      <li>
        <a
          href="javascript:;"
          class="sidebar-icon-item sidebar-changgou"
          @click="_enterSomeWhere('/index/alwaysBuyList', 3)"
        >
          <span class="side-bar-font side-bar-opacity">常购清单</span>
          <i class="side-bar-icon"></i>
        </a>
      </li>
      <li>
        <a
          href="javascript:;"
          class="sidebar-icon-item sidebar-shoucang"
          @click="_enterSomeWhere('/myOrderEntry/favoriteProduct', 4)"
        >
          <span class="side-bar-font side-bar-opacity">我的关注</span>
          <i class="side-bar-icon"></i>
        </a>
      </li>
      <li>
        <a
          href="javascript:;"
          class="sidebar-icon-item sidebar-zuji"
          @click="_enterSomeWhere('/myOrderEntry/history', 5)"
        >
          <span class="side-bar-font side-bar-opacity">我的足迹</span>
          <i class="side-bar-icon"></i>
        </a>
      </li>
    </ul>
    <div class="side-bar-qiandao" v-if="showSignEnter">
      <a href="javascript:;" @click="_enterSign()">
        <img src="../../assets/images/qiandao.gif" alt="酒批签到">
      </a>
      <!-- <span @click="_closeSign"></span> -->
    </div>
    <ul class="side-bar-bottom">
      <li>
        <a
          href="javascript:;"
          class="sidebar-icon-item sidebar-erweima"
          @click="_enterSomeWhere('/myOrderEntry/findGoods', 6)"
        >
          <span class="side-bar-font side-bar-opacity">帮我找货</span>
          <i class="side-bar-icon"></i>
        </a>
      </li>
      <li>
        <a
          href="javascript:;"
          class="sidebar-icon-item sidebar-tousu"
          @click="_enterSomeWhere('/myOrderEntry/complainSuggestion', 7)"
        >
          <span class="side-bar-font side-bar-opacity">投诉建议</span>
          <i class="side-bar-icon"></i>
        </a>
      </li>
      <li>
        <a href="javascript:;" @click="_scrollTop" class="sidebar-icon-item sidebar-top">
          <span class="side-bar-font side-bar-opacity">返回顶部</span>
          <i class="side-bar-icon"></i>
        </a>
      </li>
    </ul>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import bus from "common/bus";
import { scrollSmoothTo } from "common/lodash";
import { getSignSetting } from "api/author/author";
import * as $cache from "common/cache";
export default {
  data() {
    return {
      showSignEnter: false, //首页展示签到
      showCartCount: false //首页展示购物车
    };
  },
  created() {
    //1 /25
    if (this.$route.path == "/index/home") {
      const alreadySignIn = $cache.getCache("alreadySignIn");
      if (!alreadySignIn) {
        this._getSignSetting();
      }
      this.showCartCount = true;
      this.showSignEnter = true;
    }
  },
  computed: {
    ...mapGetters(["cartCount"])
  },
  methods: {
    _getSignSetting() {
      getSignSetting()
        .then(res => {
          if (res.data) {
            const alreadySignIn = res.data.alreadySignIn; //已签到
            $cache.setCache("alreadySignIn", alreadySignIn);
          } else {
            //此时没有签到活动
            this.showSignEnter = false;
          }
        })
        .catch(res => {});
    },
    //侧边栏购物车
    tapMiniCart() {
      bus.$emit("toggleMiniCart", "");
      this.$createTalkingData("index", "Index_Right_Navigation_Bar", {
        talkId: 2
      });
    },
    _scrollTop() {
      scrollSmoothTo(0);
      this.$createTalkingData("index", "Index_Right_Navigation_Bar", {
        talkId: 9
      });
    },
    _closeSign() {
      $cache.setCache("alreadySignIn", true);
    },
    /*1.我的久批 2.购物车 3.常购清单 4.我的收藏 5.我的足迹 6.帮我找货 7.投诉建议   9.返回顶部 */
    _enterSomeWhere(path, id) {
      this.$router.push({ path });
      this.$createTalkingData("index", "Index_Right_Navigation_Bar", {
        talkId: id
      });
    },
    //签到enter
    _enterSign() {
      this.$router.push({ path: "/index/sign" });
      this.$createTalkingData("index", "Index_Singin_Pop", {});
    }
  }
};
</script>

<style lang="stylus">
.side-bar-fixed {
  position: fixed !important;
  top: 0;
  right: 0;
}

.side-bar-qiandao {
  pos(absolute);
  right: 15px;
  top: 55%;
  text-c();
  transform: translateY(-50%);
  w(80);

  a {
    block();
    squ(80);
  }

  span {
    cp();
    inline();
    squ(16);
    background: url('../../assets/images/icon_clear.png') no-repeat;
    background-size: cover;
  }
}

.side-bar-container {
  width: 36px;
  height: 100%;
  min-height: 600px;
  background: #3f3c3c;
  z-index: 100;
  position: absolute;

  >ul {
    pos(absolute);
    right: 0;

    >li {
      &:nth-last-of-type(1) {
        .sidebar-icon-item {
          mb(0);
        }
      }
    }
  }
}

.side-bar-top {
  bottom: 50%;
}

.side-bar-bottom {
  top: 72%;
}

.side-bar-content {
  width: 36px;
  height: 100%;
  position: absolute;
  top: 0;
  right: 0;
  background: #3f3c3c;
  z-index: 9998;
}

.sidebar-icon-item {
  display: block;
  position: relative;
  height: 34px;
  padding: 0 6px;
  margin-bottom: 20px;
  cursor: pointer;
  z-index: 10;
}

.sidebar-icon-item:hover {
  background: #f0593a;
}

.sidebar-icon-item .side-bar-opacity {
  opacity: 0;
}

.sidebar-icon-item .side-bar-font {
  opacity: 0;
  position: absolute;
  left: 0px;
  background: #f0593a;
}

.sidebar-icon-item:hover .side-bar-font {
  opacity: 1;
  background: #f0593a;
  color: #fff;
  position: absolute;
  transform: translateX(-90px);
  transition: 0.1s linear;
  -webkit-transition: 0.1s linear;
}

.sidebar-icon-item:hover .side-bar-opacity {
  opacity: 1;
  transition: 0.1s linear;
}

.side-bar-font {
  width: 90px;
  height: 34px;
  font-size: 13px;
  line-height: 34px;
  color: #fff;
  text-align: center;
}

.side-bar-icon {
  display: inline-block;
  width: 24px;
  height: 34px;
  background: url('../../assets/images/home/side-bar-icon.png') no-repeat;
}

.sidebar-jiupi .side-bar-icon {
  background-position: 0 -280px;
}

.sidebar-cart .side-bar-icon {
  background-position: -42px -280px;
}

.sidebar-shoucang .side-bar-icon {
  background-position: -127px -280px;
}

.sidebar-zuji .side-bar-icon {
  background-position: -172px -280px;
}

.side-bar-bottom {
  position: absolute;
  bottom: 0;
}

.sidebar-tousu .side-bar-icon {
  background-position: -213px -278px;
}

.sidebar-erweima .side-bar-icon {
  background-position: -296px -278px;
}

.sidebar-top .side-bar-icon {
  background-position: -339px -278px;
}

.sidebar-changgou .side-bar-icon {
  background-position: -85px -280px;
}

.cart-lump {
  w(36);
  flex();
  flex-direction: column;
  align-items: center;
  bg(#EB583A);
  ft(14);
  c(#fff);
  padding: 12px 0;
  mb(20);

  .title {
    position: relative;
    left: 80%;
    transform: translateX(-50%);
    ft(14);
    line-height: 1.3;
    letter-spacing: 20px;
  }

  .count {
    mt(6);
    bg(#FFFFFF);
    w(20);
    h(20);
    border-radius: 50%;
    c(#EB583A);

    i {
      position: relative;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
    }
  }
}
</style>


