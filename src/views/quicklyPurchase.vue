<template>
  <div id="quickly_purchase">
    <sideBar v-if="!isVisitor"/>
    <div class="w">
      <div class="qp-name-area pre" v-if="scrollMenu.length">
        <span class="qp-trun-btn" @click="_pre" v-if="canScroll">&lt;</span>
        <scroll
          :probeType="1"
          :scrollX="true"
          :data="scrollMenu"
          class="scroll_menu_dom"
          ref="scroll_menu_dom"
        >
          <ul class="qp-name-list clearfix" ref="scroll_menu_content">
            <li v-for="item in scrollMenu" :key="item.categoryId">
              <a
                :id="item.categoryId"
                href="javascript:;"
                @click="_switchCategory(item.categoryId)"
                :class="{'active': item.categoryId == currentId}"
              >{{item.categoryName}}</a>
            </li>
          </ul>
        </scroll>
        <span class="qp-trun-btn" @click="_next" v-if="canScroll">&gt;</span>
      </div>
      <!--  -->
      <div class="loading-list" v-show="loading">
        <i></i>正在加载中，请稍后~
      </div>
      <div class="qp-product-list base-product-list clearfix">
        <product-common
          v-if="currentProducts.length"
          v-for="product in currentProducts"
          :key="product.productSkuId + product.canSellStoreCount + product.promotionType"
          v-bind:product-item="product"
        ></product-common>
        <empty v-show="isEmpty" txt="抱歉没有找到相关商品"></empty>
      </div>
      <!--  -->
      <div class="clearfix">
        <el-pagination
          class="mt24 mb24 frt"
          background
          :current-page.sync="currentPage"
          :page-size="pageSize"
          layout="total, prev, pager, next"
          :total="totalCount"
          prev-text="上一页"
          next-text="下一页"
        ></el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import empty from "components/common/empty.vue";
