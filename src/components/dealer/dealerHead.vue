<template>
  <div class="dealer-bg">
    <div class="container">
      <!--店铺信息-->
      <div class="shop-info">
        <div class="shop-logo">
          <img v-lazy="shopInfo.logoImgUrl" alt="">
        </div>
        <div class="shop-content">
          <h5>{{shopInfo.shopName}}</h5>
          <p class="introduce" v-if="shopInfo.shopDescription">店铺简介：{{shopInfo.shopDescription}}</p>
          <div class="contact">
            <span v-if="shopInfo.openingTime">入驻时间：{{shopInfo.openingTime}}</span>
            <span v-if="shopInfo.contactName">联系人：{{shopInfo.contactName}}-{{shopInfo.contactMobileNo}}</span>
          </div>
        </div>
        <div class="shop-favo">
          <div class="icon" @click="debounceFocus">
            <i :class="{ already: shopInfo.haveFavorite}"></i>
            <span>{{shopInfo.haveFavorite?`已关注`:`加关注`}}</span>
          </div>
          <div class="num">{{shopInfo.userFavoriteCount}}人已关注</div>
        </div>
      </div>

      <!--tab-->
      <div class="shop-tab">
        <span :class="{active:activedIdx===0}" @click="switchTab(0)">所有商品</span>
        <span :class="{active:activedIdx===1}" @click="switchTab(1)">优惠券</span>
      </div>
    </div>
  </div>
</template>

<style lang="stylus" scoped>
  @import "./dealerHead.styl"
</style>

<script>
  import { attentionShop } from "api/dealer/dealer"
  import { debounce } from "common/lodash"
  import bus from "common/bus";
  export default {
    props: {
      shopInfo: {
        type: Object,
        default: {}
      },
    },
    data() {
      return {
        activedIdx: null
      }
    },
    components:{

    },
    mounted() {
      this.debounceFocus = debounce(this.focusShop, 300, false)
      bus.$off("setActivedIdx")
      bus.$on("setActivedIdx", () => {
        this.activedIdx = 0
      });
    },
    created(){
      let pathName = this.$route.name
      if(pathName == `couponList`){
        this.activedIdx = 1
      }else if(pathName == `dealerProductList`){
        this.activedIdx = 0
      }
    },
    methods:{
      debounceFocus() {
        this.debounceFocus()
      },
      //店铺添加关注，取消关注
      focusShop(){
        let type = `add`
        const { shopId,haveFavorite,userFavoriteCount } = this.shopInfo
        let param = {
          data: shopId
        }
        if(haveFavorite) type = `cancel`
        attentionShop(type,param)
          .then(res => {
            if (res.success) {
              if(type==`add`){
                this.shopInfo.haveFavorite = true
                this.shopInfo.userFavoriteCount = userFavoriteCount + 1
                this.$message( "关注成功")
              }else{
                this.shopInfo.haveFavorite = false
                this.shopInfo.userFavoriteCount = userFavoriteCount - 1 > 0 ? userFavoriteCount - 1 : 0
                this.$message( "取消关注成功")
              }
            }
          })
          .catch(res => {});
      },
      switchTab(type){
        this.activedIdx = type
        if(type == 1){
          this.$router.push({
            path: "/dealer/couponList",
            query: this.encodeUrlQuery({ shopId: this.shopInfo.shopId })
          });
        }else{
          this.$router.push({
            path: "/dealer/dealerProductList",
            query: this.encodeUrlQuery({ shopId: this.shopInfo.shopId })
          });
        }
      },
    },
    watch:{

    }
  }
</script>

