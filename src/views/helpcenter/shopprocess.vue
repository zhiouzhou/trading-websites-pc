<template>
    <div class="help-content ">
        <div class="title">购物流程</div>
        <p>注册账号  —— 等待审核 —— 登录易久批商城 —— 选择商品进货 —— 购物车操作 —— 下单支付 —— 收货退货</p>
    </div>
</template>
<script>
export default {
    name: 'shopprocess'
}
</script>
<style lang="stylus" scoped>
.help-content {
    
    ml(220);

    p {
        ft(14)
        c(#666)
        line-height 2em
        mb(12)
    }
}
.title {
    box();
    width: 100%;
    height: 52px;
    lh(52)
    pl(12)
    mb(8)
    ft(16)
    bg(#f5f5f5)
    c(#333)
}
</style>