import * as productApi from "api/product/product";
import productCommon from "components/common/product-common.vue";
import scroll from "components/common/scroll.vue";
import { transformProductList } from "common/productUtil/list";
import * as $cache from "common/cache";
import sideBar from "components/home/sideBar.vue";
export default {
  name: "quickly_purchase",
  data() {
    return {
      isEmpty: false,
      loading: false,
      scrollMenu: [],
      renderShelfList: [],
      currentId: "",
      pageSize: 20,
      currentPage: 1,
      currentProducts: [],
      canScroll: false
    };
  },
  computed: {
    totalCount() {
      if (!this.renderShelfList.length) {
        return 1;
      }
      const currentItem = this.renderShelfList.find(
        item => item.categoryId == this.currentId
      );
      return currentItem.productList.length;
    }
  },
  components: {
    productCommon,
    scroll,
    empty,
    sideBar 
  },
  created() {
    this.alreadyCacheMyProductBrief();
  },
  activated() {
    this.$createTalkingData("ShortCut_Order", "", {}, 1);
  },
  deactivated() {
    this.$createTalkingData("ShortCut_Order", "", {}, 2);
  },
  mounted() {},
  beforeDestroy() {},
  methods: {
    constructeScrollMenu(originList) {
      let scrollMenu = [];
      for (let item of originList) {
        scrollMenu.push({
          categoryId: item.categoryId,
          categoryName: item.categoryName
        });
      }
      return scrollMenu;
    },
    alreadyCacheMyProductBrief() {
      const cache = $cache.getCache("MyProductBrief");
      if (cache) {
        this._listMyProductBrief(cache);
      } else {
        productApi
          .listMyProductBrief()
          .then(res => {
            if (res.success) {
              const MyProductBrief = res.data || [];
              $cache.setCache("MyProductBrief", MyProductBrief);
              this._listMyProductBrief(MyProductBrief);
            }
          })
          .catch(res => {
            this.isEmpty = true;
          });
      }
    },
    _listMyProductBrief(MyProductBrief) {
      //取出赋值 再请求设缓存
      this.originShelfList = MyProductBrief;
      this.isEmpty = !MyProductBrief.length;
      this.shelfList = this.originShelfList.map(item => ({
        categoryName: item.categoryName,
        categoryId: item.categoryId
      }));
      this.renderShelfList = this.shelfList = this.initShelfList(
        this.originShelfList
      );
      this.scrollMenu = this.constructeScrollMenu(this.shelfList);
      this.$nextTick(() => {
        this.calculateScrollRect();
      });
      this.currentId = this.shelfList[0].categoryId;
      const Result = this.findNeedSkuIdsWidthCurrentPage(
        this.originShelfList,
        this.shelfList,
        this.currentId,
        this.currentPage
      );
      const isProductsResult = Result.length && typeof Result[0] == "object";
      if (isProductsResult) {
        this.currentProducts = Result;
        return true;
      }
      //requst && handler 赋值给currentProducts并更新到shelfList内存中
      this.requstSkuIdsDetailAndHandler(Result, this.currentId);
    },
    //计算 scroll-menu 的scroll_menu_content 的宽度
    calculateScrollRect() {
      const els = this.$refs.scroll_menu_content.children;
      let w = 0;
      const wrapWidth = this.$refs.scroll_menu_dom.$el.offsetWidth;
      for (let el of Array.prototype.slice.call(els)) {
        w += el.getBoundingClientRect().width;
      }
      this.$refs.scroll_menu_content.style.width = w + "px";
      if (wrapWidth < w) {
        this.canScroll = true;
      }
    },
    initShelfList(originList) {
      let shelfList = [];
      for (let item of originList) {
        let temporary = {
          categoryId: item.categoryId,
          categoryName: item.categoryName,
          productList: []
        };
        temporary.productList.length = item.productList.length;
        shelfList.push(temporary);
      }
      return shelfList;
    },
    getProductsWidthCurrentPage(list, currentId, currentPage) {
      const currentItem = list.find(item => item.categoryId == currentId);
      const currentProductList = currentItem ? currentItem.productList : [];
      if (!currentProductList.length) {
        return [];
      }
      const floor = Math.floor(currentProductList.length / 20);
      if (currentPage <= floor) {
        return currentProductList.slice(
          (currentPage - 1) * 20,
          currentPage * 20
        );
      } else {
        return currentProductList.slice((currentPage - 1) * 20);
      }
    },
    getSkuIdsWidthProducts(productList) {
      return productList.map(item => item.productSkuId);
    },
    findNeedSkuIdsWidthCurrentPage(originList, list, categoryId, currentPage) {
      //如果在list里面找到数据 length 直接返回此数据
      //反之，在originList中找到对应的id
      const alreayRenderProducts = this.getProductsWidthCurrentPage(
        list,
        categoryId,
        currentPage
      );
      if (alreayRenderProducts.length && alreayRenderProducts[0]) {
        return alreayRenderProducts;
      }
      const productsInOriginList = this.getProductsWidthCurrentPage(
        originList,
        categoryId,
        currentPage
      );
      const needIds = this.getSkuIdsWidthProducts(productsInOriginList);
      return needIds;
    },
    //点击切换
    _changeCategory(categoryId) {
      const Result = this.findNeedSkuIdsWidthCurrentPage(
        this.originShelfList,
        this.shelfList,
        categoryId,
        this.currentPage
      );
      const isProductsResult = Result.length && typeof Result[0] == "object";
      if (isProductsResult) {
        this.currentProducts = Result;
        return true;
      }
      //requst && handler 赋值给currentProducts并更新到shelfList内存中
      this.requstSkuIdsDetailAndHandler(Result, categoryId);
    },
    updateMemoryShelfList(details, shelfList, currentIndex) {
      let temporary = Object.assign({}, shelfList[currentIndex]);
      temporary.productList.splice(
        (this.currentPage - 1) * 20,
        details.length,
        ...details
      );
      shelfList.splice(currentIndex, 1, temporary);
    },
    requstSkuIdsDetailAndHandler(skuIds, categoryId) {
      this.loading = true;
      productApi
        .listMyShelfProductByProductIds(skuIds)
        .then(res => {
          this.loading = false;
          if (res.success) {
            let requestSkuIdsDetail = [];
            requestSkuIdsDetail = transformProductList(res.data); //商品列表
            requestSkuIdsDetail.sort((a, b) => {
              return b.canSellStoreCount - a.canSellStoreCount;
            });
            const currentIndex = this.shelfList.findIndex(
              item => item.categoryId == categoryId
            );
            if (currentIndex != -1) {
              this.updateMemoryShelfList(
                requestSkuIdsDetail,
                this.shelfList,
                currentIndex
              );
            }
            this.currentProducts = requestSkuIdsDetail;
          }
        })
        .catch(res => {
          this.loading = false;
        });
    },
    _switchCategory(categoryId) {
      const CategoryName = this.scrollMenu.find(
        item => item.categoryId == categoryId
      ).categoryName;
      this.scrollToElement(categoryId);
      this.currentId = categoryId;
      this.currentPage = 1;
      this._changeCategory(categoryId);
      
      this.$createTalkingData("ShortCut_Order", "ShortCut_Order_Category", {
        CategoryId: categoryId,
        CategoryName: CategoryName
      });
    },
    scrollToElement(categoryId) {
      const el = document.getElementById(categoryId);
      this.$refs.scroll_menu_dom.scrollToElement(el, 150);
    },
    _pre() {
      this.$refs.scroll_menu_dom.scrollTo(0, 0);
    },
    _next() {
      const BS = this.$refs.scroll_menu_dom.scroll;
      this.$refs.scroll_menu_dom.scrollTo(BS.maxScrollX, 0);
    }
  },
  watch: {
    currentPage() {
      this._changeCategory(this.currentId);
    }
  }
};
</script>

