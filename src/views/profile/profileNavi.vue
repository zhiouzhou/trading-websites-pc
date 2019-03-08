<template>
  <div id="nav">
    <div class="w">
      <div class="N-search-area clearfix">
        <router-link to="/index/home" class="img-log flt">
          <img src="../../assets/images/logo.png" alt>
        </router-link>
        <i class="line"></i>
        <div class="myJiupi-title">
          <p>我的酒批</p>
          <router-link to="/index/home">返回商城首页&lt;&lt;</router-link>
        </div>
        <ul class="page-entry">
          <li
            class="jiupi-home"
            @mouseenter="homeDropState=true"
            :style="homeDropState?'color:#e53935':''"
            @mouseleave="homeDropState=false"
          >
            首页
            <i
              :class="[homeDropState?'el-icon-arrow-up':'el-icon-arrow-down']"
              :style="homeDropState?'color:#e53935':''"
            ></i>
            <div class="set-con">
              <ul class="drop-down" v-show="homeDropState">
                <div class="sanjiao"></div>
                <li>
                  <router-link to="/myOrderEntry/myOrders">订单中心</router-link>
                </li>
                <li>
                  <router-link to="/myOrderEntry/myCoupon">资产中心</router-link>
                </li>
                <li>
                  <router-link to="/myOrderEntry/favoriteProduct">关注中心</router-link>
                </li>
                <li>
                  <router-link to="/myOrderEntry/findGoods">帮助中心</router-link>
                </li>
              </ul>
            </div>
          </li>
          <li
            class="account-set"
            :style="dropState?'color:#e53935':''"
            @mouseenter="dropState=true"
            @mouseleave="dropState=false"
          >
            账户设置
            <i
              :class="[dropState?'el-icon-arrow-up':'el-icon-arrow-down']"
              :style="dropState?'color:#e53935':''"
            ></i>
            <div class="set-con">
              <ul class="drop-down" v-show="dropState">
                <div class="sanjiao"></div>
                <li>
                  <router-link to="/myOrderEntry/userinfo">个人信息</router-link>
                </li>
                <li>
                  <router-link to="/myOrderEntry/userinfo">收货地址</router-link>
                </li>
                <li>
                  <router-link to="/myOrderEntry/userinfo">修改密码</router-link>
                </li>
              </ul>
            </div>
          </li>
        </ul>
        <div class="search-wrap flt clearfix">
          <form v-on:submit.prevent class="pre">
            <input
              type="text"
              v-bind:placeholder="productSearchLabel"
              v-model="keyWord"
              @input="inputDebounce"
              @keyup.enter="_doSearch"
            >
            <a class="p0 fz16" href="javascript:;" @click="_doSearch()">搜索</a>
            <ul class="fuzzy-search-list" v-show="fuzzySearchList.length">
              <li v-for="item in fuzzySearchList">
                <a href="javascript:;" @click="_doSearch(item)">{{item}}</a>
              </li>
            </ul>
          </form>
        </div>
          <a class="N-cart frt pre" v-if="!isVisitor" href="#/cartIndex/shopCart" target='_blank'>
          <i></i>
          <b>{{cartCount}}</b>
          我的购物车
        </a>
      </div>
    </div>
  </div>
</template>

<script>
import  mixin  from "common/mixin/navMixin";
export default {
  name: "profile-nav",
  mixins:[mixin],
  data() {
    return {
      dropState: false,
      homeDropState: false
    };
  }
};
</script>

<style scoped lang="stylus">
#nav {
  width: 100%;
  height: 84px;
  background: rgba(255, 255, 255, 1);
  margin-bottom: 30px;
}

