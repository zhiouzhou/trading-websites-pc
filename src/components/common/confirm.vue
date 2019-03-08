<template>
<!-- 气泡提示框 -->
  <div class="confirm" v-if="show" v-clickoutside="close">
      <div class="confirm-info">
          <img src="../../assets/images/coupon_code_notice.png" alt="">
          <p>{{text}}</p>
      </div>
      <div class="confirm-button clearfix">
          <p @click="determine">确定</p>
          <p @click="close">取消</p>
      </div>
      <div class="confirm-sanjiao"></div>
  </div>
</template>
<script>
const clickoutside = {
    // 初始化指令
    inserted(el, binding, vnode) {
        function documentHandler(e) {
            // 这里判断点击的元素是否是本身，是本身，则返回
            if (el.contains(e.target)) {
                return false;
            }
            // 判断指令中是否绑定了函数
            if (binding.expression) {
                // 如果绑定了函数 则调用那个函数，此处binding.value就是handleClose方法
                binding.value(e);
            }
        }
        // 给当前元素绑定个私有变量，方便在unbind中可以解除事件监听
        el.__vueClickOutside__ = documentHandler;
        document.addEventListener('click', documentHandler);
    },
    update() {},
    unbind(el, binding) {
        // 解除事件监听
        document.removeEventListener('click', el.__vueClickOutside__);
        delete el.__vueClickOutside__;
    },
};
export default {
    directives: {clickoutside},
    data(){
        return {
            show: false
        }
    },
    props: {
        text: {
            type: String,
            default: ''
        }
    },
    methods: {
        showConfirm(){
            this.show = true
        },
        close(){
            this.show = false
        },
        determine(){
            this.$emit('determine');
        }
    }
};
</script>
<style lang="stylus">
.confirm {
    width 208px
    box()
    box-shadow:0px 2px 8px 0px rgba(0,0,0,0.15);
    position absolute
    left 50%
    transform translateX(-50%)
    padding 20px 16px 0
    bg(#fff)
}
.confirm-sanjiao {
    margin auto
    width: 20px;
    height: 20px;
    box-shadow: 4px 4px 4px -3px rgba(0, 0, 0, 0.1), 0px 0px 0px 0px rgba(0, 0, 0, 0.1);
    background: #fff;
    transform: translateY(9px) rotate(45deg);
}
.confirm-info {
    img {
        squ(14)
        inline()
        mr(8)
    }

    p {
        inline()
        c(#666)
        ft(14)
    }
}
.confirm-button {
    p {
        frt()
        w(48)
        h(24)
        border 1px solid #dddddd
        lh(24)
        text-c()
        margin 16px 0 0 8px
        cursor pointer
        
        &:nth-of-type(1){
            bg(#E53935)
            border-color #E53935
            c(#fff)
        }
    }
}
</style>
