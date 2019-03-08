<template>
  <div class="myBonus pre">
    <p class="bonus-title">我的红包
      <router-link to="/myOrderEntry/ruleBonus">红包使用规则></router-link>
    </p>
    <ul class="bonusType">
      <li class="cs" :class="bonusState==1?'selectBonus':'bonus'" @click="checkState(1)">可用红包({{total}})</li>
      <li class="cs" :class="bonusState==0?'selectBonus':'bonus'" @click="checkState(0)">不可用红包<span class="fz16" v-show="!first">({{noTotal}})</span></li>
    </ul>
    <el-table
      :data="bonusData"
      :header-cell-style="headerStyle"
      :cellStyle="cellStyle"
    >
      <template slot="empty">
        <img src="../../assets/images/noBonus.png">
        <span>暂无可用红包哦～</span>
      </template>
      <el-table-column
        prop="amount"
        label="金额"
        class-name="cellName"
      >
        <template slot-scope="scope">
          <div class="bonusName">
          <div v-show="bonusState==1"></div>
            <div v-show="bonusState==0" class="bonus-img"></div>
          <span :class="{'bonus-name': bonusState==0}">￥{{scope.row.amount}}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="time"
        label="有效期">
        <template slot-scope="scope">
          <span class="c-9">{{scope.row.time}}</span>
        </template>

      </el-table-column>
      <el-table-column
        prop="bonusState"
        label="使用状态">
        <template slot-scope="scope">
          <span>{{scope.row.bonusState==1?'待使用':scope.row.bonusState==2?'已使用':'已过期'}}</span>
        </template>
      </el-table-column>
    </el-table>
    <!--分页-->
    <div class="pagination">
      <el-pagination
        v-if="bonusState==0?noTotal:total"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-size="pageSize"
        layout="prev, pager, next,total, jumper"
        :total="bonusState==0?noTotal:total"
        background
        prev-text="<上一页"
        next-text="下一页>">
        <span class="esure">确定</span>
      </el-pagination>
    </div>

  </div>
</template>

<script>
import * as assetsCenter from "@/api/assetsCenter/assetsCenter";

export default {
    name: "myBonus",
    data() {
        return {
            bonusState: 1,   //红包状态  0-不可用 1-可用
            currentPage: 1,    //当前页数
            pageSize: 10,  //分页每页数量
            total: 0,   //总条数
            noTotal: 0,
            time: '',
            bonusData: [],
            first: true
        }
    },
    created() {
        this.getBonusList();
    },
    methods: {
        //获取红包列表
        getBonusList() {
            let {bonusState, currentPage, pageSize} = this
            assetsCenter.GetBonusList({bonusState, currentPage, pageSize}).then(data => {
                if (data.success) {
                    let that = this;
                    this.bonusData = data.data;
                    if (bonusState == 0) {
                        this.noTotal = data.totalCount;
                        this.first = false;
                    } else {
                        this.total = data.totalCount;
                    }
                    data.data.forEach(item => {
                        that.$set(item, 'time', item.effectiveTime + '~' + item.expiredTime)
                    })
                }
            })
        },
        //改变表头的样式
        headerStyle() {
            return 'background:#FAFAFB;color:#333;text-align:center;height:48px;'
        },
        //改变指定单元格的样式
        cellStyle({row, column, rowIndex, columnIndex}) {
            if (columnIndex == 0) {
                return ' color:#333;text-align:center;'
            } else if (columnIndex == 1) {
                if (this.bonusState == 1) {
                    return 'color:#E53935;text-align:center;font-weight:600;'
                } else {
                    return 'color:#666;text-align:center;font-weight:600;'
                }
            } else {
                return 'color:#999;text-align:center;'
            }
        },
        checkState(state) {
            if(this.bonusState === state){
              return;
            }
            this.bonusState = state;
            this.currentPage = 1;
            this.bonusData = [];
            this.getBonusList();

        },
        handleCurrentChange(val) {
            this.currentPage = val;
            this.getBonusList();
        },
    }
}
</script>

<style lang="stylus">
  .myBonus{
    box()
    bg(#fff)
    mb(39)
    pb(80)
    pl(20)
    pr(20)
    ml(220)
    min-height 680px
  }

  .bonus-title {
    // flex();
    // align-items: center;
    // justify-content: space-between;
    ft(28);
    c(#333);
    padding: 28px 0;

    a {
      frt()
      lh(28)
      ft(16);
      c(#4A90E2);
    }
  }

  .bonusType {
    // display: flex;
    // flex-direction: row;
    margin: 0 0 20px;
    border-bottom: 1px solid #ededed;
    li {
      inline()
      margin-right: 48px;
    }
    .bonus {
      padding: 16px 0;
      ft(16);
      c(#666)
    }
    .selectBonus {
      padding: 16px 0 13px;
      ft(16);
      c(#E53935)
      border-bottom: 3px solid #E53935
    }
  }

  .bonusName {
    position relative
    flex()
    justify-content center
    align-items center;
    c(#E53935)
    img {
      position absolute
      left 0
      inline()
      margin: 0
      squ(28)
    }

    div {
      position absolute 
      left 0
      squ(28)
      background: url('../../assets/images/ic_hongbao_keyong.png');
    }

    .bonus-name {
      c(#666666)
    }

    .bonus-img {
      background url('../../assets/images/ic_hongbao_bukeyong.png')
    }
  }

  .el-table__empty-text {
    display: flex;
    flex-direction: column;
    align-items center;
    ft(12);
    c(#666);
    padding: 120px 0;
    img {
      squ(80)
      mb(20)
    }
  }

  .el-table__row .cellName > .cell {
    span {
      font-size: 16px !important;
      font-weight: bold;
    }

  }

  .pagination {
  width 100%
  position absolute
  right 14px
  bottom 0
  display: flex;
  justify-content: flex-end;
  pt(24);
  pb(24);
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

  /*.el-pagination span:not([class*=suffix]){
    padding:0 10px;
    background: #fff;
    border:1px solid #ededed;
  }*/

</style>
