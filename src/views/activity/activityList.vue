<template>
  <div class="activity-page">
    <!--页面头部bannner-->
    <div ref="pageBanner">
      <div class="page-banner"></div>
      <!--导航栏-->
<!--      <ul class="column-wrap w" v-if="domShow">
        <li :class="{ active: item.posId==currentAct}" v-for="item in columnData">
          <span @click="posActivity(item.posId)">{{item.name}}</span>
        </li>
      </ul>-->
    </div>
    <!--页面内容-->
    <div class="container" ref="content">
      <div>
        <!--活动-->
        <ul class="activity">
          <!--打折特价-->
          <li class="column home-float-list" id="act1" v-if="activityData.discount&&activityData.discount.length">
            <h3><span>打折特价</span></h3>
            <section >
              <div>
                <div class="content" v-for="item in activityData.discount">
                  <div class="ac-header">
                    <div class="title">{{item.name}}<span></span></div>
                    <div class="ac-time" v-if="(item.activityBegun&&item.showCountdownTime)||!item.activityBegun">
                      <span>{{item.activityBegun?`距离活动结束还有`:`距离活动开始还有`}}</span>
                      <time-count-down @time-end="onTimeEnd" :endTime="item.endTime" :startTime="item.startTime"></time-count-down>
                    </div>
                    <div class="ac-btn" @click="goToAcitityDetail(item)">查看活动详情</div>
                  </div>
                  <div class="ac-list">
                    <product v-for="term in item.productSkuList" :key="term.productSkuId" v-bind:product-item="term"
                             v-bind:activity="item" v-bind:hide-water=true></product>
                    <div class="ac-list-more" v-if="item.productSkuList.length>14" @click="goToAcitityDetail(item)">
                      <div class="contents">
                        <h5>查看更多</h5>
                        <h5>促销商品</h5>
                        <p>GO></p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </li>
          <!--凑单特价-->
          <li class="column home-float-list" id="act3" v-if="activityData.gather&&activityData.gather.length">
            <h3><span>凑单特价</span></h3>
            <section >
              <div >
                <div class="content" v-for="item in activityData.gather">
                  <div class="ac-header">
                    <div class="title">{{item.name}}<span></span></div>
                    <div class="ac-time" v-if="(item.activityBegun&&item.showCountdownTime)||!item.activityBegun">
                      <span>{{item.activityBegun?`距离活动结束还有`:`距离活动开始还有`}}</span>
                      <time-count-down @time-end="onTimeEnd" :endTime="item.endTime" :startTime="item.startTime"></time-count-down>
                    </div>
                    <div class="ac-btn" @click="goToAcitityDetail(item)">查看活动详情</div>
                  </div>
                  <div class="ac-list">
                    <product v-for="term in item.productSkuList" :key="term.productSkuId" v-bind:product-item="term"
                             v-bind:activity="item" v-bind:hide-water=true></product>
                    <div class="ac-list-more" v-if="item.productSkuList.length>14" @click="goToAcitityDetail(item)">
                      <div class="contents">
                        <h5>查看更多</h5>
                        <h5>促销商品</h5>
                        <p>GO></p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </li>
          <!--限时特价-->
          <li class="column home-float-list" id="act4" v-if="activityData.timeLimit&&activityData.timeLimit.length">
            <h3><span>限时特价</span></h3>
            <section >
              <div >
                <div class="content" v-for="item in activityData.timeLimit">
                  <div class="ac-header">
                    <div class="title">{{item.name}}<span></span></div>
                    <div class="ac-time" v-if="(item.activityBegun&&item.showCountdownTime)||!item.activityBegun">
                      <span>{{item.activityBegun?`距离活动结束还有`:`距离活动开始还有`}}</span>
                      <time-count-down @time-end="onTimeEnd" :endTime="item.endTime" :startTime="item.startTime"></time-count-down>
                    </div>
                    <div class="ac-btn" @click="goToAcitityDetail(item)">查看活动详情</div>
                  </div>
                  <div class="ac-list">
                    <product v-for="term in item.productSkuList" :key="term.productSkuId" v-bind:product-item="term"
                             v-bind:activity="item" v-bind:hide-water=true></product>
                    <div class="ac-list-more" v-if="item.productSkuList.length>14" @click="goToAcitityDetail(item)">
                      <div class="contents">
                        <h5>查看更多</h5>
                        <h5>促销商品</h5>
                        <p>GO></p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </li>
          <!--产品精选-->
          <li class="column home-float-list" id="act5" v-if="activityData.sift&&activityData.sift.length">
            <h3><span>产品精选</span></h3>
            <section >
              <div >
                <div class="content" v-for="item in activityData.sift">
                  <div class="ac-header">
                    <div class="title">{{item.name}}<span></span></div>
                    <div class="ac-time" v-if="(item.activityBegun&&item.showCountdownTime)||!item.activityBegun">
                      <span>{{item.activityBegun?`距离活动结束还有`:`距离活动开始还有`}}</span>
                      <time-count-down @time-end="onTimeEnd" :endTime="item.endTime" :startTime="item.startTime"></time-count-down>
                    </div>
                    <div class="ac-btn" @click="goToAcitityDetail(item)">查看活动详情</div>
                  </div>
                  <div class="ac-list">
                    <product v-for="term in item.productSkuList" :key="term.productSkuId" v-bind:product-item="term"
                             v-bind:activity="item" v-bind:hide-water=true></product>
                    <div class="ac-list-more" v-if="item.productSkuList.length>14" @click="goToAcitityDetail(item)">
                      <div class="contents">
                        <h5>查看更多</h5>
                        <h5>促销商品</h5>
                        <p>GO></p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </li>
          <!--组合特价-->
          <li class="column home-float-list" id="act2" v-if="activityData.combination&&activityData.combination.length">
            <h3><span>组合特价</span></h3>
            <section>
              <div >
                <div class="content clearfix" >
                  <composite-product v-for="item in activityData.combination" :key="item.activityId" v-bind:item="item"></composite-product>
                </div>
              </div>
            </section>
          </li>
          <div :class="{'floor':requesting}"></div>
        </ul>
        <div class="act-footer"></div>
        <empty v-show="isEmpty" txt="暂无促销活动"></empty>
      </div>
    </div>
    <!--<homeFloat v-bind:home-float-list="pageFloatArr" v-if="pageFloatArr.length>1" />-->
    <!--侧边栏-->
    <sideBar v-if="!isVisitor"/>
  </div>
