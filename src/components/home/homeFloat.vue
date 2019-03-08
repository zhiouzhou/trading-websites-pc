<template>
  <div class="home-float-area" :class="{'float-fade-in':showFloat}">
    <ul class="hf-list clearfix">
      <li v-for="(item, index) in homeFloatList" :key="item">
        <a
          href="javascript:;"
          :class="{'active': index == currentIndex}"
          @click="_scrollToTarget(item, index)"
        >{{item}}</a>
      </li>
    </ul>
    <div class="hf-code">
      <img src="../../assets/images/home/download.png" alt="易久批app下载">
      <p>扫码下载APP</p>
      <p>更多优惠等你拿</p>
    </div>
    <div class="hf-top" @click="_scrollTop">
      回到顶部
      <i></i>
    </div>
  </div>
</template>
<script>
import Bus from "common/bus";
import { scrollSmoothTo } from "common/lodash";
import { mapGetters } from "vuex";
export default {
  name: "float",
  data() {
    return {
      heightList: [],
      scrollTop: 0
    };
  },
  props: {
    homeFloatList: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    currentIndex() {
      const arr = this.heightList;
      for (var j = 0, len = arr.length; j < len; j++) {
        var h1 = arr[j],
          h2 = arr[j + 1];
        if (this.scrollTop >= h1 && this.scrollTop < h2) {
          return j;
        }
      }
      return 0;
    },
    showFloat() {
      if (this.scrollTop > 200) {
        return true;
      } else {
        return false;
      }
    }
  },
  created() {},
  mounted() {
    window.addEventListener("scroll", e => {
      this.scrollTop =
        document.documentElement.scrollTop ||
        window.pageYOffset ||
        document.body.scrollTop;
    });
    Bus.$on("column-repeated", data => {
      let topH = data && data.topH ? data.topH : 552;
      setTimeout(() => {
        this.calculateHeightList(topH);
      }, 1000);
    });
  },
  methods: {
    _scrollTop() {
      scrollSmoothTo(0);
      this.$createTalkingData("index", "Index_Left_Navigation", {
            GoBack: 1
          });
    },
    _scrollToTarget(item, index) {
      scrollSmoothTo(this.heightList[index]);
      if (this.homeFloatList.length >= 4) {
        //导航标题枚举信息：1.优惠特价 2.饮料进货 3.白酒进货 3.休闲食品 4.粮油副食 5.赚钱精选
        const enmuer = ["", "优惠特价","饮料进货", "白酒进货", "休闲食品", "粮油副食", "赚钱精选"];
        const talkId = enmuer.findIndex(t => t == item);
        if (talkId > 0) {
          this.$createTalkingData("index", "Index_Left_Navigation_Bar", {
            ArrivalNotice: talkId
          });
        }
      }
    },
    calculateHeightList(topH) {
      let heightList = [topH],
        h = topH;
      const doms = document.querySelectorAll(".home-float-list");
      const domsArr = Array.prototype.slice.call(doms);
      for (var i = 0, len = domsArr.length; i < len; i++) {
        h += domsArr[i].offsetHeight;
        heightList.push(h);
      }
      this.heightList = heightList;
    }
  }
};
</script>
<style lang="stylus">
.home-float-area {
  pos(fixed);
  top: 200px;
  left: 50%;
  ml(-716);
  w(94);
  bg(#fff);
  hide();
  visibility: hidden;
  border: 1px solid $color-base-hr;
}

@media screen and (min-width: 1440px) {
  .float-fade-in {
    block();
    visibility: visible;
    animation: float-fade-in 0.5s ease-in;
  }
}

@media screen and (min-width: 1680px) {
  .home-float-area {
    ml(-800);
  }

  .float-fade-in {
    block();
    visibility: visible;
    animation: float-fade-in 0.5s ease-in;
  }
}

@keyframes float-fade-in {
  0% {
    opacity: 0.3;
    transform: scale(0.1);
  }

  100% {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes float-fade-out {
  0% {
    opacity: 1;
    transform: scale(1);
  }

  100% {
    opacity: 0.3;
    transform: scale(0.1);
  }
}

.hf-list {
  li {
    a {
      flt();
      c(#333);
      text-c();
      lh(32);
      h(32);
      box();
      text-c();
      width: 100%;
      border-bottom: 1px solid $color-base-hr;

      &.active {
        bg($color-base-theme);
        c(#fff);
      }

      &:hover {
        bg($color-base-theme);
        c(#fff);
      }
    }
  }
}

.hf-code {
  padding: 8px;

  >img {
    width: 78px;
    height: 75px;
  }

  >p {
    mt(8);
    ft(10);
    c(#999);
    transform: scale(0.85);
    white-space: nowrap;

    &:nth-of-type(2) {
      mt(3);
      ml(-4);
    }
  }
}

.hf-top {
  w(94);
  lh(32);
  text-c();
  c(#fff);
  cp();
  background: rgba(63, 60, 60, 1);

  >i {
    inline();
    squ(12);
    mt(-4);
    background: url('../../assets/images/home/huidaodingbu.png') no-repeat;
    background-size: cover;
    vm();
  }
}
</style>

