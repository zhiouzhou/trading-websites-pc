<template>
  <div class="myOrders-main" ref="myOrders">
    <!-- table页切换 -->
    <div class="myOrders-body" >
      <div class="myOrders" v-if="orderTitleState">我的订单</div>
      <el-tabs v-model="activeName" @tab-click="handleClick" class="myOrders-tabs" v-if="orderTitleState">
        <el-tab-pane label="全部订单" name="-1" :count="count">
        </el-tab-pane>
        <el-tab-pane :label="waitPayCount" name="8" :count="count">
        </el-tab-pane>
        <el-tab-pane :label="readlySend" name="1" :count="count">
        </el-tab-pane>
        <el-tab-pane :label="hasSend" name="2" :count="count">
        </el-tab-pane>
         <el-tab-pane :label="waitEvaluateCount" name="9" :count="count">
        </el-tab-pane>
        <el-tab-pane :label="hasCompleteCount" name="3" :count="count">
        </el-tab-pane>
      </el-tabs>
      <order-info ref="orderInfo" :orderInfo='orderType'></order-info>
    </div>
  </div>
</template>

<script>
  import OrderInfo from './orderInfo.vue';
  import * as FindService from "api/assetsCenter/assetsCenter";

  export default {
    data() {
      return {
        activeName: '-1',
        orderType: -1,
        readlySend: '待发货',
        hasSend: '已发货',
        waitPayCount: '待付款',
        waitEvaluateCount: '待评价',
        hasCompleteCount: '已完成',
        lastSpecialAreaId: '',
        orderTitleState: true,
        count:1,
      }
    },
    beforeMount(){
      if(this.$router.history.current.name == 'myJiupi'){
        this.orderTitleState = false
      }
    },
    mounted() {
      this.getUserOrderInfo();
      this.orderType = Number(this.$route.query.activeName || this.activeName);
    },
    created() {
      this.activeName = this.$route.query.activeName || this.activeName

      this.lastSpecialAreaId = localStorage.getItem("USERNAME");
    },
    methods: {
      handleClick(tab, event) {//切换tab查询不同状态的订单
        this.orderType = Number(tab.name);
        
      },
      getUserOrderInfo() {
        FindService.GetUserInfo().then(res => {
          console.log(res)
          if (res.success) {
            let datas = res.data.orderCount;
            this.readlySend = `${this.readlySend} (${datas.readlySend>99?'99+':datas.readlySend})`;
            this.hasSend = `${this.hasSend} (${datas.hasSend>99?'99+':datas.hasSend})`;
            this.waitPayCount = `${this.waitPayCount} (${datas.waitPayCount>99?'99+':datas.waitPayCount})`;
            this.waitEvaluateCount=`${this.waitEvaluateCount} (${datas.waitEvaluateCount>99?'99+':datas.waitEvaluateCount})`;
            this.hasCompleteCount = `${this.hasCompleteCount}`;
          }
        })
      }
    },
    components: {
      OrderInfo
    },
    watch: {
      "$router": function (to, from) {
        if(to.name=='myJiupi'){
          this.orderTitleState = false
        }
      }
    }
  }
</script>

<style lang="stylus">
.myOrders-main {
    // display: flex;
    mb(39)
    ml(220)
    min-height 680px
    bg(#fff)

  .myOrders {
    font-size: 28px;
    font-family: MicrosoftYaHei;
    color: rgba(51, 51, 51, 1);
    padding: 28px 20px;
  }

  .myOrders-tabs {
    padding: 0 20px;
  }

  .myOrders-tabs .el-tabs__item {
    ft(16);
    height: 48px;
    line-height: 48px;
    padding: 0 24px;
  }

  .myOrders-tabs .el-tabs__active-bar {
    height: 3px;
  }

  .myOrders-body {
    position relative
    width: 100%;
    pb(60)
    background-color #fff;
     .el-tabs__nav{
        display flex;  
      }

  }

  .myOrders-tabs .el-tabs__header {
    margin-bottom: 0px;
  }
}
</style>
