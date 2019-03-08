<template>
  <div class="container">
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

      <div class="crumbs-nav-item" v-show="selectCategorys.length>1">
        <div class="menu-drop">
          <div class="menu-drop-title">{{selectCategoryText}}</div>
        </div>
        <i class="crumbs-arrow">></i>
      </div>

      <div
        class="crumbs-nav-item"
        v-show="selectCategorys.length===1 && currentSonCategorys.length"
      >
        <div class="menu-drop">
          <div class="trigger pre">
            <span>{{selectCategoryText}}</span>
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

      <div class="crumbs-nav-item" v-show="selectBrandListText">
        <div class="menu-drop">
          <div class="menu-drop-title" style="padding-right:4px;">
            {{selectBrandListText}}
            <i @click="_clearBrand"></i>
          </div>
        </div>
        <i class="crumbs-arrow">></i>
      </div>
      <strong
        v-show="filterParam.searchKey"
        class="crumbs-nav-clear"
      >{{'"'+filterParam.searchKey+'"'}}</strong>
      <a
        class="crumbs-nav-clear ml12"
        href="javascript:;"
        v-show="selectCategoryText || selectBrandListText"
        @click="_clear"
      >清空筛选</a>
      <a
        class="crumbs-nav-clear ml12"
        href="javascript:;"
        v-if="filterParam.searchKey"
        @click="_clearSearchKey"
      >清空搜索关键字</a>
    </div>

    <!-- 品牌 -->
    <div class="L-table" v-show="currentBrands.length&&!selectBrands.length">
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
    <!-- 分类 -->
    <div class="L-table" v-show="currentSonCategorys.length&&!selectCategorys.length">
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

    <div id="filter" class="filter-wrap clearfix">
      <div class="f_w_left flt">
        <ul>
          <li v-for="item in sortMenu" :key="item.type">
            <a
              href="javascript:;"
              @click="_sort(item)"
              class="c-3"
              :class="{'active': filterParam.sort == item.type}"
            >
              {{item.text}}
              <i
                v-if="item.type == 2 && filterParam.sort==2"
                class="price-isAscending-icon"
                :class="{'price-isAscending-icon-up': filterParam.ascending}"
              ></i>
            </a>
          </li>
        </ul>
        <span>
            <b @click="justLookInStore" :class="{'active': filterParam.searchModes == 2}"></b>&nbsp;仅看有货
          </span>
      </div>
      <div class="f_w_right">
        共{{totalCount}}件商品
        <b class="c-red">{{currentPage}}</b>
        /{{totalPage}}
        <span class="f_p_btn" @click="_pre">&lt;</span>
        <span class="f_p_btn" @click="_next">&gt;</span>
      </div>
    </div>
    <!--加载过渡动画-->
    <div class="loading-list" v-show="loading">
      <i></i>正在加载中，请稍后~
    </div>
    <!--产品列表-->
    <div class="base-product-list clearfix">
      <product
        v-if="productList.length"
        v-for="(product,index) in productList"
        :key="product.productSkuId + product.price + index"
        v-bind:product-item="product"
      ></product>
      <empty v-show="isEmpty" txt="抱歉没有找到相关商品"></empty>
    </div>
    <!--分页-->
    <div class="clearfix">
      <el-pagination
        class="mt24 mb24 frt"
        background
        :current-page.sync="currentPage"
        :page-size="pageSize"
        layout="total, prev, pager, next, jumper"
        :total="totalCount"
        prev-text="上一页"
        next-text="下一页"
      ></el-pagination>
    </div>
    <dealer-pop></dealer-pop>
  </div>
