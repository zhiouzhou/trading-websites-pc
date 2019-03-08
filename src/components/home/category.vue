<template>
  <div class="C flt"  @mouseleave="currentIndex = ''">
    <div
      class="C-item pre"
      v-for="(item,index) in columnList"
      :key="index"
      @mouseenter="currentIndex = index"
      :class="{'C-item-active': currentIndex !=='' && index !== currentIndex,
      'C-b-item-active':  currentIndex !=='' && index === currentIndex}"
    >
      <div class="C-item-content">
        <h4 class="fz14 c-3 fw-b">{{item.columnName}}</h4>
        <p class="fz12 c-6">
          <a
            href="javascript:;"
            v-for="cc in item.naviCategoryList"
            :key="cc.sonId"
            @click="_jumpList('', 1, cc.categoryId)"
          >{{cc.name}}</a>
        </p>
        <b></b>
        <!--  -->
        <div
          class="C-list clearfix"
          v-if="currentIndex === index"
          @mouseenter="currentIndex = index"
          :style="{ top : topValue + 'px'}"
        >
          <div class="C-brand">
            <h5>品牌</h5>
            <ul>
              <li v-for="brand in item.brandList" :key="brand.brandId">
                <a
                  href="javascript:;"
                  @click="_jumpList('', 3, brand.brandId, brand.firstCategoryId)"
                >{{brand.brandName}}</a>
              </li>
            </ul>
            <!-- <img src alt> -->
          </div>
          <!--  -->
          <div class="C-category" v-if="item.categorys && item.categorys.length>5">
            <div
              class="C-m-item"
              v-for="category in item.categorys"
              :key="category.categoryId"
              :style="category.style"
            >
              <h4
                class="c-3 fz14"
                @click="_jumpList('', 1, category.categoryId)"
              >{{category.name || category.categoryName}} &gt;</h4>
              <ul>
                <li v-for="son in category.sonCategorys.slice(0, 9)" :key="son.sonId">
                  <a href="javascript:;" @click="_jumpList('', 2, son.sonId)">{{son.sonName}}</a>
                </li>
              </ul>
            </div>
          </div>
          <!--  -->
          <div class="C-category" v-else>
            <div class="C-c-item" v-for="category in item.categorys" :key="category.categoryId">
              <span
                @click="_jumpList('', 1, category.categoryId)"
              >{{category.name || category.categoryName}} &gt;</span>
              <ul class="clearfix">
                <li v-for="son in category.sonCategorys" :key="son.sonId">
                  <a href="javascript:;" @click="_jumpList('', 2, son.sonId)">
                    <img :alt="son.sonName" :src="son.imageUrl">
                    <span>{{son.sonName}}</span>
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <!--  -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as $cache from "common/cache";
import { RecommendProductList, ListBigCategory } from "api/common/common";
import { jumpList, transformCommonCategoryList } from "common/categoryUtil";
import { categoryListData } from "common/firstScreenData";
export default {
  name: "category",
  data() {
    return {
      columnList: categoryListData,
      currentIndex: ""
    };
  },
  computed: {
    topValue() {
      const currentIndex = this.currentIndex;
      if (currentIndex >= 1) {
        return currentIndex == 1
          ? -91
          : currentIndex == 2
          ? -181
          : currentIndex == 3
          ? -271
          : -1;
      } else {
        return -1;
      }
      return -1;
    }
  },
  created() {
    this._ListProductCategory();
  },
  methods: {
    //首页预处理  commonCategoryList
    _ListProductCategory() {
      const commonCategoryList = $cache.getCache("commonCategoryList");
      if (commonCategoryList) {
        this.columnList = transformCommonCategoryList(commonCategoryList);
        return false;
      }
      ListBigCategory().then(res => {
        $cache.setCache("commonCategoryList", res.data);
        this.columnList = transformCommonCategoryList(res.data);
      });
    },
    //specialAreaId, type, value = "", firstCategoryId = ""
    _jumpList() {
     
      jumpList.call(this, ...arguments);
    }
  }
};
</script>

