<template>
  <div id="navi">
    <!-- <sideBar v-if="!isVisitor"/> -->
    <div class="w">
      <div class="N-search-area clearfix">
        <a href="#/index/home" class="img-log flt">
          <img src="../assets/images/logo.png" alt="易久批官方商城">
        </a>
        <div
          class="N-address-wrap flt"
          @mouseenter="isVisitor?showChangeCity=true:''"
          @mouseleave="isVisitor?showChangeCity=false:''"
        >
          <a class="N-address flt" :class="{'border-bottom-white':showChangeCity}">
            <i></i>
            {{currentCityName}}
            <b v-if="isVisitor"></b>
          </a>
          <changeCities v-show="showChangeCity && isVisitor"/>
        </div>
        <div class="search-wrap flt clearfix">
          <form v-on:submit.prevent class="pre">
            <input
              type="text"
              v-bind:placeholder="productSearchLabel"
              v-model="keyWord"
              @input="inputDebounce"
              @keyup.enter="_doSearch"
              @blur="delayBlur"
              @focus="focusEvt"
            >
            <a class="p0 fz16" href="javascript:;" @click="_doSearch()">{{showDealerSearch?`搜全站`:`搜索`}}</a>
            <!-- fuzzySearchList -->
            <ul class="fuzzy-search-list" v-show="fuzzySearchList.length && focusing">
              <li v-for="item in fuzzySearchList">
                <a href="javascript:;" @click.stop="_doSearch(item)">{{item}}</a>
              </li>
            </ul>
            <!--经销商店铺搜索按钮-->
            <div class="dealer-search" @click="_dealerSearch" v-if="showDealerSearch">搜本店</div>
          </form>
          <div class="hot-searchkey c-9 fz12" v-if="HotKeyWords.length">
            <ul>
              <li>热门搜索：</li>
              <li v-for="word in HotKeyWords">
                <a href="javascript:;" @click="_doSearch(word)">{{word}}</a>
              </li>
            </ul>
          </div>
        </div>
        <a class="N-cart frt pre" v-if="!isVisitor" href="#/cartIndex/shopCart">
          <i></i>
          <b>{{cartCount}}</b>
          我的购物车
        </a>
      </div>
      <div class="nav-bar clearfix" v-if="showNaviList">
        <div class="nav-title pre" @mouseenter="isHover=true" @mouseleave="isHover=false">
          <h3>全部商品分类</h3>
          <slot v-if="showFlaotCategory">
            <div v-show="isHover" class="nav-float-category">
              <category></category>
            </div>
          </slot>
        </div>
        <ul class="N-link flt">
          <li @click="_NavigateTo(1)">
            <router-link router-link-active to="/index/home">商城首页</router-link>
          </li>
          <li @click="_NavigateTo(2)">
            <router-link router-link-active to="/index/activityList">优惠特价</router-link>
          </li>
          <li @click="_NavigateTo(3)">
            <router-link router-link-active to="/index/profit">赚钱精选</router-link>
          </li>
          <li v-if="!isVisitor" @click="_NavigateTo(4)">
            <router-link router-link-active to="/index/quicklyPurchase">快捷进货</router-link>
          </li>
        </ul>
        <ul class="nav-explain">
          <li>
            <b></b>一站式进货
          </li>
          <li>
            <b></b>易久批 进价低
          </li>
        </ul>
      </div>
      <!--  -->
    </div>
  </div>
</template>

<script>
import * as $cache from "common/cache";
import { mapGetters, mapActions } from "vuex";
import category from "components/home/category.vue";
import storage from "common/storage";
import { GetAppSetting, GetHotKeyWords } from "api/setting/setting";
import changeCities from "components/home/changeCities.vue";
import mixin from "common/mixin/navMixin";
import sideBar from "components/home/sideBar.vue";
import * as UserService from "api/author/author";

