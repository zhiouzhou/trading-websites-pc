<template>
  <div>
    <div v-if="!defaultImg">
    <div class="outContainer" v-for="(item,index) in orderList" :key="item.id">
      <div class="orderNo">
        <p><span>{{item.companyName}}</span><span class="c-9">{{item.createTime}}</span><span><i class="c-9">订单编号：</i>{{item.orderNO}}</span></p><span>{{item.state==1?'待发货':item.state==2?'已发货':item.state==3?'已完成':item.state==4?'审核拒绝':item.state==5?'已取消':item.state==6?'已删除':item.state==7?'配送失败':item.state==8?'待支付':item.state==9?'待评价':''}}</span>
      </div>
      <div>
        <div class="titleClass pre">
          <div class="titleClass_1"><span></span><span>商品</span><span>价格(元)</span><span>数量</span></div>
          <span style="width:115px; text-align:center">总计(元)</span>
        </div>
        <div class='productInfo pre'>
          <div class="productInfo_1">
            <div class="goodsDetail" v-for="products in item.items" :key="products.itemsId">
              <div @click="goGoodsDetail(products,item)" class="goods-curson">
                <img v-if="products.product.imgUrl" :src='products.product.imgUrl' alt="">
                <img v-if="!products.product.imgUrl" src='./../../assets/images/propic_default.gif' alt="">
              </div>
              <div>
                <p @click="goGoodsDetail(products,item)" class="goodsName goods-curson fz14"><i class="giftProduct" v-if="products.giftProduct">赠品</i>{{products.product.productName}} </p>
                <p class="sale-spec">规格: <span> {{products.product.specName}}</span></p>
                <p v-if="products.giftProduct" class="gift-product"><span> {{products.giftSourceDesc}}</span></p>
              </div>
              <div>
                <p class="goodsPrice" v-if="!products.giftProduct">批价: ￥<span>{{products.product.price|priceToFixed}}/{{products.product.priceunit}}</span></p>
                <p v-show="products.product.reducePrice&&products.product.reducePrice!=0" v-if="!products.giftProduct">立减: ￥<span>{{products.product.reducePrice|priceToFixed}}/{{products.product.priceunit}}</span></p>
              </div>
              <div>
                <p v-if="products.product.price&&products.product.productSkuId ==products.product.productSaleSpecId"><span>{{products.count}}{{products.product.saleUnit}}</span></p>
                <p v-if="products.product.price&&products.product.productSkuId !=products.product.productSaleSpecId"><span>{{products.count*(products.product.saleSpecQuantity||1)}}{{products.product.minUnit}}</span></p>
                <p v-if="products.giftProduct"><span>{{products.count}}{{products.product.saleUnit}}</span></p>
              </div>
            </div>
          </div>

          <div class="price">
            <p v-show="item.discountAmount!=0">优惠: ¥{{item.discountAmount|priceToFixed}}</p>
            <p>实付款</p>
            <p>¥{{item.payableAmount|priceToFixed}}</p>
          </div>
        </div>
        <!-- button -->
        <div class="yjpBtn">
          <!-- <p>{{item.companyName}}</p> -->
          <div class="yjpBtn-info">
            <div class="inline pre" v-if="item.canDeleteOrder">
              <confirm style="top:-117px;" :ref="'confirm'+index" text="您确定要删除该订单吗？" @determine="deleteOrder(item.orderNO,index)"></confirm>
              <div class="yjp-info-btn" @click="showDelete(index)">删除订单</div>
            </div>
            <div class="yjp-info-btn" v-if="item.classify!=3&&item.canCancelOrder" @click="showCancelOrderDialog(item.orderNO)">取消订单</div>
            <div class="yjp-info-btn" v-if="item.canReturnOrder" @click="returnOrder(item.orderNO,index)">退货</div>
            <div class="yjp-info-btn" @click="goToDetail(item.orderNO)">订单详情</div>
            <div class="yjp-info-btn" @click="getOrderTraceList(item.orderNO)">订单追踪</div>
            <div class="yjp-info-btn" v-if="item.canEvaluate" @click="showEvaluate(item.orderNO,index)">确认收货并评价</div>
            <div class="yjp-info-btn againBuy" v-if="item.canBuyAgain" @click="gotoCart({orderNO: item.orderNO,index})">再次购买</div>
            <div class="yjp-info-btn" v-if="item.state==8&&item.payType==1&&item.canOnlinePay">去支付</div>
          </div>
        </div>
        <!-- button -->
      </div>
    </div>
    </div>
    <!-- 评价dialog -->
    <el-dialog title="评价" :visible.sync="showDialog" width="575px" class="evaluateBody" center>
      <div class="headerEvaliate"><img src="../../assets/images/gouwuche_tishi.png" alt=""> <span>感谢您选择易久批，请对我们的服务进行评价。您的评价将帮助我们为您提供更优质的服务</span></div>
      <p class="complainEvaluate"><span>*</span><span>服务评价</span></p>
      <div class="evaluateResuit">
        <div @click="showReason(index)" v-for="(item,index) in evaluateList" :class="{selectDiv:index==currentIndex}">{{item}}</div>
      </div>
      <p>备注 (选填)</p>
      <el-input type="textarea" :rows="2" placeholder="请输入" v-model="textarea" class="textareaTxt">
      </el-input>
      <div class="checkIndex">
          <div @click="hideName=!hideName">
              <div v-if="!hideName"></div>
              <img v-if="hideName" src="../../assets/images/yigouxuan.png" alt="">
          </div>
          <span>匿名</span>
      </div>
      <span slot="footer" class="dialog-footer-e">
        <div @click="showDialog = false;">取 消</div>
        <div type="primary" @click="submitEvaluate">提 交</div>
      </span>
    </el-dialog>
    <!-- 评价dialog -->
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
        <el-button @click="centerDialogVisible = false;">取 消</el-button>
        <el-button type="primary" @click="cancelOrder">确 定</el-button>
      </span>
    </el-dialog>
    <!-- cancel订单dialog -->
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
      <span class="esure">确定</span>
    </el-pagination>
    </div>
    <div v-if="defaultImg" class="default-img">
      <img src="./../../assets/images/wutuihuoguanli.png" alt="">
      <p>暂无数据</p>
    </div>
  </div>
