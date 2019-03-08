<template>
    <div class="container">
      <!--经销商申请进货弹窗-->
      <el-dialog title="申请进货" :visible.sync="popShow" width="50%" center :close-on-click-modal=false>
        <div class="limit-pay-box">
          <div class="product-wrap">
            <div class="pic">
              <img :src="product.imgUrl" />
            </div>
            <div class="right">
              <div class="content">
                <h5>【经销商】{{product.productName}}</h5>
                <div class="spec">规格：{{product.specName}}</div>
                <div class="delivery" v-if="product.saleMode==6">{{product.deliveryMode==1?`经销商直配`:`易久批配送`}}</div>
                <div class="c-red" v-html="$options.filters.dealerPrice(product)"></div>
              </div>
              <div class="amount">
                <div>数量：</div>
                <div class="number-input">
                  <div class="reduce" @click="decrease(product)">
                    <span v-bind:class="{ disabled: product.buyCount <= product.minBuyNum }"></span>
                  </div>
                  <div class="input">
                    <input :value="product.buyCount" @change="handleChange(product, $event)">
                  </div>
                  <div class="add" @click="increase(product)">
                    <span v-bind:class="{ disabled: product.buyCount >=product.maxBuyNum }"></span>
                  </div>
                </div>
              </div>
              <div class="remark">
                <div>备注：</div>
                <div class="remark-right">
                  <textarea v-model="remark"></textarea>
                  <span class="confirm" @click="confirmApply">申请进货</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </el-dialog>
    </div>
</template>

<style lang="stylus" scoped>
  @import "./dealerPop.styl"
</style>

<script>
  import { attentionShop } from "api/dealer/dealer"
  import { debounce } from "common/lodash"
  import bus from "common/bus";
  import { dealerApplyStock } from "api/dealer/dealer"
  export default {
    props: {

    },
    data() {
      return {
        popShow: false,
        remark: ``,
        buyCount: 1,
        product: {},
      }
    },
    components:{

    },
    mounted() {
      bus.$off("popShow")
      bus.$on("popShow", (data) => {
        this.product = data
        this.popShow = true
      })
    },
    created(){

    },
    methods:{
      decrease(product) {
        const { buyCount, minBuyNum } = product;
        if (buyCount > minBuyNum) {
          product.buyCount = buyCount - 1;
          this.buyCount = product.buyCount
        }
      },
      increase(product) {
        const { buyCount, maxBuyNum } = product;
        if (buyCount < maxBuyNum) {
          product.buyCount = buyCount + 1;
          this.buyCount = product.buyCount
        }
      },
      handleChange(product, event) {
        const val = event.target.value.trim();
        if (!isValueNumber(val)) {
          event.target.value = product.buyCount;
          return;
        }
        const { minBuyNum, maxBuyNum } = product;
        product.buyCount =
          val > maxBuyNum ? maxBuyNum : val < minBuyNum ? minBuyNum : val;
        this.buyCount = product.buyCount
      },
      confirmApply(){
        const { productSkuId,companyId } = this.product
        let param = {
          data:{
            buyCount: this.buyCount,
            productSkuId,
            remark: this.remark,
            shopId: companyId
          }
        }
        dealerApplyStock(param)
          .then(res => {
            this.popShow = false
            if (res.success) {
              this.$message(`申请提交成功`);
            }else{
              this.$message(res.desc);
            }
          })
          .catch(res => {});
      },
    },
    watch:{

    }
  }
</script>

