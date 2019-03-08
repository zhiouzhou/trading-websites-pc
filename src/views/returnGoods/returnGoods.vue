<template>
  <div class="container return-body jiupi-center">
    <div class="myOrders">退货管理</div>
    <!-- table页切换 -->
    <div>
      <el-tabs v-model="activeName" class="return-manage" @tab-click="handleClick">
        <el-tab-pane label="退货中" name="1"></el-tab-pane>
        <el-tab-pane label="已退货" name="2"></el-tab-pane>
        <el-tab-pane label="已取消" name="3"></el-tab-pane>
        <el-tab-pane label="已拒绝" name="4"></el-tab-pane>
      </el-tabs>
      <order-info :orderInfo="orderType"></order-info>
    </div>
  </div>
</template>

<script>
import OrderInfo from "./returnGoodsInfo.vue";

export default {
  data() {
    return {
      activeName: "1",
      orderType: 1
    };
  },
  mounted() {},
  methods: {
    handleClick(tab, event) {
      //切换tab查询不同状态的订单
      console.log(tab, event);
      this.orderType = Number(tab.name);
    }
  },
  components: {
    OrderInfo
  }
};
</script>

<style lang="stylus" >

.myOrders {
  ft(28);
  c(rgba(51, 51, 51, 1));
  padding: 28px 20px;
}
.return-manage {
  padding : 0 20px;
  .el-tabs__item {
      font-size: 16px;
      height: 48px;
      line-height: 48px;
      padding: 0 24px;
  }
  .el-tabs__header{
    margin 0;  
  }
}
.return-body{
  position relative
  background-color #fff;
  mb(39)
  pb(80)
}
</style>
