<template>
  <div class="container findGoodsContainer pre jiupi-center">
    <div class="sus-top">
      <div>帮我找货</div>
      <div @click="addFindGoods"><img src="../../assets/images/woyaozhaohuo.png" alt="" srcset=""><span>我要找货</span></div>
    </div>
    <div class="inner-container" v-for="item in goodsList" :key="item.id">
      <div class="susHeader">
        <div>
          <p>找货：{{item.productName}}</p>
          <p>{{item.findGoodsTime}}</p>
        </div>
        <div>{{item.state==0 ? '待反馈' : '已反馈'}}</div>
      </div>
      <div class="sus-question">
        <p>备注：{{item.findGoodsRemarks}}</p>
      </div>
      <div class="goodsBtn">
          <div @click="checkDetail(item.findGoodsId)">查看详情</div>
      </div>
    </div>
    <empty v-if="!totalCount" :iconUrl="emptyImg" txt="您还没有找货记录"></empty>
     <!-- 分页 -->
     <div class="pagination">
    <el-pagination
        class="findgoods-pagination"
        v-if="totalCount"
        background
        layout="prev, pager, next,total, jumper"
        :total="totalCount"
        prev-text="<上一页"
        next-text="下一页>"
        @current-change="handleCurrentChange">
      </el-pagination>
     </div>
    <!-- 分页 -->
  </div>
</template>

<script>
  import emptyImg from "@/assets/images/empty/noRecords.png";
  import * as FindService from "api/findGoods/findGoods";
  import empty from "components/common/empty.vue";
  import { scrollSmoothTo } from "common/lodash";
  export default {
    data() {
      return {
        goodsList:[],
        totalCount:0,
        currentPage:1,
        pageSize:10,
        emptyImg: emptyImg
      }
    },
    components: {
      empty
    },
    mounted(){
      this.getFindGoosList();
    },
    methods:{
      checkDetail(goodsId){
        this.$router.push({
            path: "goodsDetail",
            query: {
              goodsId
            }
        });
      },
      addFindGoods(){
        this.$router.push({
            path: "addFindGoods",
            query: {
              
            }
        });
      },
      handleCurrentChange(val) {//分页
        document
          .getElementById('header')
          .scrollIntoView();
        this.currentPage=val;
        this.getFindGoosList();
      },
      getFindGoosList(){
        let params={
          addressId:'8330',
          currentPage:this.currentPage,
          pageSize:this.pageSize
        }
        FindService.FindGoodsList(params).then(res=>{
            if(res.data&&res.data.length>0){
              this.goodsList=res.data;
              this.totalCount=res.totalCount;
            }
        })
      },
    }
  }

</script>

<style lang="stylus" scoped>
  .susHeader {
    background: #FAFAFB;
    // justify-content: space-between;
    // display: flex;
    // align-items: center;
    padding:16px;
    border-bottom: 1px solid #DFDFDF;
    div {
      inline()
    }
    >div:last-child {
      frt()
      color: #E53935;
      img{
        height :18px;
        width:18px;
      }
    }
    p:first-child{
      font-size :14px;
      color :#414141;
      margin-bottom :8px;
      font-weight:500;
      font-family:PingFang-SC-Medium;
    }
     p:last-child{
      color :#414141;
      font-family:PingFang-SC-Medium; 
    }
  }
  
  .sus-question{
    border-bottom: 1px solid #DFDFDF;
    padding:16px;
    >p{ 
        color:#414141;
        font-family:PingFang-SC-Medium;
        font-weight:500;
    }
  }

  .inner-container {
    border: 1px solid #DFDFDF;
    margin :20px;
  }
  .sus-top {
    // display: flex;
    // align-items: center;
    // justify-content: space-between;
    padding: 28px 20px;
    >div:first-child{
      inline()
      font-size :28px;
    }
    >div:last-child {
      inline()
      frt()
      lh(28)
      cursor :pointer;
      // display: flex;
      // align-items: center;
      color: #4A90E2;
      >span{
        font-size:16px;
        font-family:PingFang-SC-Medium;
        font-weight:500;
      }
      img{
        inline()
        height :16px;
        width:16px;
        margin-right :8px;
        vertical-align text-bottom
      }
    }
  }

  .goodsBtn{
      color :#333333;
      box()
      // display : flex;
      // justify-content: flex-end;
      padding: 12px 13px;
      height 56px
      >div{
        frt()
        cursor pointer;
        border:1px solid #666666;
        border-radius: 2px;
        padding : 9px 11px;
        font-family:PingFang-SC-Medium;
        font-weight:500;
      }
  }

  .goodsBtn>div:hover{
      border-color:#E53935;
      color:#E53935;
      background-color :#fff;
  }

  .findGoodsContainer{
    background-color #fff;
    mb(39)
    pb(60)
  }

  .findgoods-pagination{
    text-align right ;
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
</style>
