<template>
  <div>
    <el-dialog title="选择订单" width="30%" class="evaluateBody" :visible.sync="orderDialogVisibles" center>
      <div class="orderContainer" v-for="(item,index) in orderList" :key="index">
        <div class="chooseOrder">
          <div class="cheackOrder">
            <div @click="changeChecked(index,item.orderNO)">
              <img v-if="checkIndex!=index" src="../../assets/images/weigouxuanyouhuo_ic@3x.png" alt="">
              <img v-if="checkIndex==index" src="../../assets/images/yigouxuan.png" alt="">
            </div>
            <div>
              <p>{{item.companyName}}<span class="jdh">(待发货)</span></p>
              <p><span>{{item.createTime}}</span> </p>
            </div>
          </div>
          <div>
            <p class="goodsCount">X1</p>
            <p>实付款：<span>￥{{item.payableAmount}}</span></p>
          </div>
        </div>
        <div :class=" item.items.length > 1 ? 'goodsContainer':''">
          <div class="goodsDetail" v-for="products in item.items" :key="products.itemsId">
            <div>
              <div class="goodsImg">
                 <img :src='products.product.imgUrl' alt="">
                 <span>x1件</span>
              </div>
              <div class="goodsName" v-show="item.items.length==1">
                <p >{{products.product.productName}} </p>
                <p>￥{{products.product.price}} <span> 件</span></p>
                <p>规格:<span>{{products.product.specName}}</span></p>
              </div>
            </div>
           <div v-show="item.items.length==1">
                <span>X{{products.count*(products.product.saleSpecQuantity||1)}}{{products.product.minUnit}}</span>
            </div>
          </div>
        </div>
      </div>
      <el-pagination
        background
        layout="prev, pager, next"
        :total="1000"
        prev-text="<上一页"
        next-text="下一页>">
      </el-pagination>
      <span slot="footer" class="dialog-footer">
        <el-button @click="orderDialogVisibles = false">取 消</el-button>
        <el-button type="primary" @click="ensureChoose">确认选择</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import * as FindService from "api/complainSuggestion/complainSuggestion";

  export default {
    data() {
      return {
        // orderDialogVisible:false,
        orderList:[],
        orderId:1,
        isChecked:false,
        checkIndex:-1,
        orderNo:''
      }
    },
    props:{
        orderDialogVisibles:{
          type : Boolean,
          default: false
        }
    },
    components: {

    },
    mounted(){
      this.getComplainOrders();
    },
    methods: {
      changeChecked(index,orderNo){
        this.checkIndex=index;
        this.orderNo=orderNo;
      },
      getComplainOrders(){
        let params={
          currentPage:1,
          pageSize:3
        }
        FindService.getComplainOrders(params).then(res=>{
          this.orderList=res.data;
        })
      },
      ensureChoose(){
        this.orderDialogVisibles = false;
        this.$emit('sendOrderNo',{orderNo:this.orderNo,orderDialogVisibles:this.orderDialogVisibles})
      }
    },
  }

</script>

<style lang='stylus' scope>
  .chooseOrder {
    display: flex;
    justify-content: space-between;

    .el-checkbox__inner {
      width: 20px;
      height: 20px;
      border-radius: 50%;
      margin-top: 20px;
      margin-right: 10px;
    }

    .el-checkbox__inner::after {
      height: 11px;
      left: 7px;
      width: 4px;
    }

    .cheackOrder{
      align-items: center;
      display: flex;
    }
    .cheackOrder>div {
      // float: right;
      img{
        border-radius: 50%;
        width 16px;
        height : 16px;
        margin-right :16px;
      }
    }

    p {
      margin: 12px 0;
    }

    .jdh {
      color: #e53935;
    }

    .goodsCount {
      text-align: right;
    }

  }

   .orderContainer{
      border: 1px solid #dfdfdf;  
      padding : 0 12px;    
      margin-bottom : 12px; 
    }

  .goodsDetail {
    flex () ;
    justify-content: space-between;
    align-items: center;
    >div:first-child{
      display: flex;
    }
    >div:nth-child(n+2) {
      // width 25% 
      pt(12);
    }

    img {
      w(84) ;
      h(84) ;
      mr(12);
    }
    .goodsName > p{
        margin : 10px 0;    
    }
  }

  .dialog-footer > button{
    width : 160px;
    height : 36px;    
  }

  .goodsImg{
    text-align : center;    
    >span{
        display: inline-block;
        margin-bottom: 10px;
    }
  }

  .goodsContainer{
    display :flex;
  }
  
  .selectDiv{
      width : 70px;
      height :26px;
      background-color : #E53539;
      color : #fff;
    }

</style>
