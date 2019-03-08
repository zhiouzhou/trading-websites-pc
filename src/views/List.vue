<template>
  <section id="list">
    <sideBar v-if="!isVisitor"/>
    <div class="w">
      <div class="crumbs-nav-main clearfix">
        <div class="crumbs-nav-item">
          <div class="menu-drop">
            <div class="menu-drop-title fz14 b0-i">全部商品</div>
          </div>
          <i class="crumbs-arrow">></i>
        </div>

        <div class="crumbs-nav-item" v-show="currentCategoryObj.name">
          <div class="menu-drop">
            <div class="menu-drop-title">{{currentCategoryObj.name}}</div>
          </div>
          <i class="crumbs-arrow">></i>
        </div>

        <div class="crumbs-nav-item" v-show="momentsonCategoryList.length>1">
          <div class="menu-drop">
            <div class="menu-drop-title">{{momentsonCategoryText}}</div>
          </div>
          <i class="crumbs-arrow">></i>
        </div>

        <div
          class="crumbs-nav-item"
          v-show="momentsonCategoryList.length===1 && currentSonCategorys.length"
        >
          <div class="menu-drop">
            <div class="trigger pre">
              <span>{{momentsonCategoryText}}</span>
              <i class="menu-drop-arrow"></i>
            </div>
            <div class="menu-drop-main">
              <ul class="menu-drop-list clearfix">
                <li v-for="item in currentSonCategorys" :key="item.sonId">
                  <a
                    href="javascript:;"
                    @click="_changeMomentsonCategoryList(item)"
                  >{{item.sonName}}</a>
                </li>
              </ul>
            </div>
          </div>
          <i class="crumbs-arrow">></i>
        </div>

        <div class="crumbs-nav-item" v-show="momentBrandListText">
          <div class="menu-drop">
            <div class="menu-drop-title" style="padding-right:4px;">
              {{momentBrandListText}}
              <i @click="_clearBrand"></i>
            </div>
          </div>
          <i class="crumbs-arrow">></i>
        </div>
        <strong
          v-show="filterParams.searchKey"
          class="crumbs-nav-clear"
        >{{'"'+filterParams.searchKey+'"'}}</strong>
        <a
          class="crumbs-nav-clear ml12"
          href="javascript:;"
          v-show="momentsonCategoryText || momentBrandListText"
          @click="_clear"
        >清空筛选</a>
      </div>

      <!--  -->
      <div class="L-table" v-show="currentBrands.length && !momentBrandList.length">
        <div class="L-t-head flt">品牌</div>
        <div class="L-t-content">
          <span
            class="brand-more-btn"
            v-show="currentBrands.length >30 && !selectBrandMultiple"
            :class="{'list-brand-show-more': brandShowMore}"
            @click="_toggleBrandMore"
          >
            {{!brandShowMore?'更多':'收起'}}
            <b></b>
          </span>
          <span
            class="brand-multiple-btn cs"
            @click="_brandMultipleClick"
            v-show="!selectBrandMultiple && currentBrands.length>1"
          >+多选</span>
          <ul
            class="L-item-list clearfix"
            v-if="!brandShowMore && currentBrands.length >30 && !selectBrandMultiple"
          >
            <li v-for="(brand, index) in currentBrands.slice(0,30)" :key="brand.brandId">
              <span
                v-show="selectBrandMultiple"
                @click="_selectbrand(brand, index)"
                v-bind:class="{'L-item-checked':brand.checked}"
              ></span>
              <a href="javascript:;" @click="_selectbrand(brand, index)">{{brand.brandName}}</a>
            </li>
          </ul>
          <ul class="L-item-list clearfix" v-else>
            <li v-for="(brand, index) in currentBrands" :key="brand.brandId">
              <span
                v-show="selectBrandMultiple"
                @click="_selectbrand(brand, index)"
                v-bind:class="{'L-item-checked':brand.checked}"
              ></span>
              <a href="javascript:;" @click="_selectbrand(brand, index)">{{brand.brandName}}</a>
            </li>
          </ul>
          <div class="L-confirm-area flex-center" v-show="selectBrandMultiple">
            <a
              href="javascript:;"
              class="L-confirm-btn"
              :class="{'confirm-btn-able': showSelectbrandsConfirm}"
              @click="_selectbrandsConfirm"
            >确定</a>
            <a href="javascript:;" class="L-confirm-btn ml12" @click="_brandMultipleClick">取消</a>
          </div>
        </div>
      </div>
      <!--  -->
      <div class="L-table" v-show="currentSonCategorys.length && !momentsonCategoryList.length">
        <div class="L-t-head flt">分类</div>
        <div class="L-t-content">
          <span
            class="brand-more-btn"
            v-show="currentSonCategorys.length > 30 && !selectCategoryMultiple"
            :class="{'list-brand-show-more': categoryShowMore}"
            @click="_toggleCategoryMore"
          >
            {{!categoryShowMore?'更多':'收起'}}
            <b></b>
          </span>
          <span
            class="brand-multiple-btn cs"
            @click="_sonCategoryMultipleClick"
            v-show="!selectCategoryMultiple && currentSonCategorys.length>1"
          >+多选</span>
          <ul
            class="L-item-list clearfix"
            v-if="!categoryShowMore && currentSonCategorys.length >30 && !selectCategoryMultiple"
          >
            <li v-for="(son, index) in currentSonCategorys.slice(0, 30)" :key="son.sonId">
              <span
                v-show="selectCategoryMultiple"
                @click="_selectSonCategory(son, index)"
                v-bind:class="{'L-item-checked':son.checked}"
              ></span>
              <a href="javascript:;" @click="_selectSonCategory(son, index)">{{son.sonName}}</a>
            </li>
          </ul>
          <ul class="L-item-list clearfix" v-else>
            <li v-for="(son, index) in currentSonCategorys" :key="son.sonId">
              <span
                v-show="selectCategoryMultiple"
                @click="_selectSonCategory(son, index)"
                v-bind:class="{'L-item-checked':son.checked}"
              ></span>
              <a href="javascript:;" @click="_selectSonCategory(son, index)">{{son.sonName}}</a>
            </li>
          </ul>
          <div class="L-confirm-area flex-center" v-show="selectCategoryMultiple">
            <a
              href="javascript:;"
              class="L-confirm-btn"
              :class="{'confirm-btn-able': showSelectSonCategorysConfirm}"
              @click="_selectSonCategorysConfirm"
            >确定</a>
            <a href="javascript:;" class="L-confirm-btn ml12" @click="_sonCategoryMultipleClick">取消</a>
          </div>
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
                  :class="{'price-isAscending-icon-up': filterParams.isAscending}"
                ></i>
              </a>
            </li>
          </ul>
          <span>
            <b @click="justLookInStore" :class="{'active': filterParams.searchModes == 2}"></b>&nbsp;仅看有货
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
          v-for="(product,index) in productList"
          :key="product.productSkuId + product.price + index"
          v-bind:product-item="product"
        ></product-common>
        <empty v-show="isEmpty" txt="抱歉没有找到相关商品"></empty>
        <!-- 点击下侧“帮我找货”按钮，登记您的需求，我们将及时处理并反馈。 -->
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
          @current-change="_elCurrentPageChange"
          @next-click="_elNext"
        ></el-pagination>
      </div>
      <!--起送，优惠券，凑单 提示栏-->
      <div id="bottom-empty"></div>
      <div class="gather-tip-wrap" v-if="filterParams.gatherType||filterParams.isCouponList">
        <gather-tip :gather-obj="gatherObj"></gather-tip>
      </div>
    </div>
    <dealer-pop></dealer-pop>
  </section>