<style lang="stylus">
.C {
  width: 200px;
  height: 360px;
  background: #fff;
}

.C-brand {
  pos(relative);
  float: right;
  width: 240px;
  display: none;
  min-height: 360px;
  bg(#fafafb);
  box();
  padding: 20px;

  >h5 {
    ft(14);
    c(#333);
    padding-bottom: 8px;
  }

  >img {
    width: 203px;
    height: 102px;
    position: absolute;
    bottom: 20px;
    left: 20px;
  }

  >ul {
    >li {
      >a {
        width: 33.33%;
        float: left;
        ft(13);
        lh(28);
        c(#333);
        text-c();
        omit();
      }
    }
  }
}

@media screen and (min-width: 1230px) {
  .C-brand {
    width: 240px;
    display: block;
  }
}

.C-m-item {
  float: left;
  width: 183px;
  height: 95px;
  mr(49);
  mb(18);

  >h4 {
    padding-bottom: 8px;
    border-bottom: 1px solid #ededed;
  }

  >ul {
    >li {
      >a {
        float: left;
        width: 33.33%;
        ft(12);
        lh(24);
        c(#666);
        omit();
      }
    }
  }
}

.C-category {
  min-height: 360px;
  bg(#fff);
  mr(244);
  padding: 16px 0 0 16px;
  box();

  .C-c-item {
    >span {
      ft(14);
      c(#666);
      inline();
    }

    >ul {
      mt(12);
      overflow: hidden;

      li {
        block();
        float: left;

        &:nth-last-of-type(1){
          a{
            mr(0);
          }
        }
        a {
          box();
          border: 1px solid #ededed;
          pos(relative);
          inline();
          squ(73);
          mr(12);
          mb(12);

          >img {
            width: 100%;
            height: 100%;
          }

          >span {
            width: 100%;
            pos(absolute);
            bottom: 0;
            block();
            lh(20);
            c(#666);
            ft(12);
            text-c();
            background: rgba(255, 255, 255, 0.8);
          }
        }
      }
    }
  }
}

.C-list {
  background: #fff;
  position: absolute;
  top: 0;
  left: 200px;
  min-height: 360px;
  width: 1030px;
  box-shadow: 4px 6px 8px 0px rgba(0, 0, 0, 0.1), 0 -2px 2px 0px rgba(0, 0, 0, 0.1);
  z-index: 20;
}

@media screen and (min-width: 1230px) {
  .C-list {
    width: 1010px;
  }
}

.C-item {
  z-index: 15;
  cp();
  height: 90px;
  padding: 0 16px;
  box();
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  //border-left: 1px solid rgba(255, 255, 255, 0.1);

  &:nth-last-of-type(1) {
    border-bottom: 0 !important;

    .C-item-content {
      border-bottom: 0;
    }
  }

  .C-item-content {
    height: 89px;
    border-bottom: 1px dashed #DDDDDD;

    >h4 {
      mt(24);
      inline();
      line-height: 1;
      // >span {
      // mt(24);
      // width: 54px;
      // height: 14px;
      // background: rgba(255, 238, 213, 1);
      // border-radius: 2px;
      // font-size: 10px;
      // font-weight: 500;
      // color: rgba(151, 81, 39, 1);
      // vertical-align: middle;
      // }
    }

    >p {
      mt(16px);
      line-height: 1;
      omit();

      >a {
        mr(10);

        &:nth-last-of-type(1) {
          mr(0);
        }
      }
    }

    >b {
      inline();
      width: 6px;
      height: 10px;
      background: url('../../assets/images/fenlei_jinruxiangqing.png');
      position: absolute;
      top: 40px;
      left: 185px;
    }
  }
}

.C-item-active {
  border-right: 1px solid #DDDDDD;
}

.C-b-item-active {
  border-top: 1px solid #DDDDDD;
  border-bottom: 1px solid #DDDDDD;
  //border-left: 1px solid #DDDDDD;

  .C-item-content {
    border-bottom: 0;
  }
}
</style>