<style lang="stylus">
#quickly_purchase {
  width: 100%;
  background: url('../assets/images/kuaijiejinhuo_banner.png') no-repeat;
  background-size: 100% 300px;
  pt(266);
}

.qp-product-list {
  mt(12);
  min-height: 600px;
}

.scroll_menu_dom {
  overflow: hidden;
  pos(relative);
}

.qp-name-area {
  padding: 0 40px;
  h(64);
  width: 100%;
  bg(#fff);
  box-shadow: 0px 6px 8px 0px rgba(0, 0, 0, 0.1), 0px -2px 8px 0px rgba(0, 0, 0, 0.1);

  >span {
    &:nth-of-type(1) {
      left: 0;
    }

    &:nth-of-type(2) {
      right: 0;
    }
  }
}

.qp-trun-btn {
  cp();
  inline();
  width: 24px;
  height: 64px;
  background: rgba(0, 0, 0, 0.4);
  pos(absolute);
  top: 0;
  text-c();
  lh(64);
  font-size: 16px;
  color: #fff;
  font-weight: 700;
  font-family: simsun;
  font-style: normal;
}

.qp-name-list {
  >li {
    flt();

    >a {
      inline();
      h(64);
      lh(64);
      ft(16);
      c(#333);
      text-c();
      margin: 0 12px;
      padding: 0 10px;
      box();

      &.active {
        c($color-base-theme);
        border-bottom: 3px solid $color-base-theme;
      }

      &:hover {
        c($color-base-theme);
      }
    }
  }
}

.quickly_purchase_footer {
  mt(24);
  mb(24);

  >span {
    &:nth-of-type(1) {
      ml(12);
    }
  }
}

.qp-btn {
  width: 80px;
  height: 28px;
  display: inline-block;
  border: 1px solid #ddd;
  text-align: center;
  lh(28);
  c(#666);
  frt();
}
</style>


