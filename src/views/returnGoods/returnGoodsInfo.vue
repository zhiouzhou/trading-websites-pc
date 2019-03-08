<template>
  <div>
    <div class="outContainer" v-if="!defaultImg" v-for="(item,index) in orderList" :key="item.id">
      <div class="orderNo pre">
        <p><span>{{item.companyName}}</span><span class="c-9">{{item.createTime}}</span><span><i class="c-9">订单编号：</i>{{item.orderNO}}</span></p>
        <span>{{item.orderState==1?'退货中':item.orderState==2?'已完成':item.orderState==3?'已取消':item.orderState==4?'已拒绝':item.orderState==5?'已删除':''}}</span>
      </div>
      <div>
        <div class="titleClass pre">
          <div class="titleClass_1"><span></span><span>商品</span><span>价格(元)</span><span>数量</span></div>
          <span style="width:115px; text-align:center">退款金额(元)</span>
        </div>
        <div class='productInfo pre'>
          <div class="productInfo_1">
            <div class="goodsDetail" v-for="products in item.items" :key="products.itemsId">
              <div @click="goGoodsDetail({productSkuId: products.product.productSkuId,sourceType: products.sourceType})" class="goods-curson">
                <img v-if="products.product.imgUrl" :src='products.product.imgUrl' alt="">
                <img v-if="!products.product.imgUrl" src='./../../assets/images/propic_default.gif' alt="">
              </div>
              <div>
                <p  @click="goGoodsDetail({productSkuId: products.product.productSkuId,sourceType: products.sourceType})" class="goodsName goods-curson fz14"><i class="giftProduct" v-if="products.giftProduct">赠品</i>{{products.product.productName}} </p>
                <p>规格: <span> {{products.product.specName}}</span></p>
              </div>
              <div>
                <p class="goodsPrice" v-if="!products.giftProduct">批价:￥<span>{{products.product.price|priceToFixed}}/{{products.product.priceunit}}</span></p>
                <p v-show="products.product.reducePrice!=0" v-if="!products.giftProduct">立减:￥<span>{{products.product.reducePrice|priceToFixed}}/{{products.product.priceunit}}</span></p>
              </div>
              <div>
                <!-- <p><span>{{products.count*(products.product.saleSpecQuantity||1)}}{{products.product.minUnit}}</span></p> -->
                <p v-if="products.product.price&&products.product.productSkuId ==products.product.productSaleSpecId"><span>{{products.returnCount}}{{products.product.saleUnit}}</span></p>
                <p v-if="products.product.price&&products.product.productSkuId !=products.product.productSaleSpecId"><span>{{products.returnCount*(products.product.saleSpecQuantity||1)}}{{products.product.minUnit}}</span></p>
                <p v-if="products.giftProduct"><span>{{products.returnCount}}{{products.product.saleUnit}}</span></p>
              </div>
            </div>
          </div>

          <div class="price">
            <p>退款</p>
            <p>¥{{item.orderAmount|priceToFixed}}</p>
          </div>
        </div>
        <div class="yjpBtn">
          <!-- <p>{{item.companyName}}</p> -->
          <div>
            <div class="yjp-info-btn" v-if="item.canDeleteOrder" @click="DeleteReturnOrder(item.orderNO,index)">删除订单</div>
            <div class="yjp-info-btn" @click="getOrderTraceList(item.orderNO)">订单追踪</div>
            <div class="pre inline" v-if="item.classify!=3&&item.canCancelOrder">
              <confirm style="top:-117px;" :ref="'confirm'+index" text="您确定要取消该订单吗？" @determine="cancelReturnOrder(item.orderNO)"></confirm>
              <div class="yjp-info-btn" @click="showCancel(index)">取消退货</div>
            </div>
            <div class="yjp-info-btn" v-if="item.state!=5&&item.state!=8" data-catch='item.orderNO' ref="catchNO" @click="goToReturnOrderDetail(item.orderNO)" >退货详情</div>
          </div>
        </div>
      </div>
    </div>
    <div v-if="defaultImg" class="default-img">
      <img src="./../../assets/images/wutuihuoguanli.png" alt="">
      <p>暂无数据</p>
    </div>
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
      @current-change="handleCurrentChange">
    </el-pagination>
    </div>
    <!-- 分页 -->
  </div>
