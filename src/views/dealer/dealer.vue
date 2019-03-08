<template>
  <div>
    <app-header />
    <Navi :dealer="true" />
    <div class="content dealer-wrap">
      <dealer-head v-if="showShop" :shop-info="shopInfo" />

      <keep-alive>
        <router-view v-if="$route.meta.keepAlive&&showShop"></router-view>
      </keep-alive>
      <router-view v-if="!$route.meta.keepAlive&&showShop"></router-view>

    </div>
    <app-footer />
  </div>
</template>
<script>
  import AppHeader from '../AppHeader.vue'
  import AppFooter from '../AppFooter.vue'
  import DealerHead from '@/components/dealer/dealerHead.vue'
  import Navi from "@/views/Navi.vue";
  import { queryDealerShop,attentionShop } from "api/dealer/dealer"
  import bus from "common/bus";
  export default {
    data(){
      return {
        shopInfo: {},
        showShop: false,
        shopId: ``,//店铺id
      }
    },
    components: {
      AppHeader,
      AppFooter,
      DealerHead,
      Navi
    },
    mounted(){
      bus.$off("dealerSearch")
      bus.$on("dealerSearch", (searchKey) => {
        bus.$emit("setActivedIdx", '');
        let name = this.$route.name
        let routeData = this.$router.resolve({
          path: "/dealer/dealerProductList",
          query: this.encodeUrlQuery({ shopId:this.shopId,searchKey })
        })
        if(name==`dealerProductList`){
          bus.$emit("dealerRefresh", searchKey);
        }
        window.open(routeData.href, "_self");
      });
    },
    beforeCreate(){

    },
    created(){
      let query = this.decodeUrlQuery(this.$route.query)
      this.shopId = query.shopId || ``
      this.getDealerShopInfo(query.shopId)
    },
    methods: {
      //获取经销商店铺信息
      getDealerShopInfo(shopId){
        let param = {
          data: shopId
        }
        queryDealerShop(param)
          .then(res => {
            if (res.success) {
              this.shopInfo = res.data
              this.showShop = true
            }
          })
          .catch(res => {});
      },
    },
  }
</script>
<style lang="stylus" scoped>
.content{
  min-height 600px
}
.dealer-wrap{
  position relative
  mt(-42)
  /*z-index 2*/
  &:before{
    content ""
    position absolute
    left 0
    top 0
    z-index 1
    bg(#fff)
    height 42px
    width 100%
  }
}
</style>

