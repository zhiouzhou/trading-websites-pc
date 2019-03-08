<template>
  <div class="w myOddBalance jiupi-center pre">
    <div class="oddBalanceHeader">
      <p class="title">零头结余</p>
      <router-link class="check" to="/myOrderEntry/ruleExplain">查看计算细则></router-link>
    </div>
    <div class="oddContent">
      <p class="balanceNumber fw-b fz32 c-red">{{oddBalanceAmount}}<span class="fz16 fw-b">元</span></p>
      <p class="oddBalance-tips"><i></i>零头结余由来：为解决零头支付不便问题，在您下单时，系统自动将本次订单应付金额与零头结余相加，计算后金额的零头为新的零头结余，并于下次下单时 一并结算。</p>
      <ul class="table-header">
        <li class="t-time">时间</li>
        <li class="t-detail">详细说明</li>
        <li class="t-price">变动金额</li>
      </ul>
      <ul class="balanceList" v-if="balanceData.length">
        <li class="balance-c" v-for="item in balanceData">
          <p class="b-time">{{item.createTime}}</p>
          <!--应付结余金额事件类型:下单(0),订单取消(1),订单审核失败(2),订单配送失败(3),订单部分配送自动计算(4),订单部分配送手动调整(5)-->
          <p class="b-no">
            {{item.eventType==0?'下单':item.eventType==1?'订单取消':item.eventType==2?'订单审核失败':item.eventType==3?'订单配送失败':item.eventType==4?'订单部分配送自动计算':item.eventType==5?'订单部分配送手动调整':''}}
            <span v-show="item.orderNo">（订单号：{{item.orderNo}}）</span>
          </p>
          <p class="b-price">{{item.modifyAmount}}</p>
        </li>
      </ul>
      <div class="empty-balance" v-if="!balanceData.length">当前没有零头结余明细哦～</div>
      <!--分页-->
      <div class="pagination">
        <el-pagination
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-size="pageSize"
          layout="prev, pager, next,total, jumper"
          :total="total"
          background
          prev-text="<上一页"
          next-text="下一页>"
          v-if="total">
          <span class="esure">确定</span>
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
  import * as assetsCenter from "@/api/assetsCenter/assetsCenter";

  export default {
    name: "oddBlance",
    data() {
      return {
        currentPage: 1,    //当前页数
        pageSize: 8,  //分页每页数量
        total: 0,
        oddBalanceAmount:0,   //零头结余余额
        balanceData: []
      }
    },
    created() {
      this.getOddBalanceList();
      this.getUserInfo();
    },
    methods: {
      //获取零头结余列表
      getOddBalanceList() {
        let {currentPage, pageSize} = this;
        assetsCenter.GetOddBalance({currentPage, pageSize}).then(data => {
          if (data.success) {
            for (let item of data.data){
              item.modifyAmount = this.processNumber(item.modifyAmount)
            }
            this.balanceData = data.data
            this.total = data.totalCount
          }
        })
      },
      //获取用户信息
      getUserInfo(){
        assetsCenter.GetUserInfo().then(data=>{
          if(data.success){
            this.oddBalanceAmount = data.data.userWallet.oddBalanceAmount
          }
        })
      },
      //改变页码时
      handleCurrentChange(val) {
        this.currentPage = val;
        this.getOddBalanceList();
      },
    //  处理数字
      processNumber(num){
        if(num>0){
          return `+${num.toFixed(2)}`
        }else{
          return `${num.toFixed(2)}`
        }
      },
    }
  }
</script>

<style lang="stylus">
  .myOddBalance{
    bg(#fff)
    mb(39)
    pb(80)
  }

  .oddBalanceHeader {
    bg(#fff);
    padding: 28px 20px;
    // display: flex;
    // align-items: center;
    // justify-content space-between;
    .title {
      inline()
      ft(28);
      c(#333);
    }
    .check {
      frt()
      ft(16);
      c(#4A90E2);
      lh(28)
    }
  }

  .oddContent {
    padding: 0 20px;
    .balanceNumber {
      padding: 40px 0;
      text-align center;
    }
    .oddBalance-tips {
      // display: flex;
      // align-items center;
      ft(12);
      c(#333);
      mb(35)
      i {
        inline()
        width: 16px;
        height: 14px;
        background-image url(../../assets/images/bulk-tip-icon.png);
        background-repeat: no-repeat;
        -webkit-background-size: contain;
        background-size: contain;
        mr(12);
      }
    }
  }

  /*.el-table__empty-text {
    ft(12);
    c(#666);
    padding: 64px 0;
  }

  .el-table__row .cellName > .cell {
    font-size: 16px !important;
    font-weight: bold;
  }*/
  .table-header {
    // display: flex;
    width: 100%;
    padding 18px 0
    background #FAFAFB;
    text-align center;
    .t-time {
      inline()
      width: 30%;
    }
    .t-detail {
      inline()
      width: 40%
    }
    .t-price {
      inline()
      width: 30%;
    }
  }

  .balanceList {
    width: 100%;
    text-align: center;
    .balance-c {
      // display: flex;
      padding: 18px 0;
      border-bottom: 1px solid #ededed;
      .b-time {
        inline()
        width: 30%;
        c(#999)
      }
      .b-no {
        inline()
        width: 40%;
        c(#333);
      }
      .b-price {
        inline()
        width: 30%;
        c(#E53935);
        ft(16)
      }
    }
  }

 .pagination {
  width 100%
  position absolute
  right 14px
  bottom 0
  // display: flex;
  // justify-content: flex-end;
  pt(24);
  pb(24);

  >div {
    frt()
  }
}

  .esure {
    width: 72px;
    height: 30px;
    display: inline-block;
    border: 1px solid #e5e5e5;
    text-align: center;
    lh: (30);
    radius(4);
    ml(12);
  }

  .el-pager {
    li {
      border: 1px solid #ededed !important;
      bg(#fff !important)
    }
    .active {
      bg(#E53935 !important)
    }
  }

  .empty-balance {
    c(#666)
    ft(12)
    mt(100)
    text-c()
  }
</style>