.fuzzy-search-list {
  pos(absolute);
  top: 38px;
  left: -2px;
  bg(#fff);
  width: 100%;
  height: auto;
  padding: 8px 1px;
  b1($color-base-hr);
  z-index: 10;

  li {
    a {
      block();
      lh(26);
      h(26);
      c(#333);
      pl(16);
    }
  }
}

.N-search-area {
  h(84);

  .line {
    width: 1px;
    height: 34px;
    block();
    bg(#ededed);
    margin: 25px 16px 0;
    flt();
  }

  .myJiupi-title {
    flt();

    >p {
      ft(20);
      c(#333);
      padding-bottom: 10px;
      pt(20);
    }

    >a {
      block();
      ft(14);
      c(#999);
      font-family: MicrosoftYaHei;
    }
  }
}

.page-entry {
  flex();
  align-items: center;
  flt();
  margin: 34px 0 34px 96px;

  li {
    ft(16);
    c(#333);

    > i {
      font-weight: bold;
      c(#333);
      pl(6);
    }
  }
}

.account-set, .jiupi-home {
  mr(35);
  position: relative;

  > .set-con {
    position: absolute;
    /* top:36px */
    left: -18px;
    padding-top: 20px;
    z-index: 99;

    > .drop-down {
      /* position: absolute */
      top: 36px;
      left: -18px;
      background: #fff;
      width: 104px;
      box-shadow: 0px 6px 8px 0px rgba(0, 0, 0, 0.1), 0px -2px 8px 0px rgba(0, 0, 0, 0.1);

      .sanjiao {
        width: 20px;
        height: 20px;
        box-shadow: -4px -4px 4px -3px rgba(0, 0, 0, 0.1), 0px 0px 0px 0px rgba(0, 0, 0, 0.1);
        background: #fff;
        transform: translateX(42px) translateY(-9px) rotate(45deg);
      }

      li {
        a {
          block();
          width: 100%;
          text-c();
          ft(14);
          c(#333);
          pb(12);
           &:hover {
            c(#e53935);
          }
        }
      }


    }
  }
}

.img-log {
  > img {
    mt(14);
    width: 140px;
    height: 60px;
  }
}

.search-wrap {
  width: auto;
  mt(24);
  flt();

  form {
    width: 280px;
    height: 36px;
    border: 2px solid $color-base-theme;

    & > input {
      width: 200px;
      float: left;
      line-height: 36px;
      ft(14);
      c(#333);
      text-indent: 12px;
    }

    & > a {
      float: left;
      width: 80px;
      line-height: 36px;
      color: #fff;
      background: $color-base-theme;
      border: 0;
      text-c();
    }
  }
}

@media screen and (min-width: 1230px) {
  .search-wrap {
    ml(152);

    form {
      width: 280px;

      & > input {
        width: 200px;
      }
    }
  }
}

.nav-bar {
  border-bottom: 1px solid $color-base-hr;
}

.N-cart {
  width: 114px;
  height: 36px;
  mt(24);
  c(#666);
  lh(36);
  text-c();
  cp();
  background: rgba(255, 255, 255, 1);
  border: 1px solid #EDEDED;

  > i {
    inline();
    squ(20);
    vm();
    mt(-2);
    background: url('../../assets/images/home/dingbugouwuche_ic_hong.png') no-repeat;
    background-size: cover;
  }

  > b {
    inline();
    pos(absolute);
    top: 8px;
    right: 8px;
    padding: 1px;
    font-size: 12px;
    line-height: 12px;
    color: #fff;
    background-color: #f10215;
    -moz-border-radius: 7px;
    border-radius: 7px;
    min-width: 12px;
    text-align: center;
  }
}

.nav-text {
  inline();
  width: 200px;
  height: 42px;
  line-height: 42px;
  background: rgba(63, 60, 60, 1);
  color: #fff;
  text-c();
}

.nav-explain {
  line-height: 42px;
  float: right;
  font-size: 14px;
  font-weight: 700;
  color: #212121;

  > li {
    inline();
    mr(24);

    &:nth-of-type(1) {
      b {
        background: url('../../assets/images/home/yizhanshijinhuo.png') no-repeat;
      }
    }

    &:nth-of-type(2) {
      b {
        background: url('../../assets/images/home/jinjiadi.png') no-repeat;
      }
    }

    b {
      inline();
      squ(16);
      mr(4);
      mt(-4);
      vertical-align: middle;
      background: $color-base-theme;
    }

    &:nth-last-of-type(1) {
      mr(0);
    }
  }
}

.N-link {
  width: auto;
  height: 42px;
  ml(24);

  > li {
    float: left;
    mauto(24);

    > a {
      font-size: 18px;
      line-height: 42px;
      color: $color-dark;
      text-c();

      &.router-link-active {
        color: $color-base-theme;
      }
    }
  }
}
</style>
