<template>
  <div id="profit">
    <sideBar v-if="!isVisitor"/>
    <div class="w">
      <div class="crumbs-nav-main clearfix">
        <div class="crumbs-nav-item">
          <div class="menu-drop">
            <div class="menu-drop-title fz14 b0-i">全部商品</div>
          </div>
          <i class="crumbs-arrow">></i>
        </div>
        <div class="crumbs-nav-item">
          <div class="menu-drop">
            <div class="menu-drop-title fz14 b0-i">赚钱精选</div>
          </div>
        </div>
      </div>
      <!--  -->
      <div class="L-table" v-if="currentBrands.length">
        <div class="L-t-head flt">品牌</div>
        <div class="L-t-content">
          <ul class="L-item-list profit-item-list clearfix" v-if="!showMore">
            <li
              v-for="brand in currentBrands.slice(0,36)"
              :key="brand.brandId"
              :class="{'active': brand.brandId == filterParams.brandIds}"
            >
              <a href="javascript:;" @click="_selectbrand(brand)">{{brand.brandName}}</a>
            </li>
          </ul>
          <ul class="L-item-list profit-item-list clearfix" v-else>
            <li
              v-for="brand in currentBrands"
              :key="brand.brandId"
              :class="{'active': brand.brandId == filterParams.brandIds}"
            >
              <a href="javascript:;" @click="_selectbrand(brand)">{{brand.brandName}}</a>
            </li>
          </ul>
          <span
            class="profit-more-btn"
            :class="{'profit-show-more': showMore}"
            @click="showMore = !showMore"
          >
            {{!showMore?'更多':'收起'}}
            <i></i>
          </span>
        </div>
      </div>
      <!--  -->
      <div id="filter" class="filter-wrap clearfix">
        <div class="f_w_left flt">
          <ul>
            <li v-for="item in sortMenu" :key="item.type">
              <a
                href="javascript:;"
                @click="_sort(item)"
                class="c-3"
                :class="{'active': filterParams.sort == item.type}"
              >
                {{item.text}}
                <i
                  v-if="item.type == 2 && filterParams.sort==2"
                  class="price-isAscending-icon"
                  :class="{'price-isAscending-icon-up':filterParams.isAscending}"
                ></i>
              </a>
            </li>
          </ul>
          <span>
            <b @click.stop="justLookInStore" :class="{'active': filterParams.searchModes == 2}"></b>&nbsp;仅看有货
          </span>
        </div>
        <div class="f_w_right">
          共{{totalCount}}件商品
          <b class="c-red">{{filterParams.currentPage}}</b>
          /{{totalPage}}
          <span class="f_p_btn" @click="_pre">&lt;</span>
          <span class="f_p_btn" @click="_next">&gt;</span>
        </div>
      </div>
      <!--  -->
      <div class="loading-list" v-show="loading">
        <i></i>正在加载中，请稍后~
      </div>
      <!--  -->
      <div class="base-product-list clearfix">
        <product-common
          v-if="productList.length"
          v-for="product in productList"
          :key="product.productSkuId + product.promotionType + product.price + product.timeLimitPromotionId"
          v-bind:product-item="product"
        ></product-common>
        <empty v-show="isEmpty" txt="抱歉没有找到相关商品"></empty>
      </div>
      <div class="clearfix">
        <el-pagination
          class="mt24 mb24 frt"
          background
          :current-page.sync="filterParams.currentPage"
          :page-size="filterParams.pageSize"
          layout="total, prev, pager, next, jumper"
          :total="totalCount"
          prev-text="上一页"
          next-text="下一页"
          @current-change="elNext"
        ></el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import { ListProductBrand, ListProduct } from "api/common/common";
import productCommon from "components/common/product-common.vue";
import * as $cache from "common/cache";
import { transformProductList } from "common/productUtil/list";
import empty from "components/common/empty.vue";
import sideBar from "components/home/sideBar.vue";
let filterParams = {
  // 可传入参数
  sonCategoryId: "",
  brandId: "",
  firstCategoryId: "",
  searchKey: null,
  specialAreaId: "",
  //查询参数
  categoryIds: [], //	二级类目Id array<string>
  brandIds: [], //品牌 Id  array<string>
  labelId: null, // 标签Id（赚钱推荐、清仓区一级类目Id）
  isAscending: "", // 是否升序   view
  saleModel: -1, //	产品类型number  全部(-1),酒批配送(1),合作商配送(2); view
  searchModes: [3], //查询模式 array<number>  仅看自营(0),易久批配送(1),仅看有货(2),仅看统采(3);   view
  sort: 0, //按排number 序号(0),按时间(1),按价格(2),按销量(3),   view
  shopId: "", //	店铺 Id
  //specialAreaId: "", // 专区id
  currentPage: 1,
  pageSize: 60
};

