<template>
  <transition name="toast-cart">
      <div class="toast-add-cart" v-if="showToast">
      <img src="../../assets/images/tijiaochenggong@2x.png" alt="">
      <span>已成功加入购物车</span>
      <div class="sanjiao-cart"></div>
  </div>
  </transition>
</template>
<script>
export default {
    data(){
        return {
            showToast: false
        }
    },
    methods: {
        show(){
            this.showToast = true;
            setTimeout(() => {
                this.showToast = false;
            },3000)
        }
    }
};
</script>
<style lang="stylus">
.toast-add-cart {
    position absolute
    box()
    padding 0 16px
    bg(#fff)
    box-shadow:0px 2px 8px 0px rgba(0,0,0,0.15);
    w(166)
    img {
        squ(14)
        inline()
        mr(8)
    }

    span {
        c(#333)
        ft(14)
    }

    .sanjiao-cart {
        position absolute 
        bottom 0
        right 38px
        squ(10)
        box-shadow: 4px 4px 4px -3px rgba(0, 0, 0, 0.1), 0px 0px 0px 0px rgba(0, 0, 0, 0.1);
        background: #fff;
        transform: translateY(5px) rotate(45deg);
    }
}

.toast-cart-enter-active, .toast-cart-leave-active {
  transition: all .5s;
}
.toast-cart-enter, .toast-cart-leave-to {
  opacity: 0;
  transform translateY(-10px)
}
</style>