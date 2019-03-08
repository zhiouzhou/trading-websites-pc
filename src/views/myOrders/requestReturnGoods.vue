<template>
  <div class="jiupi-center">
    <div class="userinfo">
      <p class="info-title">申请退货</p>
      <p class="fz14 fw-b re-pro-title">退货产品</p>
      <div class="re-pro-list">
        <div>
          <span>商品</span>
          <span>可退数量</span>
          <span>退货数量</span>
        </div>
        <div class="re-pro-item" v-for="(item,index) in list">
          <div>
            <img class="cs" :src="item.product.imgUrl" alt="退货产品" v-if="item.product.imgUrl" @click="goGoodsDetail({productSkuId: item.product.productSkuId,sourceType: item.sourceType})">
            <img class="cs" src="../../assets/images/propic_default.gif" alt="退货产品" v-if="!item.product.imgUrl" @click="goGoodsDetail({productSkuId: item.product.productSkuId,sourceType: item.sourceType})">
            <p class="inline">
              <span class="block-center cs fz14" @click="goGoodsDetail({productSkuId: item.product.productSkuId,sourceType: item.sourceType})"><i class="giftProduct" v-if="item.giftProduct">赠品</i>{{item.product.productName}}</span>
              <span class="c-9">规格：{{item.product.specName}}</span>
            </p>
          </div>
          <span v-if="item.product.productSkuId === item.product.productSaleSpecId">{{item.canReturnNum}}{{item.product.saleUnit}}</span>
          <span v-else>{{item.count*(item.product.saleSpecQuantity || 1)}}{{item.product.minUnit}}</span>
          <div>
            <div class="returnGoods-number">
              <div>
              <number-input :min="0" :max="item.canReturnNum" @on-input="onChangeCount" :index="index"></number-input>
              <span>&nbsp;{{item.product.saleUnit}}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <p class="fz14 fw-b re-pro-title">退货原因</p>
      <div class="re-reason">
        <div>
          <label class="re-reason-label">退货原因：
            <span class="red">*</span>
          </label>
          <select class="re-reason-content" v-model="reason">
              <option value="">请选择退货原因</option>
              <option :value="item" v-for="item in reasons">{{item}}</option>
          </select>
        </div>
        <div>
          <label class="re-reason-label">备注：&nbsp;&nbsp;</label>
          <textarea class="re-reason-content" v-model="remark"></textarea>
        </div>
        <div>
          <label class="re-reason-label"></label>
          <div class="re-reason-button">
            <span class="info-change cs" @click="debounceSubmit">提交</span>
            <router-link class="info-change cancel cs" to="/myOrderEntry/myOrders">取消</router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import NumberInput from "@/components/common/NumberInput.vue";