export default {
  name: "profit",
  data() {
    return {
      loading: false,
      showMore: false,
      isEmpty: false,
      totalPage: 1,
      totalCount: 1,
      categoryList: [],
      filterParams,
      productList: [],
      currentBrands: [],
      sortMenu: [
        { type: 0, text: "综合排序", isAscending: false },
        { type: 3, text: "销量", isAscending: false },
        { type: 2, text: "价格", isAscending: false }
      ]
    };
  },
  components: {
    productCommon,
    empty,
    sideBar
  },
  created() {
    this._ListProductBrand();
    this._ListProduct();
  },
  activated() {
    this.$createTalkingData("Profit_Sift", "", {}, 1);
  },
  deactivated() {
    this.$createTalkingData("Profit_Sift", "", {}, 2);
  },
  methods: {
    _selectbrand(brand) {
      if (!brand.brandId) {
        this.filterParams.brandIds = [];
        return;
      }
      if (this.filterParams.brandIds == brand.brandId) {
        return;
      }
      this.filterParams.brandIds = [brand.brandId];
      this.$createTalkingData("Profit_Sift", "Profit_Sift_Brand", {
        BrandId: brand.brandId,
        BrandName: brand.brandName
      });
    },
    _ListProduct() {
      this.loading = true;
      if (filterParams.currentPage > 1) {
        document.querySelector("#filter").scrollIntoView();
      }
      ListProduct(this.filterParams)
        .then(res => {
          this.loading = false;
          if (res.success) {
            this.productList = transformProductList(res.data);
            this.isEmpty = !this.productList.length;
            this.totalCount = res.totalCount;
            this.totalPage = Math.ceil(
              res.totalCount / this.filterParams.pageSize
            );
          }
        })
        .catch(res => {
          this.loading = false;
        });
    },
    _ListProductBrand() {
      ListProductBrand(this.filterParams).then(res => {
        if (res.success) {
          this.currentBrands = res.data;
          this.currentBrands.unshift({ brandId: "", brandName: "全部" });
        }
      });
    },
    _sort(item) {
      //createTalkingData 1.综合排序 2.销量 3.价格 4.仅看有货 5.分页 下一页
      const { sort } = this.filterParams;
      if (sort == item.type) {
        const { isAscending } = this.filterParams;
        this.filterParams.isAscending = sort == 2 ? !isAscending : isAscending;
      } else {
        this.filterParams.sort = item.type;
        this.filterParams.currentPage = 1;
      }
      this.$createTalkingData("Profit_Sift", "Profit_Sift_Rank", {
        ProfitSiftSortFilter: item.type
      });
    },
    _pre() {
      if (this.filterParams.currentPage > 1) {
        this.filterParams.currentPage--;
      }
    },
    _next() {
      if (this.filterParams.currentPage < this.totalPage) {
        this.filterParams.currentPage++;
        this.$createTalkingData("Profit_Sift", "Profit_Sift_Rank", {
          ProfitSiftSortFilter: 5
        });
      }
    },
    elNext() {
      this.$createTalkingData("Profit_Sift", "Profit_Sift_Rank", {
        ProfitSiftSortFilter: 5
      });
    },
    justLookInStore() {
      // 仅看有货
      if (this.filterParams.searchModes.length) {
        this.filterParams.searchModes.shift();
      } else {
        this.filterParams.searchModes.push(2);
        this.$createTalkingData("Profit_Sift", "Profit_Sift_Rank", {
          ProfitSiftSortFilter: 4
        });
      }
    }
  },
  watch: {
    filterParams: {
      handler(newVal, oldVal) {
        this._ListProduct(newVal);
      },
      deep: true
    }
  }
};
</script>

<style lang="stylus">
@import '../assets/stylus/list.styl';

.profit-item-list {
  padding: 2px;
  pr(80);

  >li {
    w(78);
    b1(#ddd);
    pl(0);
    pr(0);
    margin: 2px;

    &:hover {
      >a {
        c($color-base-theme);
      }
    }

    &.active {
      b1($color-base-theme);

      >a {
        c($color-base-theme);
      }
    }

    >a {
      width: 100%;
      inline();
      text-c();
      ft(14);
    }
  }
}

.profit-more-btn {
  block();
  w(56);
  h(22);
  pos(absolute);
  right: 12px;
  top: 12px;
  c(#333);
  text-c();
  lh(22);
  cp();
  background: rgba(250, 250, 251, 1);
  border: 1px solid rgba(237, 237, 237, 1);

  i {
    vm();
    ml(4);
    inline();
    w(9);
    h(6);
    background: url('../assets/images/brand-more.png') no-repeat;
    background-size: contain;
    transform: rotate(0);
    transition: transform 0.2s linear;
  }
}

.profit-show-more {
  i {
    transform: rotate(180deg);
    mt(-4);
  }
}
</style>


