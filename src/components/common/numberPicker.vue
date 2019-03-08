<template>
  <div class="number-input">
    <div class="reduce" @click.stop="decrease(product)">
      <span v-bind:class="{ disabled: product.buyCount <= product.minBuyNum }"></span>
    </div>
    <div class="input">
      <input
        :value="product.buyCount* XS"
        @change="handleChange(product, $event)"  @click.stop=""
      >
    </div>
    <div class="add" @click.stop="increase(product)">
      <span v-bind:class="{ disabled: product.buyCount >=product.maxBuyNum }"></span>
    </div>
  </div>
</template>

<script>
import bus from "common/bus";

function isValueNumber(value) {
  return /^(0|[1-9][0-9]*)$/.test(value);
}
export default {
  props: {
    product: {
      type: Object,
      default: () => ({})
    },
    detection: {
      //是否需要调用购物车金额计算
      type: Boolean,
      default: false
    }
  },
  data(){
    return {
      XS: 1
    }
  },
  created(){
    this.XS = this.product.saleSpecQuantity == this.product.specQuantity ? 1 : this.product.saleSpecQuantity
  },
  methods: {
    decrease(product) {
      const { buyCount, minBuyNum } = product;
      if (buyCount > minBuyNum) {
        product.buyCount = buyCount - 1;
      } else {
        // this.$message("不能超过起购数量");
        return
      }
      if (this.detection) this.detectionParent();
    },
    increase(product) {
      const { buyCount, maxBuyNum } = product;
      if (buyCount < maxBuyNum) {
        product.buyCount = buyCount + 1;
      } else {
        // this.$message("不能超过限购数量");
        return
      }
      if (this.detection) this.detectionParent();
    },
    handleChange(product, event) {
      let val = event.target.value.trim();
      let previousCount = product.buyCount
      if (!isValueNumber(val)) {
        event.target.value = product.buyCount* this.XS
        return;
      }
      const { minBuyNum, maxBuyNum } = product;
      val = Number(val);
      product.buyCount =
        val > maxBuyNum ? maxBuyNum : val < minBuyNum ? minBuyNum : val;
      event.target.value = product.buyCount* this.XS
      if (this.detection && previousCount != product.buyCount) this.detectionParent();
    },
    detectionParent() {
      //购物车加减需要重新计算金额，起送优惠提示信息，更新购物车数量
      const { buyCount, shopCartId } = this.product;
      const param = { buyCount, shopCartId, product: this.product };
      bus.$emit("recalculate", "");
      bus.$emit("updateShopCart", param);
    }
  }
};
</script>


<style lang="stylus" scoped>
.number-input {
  font-size: 10px;
  color: #333333;
  width: 98px;
  height: 28px;
  border-radius: 1px;
  border: 1px solid rgba(189, 189, 189, 1);
  box-sizing: border-box;
  background: #fff;

  .reduce {
    width: 27px;
    border-right: 1px solid #bdbdbd;
    float left
    height 100%
    cursor: pointer;

    span {
      display: block;
      width: 10px;
      height: 10px;
      background-image: url('../../assets/images/jian_kedian@2x.png');
      background-size: contain;
      background-repeat: no-repeat;
      background-position: center;
      position relative
      left 50%
      top 50%
      ml(-5)
      mt(-5)
    }

    .disabled {
      opacity: 0.3;
    }
  }

  .reduce:hover {
    background: #f2f2f2;
  }

  .add {
    width: 27px;
    border-left: 1px solid #bdbdbd;
    float right
    height 100%
    cursor: pointer;

    span {
      display: block;
      width: 10px;
      height: 10px;
      background-image: url('../../assets/images/jia_kedian@2x.png');
      background-size: contain;
      background-repeat: no-repeat;
      background-position: center;
      position relative
      left 50%
      top 50%
      ml(-5)
      mt(-5)
    }

    .disabled {
      opacity: 0.4;
    }
  }

  .add:hover {
    background: #f2f2f2;
  }

  .input {
    float left
    height 100%

    input {
      width: 40px;
      height 100%;
      border: 0;
      padding: 0;
      text-align: center;
      -webkit-appearance: none;
      outline: none;
      border-radius: 0;
    }
  }
}
</style>

<style type="text/css">
  .number-input{
  	margin-left: 10px\9\0;
  }
</style>
