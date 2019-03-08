<template>
  <div class="container price-report pre jiupi-center">
    <div>
      <div class="sus-top">价格举报</div>
      <!-- <div @click="addNewComplain"><img src="../../assets/images/tianjia@2x.png" alt="" srcset=""><span>我要投诉</span></div> -->
    </div>
    <!-- <div class="susUs">请对我们的服务进行评价</div> -->
    <div class="inner-container" v-for="item in complainList" :key="item.id">
      <div class="susHeader">
        <div>
          <p>{{item.productName}}</p>
          <p>{{item.createTime}}</p>
        </div>
        <div>{{item.complainState==0 ? '未处理' : item.complainState==1 ? '已处理': item.complainState==2 ? '不予处理': item.complainState==3 ? '处理中': ''}}</div>
      </div>
      <div class="sus-question">
        <p>
          <span>举报来源：{{item.source}}</span> 举报价格：
          <span class="jdh">￥{{item.price.toFixed(2)}}</span>
        </p>
        <div class="susContent">
          <div>
            <img v-for="item in item.imgList" :src="item" alt>
          </div>
        </div>
      </div>
      <div class="sus-reply" v-if="item.resultContent">
        <p>回复：{{item.resultContent}}</p>
        <p>{{item.replyTime}}</p>
      </div>
      <!-- <div class="evaluate">
          <el-button type="danger" plain size="medium" @click="evaluateDialog(item.complaintId)">评价</el-button>
      </div>-->
    </div>
    <!-- <div class="inner-container">
      <div class="susHeader">
        <div>
          <p>投诉：物流配送</p>
          <p>2017-09-01 11:53</p>
        </div>
        <div>已处理</div>
      </div>
      <div class="sus-question">
        <p>备注：01.01下的单，到现在还没有配送；客服态度差，没说两句就糊弄完了，最总也没解决问题，心塞。</p>
      </div>
      <div class="sus-reply">
        <p>回复：感谢您对易久批的支持，您的投诉已处理，相关人员将于1个工作日内上门回访。</p>
      </div>
      <div class="evaluate">
        <el-button type="danger" plain size="medium" @click="dialogVisible = true">评价</el-button>
      </div>
    </div>-->
    <div class="showGoodToast">感谢您的评价! 我们会继续努力提供更好的服务!</div>
    <div class="showBadToast">感谢您的评价! 我们会继续努力提供更好的服务!</div>
    <!-- 分页 -->
    <div class="pagination">
    <el-pagination
      class="order-pagination"
      v-if="totalCount"
      background
      layout="prev, pager, next,total, jumper"
      :total="totalCount"
      prev-text="<上一页"
      next-text="下一页>"
      @current-change="handleCurrentChange"
    ></el-pagination>
    </div>
    <!-- 分页 -->
    <empty v-if="!totalCount" :iconUrl="emptyImg" txt="您还没有价格举报记录"></empty>
  </div>
</template>

<script>
import * as FindService from "api/priceReport/priceReport";
import empty from "components/common/empty.vue";
import emptyImg from "@/assets/images/empty/noReport.png";
export default {
  data() {
    return {
      complainList: [], //投诉列表
      complaintId: "", //投诉id
      totalCount: 0,
      currentPage: 1,
      pageSize: 10,
      emptyImg: emptyImg
    };
  },
  mounted() {
    this.getPriceComplaintList();
  },
  methods: {
    getPriceComplaintList() {
      //获取投诉建议列表
      let params = {
        currentPage: this.currentPage,
        pageSize: this.pageSize
      };
      FindService.getPriceComplaintList(params).then(res => {
        this.complainList = res.data;
        this.totalCount = res.totalCount;
      });
    },
    handleCurrentChange(val) {
      //分页
      console.log(`当前页: ${val}`);
      this.currentPage = val;
      this.getPriceComplaintList();
    }
  },
  components: {
    empty
  }
};
</script>

<style lang="stylus" scoped>
.price-report {
  background-color: #fff;
  margin-bottom: 39px;
  pb(60)

  .susHeader {
    background: #FAFAFB;
    justify-content: space-between;
    display: flex;
    align-items: center;
    padding: 16px;
    border-bottom: 1px solid #DFDFDF;
    align-items: flex-start;

    >div:nth-last-of-type(1) {
      color: #E53935;
    }
    p {
      font-family:PingFang-SC-Medium;
    }
    p:first-child{
      margin-bottom 8px;
      color :#414141;
      font-size:14px;
      font-weight:500;
    }
  }

  .jdh {
    color: #E53935;
  }

  .sus-question {
    >p {
      padding: 16px;
      font-size: 14px;
      font-weight: 500;

      >span:first-child {
        margin-right: 32px;
      }

      >span {
        font-size: 14px;
        font-weight: 500;
      }
    }
  }

  .sus-reply {
    padding: 13px;

    >p:first-child {
      margin-bottom :8px;
      line-height: 1.6;
    }

    >p {
      font-family: PingFang-SC-Medium;
      font-weight: 500;
      color: rgba(65, 65, 65, 1);
    }
  }

  .inner-container {
    border: 1px solid #DFDFDF;
    margin: 20px;
  }

  .susUs {
    height: 32px;
    line-height: 32px;
  }

  .sus-top {
    font-size: 28px;
    padding: 28px 20px;
  }

  .susContent {
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid #DFDFDF;
    padding: 0 16px;
    padding-bottom: 10px;

    >div {
      display: flex;
    }

    >div>img {
      width: 84px;
      height: 84px;
      border: 1px solid #DDDDDD;
      margin-right: 16px;
    }
  }

  .evaluate {
    height: 40px;
    margin: 12px;

    >button {
      float: right;
    }
  }

  .showGoodToast, .showBadToast {
    display: none;
    color: #FFFFFF;
    background-color: rgba(0, 0, 0, 0.5);
    width: 472px;
    height: 64px;
    line-height: 64px;
    text-align: center;
    position: absolute;
    top: 50%;
    left: 50%;
    margin-left: -236px;
  }

  .bgf {
    background-color: #fff;
  }

  .order-pagination {
    text-align: right;
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
}
</style>