</template>
<script>
  import { queryDealerShopProducts } from "api/dealer/dealer"
  import { ListProductCategory,ListProductBrand } from "api/common/common"
  import product from "components/common/product-common.vue"
  import empty from "components/common/empty.vue"
  import { transformDealerProductList } from "common/productUtil/list";
  import dealerPop from "components/dealer/dealerPop.vue";
  import bus from "common/bus";
  export default {
    data(){
      return {
        loading: false,
        currentPage: 1,
        pageSize: 60,
        totalCount: 1,//产品总数
        totalPage: 1,
        filterParam:{
          ascending: false,//是否升序
          brandIds: [],//品牌id
          firstCategoryId: ``,//一级类目 Id
          searchKey: ``,//产品搜索关键字
          searchModes: [],//查询模式（0=仅看自营, 1=易久批配送, 2=仅看有货
          secondCategoryId: [],//二级类目Id
          shopId: ``,//店铺id
          sort: 0,//排序方式（按排序号(0),按时间(1),按价格(2),按销量(3),）
          saleModels: [6]//经销商
        },
        productList: [],//产品列表
        currentBrands: [],//产品品牌
        categoryList: [],//类目列表
        currentSonCategorys: [],//子类目列表
        selectBrands: [],//选中的品牌
        selectCategorys: [],//选中的类目
        currentCategoryObj: {},
        isEmpty: false,
        requestDone: false,
        sortMenu: [
          { type: 0, text: "综合排序", ascending: false },
          { type: 3, text: "销量", ascending: false },
          { type: 2, text: "价格", ascending: false }
        ], //	按排序号(0),按时间(1),按价格(2),按销量(3),
        selectBrandMultiple: false,
        brandShowMore: false,
        showSelectbrandsConfirm: false,
        categoryShowMore: false,
        selectCategoryMultiple: false,
        showSelectSonCategorysConfirm: false,
      }
    },
    computed: {
      selectBrandListText() {
        const sliceArr = this.selectBrands.map(item => item.brandName);
        return sliceArr
          .slice(0, 4)
          .join(",")
          .slice(0, 15);
      },
      selectCategoryText() {
        const sliceArr = this.selectCategorys.map(item => item.sonName);
        return sliceArr
          .slice(0, 4)
          .join(",")
          .slice(0, 15);
      },
    },
    components: {
      product,
      empty,
      dealerPop
    },
    mounted(){
      bus.$off("dealerRefresh")
      bus.$on("dealerRefresh", (searchKey) => {
        this.filterParam.searchKey = searchKey
        this.refresh()
      });
    },
    beforeRouteLeave(to, from, next) {
      if(to.name == `couponList`){
        to.meta.keepAlive = true;
      }
      next();
    },
    beforeCreate(){

    },
    created(){
      let query = this.decodeUrlQuery(this.$route.query,'shopId')
      this.filterParam.shopId = query.shopId || ``
      this.filterParam.searchKey = query.searchKey || ``
      //this.getShopProducts()
    },
    methods: {
      //初始化经销商产品列表
      initShop(){
        this.getShopProducts()
        if(!this.currentBrands.length){
          this.getShopBrands()
          this.getShopCategorys()
        }
      },
      refresh(searchKey){
        this.getShopProducts()
        this.getShopBrands()
        this.getShopCategorys()
      },
      //获取经销商品牌列表
      getShopBrands() {
        ListProductBrand(this.filterParam).then(res => {
          if (res.success) {
            this.currentBrands = res.data || [];
          }
        });
      },
      //获取经销商产品类目
      getShopCategorys() {
        ListProductCategory(this.filterParam).then(res => {
          if (res.success) {
            this.categoryList = res.data;
            this.currentSonCategorys = this.creatSonCategory(res.data);
          }
        });
      },
      //获取经销商产品列表
      getShopProducts(){
        this.loading = true
        let param = {
          data: this.filterParam,
          currentPage: this.currentPage,
          pageSize: this.pageSize
        }
        queryDealerShopProducts(param)
          .then(res => {
            this.loading = false
            if (res.success) {
              this.totalCount = res.totalCount
              this.totalPage = Math.ceil(res.totalCount / this.pageSize)
              this.productList = transformDealerProductList(res.data) || []
              this.isEmpty = !this.productList.length
            }
          })
          .catch(res => {
            this.loading = false
          });
      },
      _sort(item) {
        const { sort } = this.filterParam;
        if (sort == item.type) {
          const { ascending } = this;
          this.ascending = sort == 2 ? !ascending : ascending;
        } else {
          this.filterParam.sort = item.type;
          this.currentPage = 1;
        }
      },
      _pre() {
        if (this.currentPage > 1) {
          this.currentPage--;
        }
      },
      _next() {
        if (this.currentPage < this.totalPage) {
          this.currentPage++;
        }
      },
      // 仅看有货
      justLookInStore() {
        if (this.filterParam.searchModes.length) {
          this.filterParam.searchModes.shift();
        } else {
          this.filterParam.searchModes.push(2);
        }
      },
      creatSonCategory(data){
        let sonCategory = []
        for(let obj of data){
          for(let son of obj.sonCategorys){
            son.sonName = son.categoryName
            son.sonId = son.categoryId
            son.parentCategoryId = obj.categoryId
          }
          sonCategory.push(...obj.sonCategorys)
        }
        return sonCategory
      },
      _toggleBrandMore() {
        this.brandShowMore = !this.brandShowMore;
        if (this.brandShowMore) {
          this.$createTalkingData("Product_List", "Product_Brand_More", {});
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
      _selectbrand(brand, index) {
        if (this.selectBrandMultiple) {
          //Multiple
          brand.checked = !brand.checked;
          this.$set(this.currentBrands, index, brand);
          this.multipleConfirmAbled("brand");
        } else {
          this.selectCategoryMultiple = false;
          this.selectBrands = [brand];
          this.filterParam.brandIds = [brand.brandId];
        }
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
            this.selectBrands.push(item);
            this.filterParam.brandIds = temporary;
          }
        });
      },
      _toggleCategoryMore() {
        this.categoryShowMore = !this.categoryShowMore
        if (this.categoryShowMore) {
          this.$createTalkingData("Product_List", "Product_Category_More", {});
        }
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
      //点击类目
      _selectSonCategory(item, index) {
        if (this.selectCategoryMultiple) {
          //Multiple
          item.checked = !item.checked;
          this.$set(this.currentSonCategorys, index, item);
          this.multipleConfirmAbled();
        } else {
          this.selectBrands = [];
          this.selectCategorys = [item];
          this.selectBrandMultiple = false;
          this.filterParam.brandIds = [];
          this.filterParam.firstCategoryId = item.parentCategoryId
          this.filterParam.secondCategoryId = [item.sonId];
        }
        this.getShopBrands()
      },
      //确定多选二级类目
      _selectSonCategorysConfirm() {
        this.selectCategorys = this.currentSonCategorys.filter(
          son => son.checked && son.sonName != "全部"
        );
        this.filterParam.secondCategoryId = this.selectCategorys.map(item => {
          return item.sonId;
        });
        this.filterParam.brandIds = [];
        if (!this.hasSearKey || this.filterParam.searchKey === "") {
          this.currentBrands = _getBrandList(this.selectCategorys);
        } else {
          this._ListProductBrand();
        }
        this.$createTalkingData("Product_List", "Product_Category_Check", {
          CategoryMultipleChoiceId: this.filterParam.secondCategoryId
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
        //点击当前类目直接return
        if(son.sonId == this.filterParam.secondCategoryId[0]){
          return
        }
        this.selectBrands = [];
        this.selectCategorys = [son];
        this.selectBrandMultiple = false;
        this.filterParam.brandIds = [];
        this.filterParam.firstCategoryId = son.parentCategoryId
        this.filterParam.secondCategoryId = [son.sonId];
        this.getShopBrands()
      },
      //清空品牌
      _clearBrand() {
        this.selectBrands = [];
        this.filterParam.brandIds = [];
        this.selectBrandMultiple = false;
        this.currentBrands = this.currentBrands.map(item => {
          item.checked = false;
          return item;
        });
      },
      //清空
      _clear() {
        this.selectBrands = [];
        this.selectCategorys = [];
        this.selectBrandMultiple = false;
        this.selectCategoryMultiple = false;
        this.filterParam.brandIds = [];
        this.filterParam.firstCategoryId = "";
        this.filterParam.secondCategoryId = [];
        this.getShopBrands()
      },
      //清空搜索关键字
      _clearSearchKey(){
        this.filterParam.searchKey = ``
        this._clear()
      }
    },
    watch: {
      filterParam: {
        handler(newVal, oldVal) {
          this.initShop()
        },
        deep: true
      }
    }
  }
</script>
<style lang="stylus" scoped>
  @import "./stylus/dealerProductList.styl"
</style>

