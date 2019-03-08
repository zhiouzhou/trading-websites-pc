<template>

  <div class="container return-goods-detail jiupi-center">
    <div class="order-detail">退货详情
      <span class="frt fz16 cs" @click="cancel">返回<<</span>
    </div>
    <div class="order-info">
      <div>订单信息</div>
      <div>订单编号：<span>{{orderData.orderNO}}</span></div>
      <div>下单时间：<span>{{orderData.createTime}}</span></div>
      <div>付款方式：<span>{{orderData.payType==0&&orderData.deliveryModeValue==4?'现款现结':orderData.payType==0?'货到付款':orderData.payType==1?'微信支付':orderData.payType==2?'支付宝支付':orderData.payType==3?'银联支付':orderData.payType==5?'连连支付':orderData.payType==6?'易酒贷':orderData.payType==10?'已在线支付':orderData.payType==11?'线下转账':orderData.payType==12?'经销商收款':orderData.payType==13?'余额支付':''}}</span></div>
      <div>配送方式：<span>{{orderData.deliveryModeValue==0?'易久批配送':orderData.deliveryModeValue==1?'合作商配送':orderData.deliveryModeValue==2?'配送商配送':orderData.deliveryModeValue==3?'第三方配送':orderData.deliveryModeValue==4?'仓库自提':'总部'}}</span></div>
      <!-- <div v-if="orderData.deliveryModeValue==4">自提时间：<span>{{orderData.selfPickUpTimeDesc}}</span></div>
      <div v-if="orderData.deliveryModeValue==4">自提地点：<span>{{orderData.selfPickUpWarehouse.province}}{{orderData.selfPickUpWarehouse.city}}{{orderData.selfPickUpWarehouse.detailAddress}}{{orderData.selfPickUpWarehouse.warehouseName}}</span></div> -->
    </div>
    <div class="receiver-info">
      <div>收货人信息</div>
      <div>收货人: <span>{{address.contact}}</span></div>
      <div>电话：<span>{{address.mobileNo}}</span></div>
      <div>收货地址：<span>{{address.province}} {{address.city}} {{address.county}} {{address.street}} {{address.detailAddress}}</span></div>
    </div>
    <div v-if="traceItem.length>0">
      <div class="delivery-info">物流信息</div>
      <div class="cheackOrder" v-for="item in traceItem">
        <img src='./../../assets/images/icon-point-red.png' class="traceIcon"/>
        <div>
          <p> {{item.orderDescription}} <span class="jdh"></span></p>
          <p><span>{{item.createTime}}</span> </p>
        </div>
      </div>
    </div>
    <div>
    <div class="outContainer" >
      <div class="orderNo pre">
        <p><span>{{orderData.companyName}}</span><span class="c-9">{{orderData.createTime}}</span><span><i class="c-9">订单编号：</i>{{orderData.orderNO}}</span></p><span>{{orderData.returnOrderState==1?'退货中':orderData.returnOrderState==2?'已完成':orderData.returnOrderState==3?'已取消':orderData.returnOrderState==4?'已拒绝':orderData.returnOrderState==5?'已删除':''}}</span>
      </div>
      <div>
        <div class="titleClass pre">
          <div class="titleClass_1"><span></span><span>商品</span><span>价格(元)</span><span>数量</span></div>
          <span style="width:115px; text-align:center">总计(元)</span>
        </div>
        <div class='productInfo pre'>
          <div class="productInfo_1">
            <div class="goodsDetail" v-for="products in orderData.itemList" :key="products.itemsId">
              <div @click="goGoodsDetail({productSkuId: products.product.productSkuId,sourceType: products.sourceType})" class="goods-curson">
                <img v-if="products.product.imgUrl" :src='products.product.imgUrl' alt="">
                <img v-if="!products.product.imgUrl" src='./../../assets/images/propic_default.gif' alt="">
              </div>
              <div>
                <p @click="goGoodsDetail({productSkuId: products.product.productSkuId,sourceType: products.sourceType})" class="goodsName goods-curson fz14"><i class="giftProduct" v-if="products.giftProduct">赠品</i>{{products.product.productName}} </p>
                <p>规格: <span> {{products.product.specName}}</span></p>
              </div>
              <div>
                <p class="goodsPrice" v-if="!products.giftProduct">批价:￥<span>{{products.product.price|priceToFixed}}/{{products.product.priceunit}}</span></p>
                <p v-show="products.product.reducePrice!=0" v-if="!products.giftProduct">立减: ￥<span>{{products.product.reducePrice|priceToFixed}}/{{products.product.priceunit}}</span></p>
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
            <p v-show="orderData.discountAmount!=0">优惠：¥{{orderData.discountAmount|priceToFixed}}</p>
            <p>实付款</p>
            <p>¥{{orderData.payableAmount|priceToFixed}}</p>
          </div>
        </div>
        <div class="yjpBtn">
          <!-- <div>{{orderData.companyName}}</div> -->
          <div>

            <!-- <el-button v-if="orderData.canDeleteOrder" @click="deleteReturnOrder">删除订单</el-button> -->
            <div @click="getOrderTraceList">订单追踪</div>
            <!-- <div v-if="orderData.classify!=3&&orderData.canCancelOrder" @click="cancelReturnOrder">取消订单</div> -->
          </div>
        </div>
      </div>
    </div>
  </div>
  </div>