export default {
  name: "navi",
  mixins: [mixin],
  props: {
    dealer: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      showChangeCity: false,
      currentCityName: storage.get("CITY_NAME", "南京市"),
      HotKeyWords: ["百威雁荡山", "茅台", "五粮液", "洋河"],
      isHover: false,
      showFlaotCategory: false,
      showNaviList: true,
      showDealerSearch: false,
    };
  },
  components: {
    changeCities,
    category,
    sideBar
  },
  computed: {
    ...mapGetters(["cartCount"])
  },

  created() {
    if (this.$route.path == "/index/home") {
      this.showFlaotCategory = false;
    } else {
      this.showFlaotCategory = true;
    }
    if (this.$route.name == "addPriceReport" || this.$route.name == "dealerProductList" || this.$route.name == "couponList"){
      this.showNaviList = false;
    }else {
      this.showNaviList = true;
    }
    //经销商店铺页面显示经销商搜索按钮
    if(this.dealer) this.showDealerSearch = true
    //如果是新商盟登录
    const { token, searchKey } = this.$route.query;
    if (token) {
      this.xingshangmengLogin();
    }
    if (searchKey && this.$route.path == "/index/list") {
      this.keyWord = searchKey;
    }
    if (!this.isVisitor) {
      this.saveCartCount();
    }
    GetAppSetting()
      .then(res => {
        if (res.success) {
          this.productSearchLabel = res.data.productSearchLabel;
          localStorage.setItem("APP_SETTING", JSON.stringify(res.data));
        }
      })
      .catch(res => {});
  },
  mounted() {
    this._getHotKeyWords();
  },
  methods: {
    ...mapActions(["saveCartCount", "saveUserDtail", "initUserDefaultAddress"]),
    //获取用户收货地址
    getUserAddress() {
      let param = { datas: [0, 1, 2, 3] };
      return UserService.getAddressList(param).then(data => {
        if (data.success) {
          localStorage.setItem("USER_ADDRESS", JSON.stringify(data.data));
        }
      });
    },
    //初始化默认收货地址
    initDefaultAddress() {
      let userAddress = JSON.parse(localStorage.getItem("USER_ADDRESS"));
      let addressId = localStorage.getItem("defaultAddressId");
      if (!userAddress || !userAddress.length) return ``;
      let defaultAddress =
        userAddress.find(item => item.addressId == addressId) || userAddress[0];
      return (
        (defaultAddress.province || ``) +
        (defaultAddress.city || ``) +
        (defaultAddress.county || ``) +
        (defaultAddress.street || ``) +
        (defaultAddress.detailAddress || ``)
      );
    },
    //初始化用户信息
    initSetting() {
      //带token
      return UserService.GetUserDetail()
        .then(res => {
          if (res.success && res.data) {
            this.saveUserDtail(res.data);
            localStorage.setItem("USER_DETAIL", JSON.stringify(res.data));
            localStorage.setItem("CITY_ID", res.data.cityId);
            localStorage.setItem("CITY_NAME", res.data.city);
            localStorage.setItem("NATIVE_CITY_ID", res.data.cityId);
            localStorage.setItem("NATIVE_CITY_NAME", res.data.city);
            localStorage.setItem("defaultAddressId", res.data.addressId);
          }
        })
        .catch(res => {});
    },
    xingshangmengLogin() {
      let initSetting = this.initSetting();
      let getUserAddress = this.getUserAddress();
      Promise.all([initSetting, getUserAddress])
        .then(result => {
          let address = this.initDefaultAddress();
          localStorage.setItem("USER_DEFAULT_ADDRESS", address);
          this.initUserDefaultAddress({
            userDefaultAddress: address,
            refresh: false})
          this.$router.push({ path: "/index/home" }); //cityId
        })
        .catch(error => {});
    },
    _getHotKeyWords() {
      GetHotKeyWords().then(res => {
        if (res.success) {
          this.HotKeyWords = res.data;
          $cache.setCache("HotKeyWords", res.data);
        }
      });
    },
    _NavigateTo(enmu){
       this.$createTalkingData("Index", "Index_Navigation_Bar_Button", {
          ButtonType: enmu
        });
    }
  },
  watch: {
    $route(to, from) {
      const toPathName = to.name;
      this.showFlaotCategory = toPathName != "home";
      this.showNaviList = toPathName != "addPriceReport";
      if (toPathName != "list") {
        this.keyWord = "";
      }
    }
  }
};
</script>

<style lang="stylus">
#navi {
  width: 100%;
  height: 160px;
  background: rgba(255, 255, 255, 1);
}

.nav-float-category {
  pos(absolute);
  top: 42px;
  left: 0;
  w(200);
  h(360);
  z-index: 20;
  box-shadow: -2px 2px 2px 0px rgba(0, 0, 0, 0.1);
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
  h(118);
}

.img-log {
  >img {
    mt(24);
    width: 140px;
    height: 60px;
  }
}

.N-address-wrap {
  position: relative;
  mt(34);
  ml(32);

  &:hover {
    .N-address {
      >b {
        transform: rotate(180deg);
        transition: transform 0.2s ease-in;
      }
    }
  }
}

.N-address {
  width: 114px;
  height: 36px;
  border: 1px solid #EDEDED;
  c($color-base-theme);
  ft(14);
  cp();
  flex-center();
  position: relative;
  z-index: 100;

  >i {
    inline();
    squ(20);
    mr(8);
    background: url('../assets/images/home/chengshi_dingwei.png') no-repeat center;
  }

  >b {
    inline();
    squ(14);
    ml(6);
    background: url('../assets/images/home/ic_xiajiantou.png') no-repeat center;
    transform: rotate(0);
    transition: transform 0.2s ease-in;
  }
}

.border-bottom-white {
  border-bottom-color: #fff;
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

.search-wrap {
  width: auto;
  mt(34);
  ml(60);

  form {
    width: 420px;
    height: 36px;
    border: 2px solid $color-base-theme;
    position relative
    & > input {
      width: 340px;
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
    .dealer-search{
      position absolute
      right -82px
      top -2px
      h(40)
      lh(40)
      w(80)
      text-align center
      bg(#666666)
      ft(16)
      c(#fff)
      cursor pointer
    }
  }

  .hot-searchkey {
    mt(12);

    ul {
      li {
        flt();
        ml(12);

        a {
          c(#999);
        }
      }
    }
  }
}

@media screen and (min-width: 1230px) {
  .search-wrap {
    ml(100);

    form {
      width: 518px;

      & > input {
        width: 438px;
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
  mt(34);
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
    background: url('../assets/images/home/dingbugouwuche_ic_hong.png') no-repeat;
    background-size: cover;
  }

  > b {
    inline();
    pos(absolute);
    top: 2px;
    right: 5px;
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

.nav-title {
  inline();
  flt();
  width: 200px;
  height: 42px;
  background: rgba(63, 60, 60, 1);

  h3 {
    ft(16);
    line-height: 42px;
    color: #fff;
    text-c();
  }
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
        background: url('../assets/images/home/yizhanshijinhuo.png') no-repeat;
      }
    }

    &:nth-of-type(2) {
      b {
        background: url('../assets/images/home/jinjiadi.png') no-repeat;
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

