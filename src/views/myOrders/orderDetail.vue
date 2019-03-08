<template>
  <div class="container bgf jiupi-center">
    <div class="order-detail">订单详情
      <span class="frt fz16 cs" @click="cancel">返回<<</span>
    </div>
    <div class="order-info">
      <div>订单信息</div>
      <div>订单编号：<span>{{orderData.orderNO}}</span></div>
      <div>下单时间：<span>{{orderData.createTime}}</span></div>
      <div>付款方式：<span>{{orderData.payType==0&&orderData.deliveryModeValue==4?'现款现结':orderData.payType==0?'货到付款':orderData.payType==1?'微信支付':orderData.payType==2?'支付宝支付':orderData.payType==3?'银联支付':orderData.payType==5?'连连支付':orderData.payType==6?'易酒贷':orderData.payType==10?'已在线支付':orderData.payType==11?'线下转账':orderData.payType==12?'经销商收款':orderData.payType==13?'余额支付':''}}</span></div>
      <div>配送方式：<span>{{orderData.deliveryModeValue==0?'易久批配送':orderData.deliveryModeValue==1?'合作商配送':orderData.deliveryModeValue==2?'配送商配送':orderData.deliveryModeValue==3?'第三方配送':orderData.deliveryModeValue==4?'仓库自提':'总部'}}</span></div>
      <div v-if="orderData.deliveryModeValue==4">自提时间：<span>{{orderData.selfPickUpTimeDesc}}</span></div>
      <div v-if="orderData.deliveryModeValue==4">自提地点：<span>{{orderData.selfPickUpWarehouse.province}}{{orderData.selfPickUpWarehouse.city}}{{orderData.selfPickUpWarehouse.detailAddress}}{{orderData.selfPickUpWarehouse.warehouseName}}</span></div>
    </div>
    <div class="receiver-info">
      <div>收货人信息</div>
      <div>收货人:  <span>{{address.contact}}</span></div>
      <div>电话：<span>{{address.mobileNo}}</span></div>
      <div>收货地址：<span>{{address.province}} {{address.city}} {{address.county}} {{address.street}} {{address.detailAddress}}</span></div>
    </div>
    <div v-if="traceItem.length>0">
      <div class="delivery-info">物流信息</div>
      <!-- <div class="cheackOrder" v-for="item in traceItem">
        <img src='./../../assets/images/icon-point-red.png' class="traceIcon"/>
        <div>
          <p> {{item.orderDescription}} <span class="jdh"></span></p>
          <p><span>{{item.createTime}}</span> </p>
        </div>
      </div> -->
      <div class="order-tracelist">
        <div class="orderTrack">
          <div class='message' v-for="(item,index) in traceItem" :key="item.traceId">
            <div class='message-left'>
              <div :class='[index==0?"stub":"stub1"]'></div>
              <img src='./../../assets/images/icon-point-red.png' class='image1' style="padding:4px 0;" v-if="index==0"/>
              <div class='icon' v-else></div>
              <div :class='[index==traceItem.length-1?"line1":"line"]'></div>
            </div>
            <div class='message-right'>
              <div :style="[index==0?'color:#e53935;font-size:28rpx;':'color:#999;font-size:28rpx;']">
                {{item.orderDescription}}
              </div>
              <div :style='[index==0?"color:#e53935;font-size:24rpx;":"color:#999;font-size:24rpx;"]'>{{item.createTime}}
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
    <div class="product-info">
      <div class="pro-info-tit">商品信息</div>
      <div class="outContainer" >
        <div class="orderNo">
          <p><span>{{orderData.companyName}}</span><span class="c-9">{{orderData.createTime}}</span><span><i class="c-9">订单编号：</i>{{orderData.orderNO}}</span></p><span>{{orderData.state==1?'待发货':orderData.state==2?'已发货':orderData.state==3?'已完成':orderData.state==4?'审核拒绝':orderData.state==5?'已取消':orderData.state==6?'已删除':orderData.state==7?'配送失败':orderData.state==8?'待支付':orderData.state==9?'待评价':''}}</span>
        </div>
        <div>
          <div class="titleClass pre">
            <div class="titleClass_1"><span></span><span>商品</span><span>价格(元)</span><span>数量</span></div>
            <span style="width:132px; text-align:center">总计(元)</span>
          </div>
          <div class='productInfo pre'>
            <div class="productInfo_1">
              <div class="goodsDetail" v-for="products in orderData.itemList" :key="products.itemsId">
                <div @click="goGoodsDetail(products,orderData)" class="goods-curson">
                  <img v-if="products.product.imgUrl" :src='products.product.imgUrl' alt="">
                  <img v-if="!products.product.imgUrl" src='./../../assets/images/propic_default.gif' alt="">
                </div>
                <div>
                  <p @click="goGoodsDetail(products,orderData)" class="goodsName goods-curson fz14"><i class="giftProduct" v-if="products.giftProduct">赠品</i>{{products.product.productName}} </p>
                  <p>规格: <span>{{products.product.specName}}</span></p>
                </div>
                <div>
                  <p class="goodsPrice" v-if="!products.giftProduct">批价:￥<span>{{products.product.price|priceToFixed}}/{{products.product.priceunit}}</span></p>
                  <p v-show="products.product.reducePrice&&products.product.reducePrice!=0" v-if="!products.giftProduct">立减:￥<span>{{products.product.reducePrice|priceToFixed}}/{{products.product.priceunit}}</span></p>
                </div>
                <div>
                  <p v-if="products.product.price&&products.product.productSkuId ==products.product.productSaleSpecId"><span>{{products.count}}{{products.product.saleUnit}}</span></p>
                  <p v-if="products.product.price&&products.product.productSkuId !=products.product.productSaleSpecId"><span>{{products.count*(products.product.saleSpecQuantity||1)}}{{products.product.minUnit}}</span></p>
                  <p v-if="products.giftProduct"><span>{{products.count}}{{products.product.saleUnit}}</span></p>
                </div>
              </div>
            </div>

            <div class="price">
              <p v-if="orderData.discountAmount" class='disCount'>优惠：¥{{orderData.discountAmount|priceToFixed}}</p>
              <p>实付款</p>
              <p class="fz14 c-red">¥{{orderData.payableAmount|priceToFixed}}</p>
            </div>
          </div>
          <div class="yjpBtn">
            <!-- <p>{{orderData.companyName}}</p> -->
            <div>
            <span class="pre" v-if="deleteOrderBtn&&orderData.canDeleteOrder">
              <confirm style="top:-127px;" ref="confirm" text="您确定要删除该订单吗？" @determine="deleteOrder"></confirm>
              <span class="operation-btn" @click="showDelete">删除订单</span>
            </span>
              <span class="operation-btn" v-if="orderData.canReturnOrder" @click="goRequestReturnGoods">申请退货</span>
              <span class="operation-btn" v-if="orderData.classify!=3&&orderData.canCancelOrder" @click="showCancelOrderDialog">取消订单</span>
              <!-- <span class="operation-btn" @click="showDialog=true" v-if="orderData.canConfirmDelivery">确认收货</span> -->
              <span class="operation-btn" @click="showDialog=true" v-if="orderData.canEvaluate&&orderData.canConfirmDelivery">确认收货并评价</span>
              <span class="operation-btn" @click="getOrderTraceList">订单追踪</span>
              <span class="operation-btn" v-if="orderData.canComplain" @click="orderComplain">订单投诉</span>
              <span class="againBuy" v-if="orderData.canBuyAgain" @click="gotoCart">再次购买</span>
              <span class="operation-btn" v-if="orderData.state==8 && orderData.payType==1 && orderData.canOnlinePay">去支付</span>
            </div>
          </div>
        </div>
      </div>
      <div class="totle-price">
        <div class="message" v-if="orderData.remark">买家留言：{{orderData.remark}}</div>
        <div class="price-info">
          <p v-if="orderData.orderAmount"><span>共{{allCount}}，商品总额：</span><span>￥{{orderData.orderAmount|priceToFixed}}</span></p>
          <p v-if="orderData.reduceAmount"><span>订单满减：</span><span>￥{{orderData.reduceAmount|priceToFixed}}</span></p>
          <p v-if="orderData.productReduceAmount"><span>产品立减：</span><span>￥{{orderData.productReduceAmount|priceToFixed}}</span></p>
          <p v-if="orderData.selfPickUpReduceAmout"><span>自提优惠：</span><span>￥{{orderData.selfPickUpReduceAmout|priceToFixed}}</span></p>
          <p v-if="orderData.useCouponAmount"><span>使用优惠券：</span><span>￥{{orderData.useCouponAmount|priceToFixed}}</span></p>
          <p v-if="orderData.useBonusAmount"><span>使用红包：</span><span>￥{{orderData.useBonusAmount|priceToFixed}}</span></p>
          <p v-if="orderData.useCouponCodeAmount"><span>使用优惠码：</span><span>￥{{orderData.useCouponCodeAmount|priceToFixed}}</span></p>
          <p v-if="orderData.lastOddBalanceAmount"><span>历次未收：</span><span>￥{{orderData.lastOddBalanceAmount|priceToFixed}}</span></p>
          <p v-if="orderData.newOddBalanceAmount"><span>本次零头：</span><span>￥{{orderData.newOddBalanceAmount|priceToFixed}}</span></p>
        </div>
      </div>
      <!-- cancel订单dialog -->
      <el-dialog
        title="请选择原因"
        :visible.sync="centerDialogVisible"
        width="575px"
        center>
        <div class="cancel-radio">
          <div><input v-model="radio" class="radio" type="radio" name="radio" value="不想买了"/><span>不想买了</span></div>
          <div><input v-model="radio" class="radio" type="radio" name="radio" value="重复下单"/><span>重复下单</span></div>
          <div><input v-model="radio" class="radio" type="radio" name="radio" value="收货信息错误"/><span>收货信息错误</span></div>
          <div><input v-model="radio" class="radio" type="radio" name="radio" value="其他原因"/><span>其他原因</span></div>
          <div>
            <el-input type="textarea" :rows="2" placeholder="请输入备注信息" v-model="cancelTextarea" class="textareaTxt">
            </el-input>
          </div>
        </div>
        <span slot="footer" class="dialog-footer">
        <el-button @click="centerDialogVisible=false">取 消</el-button>
        <el-button type="primary" @click="cancelOrder">确 定</el-button>
      </span>
      </el-dialog>
      <!-- cancel订单dialog -->
    </div>
  </div>
