<template>
    <transition name="toast">
        <div class="toast" v-if="showToast">
            <img src="../../assets/images/tijiaochenggong@2x.png" alt="" v-if="type=='success'">
            <img src="../../assets/images/coupon_code_notice.png" alt="" v-if="type=='fail'">
            <span>{{text}}</span>
            <!-- 跳转不显示叉号 -->
            <img src="../../assets/images/shanchu@2x.png" alt="" v-if="noRoute" @click="closeToast">
        </div>
    </transition>
</template>
<script>
export default {
    name: 'toast',
    data(){
        return {
            showToast: false,
            text: '',
            noRoute: true,
            type: 'success'
        }
    },
    // props: {
    //     noRoute: {
    //         type: Boolean,
    //         default: true
    //     }
    // },
    mounted(){
        setTimeout(()=> {
            this.showToast = false;
        },3000)
    },
    methods: {
        show(text){
            console.log(text)
            this.text=text;
            this.showToast = true;
        },
        closeToast(){
            this.showToast = false;
        }
    },
    watch: {
        showToast: function(to,from){
            console.log(to)
            setTimeout(()=> {
                this.showToast = false;
            },3000)
        }
    }
}
</script>
<style lang="stylus">
.toast {
    position fixed
    top 150px
    left 50%
    z-index 999
    transform translateX(-50%)
    padding 12px 16px
    box-shadow:0px 2px 8px 0px rgba(0,0,0,0.15);
    radius(3)
    bg(#fff)

    img {
        inline()

        &:nth-of-type(1){
            squ(14)
            mr(8)
        }

        &:nth-of-type(2){
            squ(14)
            ml(8)
        }
    }

    span {
        ft(14)
        c(#333)
        vertical-align top
    }
}
.toast-enter-active, .toast-leave-active {
  transition: all .5s;
}
.toast-enter, .toast-leave-to {
  opacity: 0;
  top 140px
}
</style>
