//混入对象
// import
import avatar from "@/assets/images/duigou_jiarugouwuche@2x.png";
import { makeProductToCartParam } from "common/productUtil/list";
import { getProductNotify } from "api/product/product";
import { AddShopCart } from "api/cart/cart";
import numberPicker from "./numberPicker.vue";
import { mapActions } from "vuex";
import bus from "common/bus";
import toastCart from './toastAddCart';

export const mixin = {
    components: {
        numberPicker,
        toastCart
    },
    methods: {
        ...mapActions(["saveCartCount"]),
        _addToCartFromHome() {
            const param = makeProductToCartParam(this.productItem);
            AddShopCart(param).then(res => {
                if (res.success) {
                    this.saveCartCount(param.count);
                    if (this.$route.name == 'home') {
                      bus.$emit("updatePrompt", this.productItem)
                    }
                    this.$refs.toastCart.show();
                }
            });
            const { productSkuId, homePromotionProduct = "" } = this.productItem;
            if (!homePromotionProduct) { //首页专栏产品加入cart
                this.$createTalkingData('index', 'Index_Channel_List', { SkuId: productSkuId })
            }
        },
        //加入购物车
        _addToCart() {

            const param = makeProductToCartParam(this.productItem);
            AddShopCart(param).then(res => {
                if (res.success) {
                    this.saveCartCount(param.count);
                    if (this.$route.name == 'list' || this.$route.name == 'home') {
                        //购物车凑单产品列表，商品加入购物车，需要更新优惠提示信息
                        bus.$emit("updatePrompt", this.productItem)
                    }
                    // this.$confirm({
                    //     content: "已成功加入购物车",
                    //     imgUrl: avatar,
                    //     yesText: "去购物车",
                    //     noText: "继续购物",
                    //     showDuration: true
                    // }).then(() => {
                    //     const { href } = this.$router.resolve({ path: "/cartIndex/shopCart" });
                    //     window.open(href, "_self");
                    // }).catch(() => { });
                    this.$refs.toastCart.show();
                }
            });
            //枚举 页面 list（default）： 1首页，2赚钱精选，3快捷进货
            if (this.$route.name != 'list') {
                const enumer = ['', 'home', 'profit', 'quicklyPurchase', 'activityDetail'];
                const events = ['', 'Index_Channel_To_Car', 'Profit_Sift_Shop', 'ShortCut_Order_Shop', 'Activity_Content_Product_Car'];
                const matchIndex = enumer.findIndex(item => item == this.$route.name);
                const pageId = matchIndex > 0 ? matchIndex : '';
                if (pageId) {
                    const { productSkuId, buyCount } = this.productItem;
                    let pageSource = ''
                    if(this.$route.name == 'activityDetail'){
                      pageSource = 'Activity_Content'
                    }else{
                      pageSource = 'index'
                    }
                    this.$createTalkingData(pageSource, events[matchIndex], { SkuSource: pageId, SkuId: productSkuId, SkuNum: buyCount })
                }
            }
        },
        //到货通知
        _getProductNotify() {
            if (this.productItem.alreadyArrivalNotice) {
                this.$message("您已订阅该商品的到货通知");
                return false;
            }
            getProductNotify(this.productItem.productSkuId)
            .then(res => {
                if (res.success) {
                    this.productItem.alreadyArrivalNotice = true;
                    this.$message("商品一旦到货，您将收到通知");
                }
            }).catch(res => { });
            //枚举 页面 list（default）： 1首页， 2赚钱精选 ，3快捷进货
            if (this.$route.name != 'list') {
                const enumer = ['', 'home', 'profit', 'quicklyPurchase'];
                const events = ['', 'Index_ArrivalNnotice', 'Profit_ArrivalNnotice', 'ShortCut_Order_ArrivalNnotice'];
                const matchIndex = enumer.findIndex(item => item == this.$route.name);
                const pageId = matchIndex > 0 ? matchIndex : '';
                if (pageId) {
                    this.$createTalkingData('index', events[matchIndex], { SkuSource: pageId, SkuId: this.productItem.productSkuId })
                }
            }
        },
        _jumpProductDetailFromHome() {
            const { productSkuId, timeLimitPromotionId = "", homePromotionProduct=""} = this.productItem;
            let routeData = this.$router.resolve({
                name: "productDetail",
                query: this.encodeUrlQuery({ skuId: productSkuId, timeLimitPromotionId })
            });
            window.open(routeData.href, "_blank");

            if (homePromotionProduct) {//首页活动产品埋点
                this.$createTalkingData('index', 'Index_Promotion', { PromotionId: timeLimitPromotionId, SkuId: productSkuId })
            }
        },
        //跳转到商品详情
        _jumpProductDetailFromCommon() {
            const { productSkuId, timeLimitPromotionId = "",saleMode } = this.productItem;
            let routeData
            if(saleMode==6){
              routeData = this.$router.resolve({
                path: "/dealer/productDetail",
                query: this.encodeUrlQuery({ skuId: productSkuId, shopId: this.productItem.companyId })
              });
            }else{
              routeData = this.$router.resolve({
                name: "productDetail",
                query: this.encodeUrlQuery({ skuId: productSkuId, timeLimitPromotionId })
              });
            }
            window.open(routeData.href, "_blank");

            //枚举 页面 list（default）： 1首页，2赚钱精选，3快捷进货
            if (this.$route.name != 'list') {
                const enumer = ['', 'home', 'profit', 'quicklyPurchase'];
                const events = ['', 'Index_Product_Details', 'Profit_Product_Details', 'ShortCut_Order_Product_Details'];
                const matchIndex = enumer.findIndex(item => item == this.$route.name);
                const pageId = matchIndex > 0 ? matchIndex : '';
                if (pageId) {
                    this.$createTalkingData('index', events[matchIndex], { SkuSource: pageId, SkuId: this.productItem.productSkuId })
                }
                //商品详情为你推荐
                if(this.$route.name == 'productDetail'){
                  this.$createTalkingData("Product", "", {}, 2)
                  this.$createTalkingData("Product", "Product_Recommend_View", { SkuId: this.productItem.productSkuId })
                }
            }else{
                this.$createTalkingData('Product_List', 'Product', { SkuId: this.productItem.productSkuId })
            }
        },
      _dealerApply(){
          bus.$emit("popShow",this.productItem);
      },
    }
}
