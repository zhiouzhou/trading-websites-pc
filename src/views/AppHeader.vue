<template>
  <div id="header">
    <header class="w clearfix">
      <div class="h-left flt" v-if="!isVisitor">
        <router-link to="/index/home" class="h-goback mr10" v-if="showBackArae">
          <i></i>
          久批首页
        </router-link>
        Hi，{{username}}
        <a href="javascript:;" class="fz12 ml10" @click="_loginOut">退出登录</a>
      </div>
      <div class="h-left flt c-3" v-else>
        欢迎来到易久批！
        <a href="#/login" class="fz12">请登录</a>
        <a href="#/reg/step1" class="fz12 c-red ml12">免费注册</a>
      </div>
      <ul class="h-right frt" v-if="!isVisitor">
        <li>
          <router-link to="/myOrderEntry/myOrders">我的订单</router-link>
        </li>
        <li>
          <router-link to="/cartIndex/shopCart">
            <i class="h-icon h-icon-cart"></i>
            购物车({{cartCount}})
          </router-link>
        </li>
        <li>
          <router-link to="/myOrderEntry/myJiupi">我的久批</router-link>
        </li>
        <li>
          <router-link to="/myOrderEntry/favoriteProduct">我的关注</router-link>
          <!--<a href="javascript:;" class="follow-drop">
            <span>我的关注</span>
            <i class="h-icon h-icon-follow"></i>
            <ol class="follow-drop-pull">
              <div class="sanjiao"></div>
              <li>
                <router-link to="/myOrderEntry/favoriteProduct">商品关注</router-link>
              </li>
              <li>
                <router-link to="/myOrderEntry/favoriteShop">经销商关注</router-link>
              </li>
            </ol>
          </a>-->
        </li>
        <li>
          <router-link to="/index/downloadApp">
            <i class="h-icon h-icon-phone"></i>手机久批
          </router-link>
        </li>
      </ul>
    </header>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import { loginOut } from "api/author/author";
import storage from "common/storage";
export default {
  name: "app-header",
  data() {
    return {
      username: localStorage.getItem("USERNAME") || "",
      showBackArae: true
    };
  },
  computed: {
    ...mapGetters(["cartCount"])
  },
  created() {
    this.showBackArae = this.$route.path != "/index/home";
  },
  methods: {
    _loginOut() {
      loginOut()
        .then(res => {
          if (res.success) {
            const username = localStorage.getItem("USERNAME");
            const password = localStorage.getItem("PASSWORD");
            const securityToken = localStorage.getItem("securityToken") || "";
            const rememberPassword = localStorage.getItem("rememberPassword");
            const deviceId = localStorage.getItem("deviceId");
            const searchHistory = storage.get("searchHistory", []);
            const talkingData = storage.get("TalkingData", []);
            const firstShowPrompt = storage.get(
              username + "firstShowPrompt",
              false
            );

            localStorage.clear();
            sessionStorage && sessionStorage.clear();
            localStorage.setItem("USERNAME", username);
            localStorage.setItem("deviceId", deviceId);
            localStorage.setItem("securityToken", securityToken);
            localStorage.setItem("rememberPassword", rememberPassword);
            storage.set("searchHistory", searchHistory);
            storage.set("TalkingData", talkingData);
            storage.set(username + "firstShowPrompt", firstShowPrompt);
            if (rememberPassword == "true") {
              localStorage.setItem("PASSWORD", password);
            }
            this.$router.push({ path: "/login" });
            //提交埋点数据
            this.$submitTalkingData();
          }
        })
        .catch(res => {
          this.$router.push({ path: "/login" });
          //提交埋点数据
          this.$submitTalkingData();
        });
    }
  },
  watch: {
    $route(to, from) {
      const toPathName = to.name;
      this.showBackArae = toPathName != "home";
    }
  }
};
</script>

<style lang="stylus" scoped>
#header {
  width: 100%;
  background: $color-base-bg;
}

header {
  height: 32px;
  line-height: 32px;
  color: #666;
  font-size: 12px;
}

.h-left {
  color: $color-base-theme;

  .h-goback {
    lh(32);

    i {
      inline();
      squ(18);
      mt(-4);
      background: url('../assets/images/home/ic_huidaoshouye.png') no-repeat;
      background-size: contain;
      vertical-align: middle;
    }
  }
}

.h-right {
  li {
    flt();

    &:nth-of-type(3) {
      a {
        border-left: 1px solid #BDBDBD;
      }
    }

    a {
      padding: 0 12px;
    }
  }
}

.h-icon {
  inline();
  vm();
  squ(20);
  mr(5);
}

.h-icon-cart, .h-icon-phone, .h-icon-follow {
  @extend .h-icon;
}

.h-icon-cart {
  mt(-4);
  background: url('../assets/images/home/dingbugouwuche_ic_hong.png') no-repeat;
}

.h-icon-phone {
  mt(-4);
  background: url('../assets/images/home/dibu_shouji.png') no-repeat;
}

.h-icon-follow {
  mt(-4);
  squ(14);
  mr(0);
  background: url('../assets/images/home/ic_xiajiantou_guanzhu.png') no-repeat;
  transform: rotate(0);
  transition: transform 0.2s linear;
}

.follow-drop-pull {
  hide();
  z-index: 5;
  position: absolute;
  w(66);
  padding: 0 12px;
  top: 34px;
  left: 0;
  background: #fff;
  box-shadow: 0px 6px 8px 0px rgba(0, 0, 0, 0.1), 0px -2px 8px 0px rgba(0, 0, 0, 0.1);

  .sanjiao {
    width: 16px;
    height: 16px;
    box-shadow: -4px -4px 4px -3px rgba(0, 0, 0, 0.1), 0px 0px 0px 0px rgba(0, 0, 0, 0.1);
    background: #fff;
    transform: translateX(22px) translateY(-8px) rotate(45deg);
  }

  >li {
    >a {
      line-height: 1;
      padding: 0;

      &:hover {
        c($color-base-theme);
      }
    }
  }
}

.follow-drop {
  w(66);
  inline();
  pos(relative);

  &:hover {
    >span {
      c($color-base-theme);
    }

    .h-icon-follow {
      transform: rotate(180deg) translateY(-2px);
      transition: transform 0.2s linear;
    }

    .follow-drop-pull {
      block();
    }
  }
}
</style>