</template>
<script>
  import * as FindService from "api/returnGoodsManage/returnGoodsManage";
  import { scrollSmoothTo } from "common/lodash";
  import confirm from "components/common/confirm";

  export default {
    data() {
      return {
        orderList:[],
        showDialog:false,
        currentPage:1,
        pageSize:10,
        totalCount:0,
        orderState:1,
        orderNo:'',
        reason: false,
        textarea: '',
        evaluateList:['满意','一般','不满意'],
        currentIndex:4,//选择的
        hideName:false,
        defaultImg:false,//无数据默认显示的图片
      }
    },
    methods:{
      handleCurrentChange(val) {//分页
        document
          .getElementById('header')
          .scrollIntoView();
        this.currentPage=val;
        this.getOrderList();
      },
      getOrderList(){//订单列表
        let params={
          currentPage:this.currentPage,
          pageSize:this.pageSize,
          orderState:this.orderState
        }
        FindService.GetGoodsManageList(params).then(res=>{
            if(res.success){
                this.defaultImg=res.data.length>0?false:true;
                this.orderList=res.data;
                this.totalCount=res.totalCount;
            }
        })
      },
      goToReturnOrderDetail(No){//订单详情
        this.$router.push({
            path: "returnGoodsDetail",
            query: {
              No,
            }
        });
      },
      getOrderTraceList(No){//订单追踪
        this.$router.push({
            path:"orderTraceList",
            query: {
              No,
              type: "returnGoods"
            }
        });
      },
      DeleteReturnOrder(No,index){//删除订单
       this.$confirm('您确认删除该订单吗？', '删除订单提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }).then(() => {
           FindService.DeleteReturnOrder({orderNO:No}).then(res=>{
              if(res.success){
                this.orderList.splice(index,1);
                this.$toast({text: '删除成功'})
              }
           })
        }).catch(() => {
          // this.$message('已取消删除');
        });
      },
      goGoodsDetail(data){//商品详情
        if(data.sourceType == 5){
          let routeData = this.$router.resolve({
            path: "/index/groupProductDetail",
            query: this.encodeUrlQuery({
              activityId: data.productSkuId
            })
          });
          window.open(routeData.href, '_blank');
        }else {
          let routeData = this.$router.resolve({
            path: "/index/productDetail",
            query: this.encodeUrlQuery({
              skuId: data.productSkuId
            })
        });
        window.open(routeData.href, '_blank');
        }
      },
      showCancel(index){
        let ref = 'confirm' + index
        this.$refs[ref][0].showConfirm();
      },
      cancelReturnOrder(No){
        FindService.CancelReturnOrder({orderNO:No}).then(res=>{
          if(res.success){
            this.getOrderList();
            this.$toast({text: '取消退货成功'})
          }
        })
      },
    },
    props:['orderData','orderInfo'],
    mounted(){
      this.getOrderList();
    },
    components: {
      confirm
    },
    watch:{
      orderData(val){
        this.orderList=val;
      },
      orderInfo(val){
        this.orderState=this.orderInfo;
        this.getOrderList();
      },
    }
  }