import * as assetsCenter from "@/api/assetsCenter/assetsCenter.js"
import * as FindService from "api/myOrders/myOrders";
import {debounce} from "common/lodash";
export default {
  name: "requestReturnGoods",
  data() {
    return {
      list: [],
      reasons: [],
      reason: "",
      remark: "",
      orderNO:""
    };
  },
  components: {
    NumberInput
  },
  created(){
      this.orderNO = this.$route.query.orderNO;
      FindService.getOrderDetail({orderNO:this.orderNO}).then(res=>{
          if(res.success){
            let list=res.data.itemList;
            list.forEach(item => {
                item.returnCount = 0;
            })
            this.list = list;
          }
        })
      assetsCenter.getReturnOrderReasons().then(res => {
          if(res.success){
              this.reasons = res.data;
          }
      })
  },
  mounted(){
    this.debounceSubmit = debounce(this.submit, 300,false)
  },
  methods: {
      //申请退货防抖动
			debounceSubmit(){
				 this.debounceSubmit()
			},
      //提交退货单
      submit(){
          let data = [];
          this.list.forEach(item => {
              if(item.returnCount>0){
                  data.push({
                  orderItemId: item.itemId,
                  returnCount: item.returnCount,
                  sourceId: item.sourceId,
                  sourceType: item.sourceType
              })
              }
          });
          if(data.length==0){
              this.$alert("退货数量不能都为零");
              return
          }
          if(!this.reason){
              this.$alert("请选择退货原因");
              return
          }
          if(this.reason=="其他原因"&&!this.remark){
              this.$alert("选择其他原因时，备注信息必填！");
              return
          }
          let {orderNO, reason, remark} = this;
          let params = {
              items: data,
              orderNO,
              reason,
              remark
          }
          assetsCenter.AddReturnOrder({returnOrder:params}).then(res => {
              if(res.success){
                  this.$toast({text: '尊敬的用户您好，您的退货申请已提交成功，我们会尽快予以回复!',noRoute: false})
                  this.$router.push('/myOrderEntry/returnGoodsManage');
              }else {
                  this.$toast({text: res.desc,type: 'fail'});
              }
          }, error => {
              this.$alert(error.desc);
          })
      },
      onChangeCount(data){
          this.list[data.index].returnCount = data.val;
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
  }
};
</script>
<style lang="stylus">
.w-100 {
  width: 100%;
}

.userinfo {
  bg(#fff);
  mb(38);
  min-height: 682px;
}

.info-title {
  // width: 100%;
  height: 84px;
  ft(28);
  c(#333);
  lh(84);
  pl(20);
}

.re-pro-title {
  padding: 0 20px;
  lh(36px);
}

.re-pro-list {
  margin: 0 20px;
  border: 1px solid #ededed;

  >div {
    &:nth-of-type(1) {
      width: 100%;
      height: 48px;
      background: #fafafb;

      span {
        inline();
        width: 30%;
        lh(48);
        text-c();

        &:nth-of-type(1) {
          width: 40%;
        }
      }
    }
  }
}

.re-pro-item {
  width: 100%;
  height: 104px;
  border-top: 1px solid #ededed;

  >div {
    &:nth-of-type(1) {
      inline();
      width: 50%;
      height: 104px;

      img {
        inline();
        width: 80px;
        height: 80px;
        margin 12px
      }

      p {
        width 60%
        vertical-align top
        mt(33)
        lh(20)
        text-align left
      }

      @media screen and (min-width: 1230px){
        p {
        width 70%

      }
      }
    }

    &:nth-of-type(2) {
      inline();
      width: 30%;
      height: 104px;
      pt(38);
      vertical-align: top;
    }
  }

  >span {
    inline();
    width: 10%;
    margin-right: 10%;
    lh(104);
    text-c();
    vertical-align: top;
  }
}

.re-reason {

  >div {
    mb(15);

    textarea {
      width: 37.4%;
      height: 114px;
    }
  }

  .re-reason-label {
    inline();
    width: 100px;
    pt(7);
    text-align: right;
    c(#666);
    vertical-align: top;
  }
}

.re-reason-content {
  margin: 0 15px;
  width: 40%;
  height: 34px;
  padding: 6px 12px;
  ft(14);
  line-height: 1.4em;
  c(#555);
  border: 1px solid #ccc;
}

.re-reason-button {
    inline()
    mb(24)
}

.info-change {
  inline();
  ft(14);
  c(#fff);
  bg(#e43834);
  border: 1px solid #e43834;
  radius(4);
  padding: 6px 12px;
  ml(20);

  &:hover {
    bg(#ef5350);
    border-color: #ef5350;
  }
}

.cancel {
  bg(#fff);
  c(#333);
  border-color: #ccc;

  &:hover {
    bg(#eee);
    border-color: #aaa;
  }
}

.red {
  c(#e43834);
}

.giftProduct {
  c(#e43834);
  padding: 1px;
  border 1px solid #e43834
  mr(5)
}

.returnGoods-number {
  pos(relative)
  >div {
    inline()
    width 110px
    pos(absolute)
    left 50%
    transform translateX(-50%)

    >div {
      vertical-align middle
    }
  }
}
</style>
