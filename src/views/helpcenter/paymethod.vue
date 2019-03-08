<template>
    <div class="help-content ">
        <div class="title">付款方式</div>
        <p><router-link to="/index/home">现金支付</router-link></p>
    </div>
</template>
<script>
export default {
    name: "paymethod"
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
a:hover {
    c(#337ab7)
}
</style>