</template>

<script>
  import OrderInfo from './orderInfo.vue'
  import * as FindService from "api/myOrders/myOrders";
  import {AddShopCartList} from "api/cart/cart";
  import confirm from "components/common/confirm";

  export default {
    data() {
      return {
        orderNO:'',
        orderData:[],
        address:{},
        traceItem:"",   //流转信息
        centerDialogVisible:false,
        radio:'不想买了',
        cancelTextarea:'',
        deleteOrderBtn:true,//删除订单默认显示
        allCount: 0
      }
    },
    mounted(){
      this.orderNO=this.$route.query.No;
      this.getOrderDetail();
      this.getOrderTraceDelivery();
    },
    methods:{
      getOrderDetail(){//获取订单详情
        FindService.getOrderDetail({orderNO:this.orderNO}).then(res=>{
          if(res.success){
            this.dialogVisible=false;
            this.orderData=res.data;
            this.address=res.data.address;
            let allCount = 0;
            this.orderData.itemList.forEach(item => {
              if(item.product.price&&item.product.productSkuId ==item.product.productSaleSpecId){
                allCount += item.count;
              }else {
                allCount += item.count*item.product.saleSpecQuantity;
              }
            })
            this.allCount = allCount;
          }
        })
      },
      getOrderTraceDelivery() {//获取物流详情
        FindService.GeOrderTraceList({orderNO: this.orderNO}).then(res => {
          if (res.success) {
            this.traceItem = res.data.traceItems
          }
        })
      },
      goGoodsDetail(data,obj){//商品详情
        const { sourceType,product } = data
        let routeData
        if(sourceType == 5){
          routeData = this.$router.resolve({
            path: "/index/groupProductDetail",
            query: this.encodeUrlQuery({
              activityId: product.productSkuId
            })
          });
        }else {
          routeData = this.$router.resolve({
            path: "/index/productDetail",
            query: this.encodeUrlQuery({
              skuId: product.productSkuId
            })
          });
        }
        if(product.saleMode == 6){
          let shopId = product.companyId || obj.companyId
          routeData = this.$router.resolve({
            path: "/dealer/productDetail",
            query: this.encodeUrlQuery({skuId: product.productSkuId,shopId})
          });
        }
        window.open(routeData.href, '_blank');
      },
      getOrderTraceList(){//订单追踪
        this.$router.push({
          path:"orderTraceList",
          query: {
            No:this.orderNO
          }
        });
      },
      showCancelOrderDialog(){//显示取消订单
        this.radio = "不想买了";
        this.cancelTextarea = "";
        this.centerDialogVisible=true;
      },
      cancelOrder(){//取消订单
        let params={
          orderNO:this.orderNO,
          cancelType:this.radio,
          remark:this.cancelTextarea
        }
        FindService.CancelOrder(params).then(res=>{
          this.centerDialogVisible=false;
          this.deleteOrderBtn=true;
          if(res.success){
            this.getOrderDetail();//重新获取可显示的按钮
            this.$toast({text: '取消订单成功'})
          }else{
            this.$toast({text: res.desc,type: 'fail'});
          }
        })
      },
      showDelete(){
        this.$refs.confirm.showConfirm();
      },
      deleteOrder(){//删除订单
        FindService.DeleteOrder({orderNO:this.orderNO}).then(res=>{
          if(res.success){
            this.deleteOrderBtn=false;
            this.$toast({text: '订单删除成功',noRoute: false})
            // setTimeout(() => {
            //   this.$router.push('/myOrderEntry/myOrders');
            // },3000);
            this.$router.push('/myOrderEntry/myOrders');
          }
        })
      },
      gotoCart(){//再次购买
        FindService.BugAgainGoods({orderNO:this.orderNO}).then(res=>{
          let products = res.data;
          let canBuyProducts = [];
          let isDown = false;//是否下架
          let isOut = false;//是否抢光
          let isMember = false;//组合活动是否等级不够
          products.forEach(product => {
            if (product.productType == 1) {
              if (product.productState != 2 || product.canSellStoreCount <= 0 || product.stockState == 3) {
                if (product.productState != 2) {
                  isDown = true;
                }
                if (product.canSellStoreCount <= 0 || product.stockState == 3) {
                  isOut = true
                }
              }else{
                canBuyProducts.push(product);
              }
            }
            if (product.productType == 2) {
              if (product.compositeState != 2 || product.storeCount <= 0 || product.stockState == 3 || !product.enjoyUserLevelDiscount) {
                if (product.compositeState != 2) {
                  isDown = true;
                }
                if (product.storeCount <= 0 || product.stockState == 3) {
                  isOut = true
                }
                if (!product.enjoyUserLevelDiscount) {
                  isMember = true;
                }
              }else {
                canBuyProducts.push(product);
              }
            }
          })
          if (!canBuyProducts.length) {
            if (isDown) {
              this.$toast({text: '订单中的产品已下架，再看看其他产品吧',type: 'fail'});
            } else if (isMember) {
              this.$toast({text: '订单中的产品会员等级不够，再看看其他产品吧',type: 'fail'});
            } else if (isOut) {
              this.$toast({text: '订单中的产品已抢光，再看看其他产品吧',type: 'fail'});
            }
          }else {
            let productList = [];
            let buyAgainList = this.orderData.itemList;
            canBuyProducts.forEach( item => {
              let productItem = {
                productSkuId : item.productSkuId,
                productType : item.productType,
                saleSpecId : item.productSaleSpecId,
                sellingPriceUnit : item.priceunit,
                sellingPrice : item.price
              };
              buyAgainList.forEach( pro =>{
                if(item.productSkuId == pro.product.productSkuId&&pro.sourceType!=4){
                  productItem.count = pro.count;
                }
              })
              if(productItem.count){
                productList.push(productItem);
              }
            })
            if(productList.length>0){
              AddShopCartList(productList).then(res => {
                this.$router.push({
                  name: "shopCart",
                });
              })
            }
          }
        })
      },
      orderComplain(){//投诉订单
        this.$router.push({
          path: "addNewComplain",
          query: {
            No:this.orderNO
          }
        });
      },
      //去申请退货页面
      goRequestReturnGoods(){
        this.$router.push({
          path: "requestReturnGoods",
          query: {
            orderNO: this.orderData.orderNO
          }
        })
      },
      //返回上一页
      cancel(){
        this.$router.go(-1);
      }
    },
    components: {
      OrderInfo,
      confirm
    },
  }

