<template>
  <div class="container goods-detail jiupi-center">

    <div class="sus-top">
      <div>找货详情</div>
      <div @click="addFindGoods"><img src="../../assets/images/woyaozhaohuo.png" alt="" srcset=""><span>我要找货</span></div>
    </div>
    <div class="inner-container">
      <div class="susHeader">
        <div>
          <p>找货：{{goodsDetailList.productName}}</p>
          <p>{{goodsDetailList.findGoodsTime}}</p>
        </div>
      </div>
      <div class="sus-question">
        <p>备注：{{goodsDetailList.findGoodsRemarks}}</p>
        <div class="susContent">
          <div v-for="item in goodsDetailList.imgList" :key="item.id"><img :src='item' alt=""></div>
        </div>
      </div>
      <div class="sus-reply">
        <p>回复：{{goodsDetailList.findGoodsReply}}</p>
      </div>
    </div>
  </div>
</template>

<script>
  import * as FindService from "api/findGoods/findGoods";
  export default {
    data() {
      return {
        goodsId:'',
        goodsDetailList:{}
      }
    },
    created() {
      this.goodsId=this.$route.query.goodsId;
    },
    mounted(){
      this.getFindGoodsDetail();
    },
    methods:{
      addFindGoods(){
        this.$router.push({
          path: "addFindGoods",
          query: {
            
          }
        });
      },
      getFindGoodsDetail(){
        let params={
          data:this.goodsId
          // data:`340bbe319d6f448fbc771e2e05f8b70d`
        }
        FindService.FindGoodsListDetail(params).then(res=>{
            if(res.data){
              this.goodsDetailList=res.data;
            }
        })
      },
    }
  }

</script>

<style lang="stylus" scoped>
.goods-detail{
  background-color #fff; 
  .susHeader {
    background: rgba(247, 247, 247, 1);
    justify-content: space-between;
    display: flex;
    align-items: center;
    padding: 16px;
    border-bottom: 1px solid #DFDFDF;
    p:first-child{
      margin-bottom:8px;
      font-size:14px;
    }
    p{
      color #414141;
      font-family:PingFang-SC-Medium;
      font-weight: 500;
    }
  }
  
  .sus-question{
    >p{
      padding:16px;
      font-family:PingFang-SC-Medium;
      font-weight:500;
      color #414141;
    }
  }

  .sus-reply{
    padding: 16px;
    >p{
      font-family:PingFang-SC-Medium;
      font-weight:500;
    }
  }
  .inner-container {
    border: 1px solid #DFDFDF;
    margin:20px;
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
      img{
        inline()
        height :16px;
        width:16px;
        margin-right :8px;
        vertical-align text-bottom
      }
      span{
        font-size:16px;
        font-family:PingFang-SC-Medium;
        font-weight:500;
      }
    }
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
      border : 1px solid #DDDDDD;
      margin-right : 16px;
    }
  }
}
</style>
