<style lang="stylus">
.profile-wrap {
  bg(#fff);
  padding: 20px;
  margin-bottom: 20px;
}

.m-title {
  ft(28);
  c(#333);
  padding: 28px 0;
}

.m-switch-tab {
  overflow: hidden;
  border-bottom: 1px solid $color-base-hr;

  >li {
    flt();

    >a {
      inline();
      h(46);
      lh(46);
      mr(48);
      c(#666);
      ft(16);
      box();

      &.active {
        c($color-base-theme);
        border-bottom: 3px solid $color-base-theme;
      }
    }
  }
}

.m-content-tab {
  mt(20);
  min-height: 580px;
}

.mc-tab-header {
  width: 100%;
  h(48);
  bg(#FAFAFB);

  .mc-h-item {
    inline();
    width: 23%;
    lh(48);
    text-c();

    &:nth-of-type(1) {
      width: 31%;
    }
  }
}

.mc-tab-body {
  .mc-tab-row {
    width: 100%;
    border-bottom: 1px solid $color-base-hr;

    .mc-b-item {
      inline();
      width: 23%;
      lh(48);
      text-c();

      &:nth-of-type(1) {
        width: 31%;
      }
    }
  }
}

.bouns-item-amount {
  ft(16);
  c($color-base-theme);
  font-weight: 700;
  font-family: PingFangSC-Semibold;
}

.bouns-item-icon {
  inline();
  squ(28);
  vm();
  mr(12);
  background-image: url('../../assets/images/ic_hongbao_keyong.png');
  background-repeat: no-repeat;
  background-size: contain;
}

.bouns-icon-disable {
  background-image: url('../../assets/images/ic_hongbao_bukeyong.png');
}
</style>
<template >
  <div class="profile-wrap">
    <h3 class="m-title">我的红包</h3>
    <!--  -->
    <ul class="m-switch-tab clearfix" @click="_switchBounsState">
      <li>
        <a href="javascript:;" :class="{'active': bonusState}">
          可用红包
          <span v-show="ableTotalCount&&bonusState">({{ableTotalCount}})</span>
        </a>
      </li>
      <li>
        <a href="javascript:;" :class="{'active': !bonusState}">
          不可用红包
          <span v-show="disableTotalCount&&!bonusState">({{disableTotalCount}})</span>
        </a>
      </li>
    </ul>
    <!--  -->
    <div class="m-content-tab">
      <div class="mc-tab-header">
        <span class="mc-h-item" v-for="item in tabHeader" :key="item">{{item}}</span>
      </div>
      <div class="mc-tab-body" v-if="bounsList.length">
        <div class="mc-tab-row" v-for="bouns in bounsList" :key="bouns.bonusId">
          <span class="mc-b-item c-3">
            <i class="bouns-item-icon" v-bind:class="{'bouns-icon-disable':!bonusState}"></i>全场通用红包
          </span>
          <span class="mc-b-item bouns-item-amount">&yen;{{bouns.amount}}</span>
          <span class="mc-b-item c-9">{{bouns.showTime}}</span>
          <span class="mc-b-item c-9">{{bouns.stateText}}</span>
        </div>
      </div>
      <empty v-if="isEmpty" :txt='emptyText'></empty>
    </div>
    <!--  -->
    <div class="clearfix" v-show="!isEmpty">
      <el-pagination
        class="mt24 frt"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-size="pageSize"
        layout=" prev, pager, next,total, jumper"
        :total="bonusState?ableTotalCount:disableTotalCount"
        prev-text="<上一页"
        next-text="下一页>"
        background
      ></el-pagination>
    </div>
  </div>
</template>

<script>
/**
 * 未激活(0),未使用(1),已使用(2),已过期(3),未发放(4),未领取(5),已废弃(6)
 */
const bonusStateTexts = [
  { state: 0, text: "未激活" },
  { state: 1, text: "未使用" },
  { state: 2, text: "已使用" },
  { state: 3, text: "已过期" },
  { state: 4, text: "未发放" },
  { state: 5, text: "未领取" },
  { state: 6, text: "已废弃" }
];
import empty from 'components/common/empty.vue'
import * as assetsCenter from "api/assetsCenter/assetsCenter";
export default {
  name: "bouns",
  data() {
    return {
      isEmpty: false,
      disableTotalCount: 0,
      ableTotalCount: 0,
      bonusState: 1, //1可用  0 不可用
      currentPage: 1,
      pageSize: 12,
      bounsList: [],
      tabHeader: ["名称", "金额", "有效期", "使用状态"]
    };
  },
  computed:{
      emptyText(){
          if(!this.isEmpty) return '';
          return `暂无${this.bonusState?"可用":"不可用"}红包`
      }
  },
  components:{
      empty
  },
  created() {
    this._getBonusList();
  },
  methods: {
    _getBonusList() {
      const { bonusState, currentPage, pageSize } = this;
      assetsCenter
        .GetBonusList({ bonusState, currentPage, pageSize })
        .then(res => {
          if (res.success && res.data.length) {
               this.isEmpty = false
            if (this.bonusState) {
              this.ableTotalCount = res.totalCount;
            } else {
              this.disableTotalCount = res.totalCount;
            }
            this.bounsList = res.data.map(item => {
              item.stateText = bonusStateTexts.find(
                ii => ii.state == item.bonusState
              ).text;
              item.showTime = item.effectiveTime + "~" + item.expiredTime;
              return item;
            });
          }else{
              this.isEmpty = true
          }
        });
    },
    _switchBounsState() {
      this.bonusState = Number(!this.bonusState);
      this._getBonusList();
    },
    handleCurrentChange(currentPage) {
      this.currentPage = currentPage;
      this._getBonusList();
    }
  }
};
</script>