</script>
<style lang="stylus" scoped>
  .outContainer {
    b1(#EDEDED)
    margin 20px 20px
    mb(0)

    .orderNo {
      // flex ()
      // justify-content: space-between
      lh(32)
      h(32)
      padding 0 12px
      border-bottom 1px solid #EDEDED
      c(#333333)
      bg(#FAFAFB)
      p {
        inline()
      }
      >span {
        frt()
      }
      p>span{
        mr(24)
        c(#333333);
      }
      p .c-9 {
        c(#999)
      }
      >span {
        c(#E53935)
      }
    }

    .titleClass {
      lh(32)
      h(32)
      // flex ()
      border-bottom 1px solid #EDEDED
      // justify-content space-between

      >span {
        position absolute
        top 0
        right 0
      }

    }
    .titleClass_1{
      // display: flex;
      // flex: 1;
      // width 100%
      mr(116)
      >span {
        inline()
      }
      > span:first-child{
          w(80)
          margin : 0 12px;
        }
        >span:nth-child(n+2){
          width 25%
        }
        >span:nth-child(4){
          width 15%;
        }
        >span:nth-of-type(2){
          width 40%
        }
      }
      .productInfo{
        // display flex;
        // justify-content space-between;
        .productInfo_1{
          display: flex;
          flex-direction: column;
          border-right: 1px solid rgb(237, 237, 237);
          flex: 1;
          mr(116)
        }
        .goodsDetail {
          // flex ()
          border-bottom 1px solid #EDEDED
          div {
            inline()
            vertical-align top
          }
          >div:nth-child(n+2){
            width 25%;
            pt(12);
            font-family:PingFang-SC-Medium;
            p{
              font-family:PingFang-SC-Medium;
              span{
                font-family:PingFang-SC-Medium;
              }
            }
          }
          >div:nth-child(4){
            width 15%
          }
          >div:nth-of-type(2){
            width 40%
          }
          img {
            w(80);
            h(80);
            margin :12px;
          }
        }
        .price{
          box()
          position absolute
          top 0
          right 0
          width: 115px;
          height 100%
          text-align: center;
          flex-center()
          flex-direction column
          border-bottom 1px solid #EDEDED
          >p{
            margin : 8px 0;
            font-family:PingFang-SC-Medium;
          }
          >p:last-child{
            font-size:14px;
            font-family:PingFang-SC-Bold;
            font-weight:bold;
            color:#e53935;
          }
        }
      }

    .goodsName{
      mb(12);
    }

    .goodsName + p{
      c(#999999);
      ft(12);
    }

    .goodsPrice{
      mb(12);
    }

    .goodsPrice + p{
      color red;
      ft(12);
    }
    .yjpBtn{
      // flex ()
      // justify-content: space-between;
      // align-items center;
      padding: 12px 12px;
      height 56px
      box()
      >p{
        inline()
        font-family:PingFang-SC-Medium;
        font-weight:500;
        lh(32)
      }
      >div{
        frt()
        inline()
        // display flex;
        .yjp-info-btn{
          inline()
          font-family:PingFang-SC-Medium;
          border : 1px solid #666666;
          c(#333333);
          padding: 9px 11px;
          ml(12);
          border-radius: 2px;
          cursor pointer;

          &:hover {
            border-color:#E53935;
            color:#E53935;
            background-color :#fff;
          }
        }
      }

    }
  }
  //评价
  .headerEvaliate{
        padding : 14px;
        background-color : #F1DCB9;
    }
  .evaluateBody .el-dialog__header {
    border-bottom: 1px solid #F1F1F1;
  }

  .evaluateBody {
    .dialog-footer {
      justify-content: space-around;
      display: flex;

      >button {
        width: 160px;
        height: 36px;
      }
    }
  }

  .evaluateResuit {
    margin: 16px 0;
    display : flex;
    >div{
      width : 70px;
      height :26px;
      line-height: 26px;
      margin-right: 16px;
      border: 1px solid #BDBDBD;
      text-align :center;
    }
  }

  .complainEvaluate {
    margin: 12px 0;
    span:first-child {
      color: #E53539;
    }
  }

  .textareaTxt {
    margin-top: 12px;
  }

  .el-checkbox__inner {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    margin-right: 10px;
  }

  .el-checkbox__inner::after {
      height: 7px;
      left: 4px;
      width: 3px;
  }

  .anonymous{
      margin-top : 12px;
  }

  .selectDiv{
    width : 70px;
    height :26px;
    background-color : #E53539;
    color : #fff;
  }

  .checkIndex{
    align-items: center;
    display: flex;
    margin-top: 16px;
  }
  .checkIndex>div {
    img{
      border-radius: 50%;
      width 16px;
      height : 16px;
      margin-right :16px;
    }
  }

.goods-curson{
  cursor: pointer;
}

.default-img{
    text-align: center;
    margin: 50px;
    mt(136)
    >p{
      font-size: 18px;
      margin-top: 20px;
      color: #757575;
    }
  }

 .order-pagination{
    text-align right;
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

  .giftProduct {
  c(#e43834);
  padding: 1px;
  border 1px solid #e43834
  mr(5)
}
</style>