</template>

<script>
  import * as FindService from "api/returnGoodsManage/returnGoodsManage";

  export default {
    data() {
      return {
        orderNO:'',
        orderData:[],
        address:{},
        traceItem:'',//物流信息
      }
    },
    mounted(){
      this.orderNO=this.$route.query.No;
      this.GetReturnGoodsDetail();
      this.getOrderTraceDelivery();
    },
    methods:{
      GetReturnGoodsDetail(){//获取退货订单详情
        FindService.GetReturnGoodsDetail({orderNO:this.orderNO}).then(res=>{
          let datas=res.data;
          this.dialogVisible=false;
          this.orderData=datas;
          this.address=datas.address;
        })
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
      getOrderTraceDelivery() {//获取物流详情
        FindService.ReturnGeOrderTraceList({orderNO: this.orderNO}).then(res => {
          if (res.success) {
            this.traceItem = res.data.traceItems
          }
        })
      },
      cancelReturnOrder(){//取消退货订单
        FindService.CancelReturnOrder({orderNO:this.orderNO}).then(res=>{
            if(res.success){
             this.$message('取消退货成功')
            }
        })
      },
      deleteReturnOrder(){//删除退货订单
       FindService.DeleteReturnOrder({orderNO:this.orderNO}).then(res=>{
            if(res.success){
             this.$message('删除退货订单成功')
            }
        })
      },
      getOrderTraceList(){//订单追踪
        this.$router.push({
            path:"orderTraceList",
            query: {
              No:this.orderNO,
              type: 'returnGoods'
            }
        });
      },
      //返回上一页
      cancel(){
        this.$router.go(-1);
      }
    },
    components: {

    },
  }

</script>

<style lang='stylus' scoped>
.return-goods-detail{
  background-color #fff;
  margin-bottom 39px;
  .order-detail {
    color: #333;
    font-size: 28px;
    padding: 28px 20px

    span {
      inline()
      c(#4A90E2)
      lh(28)
    }
  }

  .delivery-info{
    padding: 20px;
    ft(18)
    c(#414141)
  }

  .order-info,
  .receiver-info {
    padding: 20px;
    border-bottom: 1px solid #ededed;

    >div:first-child {
      color: #414141;
      font-size: 18px;
      font-weight:500;
    }

    >div {
      margin-bottom: 12px;
      font-family:PingFang-SC-Medium;
      span{
        font-family:PingFang-SC-Medium;
      }
    }

    >div:last-child{
      margin:0
    }
  }

  .cheackOrder {
    display: flex;
    padding: 6px 12px;
    .traceIcon {
        width: 16px;
        height: 16px;
      margin:0 12px 0 0
    }

    >div>p:first-child {
      margin-bottom: 16px;
    }
  }

  .el-checkbox__inner {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    margin-right: 10px;
  }

  .el-checkbox__inner::after {
    height: 11px;
    left: 7px;
    width: 4px;
  }
  .evaluate{
    padding : 12px 16px;
    >div{
        margin: 12px 0;
    }
    >div:first-child{
        color: #414141;
        font-size: 18px;
    }
    img{
        display : inline-block;
        width : 84px ;
        height : 84px;
    }
  .jdh{
      color : #E53935;
    }
}

.totle-price{
    padding : 12px 16px;
     background-color: rgba(247, 247, 247, 1);
     >div:last-child{
         text-align : right;
         >p{
             margin : 12px 0;
         }
     }
    }

 .outContainer {
    b1(#EDEDED)
    margin 20px;

    .orderNo {
      // flex ()
      // justify-content: space-between
      lh(32)
      h(32)
      padding 0 12px
      border-bottom 1px solid #EDEDED
      c(#333333)
      bg(#F6F6F6)
      p {
        inline()
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
        frt()
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
          margin 0 12px;
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
          font-weight:500;
            p,span{
              font-family:PingFang-SC-Medium;
              font-weight:500;
            }
          }
          >div:nth-child(4){
            width 15%
          }
          >div:nth-of-type(2){
            width 40%
          }
          img {
            w(80)
            h(80)
            margin 12px;
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
            font-weight:500;
          }
          >p:last-child{
            color: #e53935;
            font-size: 14px;
            font-family: PingFang-SC-Bold;
            font-weight: bold;
          }
        }
      }


    .goodsName{
      mb(12)
    }

    .goodsName + p{
      c(#999999)
      ft(12)
    }

    .goodsPrice{
      mb(12)
    }

    .goodsPrice + p{
      color red
      ft(12)
    }

    .yjpBtn div:hover{
      border-color:#E53935;
      color:#E53935;
      background-color :#fff;
    }
    .yjpBtn{

      // flex ()
      // justify-content: space-between;

      padding: 12px 12px;
      // align-items center;
      font-family:PingFang-SC-Medium;
      height 56px
      box()
      >div{
        //  display flex;
         inline()
         frt()
         div{
          inline()
          cursor pointer;
          font-family:PingFang-SC-Medium;
          border : 1px solid #666666;
          c(#333333);
          padding: 9px 11px;
          ml(12);
          border-radius: 2px;
        }
      }

    }
  }

  .goods-curson{
    cursor: pointer;
  }

  .giftProduct {
  c(#e43834);
  padding: 1px;
  border 1px solid #e43834
  mr(5)
}
}
</style>
