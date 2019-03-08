<template>
  <div>
    <app-header/>
    <div>
      <div class="header w">
        <div class="settlement-wrap">
          <div class="header-logo flt">
            <router-link to="/index/home" class="flt">
              <img src="../../assets/images/logo.png" alt="北京易酒批电子商务有限公司">
            </router-link>
          </div>
          <div class="settlement-title">购物车</div>
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
              <a class="p0 fz16" href="javascript:;" @click="_doSearch()">搜索</a>
              <ul class="fuzzy-search-list" v-show="fuzzySearchList.length && focusing">
                <li v-for="item in fuzzySearchList">
                  <a href="javascript:;" @click="_doSearch(item)">{{item}}</a>
                </li>
              </ul>
            </form>
          </div>
        </div>
      </div>
      <router-view/>
    </div>
    <app-footer/>
  </div>
</template>
<script>
import AppHeader from "../AppHeader.vue";
import AppFooter from "../AppFooter.vue";
import mixin from "common/mixin/navMixin";
export default {
  name: "cartIndex",
  mixins: [mixin],
  data() {
    return {};
  },
  created() {
    const APP_SETTING = localStorage.getItem("APP_SETTING");
    if (APP_SETTING) {
      this.productSearchLabel = JSON.parse(APP_SETTING).productSearchLabel;
    }
  },
  components: {
    AppHeader,
    AppFooter
  }
};
</script>
<style lang="stylus" scoped>
.header {
  height: 100px;
  padding: auto 15px;
  margin: 0 auto 10px;

  .header-logo {
    height: 60px;
  }

  .header-text {
    ml(24);
    lh(60);
    font-size: 20px;
  }

  .header-login {
    mt(24);
    mr(-15);
    lh(60);
    font-size: 14px;

    a {
      ml(8);
      c(#333);
    }
  }
}

.settlement-wrap {
  flex();
  align-items: center;
  mt(34);
}

.settlement-title {
  ft(20);
  c(#333);
  ml(32);
  flex-1();
}

.settlement-subheader {
  flex-1();

  .subheader-list {
    float: right;
    pt(55);
    w(480);
    h(84);
    flex();
    background-repeat: no-repeat;
    background-position: center 0;
    box-sizing: border-box;
    background-image: url('../../assets/images/state_order1.png');

    li {
      h(24);
      lh(24);
      text-c();
      width: 33.3%;
    }
  }
}

.search-wrap {
  width: auto;
  margin-top: 0;

  form {
    width: 518px;
    height: 36px;
    border: 2px solid $color-base-theme;

    & > input {
      width: 438px;
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
    form {
      width: 518px;

      & > input {
        width: 438px;
      }
    }
  }
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
</style>

