<template>
  <div class="column">
    <div class="column-tit">
      <h3>{{columnItem.columnName}}</h3>
      <a href="javascript:;" class="c_change" @click="_turnPage(columnItem.columnName)">
        <b></b>换一批
      </a>
    </div>
    <div class="column-content">
      <!--  -->
      <div
        class="column_filter pre"
        v-bind:style="{backgroundImage:'url(' + columnItem.backgroundImgUrl + ')'}"
      >
        <ul
          class="c_f_cate clearfix"
          v-if="columnItem.sideCategoryList && columnItem.sideCategoryList.length"
        >
          <li v-for="son in columnItem.sideCategoryList.slice(0, 10)" :key="son.sonId">
            <!-- 一级 -->
            <a
              v-if="son.categoryId"
              href="javascript:;"
              @click="_jumpList(columnItem.columnName, 1, son.categoryId)"
            >{{son.sonName}}</a>
            <!-- 二级 -->
            <a
              v-else
              href="javascript:;"
              @click="_jumpList(columnItem.columnName, 2, son.sonId)"
            >{{son.sonName}}</a>
          </li>
        </ul>
      </div>
      <!--  -->
      <div class="column_products clearfix">
        <slot name="products"></slot>
      </div>
    </div>
    <!--  -->
    <div class="column-brands" v-if="columnItem.brandList && columnItem.brandList.length">
      <a
        href="javascript:;"
        v-for="brand in columnItem.brandList.slice(0, 10)"
        :key="brand.brandId"
        @click="_jumpList(columnItem.columnName, 3, brand.brandId, brand.firstCategoryId)"
      >
        <img v-if="brand.mediumImgUrl" :src="brand.mediumImgUrl" :alt="brand.brandName">
        <span v-else class="c-3 fz14">{{brand.brandName}}</span>
      </a>
    </div>
  </div>
</template>

<script>
import { jumpList } from "common/categoryUtil";
export default {
  name: "column",
  components: {},
  data() {
    return {};
  },
  props: {
    columnItem: {
      type: Object,
      default: function() {
        return {};
      }
    }
  },
  computed: {},
  created() {
    this.params = {};
  },
  mounted() {},
  methods: {
    _turnPage(name) {
      const enumer = ["", "酒类进货", "啤酒饮料", "休食百货", "粮油副食"];
      let AreaId = enumer.findIndex(item => item == name);
      AreaId = AreaId > 0 ? AreaId : "";
      this.$emit("turn-page");
      this.$createTalkingData("index", "Index_Refresh_More", {
        AreaId
      });
    },
    _jumpList() {
      jumpList.call(this, ...arguments);
    }
  }
};
</script>
<style lang="stylus">
.column {
  overflow: hidden;
}

.column-brands {
  h(72);
  bg(#fff);
  flex();
  justify-content: center;

  >a {
    flex-1();
    max-width: 10%;
    box();
    overflow: hidden;

    &:hover {
      b1($color-base-theme);
    }

    >img {
      width: 100%;
      height: 100%;
      transform: scale(1.2);

      // &:hover {
      //   transform: scale(1.2);
      //   transition: transform 0.2s ease-in;
      // }
    }

    >span {
      inline();
      w(114);
      lh(72);
      text-c();

      &:hover {
        c($color-base-theme);
      }
    }
  }
}

.column-content {
  width: 100%;
  height: 540px;

  .column_filter {
    width: 190px;
    height: 540px;
    float: left;
    // background-image: url(http://yjp-app.ufile.ucloud.com.cn/pcmall/pc_bjjh_1812.png);
    background-size: cover;

    .c_f_cate {
      width: 100%;
      box();
      pos(absolute);
      bottom: 0;
      left: 0;
      padding: 16px 12px 16px;
      background: rgba(0, 0, 0, 0.5);

      >li >a {
        float: left;
        width: 72px;
        lh(28);
        margin: 4px;
        c(#fff);
        text-c();
        ft(12);
        border: 1px solid #fff;
        background: rgba(255, 255, 255, 0.2);
      }
    }
  }

  .column_products {
    height: 100%;
    ml(190);
    overflow: hidden;
  }
}

@media screen and (min-width: 1230px) {
  .column-content {
    .column_filter {
      width: 200px;

      .c_f_cate >li >a {
        width: 78px;
      }
    }

    .column_products {
      ml(200);
    }
  }
}

.c-t-pseudo {
  content: '';
  inline();
  width: 56px;
  height: 2px;
  bg(#333333);
  vertical-align: middle;
}

.column-tit {
  height: 90px;
  pos(relative);
  background: $color-base-bg;

  >h3 {
    ft(26);
    text-c();
    c(#333);
    lh(90);

    &:after {
      @extend .c-t-pseudo;
      ml(32);
    }

    &:before {
      @extend .c-t-pseudo;
      mr(32);
    }
  }

  .c_change {
    pos(absolute);
    right: 0;
    top: 0;
    ft(14);
    c(#666);
    lh(90);
    mr(16);

    >b {
      inline();
      squ(20);
      mr(8);
      mt(-4);
      vertical-align: middle;
      background: url('../../assets/images/home/huanyipi.png') no-repeat;
    }

    >span {
      vertical-align: top;
    }
  }
}
</style>