</script>

<style lang='stylus' scoped>
  @import "./orderTraceList.styl"
</style>

<style lang='stylus' scoped>
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

  .order-info,
  .receiver-info {
    padding: 20px;
    border-bottom:1px solid #ededed

    >div:first-child {
      color: #414141;
      font-size: 18px;
      font-weight: 500;
      font-family:PingFang-SC-Medium;
    }

    >div {
      margin-bottom: 12px;
      color: #414141
      font-family:PingFang-SC-Medium;
    }

    >div:last-child{
      margin:0
    }
  }

  .delivery-info{
    padding: 20px;
    ft(18)
    c(#414141)
  }

  .product-info{
    padding:20px

    >.pro-info-tit{
      mb(20)
      ft(18)
      c(#414141)
    }
  }

  .cheackOrder {
  // display: flex;
    padding: 0px 20px 20px;

    div {
      inline()
    }

    img {
      inline()
      vertical-align top
    }

    >div>p:first-child {
      margin-bottom: 12px;
    }
    >div>p{
      color: #414141;
    }
  }

  .traceIcon {
    width: 16px;
    height: 16px;
    margin:0 12px 0 0
  }

  .el-checkbox__inner {
    width: 16px;
    height: 16px;
    border-radius: 50%;
    margin-right: 10px;
  }

  .el-checkbox__inner::after {
    height: 10px;
    left: 5px
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
    padding 20px 20px 4px
    bg(#FAFAFB)
    .message{
      pb(16)
      c(#4E4E4E);
      font-family:PingFang-SC-Medium;
      font-weight:500;
    }
    >.price-info{
      text-align : right;
      >p{
        c(#666)
        mb(16)
        >span{
          ml(48)
          c(#666666);
        }
        span:last-child{
          display inline-block;
          width 80px;
        }
      }
    }
  }

  .outContainer {
    b1(#EDEDED) ;
    mb(20)

    .orderNo {
    // flex ()
    // justify-content: space-between
      lh(32);
      h(32);
      padding 0 12px;
      border-bottom 1px solid #EDEDED;
      c(#333333);
      background:rgba(250,250,251,1);
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
        c(#E53935);
        frt()
      }
    }

    .titleClass {
      lh(32);
      h(32);
    // flex ();
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
        w(80);
        margin :0 12px;
      }
      >span:nth-child(3){
        width 25%;
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
      p{
        font-family:PingFang-SC-Medium;
        >span{
          font-family:PingFang-SC-Medium;
        }
      }
      .productInfo_1{
        display: flex;
        flex-direction: column;
        border-right: 1px solid rgb(237, 237, 237);
        flex: 1;
        mr(116)
      }
      .goodsDetail {
      // flex ();
        border-bottom 1px solid #EDEDED
        div {
          inline()
          vertical-align top
        }
        >div:nth-child(n+2){
          width 25%;
          pt(12);
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
          mb(8)
        }
        >p:last-child{
          font-family:PingFang-SC-Bold;
        }
        .disCount{
          padding-bottom:16px
          margin:0
        }
      }
    }

    .goodsName{
      mb(12)
      lh(22)
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
    .yjpBtn{
      /*height: 40px;*/
    // flex();
    // justify-content: space-between;
      padding: 12px 12px;
    // align-items: center;
      height 62px
      box()
      >div{
        frt()
        padding: 13px 0;
      }
      >p{
        inline()
        lh(32)
        c(#333333)
        font-family:PingFang-SC-Medium;
      }
      .operation-btn{
        border : 1px solid #666666;
        c(#333333);
        padding: 9px 11px;
        ml(12);
        border-radius: 2px;
        font-family:PingFang-SC-Medium;

        &:hover {
          cursor pointer;
          border-color:#E53935;
          color:#E53935;
          background-color :#fff;
        }
      }
      .againBuy{
        border : 1px solid #E53935;
        c(#E53935);
        padding: 9px 11px;
        ml(12);
        border-radius: 2px;
      }
    }
  }

  .cancel-radio{
    padding: 0 30px;
    >div{
      margin : 12px 0;
      span{
        font-size:14px;
        margin-left :20px;
      }
    }
  }

  .goods-curson{
    cursor: pointer;
  }

  .bgf{
    background-color #fff;
    mb(39)
  }

  .giftProduct {
    c(#e43834);
    padding: 1px;
    border 1px solid #e43834
    mr(5)
  }
</style>