</template>

<style lang="stylus" scoped>
  @import "./stylus/activityList.styl"
</style>

<script>
  import AppHeader from './../AppHeader.vue'
  import Navi from './../Navi.vue'
  import AppFooter from './../AppFooter.vue'
  import TimeCountDown from '../../components/common/TimeCountDown.vue'
  import Product from '../../components/common/product-activity.vue'
  import CompositeProduct from "../../components/home/compositeProduct.vue";
  import HomeFloat from "components/home/homeFloat.vue";
  import sideBar from "components/home/sideBar.vue";
  import empty from "components/common/empty.vue";
  import { getPromotionList,getCompositeActivity,getOnlinePromotion } from "../../api/activity/activity"
  import { transformProductList } from "common/productUtil/list";
  import * as ProductInfoUtil from "../../common/productInfo/productInfoUtil"
  import * as DateUtil from "../../common/DateUtil"
  import * as $cache from "common/cache";
  import bus from "common/bus";

  export default {
    data() {
      return {
        timeEndMsg: ``,
        activityData: {
          discount:[],
          gather:[],
          timeLimit:[],
          sift:[],
          combination:[]
        },
        activityList: [],
        currentPage: 1,
        pageSize: 60,
        domShow: false,
        nowTime: null,
        currentAct: '',
        columnData: [],
        pageFloatArr: [],
        coulumnHeightArr: [],               //活动距离顶部的距离数组
        activityArr:[],
        vueName: `activity`,
        columnObj: {
          discount:{
            name: `打折促销`,
            type: 3,
            loaded: false,
            show: false
          },
          gather:{
            name: `凑单特价`,
            type: 6,
            loaded: false,
            show: false
          },
          timeLimit:{
            name: `限时特价`,
            type: 4,
            loaded: false,
            show: false
          },
          sift:{
            name: `产品精选`,
            type: 8,
            loaded: false,
            show: false
          },
          combination:{
            name: `组合特价`,
            type: 5,
            loaded: false,
            show: false
          }
         },
        currentActType: '',
        requesting: false,
        screenWidth: 0,
        actRow: 3,
        isEmpty: false,
        leavePage: false,
        showMiniCart: false
      }
    },
    computed: {

    },
    components: {
      Product,
      CompositeProduct,
      AppHeader,
      Navi,
      AppFooter,
      TimeCountDown,
      HomeFloat,
      sideBar,
      empty
    },
    beforeCreate: function () {

    },
    created: function () {
      let obj = $cache.getCache('activityObj')
      let currentAddressId = localStorage.getItem("defaultAddressId")
      if(obj&&obj.activityData&&currentAddressId==obj.currentAddressId){
        this.activityData = obj.activityData
        this.columnData = obj.columnData
        for(let i in this.columnObj){
          this.columnObj[i].loaded = true
        }
        if(!this.columnData.length) this.isEmpty = true
        this.domShow = true
      }else{
        //获取打折促销
        this.getActivityList(3)
      }
    },
    mounted: function () {
/*      const that = this
      window.onresize = () => {
        return (() => {
          window.screenWidth = document.body.clientWidth
          that.screenWidth = window.screenWidth
        })()
      }*/
    },
    beforeDestroy(){
    },
    destroyed(){
    },
    beforeRouteLeave (to, from, next) {
      this.$createTalkingData("Promotion", "", {},2)
      this.leavePage = true
      next()
    },
    beforeRouteEnter (to, from, next) {
      next(vm=>{
        vm.$createTalkingData("Promotion", "", {},1)
        vm.leavePage = false
      })
    },
      methods: {
      onTimeEnd(msg){
        this.timeEndMsg = msg
      },
      //获取活动列表
      getActivityList(type){
        if(this.isEmpty) return
        let column,nextType
        for(let i in this.columnObj){
          if(this.columnObj[i].type == type){
            column = this.columnObj[i]
            nextType = type == 3 ? 6 : type == 6 ? 4 : type == 4 ? 8 : type == 8 ? 5 : 5
          }
        }
        if(column.loaded) return
        this.requesting = true
        let param = {
          currentPage: this.currentPage,
          pageSize: this.pageSize,
          data: {
            promotionType: type
          }
        }
        getPromotionList(param)
          .then(res => {
            if (res.success) {
              this.currentActType = nextType
              //console.log(res.data)
              //promotionType活动类型 赚钱精选(1),利润产品(2),批发促销(3),限时惠(4),组合产品(5),凑单活动(6),团购活动(7), 产品精选(8);
              //this.activityArr = res.data
              if(res.data&&res.data.length){
                this.nowTime = new Date(res.serviceTime).getTime()
                this.rebuildActivityData(res.data,type)
              }else{
                //if(this.isVisitor) this.isEmpty = true
              }
              this.requesting = false
              //this.getComposite()
            }
          })
          .catch(res => {
            this.requesting = false
          });
      },
      //获取组合活动列表
      getComposite(){
        if(this.columnObj.combination.loaded||this.isEmpty) return
        this.requesting = true
        let param = {
          currentPage: this.currentPage,
          pageSize: this.pageSize
        }
        getCompositeActivity(param)
          .then(res => {
            if (res.success) {
              //console.log(res.data)
              this.columnObj.combination.loaded = true
              let compositeArr = ProductInfoUtil.rebuildProducts(res.data,`compositeActivityList`)
              for(let item of compositeArr){
                item.promotionType = 5
                item.endTime = item.endDate
                item.startTime = item.beginDate
              }
              if(compositeArr.length) this.rebuildActivityData(compositeArr,5)
              this.requesting = false
              const obj = {
                activityData: this.activityData,
                columnData: this.columnData
              }
              let currentAddressId = localStorage.getItem("defaultAddressId")
              obj.currentAddressId = currentAddressId
              $cache.setCache('activityObj', obj)
              if(!this.columnData.length) this.isEmpty = true
            }
          })
          .catch(res => {
            this.requesting = false
            this.columnObj.combination.loaded = true
            const obj = {
              activityData: this.activityData,
              columnData: this.columnData
            }
            let currentAddressId = localStorage.getItem("defaultAddressId")
            obj.currentAddressId = currentAddressId
            $cache.setCache('activityObj', obj)
          });
      },
      //处理活动数据
      rebuildActivityData(data,type){
        let serviceTime = $cache.getCache("serviceTime")
        for(let item of data){
          item.activityBegun = DateUtil.compareDate(serviceTime,item.startTime)
          item.endTime = new Date(item.endTime).getTime()
          item.startTime = new Date(item.startTime).getTime()
          for(let product of item.productSkuList){
            product.imgUrl = product.defaultImgUrl
            /**
             * TODO 产品数据上暂无enjoyPromotions，先用父对象的
             * 无specName,使用productSpec
             * 无活动状态，默认state=2
             * */
            product.enjoyPromotions = item.enjoyPromotions
            product.specName = product.productSpec
            product.activityId = item.activityId
            //限时惠产品
            if(type == 4){
              product.timeLimitPromotionId = item.activityId
            }
            product.specQuantity = !product.multipleSpec ? product.saleSpecQuantity : ''
            product.priceunit = product.priceUnit
            product.orderAmount = product.gatherOrderAmount
          }
          item.productSkuList = transformProductList(item.productSkuList)
        }
        switch (type){
          case 3:
            this.columnData.push({name: `打折特价`,posId: `act1`})
            this.activityData.discount = data
            this.columnObj.discount.loaded = true
            break;
          case 4:
            this.columnData.push({name: `限时特价`,posId: `act4`})
            this.activityData.timeLimit = data
            this.columnObj.timeLimit.loaded = true
            break;
          case 5:
            this.columnData.push({name: `组合特价`,posId: `act2`})
            this.activityData.combination = data
            this.columnObj.combination.loaded = true
            break;
          case 6:
            this.columnData.push({name: `凑单特价`,posId: `act3`})
            this.activityData.gather = data
            this.columnObj.gather.loaded = true
            break;
          case 8:
            this.columnData.push({name: `产品精选`,posId: `act5`})
            this.activityData.sift = data
            this.columnObj.sift.loaded = true
            break;
          default:
        }
        for(let item of this.columnData){
          if(!this.pageFloatArr.includes(item.name)){
            this.pageFloatArr.push(item.name)
          }
        }
        this.domShow = true
      },
      //跳转到活动详情
      goToAcitityDetail(e){
        const talkingParam = {
          PromotionId: e.activityId,
          PromotionType: e.promotionType,
          PromotionState: e.state
        }
        this.$createTalkingData("Promotion", "", {},2)
        this.$createTalkingData("Promotion", "Promotion_Content", talkingParam)
        let routeData
        //组合活动跳转组合活动详情
        if(e.promotionType==5){
          routeData = this.$router.resolve({
            name: "groupProductDetail",
            query: this.encodeUrlQuery({activityId: e.activityId})
          });
        }else{
          routeData = this.$router.resolve({
            name: "activityDetail",
            query: this.encodeUrlQuery({
              activityId: e.activityId,
              promotionType: e.promotionType,
              specialAreaId: e.specialAreaId
            })
          });
        }
        window.open(routeData.href, '_blank');
      },
      loadFloor(){
        if(this.isEmpty) return
        let _this = this
        let windowHeight = document.documentElement.clientHeight;
        window.addEventListener('scroll',function(){
          if(_this.leavePage) return
          let scrollTop = window.pageYOffset|| document.documentElement.scrollTop || document.body.scrollTop;
          let domH = document.querySelector('.act-footer') && document.querySelector('.act-footer').offsetTop
          if(scrollTop+windowHeight >= domH && !_this.requesting ) {
            //console.log(domH)
            if(_this.currentActType==5){
              _this.getComposite(_this.currentActType)
            }else{
              _this.getActivityList(_this.currentActType)
            }
          }
        })
      },
    },
    watch:{
      requesting:function(val){
        if(val){
          this.$nextTick(() => {
            this.loadFloor()
            //this.pageBannerFixed()
            //计算活动头部距离窗口顶部的距离
/*            let topH = document.querySelector('.activity').offsetTop || ''
            bus.$emit("column-repeated",{ topH });*/
          })
        }
      },
/*      screenWidth:function (val) {
        if(val){
            if(val>1230){
              this.actRow = 3
            }else{
              this.actRow = 4
            }
        }
      }*/
    }
  }
</script>
