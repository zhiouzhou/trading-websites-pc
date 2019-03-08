<template>
  <div class="container" >
    <div v-if="domShow">
      <!-- 页面标题 -->
      <div class="page-title">商城 > {{activityTitle}} > {{activityDetail.name}}</div>
      <!-- 活动页banner，活动信息 -->
      <div class="activity-info">
        <div class="activity-info-pic">
          <img v-lazy="activityDetail.imgUrl" />
        </div>
        <div class="activity-info-content">
          <h4>【{{activityTitle}}】{{activityDetail.name}}</h4>
          <div class="diamond-exclusive" v-if="attivita">砖石会员专享</div>
          <!-- 活动倒计时 -->
          <div class="activity-count-down" v-if="(activityDetail.activityBegun&&activityDetail.showCountdownTime)||!activityDetail.activityBegun">
            <div class="title">{{activityDetail.activityBegun?`距离活动结束还有`:`距离活动开始还有`}}</div>
            <time-count-down @time-end="onTimeEnd" :endTime="activityDetail.endDate" :startTime="activityDetail.beginDate" timeStyle='0'></time-count-down>
          </div>
        </div>
      </div>
      <!-- 活动产品列表 -->
      <div class="product-wrap-box">
        <div class="product-list clearfix">
          <product v-for="item in productList" :key="item.productSkuId" v-bind:product-item="item" v-bind:activity="activityDetail"></product>
        </div>
      </div>
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
    </div>
  </div>
</template>

<style lang="stylus" scoped>
  @import "./stylus/activityDetail.styl"
</style>

<script>
  import AppHeader from './../AppHeader.vue'
  import Navi from './../Navi.vue'
  import AppFooter from './../AppFooter.vue'
  import TimeCountDown from '../../components/common/TimeCountDown.vue'
  import Product from '../../components/common/product-activity.vue'
  import { getActivityDetail,getActivityProducts } from "../../api/activity/activity"
  import { transformProductList } from "common/productUtil/list";
  import * as DateUtil from "../../common/DateUtil"
  import * as $cache from "common/cache";

  export default {
    data() {
      return {
        timeEndMsg: ``,
        activityId: '',               //活动id
        promotionType: '',            //活动类型
        currentPage: 1,
        pageSize: 60,
        totalCount: 1,
        activityDetail: {},
        productList: [],
        domShow: false,
        activityTitle: ``,
        attivita: false,
        vueName: `activity`,
      }
    },
    computed: {

    },
    components: {
      AppHeader,
      Navi,
      AppFooter,
      TimeCountDown,
      Product
    },
    beforeRouteEnter (to, from, next) {
      next(vm=>{
        vm.$createTalkingData("Activity_Content", "", {},1)
      })
    },
    beforeRouteLeave (to, from, next) {
      this.$createTalkingData("Activity_Content", "", {},2)
      next()
    },
    beforeCreate: function () {

    },
    created: function () {
      let query = this.decodeUrlQuery(this.$route.query)
      let id = query.activityId
      let type = query.promotionType
      this.activityTitle =
        type == 3 ? `打折促销` :
          type == 4 ? `限时惠` :
            type == 6 ? `凑单活动` :
              type == 8 ? `产品精选` : ``
      this.promotionType = type
      this.activityId = id
      this.getDetail(id,type)
      this.getProductS(id,type)
    },
    methods: {
      onTimeEnd(msg){
        this.timeEndMsg = msg
      },
      //获取活动详情
      getDetail(id,type){
        let param = {
          data: id
        }
        getActivityDetail(param,type)
          .then(res => {
            if (res.success) {
              res.data.activityBegun = DateUtil.compareDate(res.serviceTime,res.data.beginDate)
              res.data.endDate = new Date(res.data.endDate).getTime()
              res.data.beginDate = new Date(res.data.beginDate).getTime()
              res.data.endTime = res.data.endDate
              res.data.startTime = res.data.beginDate
              this.activityDetail = res.data
            }
          })
          .catch(res => {});
      },
      //获取活动产品列表
      getProductS(id,type){
        let param = {
          currentPage: this.currentPage,
          pageSize: this.pageSize,
          data: id
        }
        getActivityProducts(param,type)
          .then(res => {
            if (res.success) {
              this.totalCount = res.totalCount;
              this.productList = transformProductList(res.data)
              this.domShow = true
            }
          })
          .catch(res => {});
      }
    },
    watch: {
      currentPage: {
        handler(newVal, oldVal) {
          this.getProductS(this.activityId,this.promotionType);
        },
        deep: true
      }
    }
  }
</script>

