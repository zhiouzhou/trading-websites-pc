<template>
  <div id="nav" class="jiupiNav">
    <div class="w">
      <div class="N-search-area clearfix">
        <router-link to="/index/home" class="img-log flt">
          <img src="../../assets/images/logo.png" alt>
        </router-link>
        <i class="line"></i>
        <div class="myJiupi-title">
          <p>领券中心</p>
        </div>
        <div class="search-wrap flt clearfix">
          <form v-on:submit.prevent class="pre">
            <input
              type="text"
              v-bind:placeholder="productSearchLabel"
              v-model="keyWord"
              @input="inputDebounce"
              @keyup.enter="_doSearch(keyWord)"
            >
            <a class="p0 fz16" href="javascript:;" @click="_doSearch()">搜索</a>
            <ul class="fuzzy-search-list" v-show="fuzzySearchList.length">
              <li v-for="item in fuzzySearchList"><a href="javascript:;" @click="_doSearch(item)">{{item}}</a></li>
            </ul>
          </form>
        </div>
        <router-link to="/myOrderEntry/myCoupon" class="N-cart frt pre">
          <i></i>
          我的优惠券＞
        </router-link>
      </div>
    </div>
  </div>
</template>


<script>
import mixin from "common/mixin/navMixin";
import {debounce} from "common/lodash";
export default {
    name: '',
    mixins: [mixin],
    props: [],
    data() {
        return {
            keyWord: "",
            productSearchLabel: "名酒/葡萄酒/饮料/食品/日货",
            fuzzySearchList: [],
            dropState: false,
            homeDropState: false,
        }
    },
    components: {},
    methods: {
        _doSearch(word) {
            const searchKey = word ? word : this.keyWord;
            if (this.$route.name == "list") {
                Bus.$emit("doSearch", searchKey);
            } else {
                this.$router.push({
                    path: "/index/list",
                    query: {
                        searchKey
                    }
                });
            }
            this.fuzzySearchList = []
        },
    },
    computed: {},
}
</script>


<style lang="stylus" scoped>
  #nav {
    width: 100%;
    height: 128px;
    background: rgba(255, 255, 255, 1);
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
      block()
      bg(#ededed)
      margin: 47px 16px 0;
      flt()
    }
    .myJiupi-title {
      flt()
      p {
          ft(20)
          c(#333)
          font-family: MicrosoftYaHei;
          pt(52)
      }
    }
  }

  .img-log {
    > img {
      mt(34);
      width: 140px;
      height: 60px;
    }
  }

  .search-wrap {
    width: auto;
    mt(46);
    flt()
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
      ml(133);

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
    mt(46);
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
      background: url('../../assets/images/wodeyouhuiquan.png') no-repeat;
      background-size: cover;
    }

    > b {
      pos(absolute);
      top: 8px;
      right: 8px;
      inline();
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
