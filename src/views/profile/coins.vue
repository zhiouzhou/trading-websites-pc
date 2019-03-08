<template>
  <div class="container myCoin">
    <div class="title">我的酒币</div>
    <div class="coinContent">
      <div :class="[!coinData||!coinData.length||wineScoreAmount<20?'coin-title-no':'coinNumber-title']">
        <p class="coinNumber">{{wineScoreAmount}}<span v-show="wineScoreAmount>=1000">+</span></p>
        <span class="prize-btn" @click="wineScore">{{wineScoreAmount<20?'不可抽奖':'点击抽奖'}}</span>
      </div>
      <div class="monthNumber">
        <div class="coin-number">
          <span class="fw-b fz16 c-3 c-number">{{gainWineScoreAmount}}个</span>
          <span>3个月共收获</span>
        </div>
        <p class="line"></p>
        <div class="coin-number">
          <span class="fw-b fz16 c-3 c-number">{{spendWineScoreAmount}}个</span>
          <span>3个月共花费</span>
        </div>
      </div>
      <p class="detailed">酒币使用明细（近三个月）</p>
      <ul class="coin-list">
        <li class="coin-l-content" v-for="item in coinData">
          <p class="coin-time">{{item.createTime}}</p>
          <p class="coin-detail">{{item.desc}}</p>
          <p class="coin-number" :style="item.amount>0?'color:#E53935':'color:#333'">{{item.amount}}</p>
        </li>
      </ul>
      <!--分页-->
      <div class="pagination" v-if="coinData&&coinData.length>0">
        <el-pagination
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-size="pageSize"
          layout=" prev, pager, next,total, jumper"
          :total="total"
          background
          prev-text="<上一页"
          next-text="下一页>">
          <span class="esure">确定</span>
        </el-pagination>
      </div>
      <div class="empty" v-if="!coinData||!coinData.length">
        当前没有酒币明细哦~
      </div>
    </div>
  </div>
</template>

<script>
  import * as assetsCenter from "@/api/assetsCenter/assetsCenter";

  export default {
    name: "myCoin",
    data() {
      return {
        currentPage: 1,
        pageSize: 7,
        coinData: [],
        gainWineScoreAmount: 0,  //得到酒币金额（最近三月）
        spendWineScoreAmount: 0, //消费酒币金额（最近三月）
        wineScoreAmount: 0,      //酒币金额
        total: 0,
      }
    },
    created() {
      this.getCoinList();
      this.getUserInfo();
    },
    methods: {
      wineScore(){
        this.$router.push({name:'winescore'})
      },
      /*获取酒币列表*/
      getCoinList() {
        let {currentPage, pageSize} = this
        assetsCenter.GetCoinList({currentPage, pageSize}).then(data => {
          if (data.success) {
            for (let item of data.data) {
              item.amount = this.processNumber(item.amount)
            }
            this.coinData = data.data
            this.total = data.totalCount
          }
        })
      },
      //获取用户信息
      getUserInfo() {
        assetsCenter.GetUserInfo().then(data => {
          if (data.success) {
            this.gainWineScoreAmount = data.data.userWallet.gainWineScoreAmount
            this.spendWineScoreAmount = data.data.userWallet.spendWineScoreAmount
            this.wineScoreAmount = data.data.userWallet.wineScoreAmount
          }
        })
      },
      //  处理数字
      processNumber(num) {
        if (num > 0) {
          return `+${num.toFixed(2)}`
        } else {
          return `${num.toFixed(2)}`
        }
      },

      handleCurrentChange(val) {
        this.currentPage = val;
        this.coinData = [];
        this.getCoinList();
      },
    }
  }
</script>

<style scoped lang="stylus">
  .myCoin{
    bg(#fff)
    mb(39)
  }

  .title {
    padding: 28px 20px;
    ft(28);
    c(#333);
  }

  .coinContent {
    display: flex;
    flex-direction: column;
  }

  .coinNumber-title {
    squ(190)
    background-image: url(../../assets/images/myWinScore.png);
    background-size: contain;
    background-repeat: no-repeat;
    flex-center();
    flex-direction: column;
    margin: auto;
  }

  .coin-title-no {
    squ(190)
    background-image: url(../../assets/images/myWinScore_cannotLottery.png);
    background-size: contain;
    background-repeat: no-repeat;
    flex-center();
    flex-direction: column;
    margin: auto;
  }

  .coinNumber {
    display: flex;
    align-items flex-start;
    padding-bottom: 12px;
    ft(48);
    c(#fff)
    span {
      ft(14)
    }
  }

  .prize-btn {
    ft(16);
    c(#fff)
  }

  .monthNumber {
    display: flex;
    margin: 40px 20px;
    align-items center;
    .coin-number {
      bg(#FAFAFB);
      display: flex;
      flex-direction: column;
      align-items center;
      padding: 16px 0;
      width: 50%;
      .c-number {
        padding-bottom: 8px;
      }
    }
    .line {
      width: 1px;
      height: 52px;
      background: url(../../assets/images/xuxian.png)
    }
  }

  .detailed {
    ft(14);
    mb(20);
    text-c();
  }

  .coin-list {
    margin: 0 20px;
  }

  .coin-l-content {
    border-bottom: 1px solid #ededed;
    display: flex;
    align-items center;
    justify-content: space-between;
    padding: 18px 20px;
    .coin-time {
      c(#999)
    }
    .coin-detail {
      c(#333)
    }
    .coin-number {
      ft(16)
    }
  }

  .pagination {
    display: flex;
    justify-content flex-end;
    mt(24)
    mb(24)
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
      background: #fff !important
    }
    .active {
      background: #E53935 !important
    }
  }

  .empty {
    margin: 100px auto;
    c(#666)
  }
</style>