</template>

<script>
import bus from "common/bus";
import {
  ListProductCategory,
  ListProductBrand,
  ListProduct,
  requestSecondPageCategory,
  ListBigCategory
} from "api/common/common";
import productCommon from "components/common/product-common.vue";
import * as $cache from "common/cache";
import {
  uniqBrandList,
  backwardInference,
  _getBrandList,
  getCurrentSonCategorysInSearchKey
} from "common/categoryUtil";
import { transformProductList } from "common/productUtil/list";
import empty from "components/common/empty.vue";
import sideBar from "components/home/sideBar.vue";
import GatherTip from "components/productGatherTip/productGatherTip.vue";
import dealerPop from "components/dealer/dealerPop.vue";
/*
 从专区类目进来 取专区类目匹配
 搜索取全局类目
*/
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
  searchModes: [], //查询模式 array<number>  仅看自营(0),易久批配送(1),仅看有货(2)   view
  sort: 0, //按排number 序号(0),按时间(1),按价格(2),按销量(3),   view
  shopId: "", //	店铺 Id
  currentPage: 1,
  pageSize: 60
};

export default {
  name: "list",
  data() {
    return {
      loading: false,
      brandShowMore: false,
      categoryShowMore: false,
      isEmpty: false,
      totalPage: 1,
      totalCount: 1,
      categoryList: [],
      filterParams: {},
      productList: [],
      currentCategoryObj: {}, // '葡萄酒'
      currentSonCategorys: [], //render
      currentBrands: [], //render
      momentsonCategoryList: [], // 当前选择
      momentBrandList: [], // 当前选择
      selectCategoryMultiple: false,
      selectBrandMultiple: false,
      brandShouqi: false,
      showSelectbrandsConfirm: false,
      showSelectSonCategorysConfirm: false,
      sortMenu: [
        { type: 0, text: "综合排序", isAscending: false },
        { type: 3, text: "销量", isAscending: false },
        { type: 2, text: "价格", isAscending: false }
      ], //	按排序号(0),按时间(1),按价格(2),按销量(3),
      gatherObj: {} //起送，优惠券，凑单参数对象
    };
  },
  components: {
    productCommon,
    empty,
    GatherTip,
    sideBar,
    dealerPop
  },
  computed: {
    hasSearKey() {
      return !!this.filterParams.searchKey || this.filterParams.searchKey == "";
    },
    momentsonCategoryText() {
      const sliceArr = this.momentsonCategoryList.map(item => item.sonName);
      return sliceArr
        .slice(0, 4)
        .join(",")
        .slice(0, 15);
    },
    momentBrandListText() {
      const sliceArr = this.momentBrandList.map(item => item.brandName);
      return sliceArr
        .slice(0, 4)
        .join(",")
        .slice(0, 15);
    }
  },
  beforeCreate() {},
  created() {
    this.initFilterParams();
    this._getCategoryListfromCache();
    this.$createTalkingData("Product_List", "", {}, 1);
  },
  beforeDestroy() {
    this.$createTalkingData("Product_List", "", {}, 2);
  },
  mounted() {
    bus.$on("doSearch", data => {
      //清空对象指针
      Object.assign(filterParams, {
        firstCategoryId: "",
        sonCategoryId: "",
        brandId: "",
        searchKey: data,
        specialAreaId: ""
      });
      this.filterParams = Object.assign({}, this.filterParams, filterParams);
      this.currentCategoryObj = {};
      this.momentBrandList = [];
      this.momentsonCategoryList = [];
      this.selectBrandMultiple = false;
      this.selectCategoryMultiple = false;
      this._initWithSearchKey();
    });
  },
  methods: {
    initFilterParams() {
      if (this.$route.query) {
        //清空对象指针
        Object.assign(filterParams, {
          firstCategoryId: "",
          sonCategoryId: "",
          brandId: "",
          searchKey: null,
          specialAreaId: ""
        });
        //混入新的参数
        Object.assign(filterParams, this.$route.query);
        this.filterParams = Object.assign({}, this.filterParams, filterParams);
        //起送，优惠券，凑单参数对象
        if (this.filterParams.gatherType) {
          const {
            specialAreaId,
            gatherType,
            gatherCount = 0
          } = this.filterParams;
          this.gatherObj = {
            specialAreaId,
            gatherType,
            gatherCount
          };
        }
        const { sonCategoryId, brandId } = this.filterParams;
        this.filterParams.categoryIds = sonCategoryId ? [sonCategoryId] : [];
        this.filterParams.brandIds = brandId ? [brandId] : [];
      }
    },
    /*
       1.通过搜索进来  hasSearKey  考虑专区
        1). keyWord有值(此时一定不存在specialAreaId)  _ListProductCategory() && _ListProductBrand()
        2). keyWord无值
            无specialAreaId  commonCategoryList ==> {categoryList, currentSonCategorys, currentSonBrands}
            有specialAreaId  SecondPageCategory ==> {categoryList, currentSonCategorys, currentSonBrands}
       2.首页通过点击某个大类目  不考虑专区  二级类目  品牌  categoryList  ==>  _initMatchRender
    */
    _getCategoryListfromCache() {
      //with keyWord  有或者没有 specialAreaId
      if (this.hasSearKey) {
        this._initWithSearchKey();
        return;
      }
      //no keyWord  首页点击匹配  commonCategoryList
      const commonCategoryList = $cache.getCache("commonCategoryList");
      if (commonCategoryList) {
        this.categoryList = commonCategoryList;
        this._initMatchRender();
      } else {
        ListBigCategory().then(res => {
          this.categoryList = res.data;
          this._initMatchRender();
        });
      }
    },
    _initWithSearchKey() {
      let matchCategoryList = null;
      const { specialAreaId, searchKey } = this.filterParams;
      if (searchKey) {
        this._ListProductCategory();
        this._ListProductBrand();
        return;
      }
      //为空
      if (specialAreaId) {
        const SecondPageCategory = $cache.getCache("SecondPageCategory") || {};
        if (SecondPageCategory[specialAreaId]) {
          this.categoryList = SecondPageCategory[specialAreaId];
          this.currentSonCategorys = getCurrentSonCategorysInSearchKey(
            this.categoryList
          );
          this.currentBrands = uniqBrandList(this.categoryList);
          if (!this.currentBrands.length) {
            this._ListProductBrand();
          }
        } else {
          requestSecondPageCategory(specialAreaId).then(res => {
            if (res.success) {
              this.categoryList = res.data;
              this.currentSonCategorys = getCurrentSonCategorysInSearchKey(
                this.categoryList
              );
              this.currentBrands = uniqBrandList(this.categoryList);
              if (!this.currentBrands.length) {
                this._ListProductBrand();
              }
            }
          });
        }
      } else {
        const commonCategoryList = $cache.getCache("commonCategoryList");
        if (commonCategoryList) {
          this.categoryList = commonCategoryList;
          this.currentSonCategorys = getCurrentSonCategorysInSearchKey(
            commonCategoryList
          );
          this.currentBrands = uniqBrandList(commonCategoryList);
        } else {
          ListBigCategory().then(res => {
            this.categoryList = res.data;
            this.currentSonCategorys = getCurrentSonCategorysInSearchKey(
              this.categoryList
            );
            this.currentBrands = uniqBrandList(this.categoryList);
          });
        }
      }
    },
    _initMatchRender(clear) {
      let { firstCategoryId, sonCategoryId, brandId } = this.$route.query;
      brandId = !clear ? brandId : "";
      let {
        currentCategoryObj,
        currentSonCategorys,
        currentBrands,
        momentsonCategoryList,
        momentBrandList
      } = backwardInference(
        this.categoryList,
        firstCategoryId,
        sonCategoryId,
        brandId
      );
      this.currentCategoryObj = currentCategoryObj;
      this.currentSonCategorys = currentSonCategorys;
      this.currentBrands = currentBrands;
      if (!clear) {
        this.momentsonCategoryList = momentsonCategoryList;
        this.momentBrandList = momentBrandList;
      }
    },
    //点击类目
    _selectSonCategory(item, index) {
      if (this.selectCategoryMultiple) {
        //Multiple
        item.checked = !item.checked;
        this.$set(this.currentSonCategorys, index, item);
        this.multipleConfirmAbled();
      } else {
        this.momentBrandList = [];
        this.momentsonCategoryList = [item];
        this.selectBrandMultiple = false;
        this.filterParams.brandIds = [];
        if (this.filterParams.firstCategoryId == item.sonId) {
          this.filterParams.categoryIds = [];
        } else {
          this.filterParams.categoryIds = [item.sonId];
        }
        if (!this.hasSearKey || this.filterParams.searchKey === "") {
          this.currentBrands = [];
          //get brand
          this.currentBrands = (item.brandList || []).map(item => {
            item.checked = false;
            return item;
          });
        } else {
          this._ListProductBrand();
        }
        this.$createTalkingData("Product_List", "Product_Category", {
          CategoryId: item.sonId
        });
      }
    },
    //点击品牌
    _selectbrand(brand, index) {
      if (this.selectBrandMultiple) {
        //Multiple
        brand.checked = !brand.checked;
        this.$set(this.currentBrands, index, brand);
        this.multipleConfirmAbled("brand");
      } else {
        //有 二级类目
        if (this.momentsonCategoryList.length) {
          this.momentBrandList = [brand];
          this.filterParams.brandIds = [brand.brandId];
        } else {
          this.selectCategoryMultiple = false;
          this.momentBrandList = [brand];
          this.filterParams.brandIds = [brand.brandId];
        }
        this.$createTalkingData("Product_List", "Product_Brand", {
          BrandId: brand.brandId
        });
      }
    },
    //是否多选品牌
    _brandMultipleClick() {
      this.selectBrandMultiple = !this.selectBrandMultiple;
      this.currentBrands.forEach(brand => {
        if (brand.checked) {
          brand.checked = false;
        }
      });
      this.multipleConfirmAbled("brand");
    },
    //确定多选品牌
    _selectbrandsConfirm() {
      if (!this.showSelectbrandsConfirm) {
        return;
      }
      let temporary = [];
      this.currentBrands.forEach(item => {
        if (item.checked) {
          temporary.push(item.brandId);
          this.momentBrandList.push(item);
          this.filterParams.brandIds = temporary;
        }
      });
      this.$createTalkingData("Product_List", "Product_Brand_Check", {
            BrandMultipleChoiceId: temporary
      });
    },
    //是否多选二级
    _sonCategoryMultipleClick() {
      this.selectCategoryMultiple = !this.selectCategoryMultiple;
      //todo  有firstCategoryId时 过滤全部品牌
      this.currentSonCategorys = this.currentSonCategorys.map(item => {
        item.checked = false;
        return item;
      });
      this.multipleConfirmAbled();
    },
    //确定多选二级类目
    _selectSonCategorysConfirm() {
      this.momentsonCategoryList = this.currentSonCategorys.filter(
        son => son.checked && son.sonName != "全部"
      );
      this.filterParams.categoryIds = this.momentsonCategoryList.map(item => {
        return item.sonId;
      });
      this.filterParams.brandIds = [];
      if (!this.hasSearKey || this.filterParams.searchKey === "") {
        this.currentBrands = _getBrandList(this.momentsonCategoryList);
      } else {
        this._ListProductBrand();
      }
      this.$createTalkingData("Product_List", "Product_Category_Check", {
        CategoryMultipleChoiceId: this.filterParams.categoryIds
      });
    },
    //多选确定按钮  able  type
    multipleConfirmAbled(t) {
      if (t == "brand") {
        this.showSelectbrandsConfirm = this.currentBrands.some(
          item => item.checked
        );
      } else {
        this.showSelectSonCategorysConfirm = this.currentSonCategorys.some(
          item => item.checked
        );
      }
    },
    //切换类目
    _changeMomentsonCategoryList(son) {
      if (
        this.momentsonCategoryList.length &&
        son.sonId == this.momentsonCategoryList[0].sonId
      ) {
        return;
      }
      this.momentBrandList = [];
      this.momentsonCategoryList = [son];
      this.selectBrandMultiple = false;
      if (this.filterParams.firstCategoryId == son.sonId) {
        this.filterParams.categoryIds = [];
      } else {
        this.filterParams.categoryIds = [son.sonId];
      }
      this.filterParams.brandIds = [];
      if (!this.hasSearKey || this.filterParams.searchKey === "") {
        this.currentBrands = son.brandList || [];
      } else {
        this._ListProductBrand();
      }
      this.$createTalkingData("Product_List", "Product_Category", {
        CategoryId: son.sonId
      });
    },
    //清空
    _clear() {
      this.momentBrandList = [];
      this.momentsonCategoryList = [];
      this.selectBrandMultiple = false;
      this.selectCategoryMultiple = false;
      this.filterParams.brandIds = [];
      this.filterParams.categoryIds = [];
      this.$createTalkingData("Product_List", "Product_Empty", {});

      if (!this.hasSearKey) {
        this.$route.query.brandId = "";
        this.currentBrands = [];
        this.initFilterParams();
        this._initMatchRender(true);
        return;
      }
      if (this.filterParams.searchKey === "") {
        this.currentBrands = [];
        this.initFilterParams();
        this._initWithSearchKey();
        return;
      }
      this._ListProductBrand();
    },
    //清空品牌
    _clearBrand() {
      this.momentBrandList = [];
      this.filterParams.brandIds = [];
      this.selectBrandMultiple = false;
      this.currentBrands = this.currentBrands.map(item => {
        item.checked = false;
        return item;
      });
    },
    _ListProduct(filterParams) {
      this.loading = true;
      if (filterParams.currentPage > 1) {
        document.querySelector("#filter").scrollIntoView();
      }
      ListProduct(filterParams)
        .then(res => {
          this.loading = false;
          if (res.success) {
            if(this.filterParams.gatherType && this.filterParams.gatherType == 4){
              res.data = res.data.filter((product)=>{
                return product.isUseCoupon == true
              })
            }
            this.productList = transformProductList(res.data);
            this.isEmpty = !this.productList.length;
            this.totalCount = res.totalCount;
            this.totalPage = Math.ceil(res.totalCount / filterParams.pageSize);
            if (this.filterParams.gatherType) {
              this.$nextTick(() => {
                let topH = document.getElementById("bottom-empty").offsetTop;
                bus.$emit("listCreat", topH);
              });
            }
          }
        })
        .catch(res => {
          this.loading = false;
        });
    },
    //searchKey ==>  currentSonCategorys
    _ListProductCategory() {
      ListProductCategory(this.filterParams).then(res => {
        if (res.success) {
          this.categoryList = res.data;
          this.currentSonCategorys = getCurrentSonCategorysInSearchKey(
            res.data
          );
        }
      });
    },
    //searchKey ==>  currentBrands
    _ListProductBrand() {
      ListProductBrand(this.filterParams).then(res => {
        if (res.success) {
          this.currentBrands = res.data || [];
        }
      });
    },
    _sort(item) {
      const { sort } = this.filterParams;
      if (sort == item.type) {
        const { isAscending } = this.filterParams;
        this.filterParams.isAscending = sort == 2 ? !isAscending : isAscending;
      } else {
        this.filterParams.sort = item.type;
        this.filterParams.currentPage = 1;
      }
      this.$createTalkingData("Product_List", "Product_Rank", {
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
        this.$createTalkingData("Product_List", "Product_Rank", {
          ProfitSiftSortFilter: 5
        });
      }
    },
    _elNext() {
      this.$createTalkingData("Product_List", "Product_Rank", {
        ProfitSiftSortFilter: 5
      });
    },
    _elCurrentPageChange() {
      this.$createTalkingData("Product_List", "Product_Page", {
        PageNumber: this.filterParams.currentPage
      });
    },
    // 仅看有货
    justLookInStore() {
      if (this.filterParams.searchModes.length) {
        this.filterParams.searchModes.shift();
      } else {
        this.filterParams.searchModes.push(2);
        this.$createTalkingData("Product_List", "Product_Rank", {
          ProfitSiftSortFilter: 4
        });
      }
    },
    _toggleBrandMore() {
      this.brandShowMore = !this.brandShowMore;
      if (this.brandShowMore) {
        this.$createTalkingData("Product_List", "Product_Brand_More", {});
      }
    },
    _toggleCategoryMore() {
      this.categoryShowMore = !this.categoryShowMore
      if (this.categoryShowMore) {
        this.$createTalkingData("Product_List", "Product_Category_More", {});
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
</style>