</template>
<script>
  import * as FindService from "api/myOrders/myOrders";
  import {AddShopCartList} from "api/cart/cart";
  import { scrollSmoothTo } from "common/lodash";
  import confirm from "components/common/confirm";

  export default {
    data() {
      return {
        orderList:[],
        showDialog:false,
        currentPage:1,
        pageSize:10,
        orderState:-1,
        orderNo:'',
        reason: false,
        textarea: '',
        evaluateList:['满意','一般','不满意'],
        currentIndex:4,//选择的
        hideName:false,
        totalCount:0,
        centerDialogVisible:false,//cancel弹窗
        radio:'不想买了',//单选框的value
        cancelTextarea:'',//取消textarea
        defaultImg:false,//无数据默认显示的图片
        dataListArr:[],
      }
    },
    props:['orderData','orderInfo'],
    mounted(){
      this.$nextTick(function () {
        this.getOrderList();
      })
    },
    components: {
      confirm
    },
    methods:{
      getOrderList(){//订单列表
        let params={
          currentPage:this.currentPage,
          pageSize:this.pageSize,
          state:this.orderState
        }
        FindService.getOrderList(params).then(res=>{
          if(res.success){
            this.defaultImg=res.data.length>0?false:true;
            this.orderList=res.data;
            this.totalCount=res.totalCount;
          }
        })
      },
      getOrderTraceList(No){//订单追踪
        this.$router.push({
            path:"orderTraceList",
            query: {
              No
            }
        });
      },
      showCancelOrderDialog(No){//显示取消订单dialog
        this.radio = "不想买了";
        this.cancelTextarea = "";
        this.centerDialogVisible=true;
        this.orderNo=No;
      },
      cancelOrder(){//取消订单
        let params={
          orderNO:this.orderNo,
          cancelType:this.radio,
          remark:this.cancelTextarea
        }
        FindService.CancelOrder(params).then(res=>{
            this.centerDialogVisible=false;
            if(res.success){
              this.getOrderList();
              this.$toast({text: '取消订单成功'})
            }else{
              this.$toast({text: res.desc,type: 'fail'});
            }
        })
      },
      showDelete(index){
        let ref= 'confirm'+index
        this.$refs[ref][0].showConfirm();
      },
      deleteOrder(No,index){//删除订单
           FindService.DeleteOrder({orderNO:No}).then(res=>{
              if(res.success){
                this.orderList.splice(index,1);
                this.$toast({text: '订单删除成功'})
              }else{
              this.$toast({text: res.desc,type: 'fail'});
            }
            let ref= 'confirm'+index
            this.$refs[ref][0].close();
           })

      },
      goToDetail(No){//订单详情
        this.$router.push({
            path: "orderDetail",
            query: {
              No
            }
        });
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
      showEvaluate(No,index){//订单评价
        this.textarea = "";
        this.hideName = false;
        this.currentIndex = 4;
        this.showDialog=true;
        this.orderNo=No;
      },
      confirmDelivery(){//确认收货
        FindService.ConfirmDelivery({data:this.orderNo}).then(res=>{
          if(res.success){
            this.evaluateOrder();
          }else{
            this.$toast({text: res.desc,type: 'fail'});
          }
        })
      },
      gotoCart(list){//再次购买
        FindService.BugAgainGoods({orderNO:list.orderNO}).then(res=>{
          let products = res.data;
          let canBuyProducts = [];
          // let canBuyAgain =true;
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
            let buyAgainList = this.orderList[list.index].items;
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
      handleCurrentChange(val) {//分页
        document
          .getElementById('header')
          .scrollIntoView();
        this.currentPage=val;
        this.getOrderList();
      },
      showReason(index){
        this.currentIndex=index;
      },
      evaluateOrder(){//订单评价
        let params={
          orderNo:this.orderNo,
          content:this.textarea,
          anonymous:this.hideName,
          deliverySpeedScore:this.currentIndex
        }
        FindService.orderEvaluate(params).then(res=>{
          if(res.success){
            this.showDialog=false;
            this.getOrderList();
            this.$toast({text: '评价成功'})
          }else{
            this.$toast({text: res.desc,type: 'fail'})
          }
        })
      },
      submitEvaluate(){
        // this.confirmDelivery();
        this.evaluateOrder();
      }
    },
    watch:{
      orderData(val){
        this.orderList=val;
      },
      orderInfo(val){
        this.orderState=this.orderInfo;
        this.getOrderList();
        // const specialAreaId = localStorage.getItem("USERNAME");
        //  if( this.lastSpecialAreaId != specialAreaId){
        //   this.getOrderList();
        // }
      },
    }
  }

</script>
<style lang="stylus" scoped>
  .outContainer {
    b1(#EDEDED)
    margin 20px 20px;
    font-family:MicrosoftYaHei;
    .orderNo {
      // flex ()
      // justify-content: space-between;
      padding: 10px 12px;
      border-bottom :1px solid #EDEDED;
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
        font-family:MicrosoftYaHei;
      }
      p .c-9 {
        c(#999)
      }
      >span {
        c(#E53935);
        font-family:MicrosoftYaHei;
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
            p{
              font-family:PingFang-SC-Medium;
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
            margin: 12px;
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
            margin : 7px 0;
          }
          >p:last-child{
            color:#e53935;
            font-family:PingFang-SC-Bold;
            font-size:14px;
            font-weight: bold;
          }
        }
      }

    .goodsName{
      mb(12);
      lh(22)
    }

    .sale-spec{
      c(#999999);
      ft(12);
      margin-bottom: 6px;
    }

    .gift-product{
      span{
        color #666;
      }
    }

    .goodsPrice{
      mb(12)
    }

    .goodsPrice + p{
      color red
      ft(12)
    }

    .yjpBtn .yjpBtn-info .yjp-info-btn:hover{
      border-color:#E53935;
      color:#E53935;
      background-color :#fff;
    }
    .yjpBtn{
      // flex ()
      // justify-content: space-between;
      padding: 12px 12px;
      height 56px
      box()
      align-items center;
      font-family:PingFang-SC-Medium;
      >p{
        inline()
        font-family:PingFang-SC-Medium;
        font-weight:500;
        lh(32)
      }
      >.yjpBtn-info{
          frt()
          inline()
          // display flex;

         .yjp-info-btn{
            inline()
            cursor :pointer;
            font-family:PingFang-SC-Medium;
            border : 1px solid #666666;
            c(#333333);
            padding: 9px 11px;
            ml(12);
            border-radius: 2px;
         }
        .againBuy{
            border: 1px solid #e53935;
            color: #e53935;
        }
      }
    }
  }
  .esure {//分页确定按钮
    width: 72px;
    height: 30px;
    display: inline-block;
    border: 1px solid #e5e5e5;
    text-align: center;
    lh: (30);
    radius(4);
    ml(12);
  }
  //评价
  .headerEvaliate{
      padding : 14px;
      background-color : #F1DCB9;
      >img{
        display:inline-block;
        // margin-right :12px;
        vertical-align: sub;
      }
    }
  .evaluateBody .el-dialog__header {
    border-bottom: 1px solid #F1F1F1;
  }

  .evaluateBody {
    .dialog-footer-e {
      justify-content: space-around;
      display: flex;

      >div {
        cursor pointer;
        padding 10px 64px;
        border-radius:2px;
        font-weight:500;
        font-size:16px;
      }
      >div:first-child{
        border:1px solid rgba(189,189,189,1);
        color:#414141;
      }
      >div:last-child{
        color:#fff;
        background-color #e53935;
      }
    }
  }

  .dialog-footer{
    .el-button{
        padding:13px 38px
      }
    }

  .evaluateResuit {
    margin: 16px 0;
    display : flex;
    >div{
      cursor pointer;
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
    div{
      height 14px;
      width 14px;
      border-radius:50%;
      border 1px solid #999;
      margin-right :6px;
    }
    img{
      border-radius: 50%;
      width 16px;
      height : 16px;
      margin-right :6px;
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

  .default-img{
    text-align: center;
    margin: 136px;
    >p{
      font-size: 18px;
      margin-top: 20px;
      color: #757575;
    }
  }

  .order-pagination{
    text-align right;
  }

  .el-dialog__body{
    border-top:1px solid #ededed !important
  }

  .giftProduct {
  c(#e43834);
  padding: 1px;
  border 1px solid #e43834
  mr(5)
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
